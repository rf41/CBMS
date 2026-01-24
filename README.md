# Child Behavior Monitoring System (CBMS)

Website dinamis untuk monitoring perilaku anak dengan integrasi database Vercel Postgres dan ESP32 IoT.

🌐 **Live Website**: [https://cbms-iota.vercel.app](https://cbms-iota.vercel.app)

---

## 📋 Daftar Isi

1. [Fitur Utama](#-fitur-utama)
2. [Teknologi](#-teknologi)
3. [Setup & Instalasi](#-setup--instalasi)
4. [Deploy ke Vercel](#-deploy-ke-vercel)
5. [Setup Database](#-setup-database)
6. [Setup ESP32](#-setup-esp32)
7. [Penggunaan Website](#-penggunaan-website)
8. [API Documentation](#-api-documentation)
9. [Testing](#-testing)
10. [Troubleshooting](#-troubleshooting)

---

## 🎯 Fitur Utama

### 1. **Home**
- Overview sistem
- Informasi cara kerja
- Disclaimer medis
- Feature cards

### 2. **Test API (Dashboard)**
- ✅ Form untuk menyimpan data baru ke database
- ✅ Get latest data dengan custom limit
- ✅ Get data berdasarkan ID
- ✅ Display API response dalam format JSON
- ✅ Real-time testing API endpoints

### 3. **Analysis**
- 📈 **Line Chart**: Visualisasi trend risk score dari 10 data terakhir
- 📊 **Statistics**: Total records, Average, Max, Min risk scores
- 🎯 **Detail Analysis**: Analisis lengkap data terbaru dengan risk assessment
- 🔄 **Auto Fetch**: Ambil data langsung dari database
- 💯 **Risk Scoring**: Algoritma perhitungan risk score (0-10)

### 4. **Recommendation**
- 📊 **Trend Chart**: Line chart dengan color-coded points
  - 🟢 **Green** = Low Risk (0-2)
  - 🟡 **Yellow** = Moderate Risk (3-5)
  - 🔴 **Red** = High Risk (6-10)
- 💡 **Smart Recommendations**: Rekomendasi berdasarkan analisis data
- ⏰ **Timestamp Labels**: Menampilkan waktu pengambilan data
- 📋 **Next Steps**: Panduan tindak lanjut

---

## 🛠️ Teknologi

### Frontend
- **HTML5** - Struktur website
- **CSS3** - Styling dengan custom properties
- **JavaScript (ES6+)** - Logic & interaksi
- **Chart.js 4.4.0** - Visualisasi data dengan line charts
- **Font Awesome 6.4.0** - Icons

### Backend
- **Node.js** - Runtime environment
- **Vercel Serverless Functions** - API endpoints
- **@vercel/postgres** - Database client

### Database
- **Vercel Postgres** - PostgreSQL database (free tier)

### IoT
- **ESP32** - Microcontroller untuk sensor
- **Arduino IDE** - Development environment
- **ArduinoJson** - JSON serialization

---

## 📦 Setup & Instalasi

### Prerequisites
1. **Node.js** (v18 atau lebih baru) - [Download](https://nodejs.org/)
2. **Git** - Version control
3. **Vercel Account** - [Daftar gratis](https://vercel.com)
4. **Arduino IDE** (untuk ESP32) - [Download](https://www.arduino.cc/en/software)

### Install Dependencies

```bash
# Clone repository (jika dari GitHub)
git clone https://github.com/yourusername/CBMS.git
cd CBMS

# Install dependencies
npm install

# Install Vercel CLI
npm install -g vercel
```

---

## 🚀 Deploy ke Vercel

### Method 1: Via Vercel CLI (Recommended)

```bash
# 1. Login ke Vercel
vercel login

# 2. Deploy ke production
vercel --prod
```

Ikuti instruksi di terminal:
- **Set up and deploy?** → Y
- **Which scope?** → Pilih account Anda
- **Link to existing project?** → N
- **What's your project's name?** → cbms (atau nama lain)
- **In which directory is your code located?** → ./
- **Want to override the settings?** → N

### Method 2: Via GitHub (Auto-deploy)

1. **Push ke GitHub:**
```bash
git init
git add .
git commit -m "Initial commit - CBMS dynamic"
git branch -M main
git remote add origin https://github.com/yourusername/CBMS.git
git push -u origin main
```

2. **Import di Vercel:**
   - Buka [https://vercel.com/new](https://vercel.com/new)
   - Pilih repository GitHub Anda
   - Klik **Import**
   - Vercel akan auto-detect settings
   - Klik **Deploy**

3. **Link Database:**
   - Setelah deploy, buka project settings
   - Pilih tab **Storage**
   - Link database yang sudah dibuat

---

## 🗄️ Setup Database

### 1. Buat Database Postgres di Vercel

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih tab **Storage** di sidebar
3. Klik **Create Database**
4. Pilih **Postgres**
5. Pilih region terdekat (contoh: Singapore)
6. Klik **Create**

### 2. Environment Variables

Setelah database dibuat, Vercel akan otomatis menyediakan environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

Environment variables ini akan otomatis tersedia untuk project Anda.

### 3. Initialize Database

Setelah deployment berhasil, initialize tabel database:

#### Via Browser:
Buka: `https://your-project.vercel.app/api/init-db` (method POST)

#### Via PowerShell:
```powershell
Invoke-WebRequest -Uri "https://cbms-iota.vercel.app/api/init-db" -Method POST -UseBasicParsing | Select-Object -ExpandProperty Content
```

#### Via cURL:
```bash
curl -X POST https://your-project.vercel.app/api/init-db
```

**Response sukses:**
```json
{
  "success": true,
  "message": "Database initialized successfully"
}
```

### 4. Database Schema

Table: `sensor_data`

```sql
CREATE TABLE sensor_data (
    id                  SERIAL PRIMARY KEY,
    heart_rate          INTEGER NOT NULL,
    body_temperature    DECIMAL(4,2) NOT NULL,
    touch_intensity     VARCHAR(20) NOT NULL CHECK (touch_intensity IN ('low', 'normal', 'high')),
    movement_pattern    VARCHAR(20) NOT NULL CHECK (movement_pattern IN ('normal', 'repetitive', 'extreme')),
    sound_activity      VARCHAR(20) NOT NULL CHECK (sound_activity IN ('normal', 'frequent', 'intense')),
    device_id           VARCHAR(50) DEFAULT 'ESP32_001',
    created_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_created_at ON sensor_data(created_at DESC);
CREATE INDEX idx_device_id ON sensor_data(device_id);
```

---

## 🔌 Setup ESP32

### 1. Install Libraries di Arduino IDE

Via **Library Manager** (Sketch → Include Library → Manage Libraries):
- **WiFi** (built-in untuk ESP32)
- **HTTPClient** (built-in)
- **ArduinoJson** (cari dan install versi terbaru)

### 2. Konfigurasi Code

Edit file `esp32-example.ino`:

```cpp
// ===== GANTI DENGAN WIFI ANDA =====
const char* ssid = "NAMA_WIFI_ANDA";
const char* password = "PASSWORD_WIFI_ANDA";

// ===== GANTI DENGAN URL VERCEL ANDA =====
const char* serverName = "https://your-project.vercel.app/api/save-data";
```

### 3. Upload ke ESP32

1. Buka `esp32-example.ino` di Arduino IDE
2. Pilih board: **Tools → Board → ESP32 Dev Module**
3. Pilih port: **Tools → Port → COM[X]**
4. Klik **Upload** (panah kanan)
5. Buka **Serial Monitor** (115200 baud) untuk melihat log

### 4. Koneksi Sensor (Contoh)

```
ESP32 Pin Mapping:
- Heart Rate Sensor → GPIO 34 (ADC1)
- Temperature Sensor → GPIO 35 (ADC1)
- Touch Sensor → GPIO 4
- Movement Sensor → GPIO 16
- Sound Sensor → GPIO 36 (ADC1)
- LED Indicator → GPIO 2
```

**Note:** Sesuaikan pin dengan sensor yang Anda gunakan.

---

## 💻 Penggunaan Website

### Tab 1: Test API

1. **Save Data Baru:**
   - Isi form dengan nilai sensor:
     - Heart Rate (40-200 bpm)
     - Body Temperature (30-45 °C)
     - Touch Intensity (low/normal/high)
     - Movement Pattern (normal/repetitive/extreme)
     - Sound Activity (normal/frequent/intense)
   - Klik **"Save Data to Database"**
   - Response akan muncul dengan ID data baru

2. **Get Latest Data:**
   - Set jumlah records (default: 10)
   - Klik **"Get Latest Data"**
   - JSON response akan ditampilkan

3. **Get Data by ID:**
   - Masukkan ID data yang ingin diambil
   - Klik **"Get Data by ID"**
   - Detail data akan ditampilkan

### Tab 2: Analysis

1. Pastikan ada minimal 10 data di database
2. Klik tombol **"📈 Analyze Latest 10 Data"**
3. Sistem akan:
   - Fetch 10 data terakhir dari database
   - Hitung risk score untuk setiap data
   - Tampilkan line chart trend
   - Tampilkan statistics (Total, Average, Max, Min)
   - Analisis detail data terbaru dengan sensor breakdown

**Chart Features:**
- Hover pada titik untuk lihat nilai detail
- X-axis: Data ID
- Y-axis: Risk Score (0-10)

### Tab 3: Recommendation

1. Klik tombol **"💡 Analyze & Recommend"**
2. Sistem akan:
   - Fetch 10 data terakhir
   - Calculate average risk score
   - Generate personalized recommendations
   - Tampilkan trend chart dengan timestamp
   - Color-coded points berdasarkan risk level

**Rekomendasi Berdasarkan:**
- **Low Risk (avg ≤ 2)**: 
  - Continue monitoring
  - Maintain healthy routines
  - Document changes
  
- **Moderate Risk (avg 3-5)**:
  - Increase monitoring frequency
  - Document specific patterns
  - Schedule follow-up in 1-2 weeks
  
- **High Risk (avg > 5)**:
  - **Schedule appointment with pediatrician**
  - Prepare detailed documentation
  - Consult child development specialist
  - Share data with healthcare professionals

---

## 📡 API Documentation

### Base URL
```
Production: https://cbms-iota.vercel.app/api
Development: http://localhost:3000/api
```

### Endpoints

#### 1. Initialize Database
```http
POST /api/init-db
```

**Response:**
```json
{
  "success": true,
  "message": "Database initialized successfully"
}
```

---

#### 2. Save Sensor Data
```http
POST /api/save-data
Content-Type: application/json
```

**Request Body:**
```json
{
  "heartRate": 85,
  "bodyTemperature": 37.2,
  "touchIntensity": "normal",
  "movementPattern": "normal",
  "soundActivity": "normal",
  "deviceId": "ESP32_001"
}
```

**Validation:**
- `heartRate`: Integer, required
- `bodyTemperature`: Float, required
- `touchIntensity`: String (low/normal/high), required
- `movementPattern`: String (normal/repetitive/extreme), required
- `soundActivity`: String (normal/frequent/intense), required
- `deviceId`: String, optional (default: "ESP32_001")

**Response:**
```json
{
  "success": true,
  "message": "Data saved successfully",
  "data": {
    "id": 1,
    "heart_rate": 85,
    "body_temperature": 37.2,
    "touch_intensity": "normal",
    "movement_pattern": "normal",
    "sound_activity": "normal",
    "device_id": "ESP32_001",
    "created_at": "2024-01-24T10:30:00.000Z"
  }
}
```

---

#### 3. Get Latest Data
```http
GET /api/get-latest-data?limit=10&deviceId=ESP32_001
```

**Query Parameters:**
- `limit`: Integer (default: 10) - Jumlah data yang diambil
- `deviceId`: String (optional) - Filter berdasarkan device ID

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 10,
      "heart_rate": 95,
      "body_temperature": 37.5,
      "touch_intensity": "normal",
      "movement_pattern": "normal",
      "sound_activity": "normal",
      "device_id": "ESP32_001",
      "created_at": "2024-01-24T10:35:00.000Z"
    },
    // ... 9 data lainnya
  ]
}
```

---

#### 4. Get Data by ID
```http
GET /api/get-data?id=1
```

**Query Parameters:**
- `id`: Integer, required - ID data yang ingin diambil

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "heart_rate": 85,
    "body_temperature": 37.0,
    "touch_intensity": "normal",
    "movement_pattern": "normal",
    "sound_activity": "normal",
    "device_id": "ESP32_001",
    "created_at": "2024-01-24T10:00:00.000Z"
  }
}
```

---

## 🧪 Testing

### Test Sample Data

#### Low Risk Data:
```powershell
$body = @{
    heartRate = 85
    bodyTemperature = 37.0
    touchIntensity = "normal"
    movementPattern = "normal"
    soundActivity = "normal"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://cbms-iota.vercel.app/api/save-data" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

#### Medium Risk Data:
```powershell
$body = @{
    heartRate = 125
    bodyTemperature = 37.8
    touchIntensity = "low"
    movementPattern = "repetitive"
    soundActivity = "frequent"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://cbms-iota.vercel.app/api/save-data" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

#### High Risk Data:
```powershell
$body = @{
    heartRate = 140
    bodyTemperature = 38.2
    touchIntensity = "high"
    movementPattern = "extreme"
    soundActivity = "intense"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://cbms-iota.vercel.app/api/save-data" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
```

### Generate Multiple Test Data

```powershell
# Script untuk generate 10 sample data
1..10 | ForEach-Object {
    $heartRate = Get-Random -Minimum 70 -Maximum 130
    $temp = (Get-Random -Minimum 360 -Maximum 380) / 10
    $touch = @("low", "normal", "high") | Get-Random
    $movement = @("normal", "repetitive", "extreme") | Get-Random
    $sound = @("normal", "frequent", "intense") | Get-Random
    
    $body = @{
        heartRate = $heartRate
        bodyTemperature = $temp
        touchIntensity = $touch
        movementPattern = $movement
        soundActivity = $sound
    } | ConvertTo-Json
    
    Write-Host "Sending data $_..."
    Invoke-WebRequest -Uri "https://cbms-iota.vercel.app/api/save-data" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing | Out-Null
    Start-Sleep -Milliseconds 500
}
Write-Host "Done! 10 data created."
```

### Test di Browser Console

```javascript
// Test functions tersedia di console
testGetLatestData();           // Get 10 data terakhir
testGetDataById();             // Get data by ID
analyzeLatestData();           // Analyze + show chart
analyzeRecommendations();      // Generate recommendations
```

---

## 📊 Risk Score Calculation

### Algoritma Perhitungan

**Maximum Score: 10 points**

Setiap parameter sensor memberikan score 0-2:

#### Heart Rate (0-2 points)
- **0 point**: 70-120 bpm (normal)
- **1 point**: 60-69 or 121-130 bpm (slightly elevated)
- **2 points**: <60 or >130 bpm (abnormal)

#### Body Temperature (0-2 points)
- **0 point**: 36.5-37.5°C (normal)
- **1 point**: 36.0-36.4 or 37.6-38.0°C (slightly off)
- **2 points**: <36.0 or >38.0°C (abnormal)

#### Touch Intensity (0-2 points)
- **0 point**: "normal"
- **1 point**: "low" (low sensitivity)
- **2 points**: "high" (high intensity detected)

#### Movement Pattern (0-2 points)
- **0 point**: "normal"
- **1 point**: "repetitive" (repetitive patterns)
- **2 points**: "extreme" (extreme movements)

#### Sound Activity (0-2 points)
- **0 point**: "normal"
- **1 point**: "frequent" (frequent activity)
- **2 points**: "intense" (intense sounds)

### Risk Levels

| Total Score | Risk Level | Status | Action |
|-------------|------------|--------|--------|
| 0-2 | Low Risk | 🟢 Green | Continue monitoring |
| 3-5 | Moderate | 🟡 Yellow | Needs observation |
| 6-10 | High Risk | 🔴 Red | Professional consultation |

---

## 🔧 Troubleshooting

### 1. Database Connection Failed
**Gejala:** API error 500, "Database connection failed"

**Solusi:**
- Pastikan database sudah di-link ke project di Vercel
- Check environment variables: Project Settings → Environment Variables
- Verifikasi `POSTGRES_URL` tersedia
- Jalankan ulang `init-db` endpoint

### 2. API Returns 404
**Gejala:** Endpoint tidak ditemukan

**Solusi:**
- Pastikan file API ada di folder `/api`
- Check `vercel.json` configuration
- Redeploy: `vercel --prod`
- Check Vercel logs untuk detail error

### 3. Chart Tidak Muncul
**Gejala:** Empty canvas, chart tidak render

**Solusi:**
- Pastikan Chart.js loaded: Check browser console
- Pastikan minimal 1 data di database
- Clear browser cache
- Check console untuk JavaScript errors

### 4. ESP32 Tidak Bisa Connect
**Gejala:** WiFi connection failed, HTTP error

**Solusi:**
- Check WiFi credentials (SSID & password)
- Pastikan URL API menggunakan HTTPS
- Check signal WiFi strength
- Buka Serial Monitor (115200 baud) untuk log detail
- Test endpoint manual via Postman/browser
- Pastikan ESP32 board definition terinstall

### 5. CORS Error
**Gejala:** "Access to fetch blocked by CORS policy"

**Solusi:**
- Header CORS sudah ditambahkan di semua API endpoints
- Clear browser cache
- Jika masih error, check browser console untuk detail
- Test dengan browser lain atau incognito mode

### 6. Data Tidak Muncul di Analysis
**Gejala:** "No data available in database"

**Solusi:**
- Pastikan sudah jalankan `init-db`
- Save minimal 1 data via Test API tab
- Check database via Vercel Dashboard → Storage → Query tab
- Jalankan query: `SELECT * FROM sensor_data LIMIT 10;`

### 7. Deployment Failed
**Gejala:** Vercel build error

**Solusi:**
- Check syntax error di semua file
- Pastikan `package.json` valid
- Pastikan `vercel.json` valid JSON
- Check build logs di Vercel Dashboard
- Test locally dulu sebelum deploy

---

## 📱 Monitoring & Debugging

### Vercel Dashboard
- **Deployments**: [https://vercel.com/dashboard](https://vercel.com/dashboard)
- **Logs**: Project → Logs (real-time logs)
- **Database**: Project → Storage → Query tab

### View Database Records
1. Buka Vercel Dashboard
2. Pilih Storage → Your Database
3. Klik **Query** tab
4. Jalankan query:
```sql
-- View latest 10 records
SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 10;

-- Count total records
SELECT COUNT(*) FROM sensor_data;

-- View records by device
SELECT * FROM sensor_data WHERE device_id = 'ESP32_001';

-- Calculate average risk (manual)
SELECT 
  AVG(heart_rate) as avg_hr,
  AVG(body_temperature) as avg_temp,
  COUNT(*) as total
FROM sensor_data;
```

### Browser Console Debugging
Buka website → F12 → Console

```javascript
// Check available functions
console.log(window);

// Manual test
testGetLatestData();
testGetDataById();
analyzeLatestData();
analyzeRecommendations();

// Check API base URL
console.log(API_BASE_URL);
```

---

## 🔄 Update & Redeploy

### Via CLI:
```bash
# Make changes
git add .
git commit -m "Update description"
git push origin main

# Deploy to production
vercel --prod
```

### Via GitHub (Auto-deploy):
```bash
# Just push - Vercel will auto-deploy
git add .
git commit -m "Update description"
git push origin main
```

---

## 📱 Custom Domain (Optional)

1. Buka Project Settings di Vercel
2. Pilih tab **Domains**
3. Add your custom domain
4. Follow DNS setup instructions
5. Wait for DNS propagation (5-10 menit)

---

## 📁 File Structure

```
CBMS/
├── index.html              # Main HTML file
├── style.css               # Stylesheet
├── script-dynamic.js       # Frontend logic + API integration
├── esp32-example.ino       # ESP32 Arduino code
├── package.json            # Dependencies
├── vercel.json            # Vercel configuration
├── .gitignore             # Git ignore rules
├── README.md              # Documentation (ini)
├── api/
│   ├── init-db.js         # Initialize database table
│   ├── save-data.js       # POST: Save sensor data
│   ├── get-latest-data.js # GET: Fetch latest records
│   └── get-data.js        # GET: Fetch by ID
└── assets/
    ├── TeddyTalk.jpeg     # Logo
    ├── Chart.jpeg         # Icon
    ├── Lock.jpeg          # Icon
    ├── Lightning.jpeg     # Icon
    └── List.jpeg          # Icon
```

---

## 🎯 Checklist Deployment

- [ ] Node.js installed
- [ ] Vercel account created
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Database created di Vercel
- [ ] Project deployed (`vercel --prod`)
- [ ] Database initialized (`/api/init-db`)
- [ ] Test save data endpoint
- [ ] Test get latest data
- [ ] Test get data by ID
- [ ] Test Analysis tab (with charts)
- [ ] Test Recommendation tab (with charts)
- [ ] ESP32 code updated dengan WiFi credentials
- [ ] ESP32 code updated dengan Vercel URL
- [ ] ESP32 uploaded dan tested
- [ ] Check ESP32 Serial Monitor logs
- [ ] Website accessible dan navigation working
- [ ] All 4 tabs working correctly

---

## 📚 Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [ESP32 Documentation](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/)

### Libraries
- [Chart.js](https://www.chartjs.org/) - Charting library
- [Font Awesome](https://fontawesome.com/) - Icons
- [@vercel/postgres](https://www.npmjs.com/package/@vercel/postgres) - Database client
- [ArduinoJson](https://arduinojson.org/) - JSON for Arduino

---

## ⚠️ Disclaimer

**PENTING:** Sistem ini adalah **prototipe edukasi** dan **BUKAN alat diagnosis medis**. 

Sistem ini menganalisis pola perilaku dari data sensor tetapi **TIDAK mendiagnosis** autisme atau kondisi medis apapun. 

**Selalu konsultasikan dengan profesional kesehatan yang berkualifikasi** untuk assessment dan diagnosis medis yang tepat.

---

## 📄 License

Copyright © 2024 CBMS Project. Educational prototype - Not for medical diagnosis.

---

## 🆘 Support & Contact

Jika ada masalah atau pertanyaan:

1. **Check dokumentasi** di README ini
2. **Check Vercel logs** untuk error details
3. **Check browser console** untuk JavaScript errors
4. **Check ESP32 Serial Monitor** untuk IoT issues
5. **Review Vercel documentation** untuk deployment issues

---

## 🎉 Success!

Website Anda sekarang:
- ✅ Deploy di Vercel (gratis)
- ✅ Menggunakan Postgres database (gratis)
- ✅ Bisa menerima data dari ESP32
- ✅ Bisa fetch & display data real-time
- ✅ Visualisasi dengan Chart.js
- ✅ Smart analysis & recommendations
- ✅ Responsive design

**Selamat! CBMS Anda sudah jadi web dinamis yang fully functional!** 🚀

---

**Live Website**: [https://cbms-iota.vercel.app](https://cbms-iota.vercel.app)

**Vercel Dashboard**: [https://vercel.com/ridwan-firmansyahs-projects-207768d5/cbms](https://vercel.com/ridwan-firmansyahs-projects-207768d5/cbms)
