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
    // Connect to Neon database
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: true
    });

    await client.connect();

    // Get count before deletion
    const countResult = await client.query('SELECT COUNT(*) FROM exam_submissions');
    const deletedCount = parseInt(countResult.rows[0].count);

    // Clear all submissions
    await client.query('DELETE FROM exam_submissions');

    // Reset the sequence for clean IDs
    await client.query('ALTER SEQUENCE exam_submissions_id_seq RESTART WITH 1');

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `All ${deletedCount} submissions have been cleared`,
        deletedCount: deletedCount,
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
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }),
    };
  }
};