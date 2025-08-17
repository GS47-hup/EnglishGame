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
    if (!submission.studentName || !submission.answers) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: studentName and answers' 
        }),
      };
    }

    // Calculate score
    const correctAnswers = {
      1: "🍎", 2: "🐱", 3: "📚", 4: "🚗", 5: "🌸",
      6: "⚽", 7: "🌳", 8: "🏠", 9: "🐦", 10: "🐟"
    };
    
    let score = 0;
    submission.answers.forEach(answer => {
      if (correctAnswers[answer.number] === answer.image) {
        score++;
      }
    });

    // Connect to Neon database
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: true
    });

    await client.connect();

    // Create table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS exam_submissions (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        submission_data JSONB NOT NULL,
        score INTEGER NOT NULL,
        total_questions INTEGER DEFAULT 10,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Insert submission
    const result = await client.query(
      `INSERT INTO exam_submissions (student_name, submission_data, score, total_questions) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, timestamp`,
      [
        submission.studentName,
        JSON.stringify(submission),
        score,
        10
      ]
    );

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Exam submitted successfully',
        submissionId: result.rows[0].id,
        timestamp: result.rows[0].timestamp,
        score: `${score}/10`
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