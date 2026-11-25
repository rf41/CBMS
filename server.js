const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-memory mock database
let mockDatabase = [];
let currentId = 1;

// Seed with some initial data for testing
const seedData = [
    { heart_rate: 85, body_temperature: 37.0, touch_intensity: 'normal', movement_pattern: 'normal', sound_activity: 'normal', location: '-6.2088,106.8456' },
    { heart_rate: 90, body_temperature: 37.2, touch_intensity: 'high', movement_pattern: 'repetitive', sound_activity: 'frequent', location: 'Living Room' },
];

seedData.forEach(data => {
    mockDatabase.push({
        id: currentId++,
        ...data,
        device_id: 'ESP32_001',
        created_at: new Date(Date.now() - (seedData.length - currentId) * 3600000).toISOString() // Fake past times
    });
});

// API Mocks
app.post('/api/save-data', (req, res) => {
    const { heartRate, bodyTemperature, touchIntensity, movementPattern, soundActivity, location, deviceId } = req.body;
    
    if (!heartRate || !bodyTemperature || !touchIntensity || !movementPattern || !soundActivity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newRecord = {
        id: currentId++,
        heart_rate: heartRate,
        body_temperature: bodyTemperature,
        touch_intensity: touchIntensity.toLowerCase(),
        movement_pattern: movementPattern.toLowerCase(),
        sound_activity: soundActivity.toLowerCase(),
        location: location || 'Unknown',
        device_id: deviceId || 'ESP32_001',
        created_at: new Date().toISOString()
    };

    mockDatabase.push(newRecord);

    return res.status(201).json({
      success: true,
      message: 'Data saved successfully',
      data: newRecord
    });
});

app.get('/api/get-latest-data', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const deviceId = req.query.deviceId;

    let filtered = mockDatabase;
    if (deviceId) {
        filtered = filtered.filter(d => d.device_id === deviceId);
    }
    
    const sorted = [...filtered].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, limit);

    return res.status(200).json({
      success: true,
      count: sorted.length,
      data: sorted
    });
});

app.get('/api/get-data', (req, res) => {
    const id = parseInt(req.query.id);
    const data = mockDatabase.find(d => d.id === id);
    if (!data) return res.status(404).json({ success: false, error: 'Not found' });
    return res.status(200).json({ success: true, data });
});

app.post('/api/init-db', (req, res) => {
    return res.status(200).json({ success: true, message: 'Mock DB initialized' });
});

// Serve Static Files
app.use(express.static(path.join(__dirname, '.')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`===================================================`);
    console.log(`🚀 Local Development Server running!`);
    console.log(`👉 Web Interface: http://localhost:${port}`);
    console.log(`👉 App Interface: http://localhost:${port}/app/index.html`);
    console.log(`===================================================`);
    console.log(`API mocked in-memory (data will reset when server restarts)`);
});
