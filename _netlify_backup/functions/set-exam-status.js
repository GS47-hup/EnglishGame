const { Client } = require('pg');

const VALID_EXAM_KEYS = [
  '2-reading', '2-writing', '2-listening',
  '4-reading', '4-writing', '4-listening',
  '5-reading', '5-writing', '5-listening',
];

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-token',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // ── AUTH CHECK ───────────────────────────────────────────────────────────
  // The admin token is set in Netlify Dashboard → Environment Variables
  // as ADMIN_SECRET_KEY. It is NEVER in the frontend code.
  const providedToken = event.headers['x-admin-token'];
  const secretKey = process.env.ADMIN_SECRET_KEY;

  if (!secretKey) {
    // The env variable hasn't been set yet in Netlify dashboard
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Admin system not configured. Please set ADMIN_SECRET_KEY in Netlify Environment Variables.'
      }),
    };
  }

  if (!providedToken || providedToken !== secretKey) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ success: false, error: 'Unauthorized. Invalid admin token.' }),
    };
  }
  // ── END AUTH CHECK ───────────────────────────────────────────────────────

  try {
    const { examKey, isOpen } = JSON.parse(event.body);

    // Validate inputs
    if (!examKey || !VALID_EXAM_KEYS.includes(examKey)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: `Invalid exam key: "${examKey}"` }),
      };
    }

    if (typeof isOpen !== 'boolean') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'isOpen must be a boolean (true or false).' }),
      };
    }

    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: true,
    });

    await client.connect();

    await client.query(
      `INSERT INTO exam_status (exam_key, is_open, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (exam_key)
       DO UPDATE SET is_open = $2, updated_at = NOW()`,
      [examKey, isOpen]
    );

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `Exam "${examKey}" is now ${isOpen ? '🟢 OPEN' : '🔴 CLOSED'}.`,
        examKey,
        isOpen,
      }),
    };

  } catch (error) {
    console.error('set-exam-status error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Database error. Could not update exam status.' }),
    };
  }
};
