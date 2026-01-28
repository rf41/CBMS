# Building TeddyTalk CBMS Android APK

This guide explains how to build your web app into a standalone Android APK.

## Prerequisites

### 1. Install Android Studio
Download and install Android Studio from: https://developer.android.com/studio

### 2. Install Java Development Kit (JDK)
- Android Studio includes JDK, or download separately: JDK 17 or later
- Set JAVA_HOME environment variable

### 3. Set Up Android SDK
- Open Android Studio
- Go to: Tools → SDK Manager
- Install:
  - Android SDK Platform 33 (or latest)
  - Android SDK Build-Tools
  - Android SDK Command-line Tools
- Set ANDROID_HOME environment variable to SDK location (usually `C:\Users\YourName\AppData\Local\Android\Sdk`)

## Building APK - Quick Start

### Method 1: Using Android Studio (Recommended for First Build)

1. **Open the project in Android Studio:**
   ```bash
   npm run android:open
   ```

2. **Build the APK:**
   - In Android Studio menu: Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Wait for Gradle to finish building
   - Click "locate" in the popup to find your APK

3. **APK Location:**
   ```
   android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Method 2: Using Command Line

1. **Sync your web assets:**
   ```bash
   npm run android:sync
   ```

2. **Build Debug APK:**
   ```bash
   npm run android:build
   ```
   APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

3. **Build Release APK (for production):**
   ```bash
   npm run android:release
   ```
   APK will be at: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

## Step-by-Step Build Process

### Step 1: Update Web Assets
Whenever you change your HTML/CSS/JS files:
```bash
npm run android:sync
```

### Step 2: Build APK
For testing (debug version):
```bash
cd android
gradlew assembleDebug
```

For production (release version):
```bash
cd android
gradlew assembleRelease
```

### Step 3: Install on Device

**Via USB (ADB):**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Or copy the APK file to your phone and install manually**

## Signing Release APK (for Google Play Store)

### 1. Generate Signing Key
```bash
cd android/app
keytool -genkey -v -keystore teddytalk-release.keystore -alias teddytalk -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configure Signing in `android/app/build.gradle`
Add above `android {`:
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

Inside `android {` block, add:
```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

### 3. Create `android/keystore.properties`
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=teddytalk
storeFile=app/teddytalk-release.keystore
```

### 4. Build Signed Release APK
```bash
npm run android:release
```

## Customizing App

### Change App Icon
1. Prepare icon (1024x1024 PNG)
2. Use Android Studio: Right-click `android/app/src/main/res` → New → Image Asset
3. Follow wizard to generate all sizes

### Change App Name
Edit `android/app/src/main/res/values/strings.xml`:
```xml
<string name="app_name">TeddyTalk CBMS</string>
```

### Change Package Name
Edit `capacitor.config.ts`:
```typescript
appId: 'com.yourcompany.teddytalk',
```
Then run:
```bash
npx cap sync android
```

### Change Splash Screen
1. Place splash image in `android/app/src/main/res/drawable/splash.png`
2. Or use Android Studio: File → New → Image Asset → Launcher Icons

## Troubleshooting

### "ANDROID_HOME not set"
Set environment variable:
```powershell
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\YourName\AppData\Local\Android\Sdk', 'User')
```

### "Java not found"
Install JDK and set JAVA_HOME:
```powershell
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', 'C:\Program Files\Android\Android Studio\jbr', 'User')
```

### Gradle build fails
```bash
cd android
gradlew clean
gradlew assembleDebug
```

### API calls not working in APK
Make sure your API endpoints are accessible from external network (not localhost)

## Publishing to Google Play Store

1. Build signed release APK (see above)
2. Create developer account: https://play.google.com/console
3. Create new app
4. Upload APK
5. Fill in store listing details
6. Submit for review

## Notes

- **Debug APK**: For testing only, larger file size
- **Release APK**: Optimized for production, needs signing
- **AAB (Android App Bundle)**: Preferred format for Play Store
  ```bash
  cd android
  gradlew bundleRelease
  ```

## Support

For more information:
- Capacitor Docs: https://capacitorjs.com/docs
- Android Developers: https://developer.android.com
