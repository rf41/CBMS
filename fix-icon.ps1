# Fix Android Icon - Complete Solution
# This script fixes all icon issues including adaptive icons

Write-Host "=== Fixing Android Icon ===" -ForegroundColor Green

$sourceIcon = "assets\TeddyTalk.jpeg"
if (-not (Test-Path $sourceIcon)) {
    $sourceIcon = "app\assets\TeddyTalk.jpeg"
}

Write-Host "Source: $sourceIcon" -ForegroundColor Cyan

# Load System.Drawing
Add-Type -AssemblyName System.Drawing

# Load source image
$sourceImg = [System.Drawing.Image]::FromFile((Resolve-Path $sourceIcon))
Write-Host "[OK] Image loaded: $($sourceImg.Width)x$($sourceImg.Height)" -ForegroundColor Green

# Function to resize image
function Resize-Image {
    param($sourceImage, $targetPath, $size)
    
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    $graphics.DrawImage($sourceImage, 0, 0, $size, $size)
    $bitmap.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $bitmap.Dispose()
}

# Icon sizes
$iconSizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

$basePath = "android\app\src\main\res"
$generated = 0

# Generate icons
foreach ($folder in $iconSizes.Keys) {
    $size = $iconSizes[$folder]
    $folderPath = Join-Path $basePath $folder
    
    if (Test-Path $folderPath) {
        # Main launcher icon
        $iconPath = Join-Path $folderPath "ic_launcher.png"
        Resize-Image -sourceImage $sourceImg -targetPath $iconPath -size $size
        Write-Host "[OK] $folder\ic_launcher.png (${size}x${size})" -ForegroundColor Green
        
        # Round icon
        $roundIconPath = Join-Path $folderPath "ic_launcher_round.png"
        Copy-Item $iconPath $roundIconPath -Force
        Write-Host "[OK] $folder\ic_launcher_round.png (${size}x${size})" -ForegroundColor Green
        
        # Foreground icon (for adaptive icons)
        $foregroundPath = Join-Path $folderPath "ic_launcher_foreground.png"
        Copy-Item $iconPath $foregroundPath -Force
        Write-Host "[OK] $folder\ic_launcher_foreground.png (${size}x${size})" -ForegroundColor Green
        
        $generated += 3
    }
}

$sourceImg.Dispose()

# Fix adaptive icon XML files
Write-Host "`nFixing adaptive icon configurations..." -ForegroundColor Yellow

$adaptiveIconXml = @"
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
"@

$adaptiveFolder = Join-Path $basePath "mipmap-anydpi-v26"
if (Test-Path $adaptiveFolder) {
    # ic_launcher.xml
    $adaptiveIconXml | Out-File -FilePath (Join-Path $adaptiveFolder "ic_launcher.xml") -Encoding UTF8 -Force
    Write-Host "[OK] Updated mipmap-anydpi-v26\ic_launcher.xml" -ForegroundColor Green
    
    # ic_launcher_round.xml
    $adaptiveIconXml | Out-File -FilePath (Join-Path $adaptiveFolder "ic_launcher_round.xml") -Encoding UTF8 -Force
    Write-Host "[OK] Updated mipmap-anydpi-v26\ic_launcher_round.xml" -ForegroundColor Green
}

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Generated: $generated icon files" -ForegroundColor Green
Write-Host "Fixed: 2 adaptive icon configs" -ForegroundColor Green

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. cd android" -ForegroundColor White
Write-Host "2. .\gradlew clean" -ForegroundColor White
Write-Host "3. cd .." -ForegroundColor White
Write-Host "4. npm run android:build" -ForegroundColor White
Write-Host "`n5. PENTING: Uninstall app lama di HP" -ForegroundColor Red
Write-Host "6. Restart HP" -ForegroundColor Red
Write-Host "7. Install APK baru" -ForegroundColor Red

Write-Host "`n[OK] Done!" -ForegroundColor Green
