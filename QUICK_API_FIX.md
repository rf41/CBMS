# 🚨 PENTING - Setup API URL

## ⚡ Quick Fix

### 1. Cari URL Vercel Anda
```bash
npm run deploy
```
Atau cek di: https://vercel.com/dashboard

Contoh URL: `https://cbms-dynamic.vercel.app`

### 2. Edit File Config
Buka: **`app/config.js`**

Ganti baris ini:
```javascript
API_URL: 'https://cbms-dynamic.vercel.app',  // ← GANTI INI
```

Dengan URL Vercel Anda yang sebenarnya.

### 3. Rebuild APK
```bash
npm run android:build
```

### 4. Test
- Install APK baru
- Coba save data di halaman "Your Bear"
- Harus muncul pesan sukses ✓

---

## 📱 Jika Masih Error

### Cek HP Connect Internet
- ✅ WiFi atau Data harus ON
- ✅ Buka browser di HP, test google.com

### Cek URL Benar
Buka di browser HP: `https://your-url.vercel.app/api/get-latest-data?limit=1`
- Harus muncul JSON data, bukan error page

### Debug via USB
```bash
adb logcat | Select-String "error|failed"
```

---

## 📞 File Penting

1. **app/config.js** - Tempat set API URL
2. **app/mobile-script.js** - Semua API calls
3. **SETUP_API_CONNECTION.md** - Dokumentasi lengkap

---

**URL Vercel saya:** `___________________________` ← Tulis di sini untuk referensi!
