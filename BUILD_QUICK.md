# TeddyTalk CBMS - Quick Build Guide

## 🚀 Fast Track to APK

### Option 1: Android Studio (Easiest)
```bash
npm run android:open
```
Then in Android Studio: **Build → Build APK(s)**

### Option 2: Command Line
```bash
npm run android:build
```
APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📋 Prerequisites Checklist

- [ ] Android Studio installed
- [ ] Android SDK installed (via Android Studio)
- [ ] JDK 17+ installed
- [ ] Environment variables set:
  - `ANDROID_HOME` = `C:\Users\YourName\AppData\Local\Android\Sdk`
  - `JAVA_HOME` = Java installation path

---

## 🔄 After Making Changes to Web Files

```bash
npm run android:sync
npm run android:build
```

---

## 📱 Install APK on Phone

**Option 1:** Copy `app-debug.apk` to phone and tap to install

**Option 2:** Via USB cable
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📦 Available NPM Scripts

- `npm run android:sync` - Sync web assets to Android project
- `npm run android:open` - Open project in Android Studio
- `npm run android:build` - Build debug APK
- `npm run android:release` - Build release APK (unsigned)

---

## ⚠️ Important Notes

1. **API Endpoints**: Make sure your API is accessible (not localhost)
2. **First Build**: May take 5-10 minutes to download Gradle dependencies
3. **Debug vs Release**: Use debug for testing, release for production

---

For detailed instructions, see [BUILD_APK.md](BUILD_APK.md)
