const { Client } = require('pg');

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Connect to Neon database
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: true
    });

    await client.connect();

    // Create table if it doesn't exist (safety check)
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

    // Get all test system submissions ordered by timestamp (most recent first)
    const result = await client.query(`
      SELECT
        id,
        student_name,
        timestamp,
        submission_data,
        score,
        total_questions,
        created_at
      FROM test_system_submissions
      ORDER BY timestamp DESC
    `);

    await client.end();

    // Transform data for frontend compatibility
    const submissions = result.rows.map(row => ({
      id: row.id,
      studentName: row.student_name,
      timestamp: row.timestamp,
      totalScore: row.score,
      totalQuestions: row.total_questions,
      answers: row.submission_data.answers || {},
      completed: true,
      submissionData: row.submission_data
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        submissions: submissions,
        count: submissions.length,
        timestamp: new Date().toISOString()
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
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        submissions: [], // Fallback empty array
        count: 0
      }),
    };
  }
};