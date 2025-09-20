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
      CREATE TABLE IF NOT EXISTS placement_test_submissions (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        student_password VARCHAR(255),
        timestamp TIMESTAMPTZ DEFAULT NOW(),
        start_time TIMESTAMPTZ,
        end_time TIMESTAMPTZ,
        completion_time VARCHAR(50),
        submission_data JSONB NOT NULL,
        total_score INTEGER NOT NULL,
        level3_score INTEGER NOT NULL,
        level4_score INTEGER NOT NULL,
        total_questions INTEGER DEFAULT 49,
        questions_answered INTEGER,
        placement_level VARCHAR(50),
        recommendation TEXT,
        writing_task VARCHAR(20),
        writing_content TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Get all placement test submissions ordered by timestamp (most recent first)
    const result = await client.query(`
      SELECT
        id,
        student_name,
        timestamp,
        start_time,
        end_time,
        completion_time,
        submission_data,
        total_score,
        level3_score,
        level4_score,
        total_questions,
        questions_answered,
        placement_level,
        recommendation,
        writing_task,
        writing_content,
        created_at
      FROM placement_test_submissions
      ORDER BY timestamp DESC
    `);

    await client.end();

    // Transform data for frontend compatibility
    const submissions = result.rows.map(row => ({
      id: row.id,
      studentName: row.student_name,
      timestamp: row.timestamp,
      startTime: row.start_time,
      endTime: row.end_time,
      completionTime: row.completion_time,
      totalScore: row.total_score,
      level3Score: row.level3_score,
      level4Score: row.level4_score,
      totalQuestions: row.total_questions,
      questionsAnswered: row.questions_answered,
      placementLevel: row.placement_level,
      recommendation: row.recommendation,
      writingTask: row.writing_task,
      writingContent: row.writing_content,
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