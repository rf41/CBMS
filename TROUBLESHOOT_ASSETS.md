# Troubleshooting - Asset Missing di APK

## Masalah: CSS dan Assets Tidak Muncul di APK

### Penyebab
- Path yang menggunakan `/` (absolute path) tidak bekerja di Capacitor APK
- Contoh: `/app/style.css`, `/assets/image.png`

### Solusi ✅ (Sudah Diterapkan)

1. **Semua path diubah jadi relative paths:**
   - ❌ `/app/mobile-style.css` 
   - ✅ `./mobile-style.css`
   
   - ❌ `/assets/TeddyTalk.jpeg`
   - ✅ `./assets/TeddyTalk.jpeg`

2. **Folder assets dipindah ke dalam folder app:**
   ```
   app/
     ├── index.html
     ├── mobile-style.css
     ├── mobile-script.js
     └── assets/          ← Folder assets ada di dalam app
         └── TeddyTalk.jpeg
   ```

### Cara Test
1. Build ulang: `npm run android:build`
2. Install APK: `android/app/build/outputs/apk/debug/app-debug.apk`
3. Semua asset seharusnya muncul dengan benar

### Jika Masih Ada Masalah

#### Cek Console Error di APK
1. Sambungkan HP ke PC via USB
2. Enable USB Debugging di HP
3. Jalankan: `adb logcat | Select-String "chromium"`
4. Lihat error yang muncul

#### Cek Asset di APK
```bash
# Extract APK
cd android/app/build/outputs/apk/debug
jar -xf app-debug.apk
# Cek folder assets/public/
```

#### Test di Browser Dulu
1. Buka `app/index.html` langsung di browser
2. Pastikan semua asset muncul
3. Jika OK di browser tapi tidak di APK, cek path lagi

### Checklist Path yang Benar untuk Capacitor

✅ **Benar:**
```html
<!-- Relative paths -->
<link href="./style.css">
<img src="./assets/logo.png">
<script src="./script.js"></script>
```

❌ **Salah:**
```html
<!-- Absolute paths - TIDAK bekerja di APK -->
<link href="/app/style.css">
<img src="/assets/logo.png">
<script src="/app/script.js"></script>
```

### Setelah Edit File HTML/CSS/JS

**SELALU jalankan:**
```bash
npm run android:sync
npm run android:build
```

Atau pakai Android Studio:
```bash
npm run android:sync
npm run android:open
# Kemudian Build → Build APK di Android Studio
```
