import { sql } from '@vercel/postgres';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS sensor_data (
        id SERIAL PRIMARY KEY,
        heart_rate INTEGER NOT NULL,
        body_temperature DECIMAL(4,2) NOT NULL,
        touch_intensity VARCHAR(20) NOT NULL CHECK (touch_intensity IN ('low', 'normal', 'high')),
        movement_pattern VARCHAR(20) NOT NULL CHECK (movement_pattern IN ('normal', 'repetitive', 'extreme')),
        sound_activity VARCHAR(20) NOT NULL CHECK (sound_activity IN ('normal', 'frequent', 'intense')),
        device_id VARCHAR(50) DEFAULT 'ESP32_001',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create index for better performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_created_at ON sensor_data(created_at DESC)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_device_id ON sensor_data(device_id)
    `;

    return res.status(200).json({
      success: true,
      message: 'Database initialized successfully'
    });

  } catch (error) {
    console.error('Database initialization error:', error);
    return res.status(500).json({ 
      error: 'Failed to initialize database',
      details: error.message 
    });
  }
}
