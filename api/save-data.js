const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  // Set CORS headers untuk ESP32
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { heartRate, bodyTemperature, touchIntensity, movementPattern, soundActivity, deviceId } = req.body;

    // Validasi data
    if (!heartRate || !bodyTemperature || !touchIntensity || !movementPattern || !soundActivity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validasi range nilai
    if (heartRate < 40 || heartRate > 200) {
      return res.status(400).json({ error: 'Heart rate out of valid range' });
    }

    if (bodyTemperature < 30 || bodyTemperature > 45) {
      return res.status(400).json({ error: 'Body temperature out of valid range' });
    }

    const validTouchIntensity = ['low', 'normal', 'high'];
    if (!validTouchIntensity.includes(touchIntensity.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid touch intensity value' });
    }

    const validMovementPattern = ['normal', 'repetitive', 'extreme'];
    if (!validMovementPattern.includes(movementPattern.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid movement pattern value' });
    }

    const validSoundActivity = ['normal', 'frequent', 'intense'];
    if (!validSoundActivity.includes(soundActivity.toLowerCase())) {
      return res.status(400).json({ error: 'Invalid sound activity value' });
    }

    // Simpan ke database
    const result = await sql`
      INSERT INTO sensor_data (
        heart_rate, 
        body_temperature, 
        touch_intensity, 
        movement_pattern, 
        sound_activity,
        device_id,
        created_at
      ) VALUES (
        ${heartRate}, 
        ${bodyTemperature}, 
        ${touchIntensity.toLowerCase()}, 
        ${movementPattern.toLowerCase()}, 
        ${soundActivity.toLowerCase()},
        ${deviceId || 'ESP32_001'},
        NOW()
      )
      RETURNING *
    `;

    return res.status(201).json({
      success: true,
      message: 'Data saved successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}
