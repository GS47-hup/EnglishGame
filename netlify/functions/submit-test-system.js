const { Client } = require('pg');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const submission = JSON.parse(event.body);

    // Validate required fields
    if (!submission.student_name || !submission.answers) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: student_name and answers'
        }),
      };
    }

    // Calculate score for test system (3 questions)
    const correctAnswers = {
      'q2': 'c',  // 2 + 2 = 4
      'q3': 'b'   // Quantum physics: [x̂, p̂] = iℏ
    };

    let score = 0;

    // Q1 (name) - always correct if provided
    if (submission.answers.q1 && submission.answers.q1.trim()) {
      score++;
    }

    // Q2 and Q3 - check against correct answers
    Object.keys(correctAnswers).forEach(qKey => {
      if (correctAnswers[qKey] === submission.answers[qKey]) {
        score++;
      }
    });

    // Connect to Neon database
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: true
    });

    await client.connect();

    // Create test system table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS test_system_submissions (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        student_password VARCHAR(255),
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        submission_data JSONB NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER DEFAULT 3,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Insert test system submission
    const result = await client.query(
      `INSERT INTO test_system_submissions (
        student_name, student_password, submission_data, score, total_questions
      ) VALUES ($1, $2, $3, $4, $5)
       RETURNING id, timestamp`,
      [
        submission.student_name,
        submission.student_password || '',
        JSON.stringify(submission),
        score,
        3
      ]
    );

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Test system submission successful',
        submissionId: result.rows[0].id,
        timestamp: result.rows[0].timestamp,
        results: {
          totalScore: `${score}/3`,
          percentage: `${((score / 3) * 100).toFixed(1)}%`,
          testType: 'Test System Demo'
        }
      }),
    };

  } catch (error) {
    console.error('Database error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Database error occurred',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    };
  }
};