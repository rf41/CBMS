# Test API CBMS

Website: **https://cbms-iota.vercel.app**

## ✅ Status: BERHASIL DEPLOY!

Semua API sudah berfungsi dengan baik!

## 🧪 Test Commands (PowerShell)

### 1. Initialize Database ✅
```powershell
Invoke-WebRequest -Uri "https://cbms-iota.vercel.app/api/init-db" -Method POST -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 2. Save Data (Simulasi dari ESP32) ✅
```powershell
$body = @{
    heartRate = 95
    bodyTemperature = 37.2
    touchIntensity = "high"
    movementPattern = "repetitive"
    soundActivity = "frequent"
    deviceId = "ESP32_001"
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://cbms-iota.vercel.app/api/save-data" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 3. Get Latest Data ✅
```powershell
Invoke-WebRequest -Uri "https://cbms-iota.vercel.app/api/get-latest-data?limit=10" -UseBasicParsing | Select-Object -ExpandProperty Content
```

### 4. Get Data by ID ✅
```powershell
Invoke-WebRequest -Uri "https://cbms-iota.vercel.app/api/get-data?id=1" -UseBasicParsing | Select-Object -ExpandProperty Content
```

## 🌐 Test di Website

1. Buka: https://cbms-iota.vercel.app
2. Buka Console Browser (F12)
3. Test fetch data:

```javascript
// Fetch latest data dari database
fetchLatestData();

// Fetch data by ID
fetchDataById(1);
```

## 📱 Update ESP32 Code

Edit file `esp32-example.ino`:

```cpp
// Ganti WiFi credentials
const char* ssid = "NAMA_WIFI_ANDA";
const char* password = "PASSWORD_WIFI_ANDA";

// Ganti URL API
const char* serverName = "https://cbms-iota.vercel.app/api/save-data";
```

Upload ke ESP32, dan data akan otomatis masuk ke database setiap 30 detik!

## 🎯 Test Sample Data

### Low Risk:
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

### Medium Risk:
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

### High Risk:
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

## 🔗 Links

- **Website**: https://cbms-iota.vercel.app
- **Vercel Dashboard**: https://vercel.com/ridwan-firmansyahs-projects-207768d5/cbms
- **API Base**: https://cbms-iota.vercel.app/api

## ✨ Next Steps

1. ✅ Database initialized
2. ✅ API endpoints working
3. ✅ Website deployed
4. 🔄 Upload code ke ESP32
5. 🔄 Test real-time data flow

Selamat! Website dinamis Anda sudah berjalan! 🚀
