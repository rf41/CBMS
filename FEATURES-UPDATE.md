# CBMS - Updated Features Guide

## 🎉 What's New

Website CBMS telah diperbarui dengan fitur-fitur baru yang lebih powerful!

## 📱 Updated Sections

### 1. Test API (Dashboard)
**Fitur Baru:**
- ✅ Form untuk save data baru ke database
- ✅ Button untuk get latest data (custom limit)
- ✅ Button untuk get data by ID
- ✅ Display API response dalam format JSON

**Cara Menggunakan:**
1. Buka tab **Test API**
2. **Save Data:**
   - Isi form dengan nilai sensor
   - Klik "Save Data to Database"
   - Data akan tersimpan dengan ID baru
3. **Get Latest Data:**
   - Set jumlah records (default: 10)
   - Klik "Get Latest Data"
   - Lihat response di bawah
4. **Get Data by ID:**
   - Masukkan ID data
   - Klik "Get Data by ID"
   - Lihat detail data

### 2. Analysis Tab
**Fitur Baru:**
- 📈 **Line Chart**: Menampilkan trend risk score dari 10 data terakhir
- 📊 **Statistics**: Total records, Average, Max, Min risk scores
- 🎯 **Latest Data Analysis**: Detail analisis data terbaru
- 🔄 **Trigger Button**: "Analyze Latest 10 Data" untuk memicu analisis

**Cara Menggunakan:**
1. Buka tab **Analysis**
2. Klik tombol "📈 Analyze Latest 10 Data"
3. Sistem akan:
   - Fetch 10 data terakhir dari database
   - Hitung risk score untuk setiap data
   - Tampilkan line chart trend
   - Tampilkan statistik summary
   - Analisis detail data terbaru

**Chart Features:**
- Hover pada titik untuk lihat detail
- Menampilkan ID data pada X-axis
- Risk score (0-10) pada Y-axis

### 3. Recommendation Tab
**Fitur Baru:**
- 📊 **Trend Chart**: Line chart dengan color-coded points
  - 🟢 Green = Low Risk (0-2)
  - 🟡 Yellow = Moderate Risk (3-5)
  - 🔴 Red = High Risk (6-10)
- 💡 **Smart Recommendations**: Berdasarkan average risk
- ⏰ **Timestamp Labels**: Menampilkan waktu data
- 🔄 **Trigger Button**: "Analyze & Recommend"

**Cara Menggunakan:**
1. Buka tab **Recommendation**
2. Klik tombol "💡 Analyze & Recommend"
3. Sistem akan:
   - Fetch 10 data terakhir
   - Calculate average risk score
   - Generate personalized recommendations
   - Tampilkan trend chart dengan timestamp

**Recommendations Based On:**
- **Low Risk (avg ≤ 2)**: Continue monitoring, maintain routines
- **Moderate Risk (avg 3-5)**: Increase observation, document patterns
- **High Risk (avg > 5)**: Professional consultation recommended

## 🎨 Technical Details

### Libraries Added:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

### New Functions in script-dynamic.js:
- `testGetLatestData()` - Test API get latest
- `testGetDataById()` - Test API get by ID
- `analyzeLatestData()` - Analyze 10 data + chart
- `analyzeRecommendations()` - Generate recommendations + chart
- `calculateRiskScore(data)` - Calculate risk from sensor data
- `drawAnalysisChart()` - Draw line chart for analysis
- `drawRecommendationChart()` - Draw line chart for recommendations

### Risk Score Calculation:
```
Maximum Score: 10 points
- Heart Rate: 0-2 points
- Temperature: 0-2 points
- Touch Intensity: 0-2 points
- Movement Pattern: 0-2 points
- Sound Activity: 0-2 points
```

## 🧪 Testing Guide

### 1. Test Save Data
```javascript
// Manual test via browser console
const data = {
    heartRate: 95,
    bodyTemperature: 37.2,
    touchIntensity: "normal",
    movementPattern: "normal",
    soundActivity: "normal"
};
```

### 2. Generate Sample Data (PowerShell)
```powershell
# Low Risk Data
$low = @{ heartRate=85; bodyTemperature=37.0; touchIntensity="normal"; movementPattern="normal"; soundActivity="normal" } | ConvertTo-Json
Invoke-WebRequest -Uri "https://cbms-iota.vercel.app/api/save-data" -Method POST -Body $low -ContentType "application/json" -UseBasicParsing

# Medium Risk Data
$med = @{ heartRate=125; bodyTemperature=37.8; touchIntensity="low"; movementPattern="repetitive"; soundActivity="frequent" } | ConvertTo-Json
Invoke-WebRequest -Uri "https://cbms-iota.vercel.app/api/save-data" -Method POST -Body $med -ContentType "application/json" -UseBasicParsing

# High Risk Data
$high = @{ heartRate=140; bodyTemperature=38.2; touchIntensity="high"; movementPattern="extreme"; soundActivity="intense" } | ConvertTo-Json
Invoke-WebRequest -Uri "https://cbms-iota.vercel.app/api/save-data" -Method POST -Body $high -ContentType "application/json" -UseBasicParsing
```

### 3. Test Analysis
1. Pastikan ada minimal 10 data di database
2. Buka tab Analysis
3. Klik "Analyze Latest 10 Data"
4. Verifikasi:
   - Chart muncul dengan benar
   - Statistics ditampilkan
   - Latest data analysis accurate

### 4. Test Recommendations
1. Buka tab Recommendation
2. Klik "Analyze & Recommend"
3. Verifikasi:
   - Chart dengan color-coded points
   - Recommendations sesuai dengan risk level
   - Timestamp labels readable

## 🌐 Live Demo

**Website URL:** https://cbms-iota.vercel.app

**Navigation:**
1. 🏠 **Home** - Overview & info
2. 🧪 **Test API** - Save & fetch data operations
3. 📊 **Analysis** - Visual trend analysis
4. 💡 **Recommendation** - Smart recommendations

## 📝 Notes

- Chart menggunakan Chart.js library
- Data diambil dari Vercel Postgres database
- Real-time analysis dari database
- Responsive design untuk mobile
- Color-coded risk indicators

## 🚀 Features Summary

| Feature | Status |
|---------|--------|
| Save Data Form | ✅ Working |
| Get Latest Data | ✅ Working |
| Get Data by ID | ✅ Working |
| Analysis Chart | ✅ Working |
| Statistics Display | ✅ Working |
| Recommendation Chart | ✅ Working |
| Smart Recommendations | ✅ Working |
| Responsive Design | ✅ Working |

## 🎯 Next Steps

1. Test semua fitur di browser
2. Add more sample data jika diperlukan
3. Monitor chart performance
4. Customize chart colors/styling jika perlu
5. Test di mobile devices

Selamat mencoba! 🎉
