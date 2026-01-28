# Android Environment Setup for Windows

## Step 1: Install Android Studio

1. Download from: https://developer.android.com/studio
2. Run installer
3. Choose "Standard" installation
4. Wait for SDK downloads to complete

## Step 2: Set Environment Variables

### Open Environment Variables
1. Press `Win + X` → System
2. Click "Advanced system settings"
3. Click "Environment Variables"

### Add ANDROID_HOME
1. Under "User variables", click "New"
2. Variable name: `ANDROID_HOME`
3. Variable value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`
   (Replace YourUsername with your actual Windows username)
4. Click OK

### Add JAVA_HOME
1. Under "User variables", click "New"
2. Variable name: `JAVA_HOME`
3. Variable value: `C:\Program Files\Android\Android Studio\jbr`
4. Click OK

### Update PATH
1. Find "Path" under "User variables"
2. Click "Edit"
3. Click "New" and add: `%ANDROID_HOME%\platform-tools`
4. Click "New" and add: `%ANDROID_HOME%\tools`
5. Click "New" and add: `%JAVA_HOME%\bin`
6. Click OK on all dialogs

## Step 3: Verify Installation

Open a NEW PowerShell window and run:

```powershell
# Check Java
java -version

# Check Android SDK
adb --version

# Check Gradle (after first build)
cd android
.\gradlew --version
```

## Step 4: Configure Android SDK

1. Open Android Studio
2. Go to: Tools → SDK Manager
3. In "SDK Platforms" tab, check:
   - ✅ Android 13.0 (Tiramisu) - API Level 33
   - ✅ Android 12.0 (S) - API Level 31
   
4. In "SDK Tools" tab, check:
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Command-line Tools
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
   - ✅ Google Play services

5. Click "Apply" and wait for downloads

## Step 5: Test Your Setup

```bash
cd C:\Users\ACER\Documents\GitHub\CBMS
npm run android:build
```

## Troubleshooting

### Error: "ANDROID_HOME is not set"
Close and reopen PowerShell after setting environment variables.

### Error: "Could not find or load main class org.gradle.wrapper.GradleWrapperMain"
```bash
cd android
.\gradlew wrapper --gradle-version 8.0
```

### Error: "Unable to locate Android SDK"
Make sure ANDROID_HOME points to the correct SDK location:
```powershell
echo $env:ANDROID_HOME
```

### Permission Denied
Run PowerShell as Administrator:
```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## Quick Reference

**Android SDK Location:**
```
C:\Users\YourUsername\AppData\Local\Android\Sdk
```

**APK Output Location:**
```
android\app\build\outputs\apk\debug\app-debug.apk
```

**Gradle Location:**
```
C:\Users\YourUsername\.gradle
```
