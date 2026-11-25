# Script untuk melakukan commit file satu per satu berdasarkan tanggal modifikasi (Date Modified)
# Ini akan membuat riwayat commit di Git terlihat realistis dari waktu ke waktu (Sep 2025 - Jan 2026)

Write-Host "Memulai proses commit berdasarkan metadata tanggal file..."

# Ambil semua file dalam direktori (abaikan folder .git)
$files = Get-ChildItem -Path . -Recurse -File | Where-Object { $_.FullName -notmatch "\\.git\\" }

# Urutkan file berdasarkan waktu modifikasi dari yang paling lama ke yang paling baru
# Ini penting agar timeline di Git (Log) berjalan maju secara kronologis
$files = $files | Sort-Object LastWriteTime

$commitCount = 0

foreach ($file in $files) {
    # Dapatkan path relatif untuk git add
    $relPath = Resolve-Path -Relative $file.FullName
    $relPath = $relPath -replace "\\", "/" # Ubah format slash untuk Git
    
    # Cek apakah file ini ada perubahan (modified/untracked)
    $status = git status --porcelain $relPath
    
    if (![string]::IsNullOrWhiteSpace($status)) {
        # Format tanggal sesuai yang dibutuhkan Git
        $date = $file.LastWriteTime.ToString("yyyy-MM-ddTHH:mm:ss")
        $env:GIT_AUTHOR_DATE = $date
        $env:GIT_COMMITTER_DATE = $date
        
        # Tambahkan file dan commit
        git add $relPath
        git commit -m "Update $relPath" | Out-Null
        
        Write-Host "Committed: $relPath dengan tanggal $date" -ForegroundColor Green
        $commitCount++
    }
}

Write-Host "Selesai! Berhasil membuat $commitCount commit." -ForegroundColor Cyan
Write-Host "Anda dapat mengecek riwayatnya dengan menjalankan perintah: git log" -ForegroundColor Yellow
