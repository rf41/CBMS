# 🐛 Debug Guide - Network Issues

## Sudah Build APK Baru dengan Debug Console

APK baru sekarang punya built-in debug console untuk troubleshooting!

## 🔍 Cara Menggunakan Debug Console

### 1. Buka Debug Console
**Di Landing Page:**
- **Tekan dan tahan** text "SIBEAR81" selama 3 detik
- Debug console akan muncul

### 2. Apa yang Ditampilkan
- ✅ API URL yang digunakan
- ✅ Status koneksi internet
- ✅ Semua log dan error
- ✅ Tombol "Test Connection" untuk test API

### 3. Test Connection
- Klik tombol **"Test Connection"**
- Akan test fetch data dari API
- Kalau sukses: muncul alert hijau dengan data
- Kalau gagal: muncul alert merah dengan error message

## 📱 Step-by-Step Debugging

### Step 1: Install APK Baru
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### Step 2: Buka App & Check Debug Console
1. Buka app
2. Di landing page, **long press** "SIBEAR81" (3 detik)
3. Debug console muncul
4. Lihat apakah:
   - ✅ API URL: `https://cbms-iota.vercel.app`
   - ✅ Online: `true`

### Step 3: Test Connection
1. Di debug console, klik **"Test Connection"**
2. Tunggu response

**Jika SUCCESS:**
- ✅ Muncul alert: "Connection Success"
- ✅ Artinya network OK, fetch bisa jalan
- ✅ Coba gunakan app normal

**Jika FAILED:**
- ❌ Catat error message yang muncul
- ❌ Screenshot debug console
- ❌ Lanjut ke troubleshooting

## 🔧 Troubleshooting by Error Message

### Error: "Failed to fetch"
**Kemungkinan:**
1. HP tidak connect internet
2. Vercel API down
3. URL salah

**Fix:**
- Cek HP connect WiFi/Data
- Buka browser di HP: https://cbms-iota.vercel.app/api/get-latest-data?limit=1
- Harus return JSON, bukan error

### Error: "Network request failed"
**Kemungkinan:**
- Firewall/VPN blocking
- Operator internet blocking

**Fix:**
- Matikan VPN kalau ada
- Coba ganti WiFi/Data
- Test dengan browser di HP

### Error: "CORS policy"
**Kemungkinan:**
- API tidak return CORS headers

**Fix:**
Cek file API Anda punya headers ini:
```javascript
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
'Access-Control-Allow-Headers': 'Content-Type'
```

### Error: "Timeout"
**Kemungkinan:**
- Internet lambat
- API server slow

**Fix:**
- Coba lagi dengan internet lebih cepat
- Cek Vercel dashboard untuk performance

### Config tidak loaded
**Symptom:** Debug console show "CONFIG not loaded"

**Fix:**
```bash
# Pastikan file config.js ada
ls app/config.js

# Rebuild
npm run android:build
```

## 📊 Cara Baca Debug Logs

Debug console akan show logs seperti:
```
[LOG] === CBMS App Started ===
[LOG] API_BASE_URL: https://cbms-iota.vercel.app
[LOG] CONFIG: [object Object]
[LOG] API Request: https://cbms-iota.vercel.app/api/get-latest-data?limit=100
[LOG] Response status: 200
[LOG] Response data: {success: true, data: [...]}
```

Atau kalau error:
```
[ERROR] API Request Error: TypeError: Failed to fetch
[ERROR] URL was: https://cbms-iota.vercel.app/api/get-latest-data?limit=100
```

## 🔌 Test Via ADB (Jika Punya USB)

Jika HP connect ke PC via USB:

```powershell
# Enable USB debugging di HP
# Settings → Developer Options → USB Debugging

# Di PC, jalankan:
adb logcat | Select-String "chromium|Console"
```

Akan show semua console.log dan error real-time.

## ✅ Checklist Final

Sebelum bilang "tidak bisa", pastikan:

- [ ] APK baru sudah di-install (tanggal file APK = hari ini)
- [ ] HP connect internet (test buka google.com di browser)
- [ ] URL di config.js = `https://cbms-iota.vercel.app`
- [ ] Test connection di debug console = SUCCESS
- [ ] API test di browser HP = Return JSON

Jika semua ✅ tapi masih gagal, screenshot:
1. Debug console full log
2. Error message yang muncul
3. Test API di browser HP

## 💡 Tips

- **Long press "SIBEAR81"** untuk buka debug console
- **Test Connection button** untuk quick test
- Logs **maksimal 100 entries**, otomatis delete yang lama
- Debug console bisa dibuka kapan saja dari landing page

---

APK Location: `android/app/build/outputs/apk/debug/app-debug.apk`
Build Date: {{ sekarang }}
