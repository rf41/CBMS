# Script untuk set custom icon di Android APK
# Menggunakan TeddyTalk.jpeg sebagai icon

Write-Host "=== Setting Custom Icon untuk APK ===" -ForegroundColor Green

# Path ke source icon
$sourceIcon = "assets\TeddyTalk.jpeg"
$appIcon = "app\assets\TeddyTalk.jpeg"

# Check if source exists
if (-not (Test-Path $sourceIcon)) {
    if (Test-Path $appIcon) {
        $sourceIcon = $appIcon
    } else {
        Write-Host "Error: Icon tidak ditemukan di assets\ atau app\assets\" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Source icon: $sourceIcon" -ForegroundColor Cyan

# Copy icon ke Android res drawable untuk splash/icon resources
$drawablePath = "android\app\src\main\res\drawable"
if (Test-Path $drawablePath) {
    Copy-Item $sourceIcon "$drawablePath\ic_launcher.png" -Force
    Write-Host "✓ Copied to drawable\ic_launcher.png" -ForegroundColor Green
}

# Untuk manual: User perlu generate icon di berbagai ukuran
Write-Host "`n=== NEXT STEPS ===" -ForegroundColor Yellow
Write-Host "Icon telah di-copy ke drawable folder."
Write-Host "`nUntuk hasil terbaik, generate icon di berbagai ukuran:" -ForegroundColor Yellow
Write-Host "1. Buka Android Studio" -ForegroundColor White
Write-Host "2. Right-click: android\app\src\main\res → New → Image Asset" -ForegroundColor White
Write-Host "3. Pilih 'Launcher Icons'" -ForegroundColor White
Write-Host "4. Browse ke: $sourceIcon" -ForegroundColor White
Write-Host "5. Klik Next → Finish" -ForegroundColor White
Write-Host "`nATAU gunakan online tool:" -ForegroundColor Yellow
Write-Host "- https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html" -ForegroundColor Cyan
Write-Host "- Upload TeddyTalk.jpeg" -ForegroundColor White
Write-Host "- Download ZIP dan extract ke: android\app\src\main\res\" -ForegroundColor White

Write-Host "`n=== ATAU Gunakan Cara Cepat (NPM) ===" -ForegroundColor Yellow
Write-Host "npm install -g app-icon" -ForegroundColor Cyan
Write-Host "app-icon generate -i assets\TeddyTalk.jpeg --platforms=android" -ForegroundColor Cyan

Write-Host "`nSetelah generate icon, rebuild APK:" -ForegroundColor Green
Write-Host "npm run android:build" -ForegroundColor Cyan

Write-Host "`n✓ Script selesai!" -ForegroundColor Green
