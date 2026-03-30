const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
    // CORS configuration
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        // Connect to Neon using environment variable
        const sql = neon(process.env.NETLIFY_DATABASE_URL);

        // Create table if it doesn't exist (safety check)
        await sql`
            CREATE TABLE IF NOT EXISTS level2_submissions (
                id SERIAL PRIMARY KEY,
                student_name VARCHAR(255) NOT NULL,
                exam_type VARCHAR(50) NOT NULL,
                score INTEGER,
                max_score INTEGER,
                answers JSONB,
                submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;

        // Get all Level 2 submissions ordered by time
        const result = await sql`
            SELECT
                id,
                student_name as "studentName",
                exam_type as "examType",
                score,
                max_score as "maxScore",
                answers,
                submitted_at as timestamp
            FROM level2_submissions
            ORDER BY submitted_at DESC
        `;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                submissions: result,
                count: result.length,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Fetch Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                success: false,
                error: 'Failed to fetch submissions', 
                details: error.message,
                submissions: [],
                count: 0
            })
        };
    }
};
