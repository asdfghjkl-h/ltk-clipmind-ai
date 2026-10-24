Add-Type -AssemblyName System.Drawing

function Create-Screenshot($filename, $title, $subtitle, $badge) {
    [int]$w = 1280
    [int]$h = 800
    $bmp = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    # Background
    $g.Clear([System.Drawing.Color]::FromArgb(248, 250, 252))

    # Top header bar
    $hRect = [System.Drawing.Rectangle]::new(0, 0, $w, 80)
    $hBrush = [System.Drawing.Drawing2D.LinearGradientBrush]::new($hRect, [System.Drawing.Color]::FromArgb(49, 46, 129), [System.Drawing.Color]::FromArgb(30, 27, 75), 0.0)
    $g.FillRectangle($hBrush, $hRect)

    # Title in header
    $logoFont = [System.Drawing.Font]::new("Segoe UI", 24, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString("ClipMind AI - " + $title, $logoFont, [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White), 40, 24)

    # Badge in header
    $badgeFont = [System.Drawing.Font]::new("Segoe UI", 14, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString($badge, $badgeFont, [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(244, 114, 182)), 980, 28)

    # Main Card
    $cardRect = [System.Drawing.Rectangle]::new(80, 120, 1120, 620)
    $g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::White), $cardRect)
    $g.DrawRectangle([System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(226, 232, 240), 2), $cardRect)

    # Subtitle
    $subFont = [System.Drawing.Font]::new("Segoe UI", 26, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString($subtitle, $subFont, [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(15, 23, 42)), 120, 160)

    # Features
    $bodyFont = [System.Drawing.Font]::new("Segoe UI", 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $bodyBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(51, 65, 85))

    $g.DrawString("1. Instant Inline Bubble: Highlight any text on any webpage to trigger AI actions instantly.", $bodyFont, $bodyBrush, 120, 240)
    $g.DrawString("2. Structured Key Takeaways: Generates bullet-point summaries and core takeaways in milliseconds.", $bodyFont, $bodyBrush, 120, 290)
    $g.DrawString("3. High-Fidelity Translation: Smooth and contextual bilingual translation without context switching.", $bodyFont, $bodyBrush, 120, 340)
    $g.DrawString("4. Knowledge Flashcard Stream: Save inspiring clips and export full Markdown / Notion reports.", $bodyFont, $bodyBrush, 120, 390)
    $g.DrawString("5. Privacy-First Architecture: 100% client-side execution, zero tracking, zero server dependence.", $bodyFont, $bodyBrush, 120, 440)

    # Mock Preview Box
    $mockBox = [System.Drawing.Rectangle]::new(120, 500, 1040, 180)
    $g.FillRectangle([System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(241, 245, 249)), $mockBox)
    $g.DrawRectangle([System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(203, 213, 225), 1), $mockBox)

    $boxTitleFont = [System.Drawing.Font]::new("Segoe UI", 16, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString("Live Execution Showcase:", $boxTitleFont, [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(79, 70, 229)), 140, 520)

    $previewTextFont = [System.Drawing.Font]::new("Segoe UI", 14, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $g.DrawString("Selected: 'The future of productivity belongs to autonomous micro-tools that eliminate context switching...'", $previewTextFont, [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(71, 85, 105)), 140, 560)
    $g.DrawString("Output: 1. Focus on Micro-tools  2. Zero Context Switching  3. Instant 10x Productivity Gain (1-Click Copy / Save)", $previewTextFont, [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(16, 185, 129)), 140, 600)

    $g.Dispose()
    $bmp.Save($filename, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

Create-Screenshot "C:\Users\admin\.gemini\antigravity\scratch\smart-clipper-ai\promo-screenshots\screenshot-1-1280x800.png" "Smart Inline Highlighter" "Highlight Any Web Text - Instant Structured Insights" "Core Inline UX"
Create-Screenshot "C:\Users\admin\.gemini\antigravity\scratch\smart-clipper-ai\promo-screenshots\screenshot-2-1280x800.png" "Knowledge Hub & Markdown Export" "Offline Flashcard Archive - Export Full Markdown Notes" "Knowledge Hub"
Write-Output "Both screenshots created successfully at 1280x800"
