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
    if (!submission.studentName || !submission.examType || !submission.answers) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: 'Missing required fields: studentName, examType, and answers'
        }),
      };
    }

    // Connect to Neon database
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: true
    });

    await client.connect();

    // Create table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS level4_exam_submissions (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        exam_type VARCHAR(50) NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        submission_data JSONB NOT NULL,
        time_taken VARCHAR(50),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Insert submission
    const result = await client.query(
      `INSERT INTO level4_exam_submissions (student_name, exam_type, submission_data, time_taken)
       VALUES ($1, $2, $3, $4)
       RETURNING id, timestamp`,
      [
        submission.studentName,
        submission.examType,
        JSON.stringify(submission),
        submission.timeTaken || 'N/A'
      ]
    );

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Level 4 ${submission.examType} exam submitted successfully`,
        submissionId: result.rows[0].id,
        timestamp: result.rows[0].timestamp
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
