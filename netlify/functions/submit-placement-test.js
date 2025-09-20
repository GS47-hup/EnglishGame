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

    // Calculate score for Level 3 & 4 Placement Test
    const correctAnswers = {
      // Level 3 Assessment (Questions 1-24)
      'q1': 'a', 'q2': 'b', 'q3': 'a', 'q4': 'b', 'q5': 'a',
      'q7': 'c', 'q8': 'b', 'q9': 'a', 'q10': 'c', 'q11': 'a',
      'q12': 'c', 'q13': 'b', 'q14': 'a', 'q15': 'b', 'q16': 'b',
      'q17': 'c', 'q18': 'a', 'q19': 'a', 'q20': 'b', 'q21': 'a',
      'q22': 'b', 'q23': 'b', 'q24': 'a',

      // Level 4 Assessment (Questions 25-49)
      'q25': 'b', 'q26': 'a', 'q27': 'c', 'q28': 'b', 'q29': 'a',
      'q30': 'c', 'q31': 'b', 'q32': 'c', 'q33': 'b', 'q34': 'a',
      'q35': 'a', 'q36': 'b', 'q37': 'c', 'q38': 'b', 'q39': 'b',
      'q40': 'b', 'q41': 'a', 'q42': 'b', 'q43': 'a', 'q44': 'a',
      'q45': 'b', 'q46': 'b', 'q47': 'c', 'q48': 'a', 'q49': 'a'
    };

    let score = 0;
    let level3Score = 0;
    let level4Score = 0;

    // Calculate total score and level-specific scores
    Object.keys(submission.answers).forEach(questionKey => {
      if (questionKey.startsWith('question_')) {
        const qNum = questionKey.replace('question_', '');
        const qKey = 'q' + qNum;

        if (correctAnswers[qKey] === submission.answers[questionKey]) {
          score++;

          // Track level-specific scores
          if (parseInt(qNum) <= 24) {
            level3Score++;
          } else if (parseInt(qNum) <= 49) {
            level4Score++;
          }
        }
      }
    });

    // Determine placement level based on performance
    let placementLevel = 'Pre-Level 3';
    let recommendation = 'Start with foundational Level 3 content';

    if (level3Score >= 18 && level4Score >= 15) {
      placementLevel = 'Level 4+';
      recommendation = 'Ready for Level 4 or higher content';
    } else if (level3Score >= 15) {
      placementLevel = 'Level 4';
      recommendation = 'Ready to begin Level 4 content';
    } else if (level3Score >= 12) {
      placementLevel = 'Level 3';
      recommendation = 'Continue with Level 3 content';
    }

    // Connect to Neon database
    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: true
    });

    await client.connect();

    // Create placement test table if it doesn't exist
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

    // Insert placement test submission
    const result = await client.query(
      `INSERT INTO placement_test_submissions (
        student_name, student_password, start_time, end_time, completion_time,
        submission_data, total_score, level3_score, level4_score,
        questions_answered, placement_level, recommendation,
        writing_task, writing_content
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING id, timestamp`,
      [
        submission.student_name,
        submission.student_password || '',
        submission.start_time ? new Date(submission.start_time) : null,
        submission.end_time ? new Date(submission.end_time) : null,
        submission.completion_time || '',
        JSON.stringify(submission),
        score,
        level3Score,
        level4Score,
        submission.questions_answered || 0,
        placementLevel,
        recommendation,
        submission.answers.writing_task || '',
        submission.answers.writing_content || ''
      ]
    );

    await client.end();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Placement test submitted successfully',
        submissionId: result.rows[0].id,
        timestamp: result.rows[0].timestamp,
        results: {
          totalScore: `${score}/49`,
          level3Score: `${level3Score}/24`,
          level4Score: `${level4Score}/25`,
          placementLevel: placementLevel,
          recommendation: recommendation
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