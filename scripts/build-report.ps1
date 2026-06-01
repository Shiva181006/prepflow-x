$projectRoot = if (Test-Path "PROJECT_DOCUMENTATION.md") {
  (Get-Location).Path
} elseif (Test-Path "$PSScriptRoot\..\PROJECT_DOCUMENTATION.md") {
  Resolve-Path "$PSScriptRoot\.."
} else {
  "C:\Users\shiva\OneDrive\Desktop\project"
}

$src = Join-Path $projectRoot "PROJECT_DOCUMENTATION.md"
$out = Join-Path $projectRoot "REPORT.md"

$lines = [System.IO.File]::ReadAllText($src, [System.Text.Encoding]::UTF8)
$start = $lines.IndexOf("## 1. Executive Summary")
if ($start -lt 0) { throw "Could not find start marker" }
$body = $lines.Substring($start)

$pb = "`n`n<div class=`"page-break`"></div>`n`n"

function Wrap-Diagrams([string]$text) {
  $pattern = '(?ms)^```text\r?\n(.*?)^```'
  [regex]::Replace($text, $pattern, {
    param($m)
    $inner = $m.Groups[1].Value.TrimEnd()
    "`n`n<div class=`"diagram-box`">`n`n**Figure — Architecture / Data Flow Diagram**`n`n``````text`n$inner`n``````n`n</div>`n"
  })
}

$body = Wrap-Diagrams $body

$sectionBreaks = @(
  '## 2. Problem Statement', '## 3. Solution Overview', '## 4. Key Features',
  '## 5. Technology Stack', '## 6. Folder Structure', '## 7. System Architecture',
  '## 8. Data Flow', '## 9. Context API Architecture', '## 10. Module Explanations',
  '## 11. Code Walkthrough', '## 12. Real-World Use Cases', '## 13. Challenges Faced',
  '## 14. Optimizations Implemented', '## 15. Accessibility Improvements',
  '## 16. Future Enhancements', '## 17. Resume Description',
  '## 18. Interview Preparation Guide', '## 19. Conclusion'
)
foreach ($h in $sectionBreaks) {
  $body = $body.Replace($h, "$pb$h")
}

$body = $body.Replace('## 11. Code Walkthrough', '## Appendix B — Code Explanation & Walkthrough')
$body = $body.Replace('## 18. Interview Preparation Guide', '## Appendix A — Interview Preparation Guide (55 Questions)')

$header = @'
---
title: "PrepFlow X — Technical Project Report"
author: "Shiva Kasaudhan"
date: "May 2026"
lang: en-GB
papersize: a4
geometry:
  - margin=2.2cm
  - top=2.5cm
  - bottom=2.5cm
documentclass: report
toc: true
toc-depth: 3
numbersections: true
colorlinks: true
linkcolor: "#4f46e5"
header-includes:
  - \usepackage{fancyhdr}
  - \pagestyle{fancy}
  - \fancyhead[L]{PrepFlow X}
  - \fancyhead[R]{Shiva Kasaudhan}
  - \fancyfoot[C]{\thepage}
---

<style>
@media print {
  .page-break { page-break-after: always; break-after: page; }
  .cover-page { page-break-after: always; break-after: page; min-height: 90vh; }
  pre, .diagram-box { page-break-inside: avoid; break-inside: avoid; }
}
@page { size: A4; margin: 2.2cm; }
body { font-family: "Segoe UI", Inter, system-ui, sans-serif; font-size: 11pt; line-height: 1.55; max-width: 100%; }
h1 { font-size: 22pt; border-bottom: 2px solid #6366f1; padding-bottom: 0.3em; }
h2 { font-size: 16pt; color: #312e81; margin-top: 1.2em; }
h3 { font-size: 13pt; color: #4338ca; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 10pt; }
th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
th { background: #f1f5f9; font-weight: 600; }
.diagram-box { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #6366f1; padding: 1em 1.2em; margin: 1.2em 0; border-radius: 6px; }
.diagram-box pre, .diagram-box code { background: transparent !important; font-size: 8.5pt; line-height: 1.35; }
.cover-meta { font-size: 12pt; color: #475569; margin: 0.5em 0; }
.cover-rule { border: none; border-top: 2px solid #6366f1; margin: 2em auto; width: 60%; }
</style>

<div class="cover-page" markdown="1">

<div align="center">

<br /><br /><br />

# PrepFlow X

## Technical Project Report

### Placement Preparation & Interview Tracking Platform

<hr class="cover-rule" />

<p class="cover-meta"><strong>Developer:</strong> Shiva Kasaudhan</p>
<p class="cover-meta"><strong>Document Type:</strong> Full Project Report (PDF Export)</p>
<p class="cover-meta"><strong>Version:</strong> 1.0</p>
<p class="cover-meta"><strong>Date:</strong> May 2026</p>
<p class="cover-meta"><strong>Source:</strong> PROJECT_DOCUMENTATION.md (complete edition)</p>

<br /><br />

**Technology Stack**

React 19 · Vite 8 · React Router 7 · Context API · Recharts · Framer Motion · localStorage

<br /><br />

*Prepared for academic submission, portfolio review, recruiter packets, and technical interviews.*

*Export: Pandoc, Typora, or VS Code Markdown PDF — A4, print backgrounds enabled.*

</div>

</div>

<div class="page-break"></div>

# Table of Contents

| Section | Title |
| :------ | :---- |
| 1 | Executive Summary |
| 2 | Problem Statement |
| 3 | Solution Overview |
| 4 | Key Features |
| 5 | Technology Stack |
| 6 | Folder Structure |
| 7 | System Architecture |
| 8 | Data Flow |
| 9 | Context API Architecture |
| 10 | Module Explanations |
| 11 | Real-World Use Cases |
| 12 | Challenges Faced |
| 13 | Optimizations Implemented |
| 14 | Accessibility Improvements |
| 15 | Future Enhancements |
| 16 | Resume Description |
| 17 | Conclusion |
| **Appendix A** | **Interview Preparation Guide (55 Q&A)** |
| **Appendix B** | **Code Explanation & Walkthrough** |

> **Note:** Appendix A and Appendix B appear in full later in this document with complete, unabridged content from the project documentation. No material has been omitted.

<div class="page-break"></div>

# Part I — Project Overview & Architecture

'@

$footer = @'

<div class="page-break"></div>

<div align="center">

---

**— End of Report —**

**PrepFlow X · Technical Project Report v1.0**

**Developer: Shiva Kasaudhan**

---

### PDF Export Commands

**Pandoc (recommended for A4):**

```bash
pandoc REPORT.md -o PrepFlowX-Report.pdf --pdf-engine=xelatex -V papersize=a4 -V geometry:margin=2.2cm --toc --number-sections
```

**Markdown PDF (VS Code extension):**

Enable `printBackground`, format **A4**, margins **20mm**, display header/footer optional.

</div>

'@

$endIdx = $body.LastIndexOf('## 19. Conclusion')
if ($endIdx -ge 0) {
  $conclusionPart = $body.Substring($endIdx)
  $marker = "---`r`n`r`n<div align"
  $cutEnd = $conclusionPart.IndexOf($marker)
  if ($cutEnd -lt 0) { $marker = "---`n`n<div align"; $cutEnd = $conclusionPart.IndexOf($marker) }
  if ($cutEnd -gt 0) {
    $body = $body.Substring(0, $endIdx) + $conclusionPart.Substring(0, $cutEnd).TrimEnd()
  }
}

$body = $body.Replace("$pb## 12. Real-World Use Cases", @"

<div class="page-break"></div>

# Part II — Implementation, Quality & Career Materials

$pb## 12. Real-World Use Cases
"@)

$body = $body.Replace("$pb## Appendix B", @"

<div class="page-break"></div>

# Part III — Appendices

$pb## Appendix B
"@)

$report = $header + $body + $footer
[System.IO.File]::WriteAllText($out, $report, [System.Text.UTF8Encoding]::new($false))
Write-Host "Wrote $out ($((Get-Item $out).Length) bytes)"
