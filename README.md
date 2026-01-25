# Child Behavior Monitoring System (CBMS)

Website dinamis untuk monitoring perilaku anak dengan integrasi database Vercel Postgres dan ESP32 IoT.

🌐 **Live Website**: [https://cbms-iota.vercel.app](https://cbms-iota.vercel.app)

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

## ⚠️ Disclaimer

**PENTING:** Sistem ini adalah **prototipe edukasi** dan **BUKAN alat diagnosis medis**. 

Sistem ini menganalisis pola perilaku dari data sensor tetapi **TIDAK mendiagnosis** autisme atau kondisi medis apapun. 

**Selalu konsultasikan dengan profesional kesehatan yang berkualifikasi** untuk assessment dan diagnosis medis yang tepat.
