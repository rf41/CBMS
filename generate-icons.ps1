# Generate Android Icons dari TeddyTalk.jpeg
# Script ini akan resize icon ke semua ukuran yang dibutuhkan

param(
    [string]$SourceImage = "assets\TeddyTalk.jpeg"
)

Write-Host "=== Android Icon Generator ===" -ForegroundColor Green

# Check if source exists
if (-not (Test-Path $SourceImage)) {
    $SourceImage = "app\assets\TeddyTalk.jpeg"
    if (-not (Test-Path $SourceImage)) {
        Write-Host "Error: TeddyTalk.jpeg tidak ditemukan!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Source: $SourceImage" -ForegroundColor Cyan

# Load System.Drawing assembly
Add-Type -AssemblyName System.Drawing

# Load source image
try {
    $sourceImg = [System.Drawing.Image]::FromFile((Resolve-Path $SourceImage))
    Write-Host "[OK] Image loaded: $($sourceImg.Width)x$($sourceImg.Height)" -ForegroundColor Green
} catch {
    Write-Host "Error loading image: $_" -ForegroundColor Red
    exit 1
}

# Define icon sizes for Android
$iconSizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

# Function to resize and save image
function Resize-Image {
    param($sourceImage, $targetPath, $size)
    
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Set high quality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    # Draw resized image
    $graphics.DrawImage($sourceImage, 0, 0, $size, $size)
    
    # Save
    $bitmap.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Cleanup
    $graphics.Dispose()
    $bitmap.Dispose()
}

# Generate icons
$basePath = "android\app\src\main\res"
$generated = 0

foreach ($folder in $iconSizes.Keys) {
    $size = $iconSizes[$folder]
    $folderPath = Join-Path $basePath $folder
    
    if (Test-Path $folderPath) {
        $iconPath = Join-Path $folderPath "ic_launcher.png"
        $roundIconPath = Join-Path $folderPath "ic_launcher_round.png"
        
        try {
            Resize-Image -sourceImage $sourceImg -targetPath $iconPath -size $size
            Write-Host "[OK] Generated: $folder\ic_launcher.png (${size}x${size})" -ForegroundColor Green
            
            # Copy same image for round icon
            Copy-Item $iconPath $roundIconPath -Force
            Write-Host "[OK] Generated: $folder\ic_launcher_round.png (${size}x${size})" -ForegroundColor Green
            
            $generated += 2
        } catch {
            Write-Host "[ERROR] Error generating $folder : $_" -ForegroundColor Red
        }
    } else {
        Write-Host "! Folder not found: $folderPath" -ForegroundColor Yellow
    }
}

# Cleanup
$sourceImg.Dispose()

Write-Host "`n=== Summary ===" -ForegroundColor Cyan
Write-Host "Generated: $generated icon files" -ForegroundColor Green
Write-Host "`nNext step:" -ForegroundColor Yellow
Write-Host "npm run android:build" -ForegroundColor Cyan

Write-Host "`n[OK] Done!" -ForegroundColor Green
