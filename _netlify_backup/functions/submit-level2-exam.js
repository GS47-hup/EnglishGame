const { neon } = require('@neondatabase/serverless');

exports.handler = async (event, context) => {
    // CORS configuration
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const { studentName, examType, answers } = body;

        if (!studentName || !examType || !answers) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields' })
            };
        }

        // Connect to Neon using environment variable
        const sql = neon(process.env.NETLIFY_DATABASE_URL);

        // Calculate score (Dummy logic for now, easily expandable)
        let calculatedScore = 0;
        let maxScore = answers.length;

        // Auto-grace logic for Level 2 Reading (exact answer checking)
        if (examType === 'Level2_Reading') {
            const readingKey = {
                1: 'B', 2: 'B', 3: 'A', 4: 'B', 5: 'C',
                6: 'B', 7: 'A', 8: 'C', 9: 'D', 10: 'E',
                11: 'T', 12: 'F', 13: 'F', 14: 'T', 15: 'F',
                16: 'A', 17: 'B', 18: 'C', 19: 'B', 20: 'C',
                21: 'B', 22: 'B', 23: 'C', 24: 'B', 25: 'B'
            };
            answers.forEach(q => {
                if (readingKey[q.number] && readingKey[q.number] === q.answer.trim().toUpperCase()) {
                    calculatedScore++;
                }
            });
            maxScore = 25; // Full mark for reading
        } else {
            // For writing/listening, we might want to just store it for teacher manual grading
            // Default to 0 until teacher grades
        }

        // Create table if it doesn't exist
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

        // Insert submission
        const result = await sql`
            INSERT INTO level2_submissions (student_name, exam_type, score, max_score, answers)
            VALUES (${studentName}, ${examType}, ${calculatedScore}, ${maxScore}, ${JSON.stringify(answers)})
            RETURNING id
        `;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                submissionId: result[0].id,
                score: calculatedScore,
                maxScore: maxScore
            })
        };

    } catch (error) {
        console.error('Submission Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to process submission', details: error.message })
        };
    }
};
