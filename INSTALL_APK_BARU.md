# 🚨 PENTING - Install APK Baru

## Screenshot Anda menunjukkan APK LAMA masih terinstall!

Debug console show: `https://cbms-dynamic.vercel.app` ❌  
Seharusnya: `https://cbms-iota.vercel.app` ✅

## ⚠️ WAJIB Uninstall APK Lama Dulu!

### Step 1: Uninstall App Lama
Di HP Android:
1. **Settings** → **Apps** → **TeddyTalk CBMS**
2. Klik **Uninstall**
3. Confirm uninstall

### Step 2: Restart HP (Optional tapi Recommended)
Restart HP untuk clear cache completely

### Step 3: Install APK Baru
APK baru ada di:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

Copy ke HP dan install

### Step 4: Verify APK Benar
1. Buka app
2. Long press "SIBEAR81" (3 detik) untuk buka debug console
3. **Harus muncul:**
   ```
   API URL: https://cbms-iota.vercel.app
   Build: 2026-01-27 22:55
   ```

Kalau masih muncul `cbms-dynamic`, berarti APK lama masih kepake!

## 🔍 Cara Verify APK yang Terinstall

### Method 1: Debug Console
- Long press "SIBEAR81"
- Lihat baris pertama: `API URL: ...`
- **Harus:** `https://cbms-iota.vercel.app`
- **Harus ada:** `Build: 2026-01-27 22:55`

### Method 2: Test Connection
- Buka debug console
- Klik "Test Connection"
- **Harus SUCCESS** (alert hijau)

## 💡 Kenapa Harus Uninstall?

Android cache APK lama di:
- App storage
- WebView cache
- System cache

Kalau cuma install over (replace), kadang cache tidak clear!

**Solution:** Uninstall → Restart → Install baru

## ✅ Checklist

Sebelum test lagi:
- [ ] Uninstall app "TeddyTalk CBMS" dari HP
- [ ] Restart HP
- [ ] Install APK baru: `app-debug.apk`
- [ ] Buka app
- [ ] Long press "SIBEAR81" untuk verify
- [ ] API URL harus: `https://cbms-iota.vercel.app`
- [ ] Build time harus: `2026-01-27 22:55`
- [ ] Test connection harus SUCCESS

## 🎯 Expected Result

Setelah install APK baru yang benar, debug console harus show:

```
API URL: https://cbms-iota.vercel.app
Build: 2026-01-27 22:55
User Agent: Mozilla/5.0 ...
Online: true
---
[LOG] === CBMS App Started ===
[LOG] API_BASE_URL: https://cbms-iota.vercel.app
[LOG] BUILD_TIME: 2026-01-27 22:55
```

Dan ketika klik "Test Connection": **✅ Alert hijau "Connection Success!"**

---

**APK Baru Location:**  
`C:\Users\ACER\Documents\GitHub\CBMS\android\app\build\outputs\apk\debug\app-debug.apk`

**File Size:** ~7-8 MB  
**Build Time:** Baru saja (cek timestamp file)
