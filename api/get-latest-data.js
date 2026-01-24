import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { limit = 10, deviceId } = req.query;

    let result;
    
    if (deviceId) {
      result = await sql`
        SELECT * FROM sensor_data 
        WHERE device_id = ${deviceId}
        ORDER BY created_at DESC 
        LIMIT ${parseInt(limit)}
      `;
    } else {
      result = await sql`
        SELECT * FROM sensor_data 
        ORDER BY created_at DESC 
        LIMIT ${parseInt(limit)}
      `;
    }

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
