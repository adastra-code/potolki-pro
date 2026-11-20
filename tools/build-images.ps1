Add-Type -AssemblyName System.Drawing

$root = Join-Path $PSScriptRoot ".."
$srcDir = Join-Path $root "assets\card"
$fullDir = Join-Path $root "assets\gallery\full"
$thumbDir = Join-Path $root "assets\gallery\thumb"
$imgDir = Join-Path $root "assets\img"

foreach ($dir in @($fullDir, $thumbDir, $imgDir)) {
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  Get-ChildItem $dir -File | Remove-Item -Force
}

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoder = [System.Drawing.Imaging.Encoder]::Quality
$wide = @("02", "03", "05", "06", "17", "36", "38", "39")

function Save-Crop {
  param(
    [System.Drawing.Image]$Image,
    [int]$TargetW,
    [int]$TargetH,
    [string]$Path,
    [int]$Quality = 84
  )
  $targetRatio = $TargetW / $TargetH
  $srcRatio = $Image.Width / $Image.Height
  if ($srcRatio -gt $targetRatio) {
    $cropH = $Image.Height
    $cropW = [int]($Image.Height * $targetRatio)
  } else {
    $cropW = $Image.Width
    $cropH = [int]($Image.Width / $targetRatio)
  }
  $srcX = [int](($Image.Width - $cropW) / 2)
  $srcY = [int](($Image.Height - $cropH) / 2)

  $bmp = New-Object System.Drawing.Bitmap $TargetW, $TargetH
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.DrawImage($Image, (New-Object System.Drawing.Rectangle 0, 0, $TargetW, $TargetH), (New-Object System.Drawing.Rectangle $srcX, $srcY, $cropW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)

  $params = New-Object System.Drawing.Imaging.EncoderParameters 1
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter $encoder, $Quality
  $bmp.Save($Path, $jpegCodec, $params)
  $g.Dispose()
  $bmp.Dispose()
}

for ($i = 1; $i -le 39; $i++) {
  $name = "{0:D2}" -f $i
  if ($name -eq "04") { continue }
  $file = Join-Path $srcDir "$name.jpg"
  if (-not (Test-Path $file)) { Write-Warning "Нет $file"; continue }

  Copy-Item $file (Join-Path $fullDir "$name.jpg") -Force
  $img = [System.Drawing.Image]::FromFile($file)

  if ($img.Width -le 350) {
    Copy-Item $file (Join-Path $thumbDir "$name.jpg") -Force
  } elseif ($wide -contains $name) {
    Save-Crop $img 600 400 (Join-Path $thumbDir "$name.jpg") 82
  } else {
    Save-Crop $img 480 600 (Join-Path $thumbDir "$name.jpg") 82
  }
  $img.Dispose()
}

function Save-From {
  param([string]$Source, [int]$W, [int]$H, [string]$Path, [int]$Quality = 88)
  $img = [System.Drawing.Image]::FromFile((Join-Path $srcDir $Source))
  Save-Crop $img $W $H (Join-Path $imgDir $Path) $Quality
  $img.Dispose()
}

Save-From "30.jpg" 960 1200 "hero.jpg"
Save-From "03.jpg" 1200 960 "about.jpg"
Save-From "17.jpg" 1080 864 "about-2.jpg"
Save-From "34.jpg" 960 768 "bath.jpg"
Save-From "03.jpg" 1200 630 "og.jpg"

Write-Output ("Полных: " + (Get-ChildItem $fullDir -File).Count + ", миниатюр: " + (Get-ChildItem $thumbDir -File).Count)
