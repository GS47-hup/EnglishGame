const { Client } = require('pg');

// All valid exam keys in the system
const ALL_EXAM_KEYS = [
  '2-reading', '2-writing', '2-listening',
  '4-reading', '4-writing', '4-listening',
  '5-reading', '5-writing', '5-listening',
];

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: true,
    });

    await client.connect();

    // Auto-create exam_status table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS exam_status (
        exam_key  TEXT PRIMARY KEY,
        is_open   BOOLEAN DEFAULT FALSE,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    // Seed any missing exam keys with default closed state
    for (const key of ALL_EXAM_KEYS) {
      await client.query(
        `INSERT INTO exam_status (exam_key, is_open)
         VALUES ($1, FALSE)
         ON CONFLICT (exam_key) DO NOTHING`,
        [key]
      );
    }

    // Fetch all current statuses
    const result = await client.query('SELECT exam_key, is_open, updated_at FROM exam_status');

    await client.end();

    // Convert rows array to a clean { examKey: boolean } map for easy frontend use
    const statusMap = {};
    result.rows.forEach(row => {
      statusMap[row.exam_key] = row.is_open;
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, statuses: statusMap }),
    };

  } catch (error) {
    console.error('get-exam-status error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Failed to load exam statuses.' }),
    };
  }
};
