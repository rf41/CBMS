# Setup API Connection untuk APK

## Problem: Fetch API Tidak Bekerja di APK

APK tidak bisa akses `/api/...` karena tidak ada server lokal di HP. Harus pakai full URL.

## ✅ Solusi (Sudah Diterapkan)

### 1. File Config (app/config.js)
File ini untuk set API URL dengan mudah:

```javascript
const CONFIG = {
    API_URL: 'https://cbms-dynamic.vercel.app',  // ← GANTI INI
    DEFAULT_PIN: '1234',
    APP_NAME: 'TeddyTalk CBMS'
};
```

### 2. Semua Fetch Calls Updated
Semua `fetch('/api/...')` diganti jadi `fetch(\`${API_BASE_URL}/api/...\`)`

### 3. Android Network Config
- ✅ Internet permission: `AndroidManifest.xml`
- ✅ Cleartext traffic allowed: `network_security_config.xml`
- ✅ CORS enabled di Capacitor config

## 🚀 Cara Setup

### Step 1: Dapatkan URL Vercel Anda

**Cek di terminal saat deploy:**
```bash
npm run deploy
# Output: https://your-project-abc123.vercel.app
```

**Atau cek di Vercel Dashboard:**
- Login ke https://vercel.com
- Pilih project CBMS
- Copy URL di bagian "Domains"

### Step 2: Update Config

Edit `app/config.js`:
```javascript
const CONFIG = {
    API_URL: 'https://your-actual-url.vercel.app',  // ← Ganti ini
    DEFAULT_PIN: '1234',
    APP_NAME: 'TeddyTalk CBMS'
};
```

**Contoh URL yang benar:**
- ✅ `https://cbms-dynamic.vercel.app`
- ✅ `https://cbms-git-main-username.vercel.app`
- ✅ `https://yourdomain.com` (jika pakai custom domain)

**JANGAN pakai:**
- ❌ `http://localhost:3000`
- ❌ `/api/save-data` (relative path)
- ❌ URL tanpa `https://`

### Step 3: Rebuild APK

```bash
npm run android:sync
npm run android:build
```

### Step 4: Test API

Install APK, lalu test:
1. Login dengan PIN 1234
2. Ke halaman "Your Bear"
3. Isi form dan click "Save Data"
4. Harus ada pesan "Data saved successfully!"

## 🧪 Testing & Debug

### Test API di Browser Dulu
```bash
# Jalankan local dev
npm run dev

# Atau langsung cek API
curl https://your-url.vercel.app/api/get-latest-data?limit=1
```

### Debug di HP
```bash
# Sambungkan HP via USB, enable USB debugging
adb logcat | Select-String "chromium|console"
```

Cari error seperti:
- `Failed to fetch`
- `CORS error`
- `Network request failed`

### Cek Koneksi Internet
Pastikan HP connect ke internet (WiFi/Data) saat test APK.

## ⚙️ Konfigurasi Network untuk Development

### Jika Mau Test dengan Local Server

1. **Jalankan Vercel Dev:**
   ```bash
   npm run dev
   ```
   Output: `http://localhost:3000`

2. **Cari IP Local PC:**
   ```powershell
   ipconfig
   # Cari "IPv4 Address", contoh: 192.168.1.100
   ```

3. **Update config.js:**
   ```javascript
   API_URL: 'http://192.168.1.100:3000',  // IP lokal PC
   ```

4. **HP dan PC harus di WiFi yang sama!**

5. **Rebuild APK**

## 🔒 Security Notes

### Production
- ✅ Gunakan HTTPS (Vercel otomatis HTTPS)
- ✅ Add CORS headers di API (sudah ada di Vercel)
- ❌ Jangan expose database credentials

### Development
- File `network_security_config.xml` allow cleartext untuk dev
- Untuk production, bisa diperketat

## 🐛 Troubleshooting

### Error: "Failed to fetch"
**Penyebab:** URL salah atau API down
**Fix:** 
1. Cek URL di browser: `https://your-url.vercel.app/api/get-latest-data?limit=1`
2. Harus return JSON, bukan error page

### Error: "CORS policy"
**Penyebab:** API tidak allow request dari mobile app
**Fix:** Vercel API sudah include CORS headers secara default

### Error: "Network request failed"
**Penyebab:** HP tidak connect internet
**Fix:** 
1. Enable WiFi/Data di HP
2. Test buka browser di HP, akses google.com
3. Coba lagi

### Data tidak tersimpan
**Penyebab:** API endpoint salah atau DB connection error
**Fix:**
1. Cek Vercel logs di dashboard
2. Test API dengan Postman:
   ```
   POST https://your-url.vercel.app/api/save-data
   Body: {
     "heartRate": 75,
     "bodyTemperature": 36.5,
     "touchIntensity": "normal",
     "movementPattern": "calm",
     "soundActivity": "quiet",
     "deviceId": "TEST"
   }
   ```

### Masih tidak bekerja?
```bash
# Check detailed logs
adb logcat *:E

# Test dengan curl
curl -X POST https://your-url.vercel.app/api/save-data \
  -H "Content-Type: application/json" \
  -d '{"heartRate":75,"bodyTemperature":36.5,"touchIntensity":"normal","movementPattern":"calm","soundActivity":"quiet","deviceId":"TEST"}'
```

## 📝 Checklist Before Deploy

- [ ] Config.js updated dengan URL Vercel yang benar
- [ ] Test API di browser (buka URL, harus return data)
- [ ] HP connected ke internet
- [ ] APK rebuild dengan `npm run android:build`
- [ ] Test save data di halaman "Your Bear"
- [ ] Test analysis data di halaman "Analysis"

## 📚 Files Modified

- `app/config.js` - API URL configuration
- `app/index.html` - Added config.js script
- `app/mobile-script.js` - All fetch calls updated
- `capacitor.config.ts` - Network settings
- `android/app/src/main/AndroidManifest.xml` - Permissions
- `android/app/src/main/res/xml/network_security_config.xml` - Network security

## Contoh URL Vercel

Saat deploy, Anda akan dapat URL seperti:
```
✅ Production: https://cbms-dynamic.vercel.app
```

Copy URL ini ke `app/config.js`!
