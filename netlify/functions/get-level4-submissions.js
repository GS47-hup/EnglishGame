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

    // Get all Level 4 submissions ordered by timestamp (most recent first)
    const result = await client.query(`
      SELECT
        id,
        student_name,
        exam_type,
        timestamp,
        submission_data,
        time_taken,
        created_at
      FROM level4_exam_submissions
      ORDER BY timestamp DESC
    `);

    await client.end();

    // Transform data for frontend compatibility
    const submissions = result.rows.map(row => ({
      id: row.id,
      studentName: row.student_name,
      examType: row.exam_type,
      timestamp: row.timestamp,
      timeTaken: row.time_taken,
      submissionData: row.submission_data,
      completed: true
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
