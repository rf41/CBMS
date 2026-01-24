# CBMS - Deployment Guide ke Vercel

## 📋 Prerequisites
1. Install Node.js (v18 atau lebih baru) - Download dari https://nodejs.org/
2. Install Vercel CLI: `npm install -g vercel`
3. Buat akun di https://vercel.com (gratis)
4. Git sudah terinstall

## 🗄️ Setup Database Postgres di Vercel

### 1. Create Database
1. Login ke Vercel Dashboard (https://vercel.com/dashboard)
2. Pilih tab **Storage** di sidebar
3. Klik **Create Database**
4. Pilih **Postgres**
5. Pilih region terdekat (contoh: Singapore)
6. Klik **Create**

### 2. Get Connection Strings
Setelah database dibuat, Vercel akan otomatis menyediakan environment variables:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

Environment variables ini akan otomatis tersedia untuk project Anda.

## 🚀 Deploy ke Vercel

### Method 1: Via Vercel CLI (Recommended)

```bash
# 1. Install dependencies
npm install

# 2. Login ke Vercel
vercel login

# 3. Deploy ke production
vercel --prod
```

Ikuti instruksi di terminal:
- Set up and deploy? **Y**
- Which scope? Pilih account Anda
- Link to existing project? **N**
- What's your project's name? **cbms** (atau nama lain)
- In which directory is your code located? **./**
- Want to override the settings? **N**

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
   - Buka https://vercel.com/new
   - Pilih repository GitHub Anda
   - Klik **Import**
   - Vercel akan auto-detect settings
   - Klik **Deploy**

3. **Link Database:**
   - Setelah deploy, buka project settings
   - Pilih tab **Storage**
   - Link database yang sudah dibuat sebelumnya

## 🔧 Initialize Database

Setelah deployment berhasil, initialize database table:

### Via Browser:
Buka: `https://your-project.vercel.app/api/init-db` (method POST)

### Via cURL:
```bash
curl -X POST https://your-project.vercel.app/api/init-db
```

### Via Postman:
- Method: **POST**
- URL: `https://your-project.vercel.app/api/init-db`
- Headers: tidak perlu
- Body: kosong

Response sukses:
```json
{
  "success": true,
  "message": "Database initialized successfully"
}
```

## ✅ Test API Endpoints

### 1. Save Data (dari ESP32)
```bash
curl -X POST https://your-project.vercel.app/api/save-data \
  -H "Content-Type: application/json" \
  -d '{
    "heartRate": 85,
    "bodyTemperature": 37.0,
    "touchIntensity": "normal",
    "movementPattern": "normal",
    "soundActivity": "normal",
    "deviceId": "ESP32_001"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Data saved successfully",
  "data": {
    "id": 1,
    "heart_rate": 85,
    "body_temperature": 37.0,
    ...
  }
}
```

### 2. Get Latest Data
```bash
curl https://your-project.vercel.app/api/get-latest-data?limit=10
```

### 3. Get Data by ID
```bash
curl https://your-project.vercel.app/api/get-data?id=1
```

## 🔌 Setup ESP32

### 1. Install Libraries di Arduino IDE:
- WiFi (built-in)
- HTTPClient (built-in)
- ArduinoJson (via Library Manager)

### 2. Update Code ESP32:

Edit file `esp32-example.ino`:

```cpp
// Ganti dengan WiFi Anda
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// Ganti dengan URL Vercel Anda
const char* serverName = "https://your-project.vercel.app/api/save-data";
```

### 3. Upload ke ESP32:
1. Buka `esp32-example.ino` di Arduino IDE
2. Pilih board: **ESP32 Dev Module**
3. Pilih port yang sesuai
4. Klik **Upload**
5. Buka Serial Monitor (115200 baud) untuk melihat log

## 🌐 Update Website

File [index.html](index.html) sudah dikonfigurasi untuk menggunakan `script-dynamic.js`.

Jika belum, update baris terakhir sebelum `</body>`:

```html
<!-- Ganti dari script.js menjadi script-dynamic.js -->
<script src="script-dynamic.js"></script>
```

## 📊 Test Website

1. Buka website Anda: `https://your-project.vercel.app`
2. Buka Console browser (F12)
3. Test fetch data:
```javascript
// Fetch latest data
fetchLatestData();

// Fetch by ID
fetchDataById(1);
```

## 🔍 Monitoring & Debugging

### Vercel Dashboard:
- **Deployments**: https://vercel.com/dashboard
- **Logs**: Project > Logs
- **Database**: Project > Storage > Your Database

### View Database Records:
1. Buka Vercel Dashboard
2. Pilih Storage > Your Database
3. Klik **Query** tab
4. Jalankan query:
```sql
SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 10;
```

### Common Issues:

**1. Database connection failed**
- Pastikan database sudah di-link ke project
- Check environment variables di Project Settings > Environment Variables

**2. API returns 500**
- Check logs di Vercel Dashboard
- Pastikan tabel sudah dibuat (jalankan init-db)

**3. CORS Error**
- Sudah ditangani di API dengan header CORS
- Jika masih error, check browser console untuk detail

**4. ESP32 tidak bisa connect**
- Check WiFi credentials
- Check URL API (pastikan https://)
- Check Serial Monitor untuk error message

## 🔄 Update & Redeploy

### Via CLI:
```bash
git add .
git commit -m "Update description"
git push
vercel --prod
```

### Via GitHub (auto):
Just push to main branch - Vercel will auto-deploy!

## 📱 Custom Domain (Optional)

1. Buka Project Settings di Vercel
2. Pilih tab **Domains**
3. Add your custom domain
4. Follow DNS setup instructions

## 🎯 Usage Tips

### Website Features:
1. **Upload File**: Tetap bisa upload JSON manual
2. **Fetch Data**: Otomatis ambil data terbaru dari database
3. **Console Commands**:
   - `fetchLatestData()` - ambil data terbaru
   - `fetchDataById(1)` - ambil data berdasarkan ID

### ESP32 Features:
- Otomatis kirim data setiap 30 detik
- Data langsung masuk ke database
- Website bisa fetch data real-time

## 📝 Database Schema

Table: `sensor_data`
```sql
id                  SERIAL PRIMARY KEY
heart_rate          INTEGER NOT NULL
body_temperature    DECIMAL(4,2) NOT NULL
touch_intensity     VARCHAR(20) CHECK (low/normal/high)
movement_pattern    VARCHAR(20) CHECK (normal/repetitive/extreme)
sound_activity      VARCHAR(20) CHECK (normal/frequent/intense)
device_id           VARCHAR(50) DEFAULT 'ESP32_001'
created_at          TIMESTAMP DEFAULT NOW()
```

## 🆘 Support

Jika ada masalah:
1. Check Vercel logs
2. Check browser console
3. Check ESP32 Serial Monitor
4. Review dokumentasi Vercel: https://vercel.com/docs

## 🎉 Success!

Website Anda sekarang:
✅ Deploy di Vercel (gratis)
✅ Menggunakan Postgres database (gratis)
✅ Bisa menerima data dari ESP32
✅ Bisa fetch & display data real-time
✅ Tampilan tetap sama, backend dinamis

Selamat! CBMS Anda sudah jadi web dinamis! 🚀
