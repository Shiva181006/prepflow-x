import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = fs.existsSync(path.join(process.cwd(), 'PROJECT_DOCUMENTATION.md'))
  ? process.cwd()
  : path.resolve(__dirname, '..')

const src = path.join(projectRoot, 'PROJECT_DOCUMENTATION.md')
const out = path.join(projectRoot, 'REPORT.md')

const raw = fs.readFileSync(src, 'utf8')
const start = raw.indexOf('## 1. Executive Summary')
if (start < 0) throw new Error('Could not find start marker')
let body = raw.slice(start)

// Strip original closing boilerplate
const endCut = body.search(/\n---\n\n<div align="center">\n\n\*\*— End of Document —\*\*/)
if (endCut > 0) body = body.slice(0, endCut).trimEnd()

function extractSection(bodyText, heading) {
  const idx = bodyText.indexOf(heading)
  if (idx < 0) return { before: bodyText, section: '', after: '' }
  const next = bodyText.slice(idx + heading.length).search(/\n## /)
  const end = next < 0 ? bodyText.length : idx + heading.length + next
  return {
    before: bodyText.slice(0, idx).trimEnd(),
    section: bodyText.slice(idx, end).trimEnd(),
    after: bodyText.slice(end).trimStart(),
  }
}

const codeHeading = '## 11. Code Walkthrough'
const interviewHeading = '## 18. Interview Preparation Guide'

let e1 = extractSection(body, codeHeading)
let main = e1.before
let appendixB = e1.section
let rest = e1.after

let e2 = extractSection(rest, interviewHeading)
main = (main + '\n\n' + e2.before).trim()
let appendixA = e2.section
main = (main + '\n\n' + e2.after).trim()

appendixB = appendixB.replace(codeHeading, '## Appendix B — Code Explanation & Walkthrough')
appendixA = appendixA.replace(
  interviewHeading,
  '## Appendix A — Interview Preparation Guide (55 Questions)',
)

const pb = '\n\n<div class="page-break"></div>\n\n'

function wrapDiagrams(text) {
  return text.replace(/```text\n([\s\S]*?)```/g, (_, inner) => {
    return `\n\n<div class="diagram-box">\n\n**Figure — Architecture / Data Flow Diagram**\n\n\`\`\`text\n${inner.trimEnd()}\n\`\`\`\n\n</div>\n`
  })
}

main = wrapDiagrams(main)
appendixA = wrapDiagrams(appendixA)
appendixB = wrapDiagrams(appendixB)

const mainSectionHeadings = [
  '## 2. Problem Statement',
  '## 3. Solution Overview',
  '## 4. Key Features',
  '## 5. Technology Stack',
  '## 6. Folder Structure',
  '## 7. System Architecture',
  '## 8. Data Flow',
  '## 9. Context API Architecture',
  '## 10. Module Explanations',
  '## 12. Real-World Use Cases',
  '## 13. Challenges Faced',
  '## 14. Optimizations Implemented',
  '## 15. Accessibility Improvements',
  '## 16. Future Enhancements',
  '## 17. Resume Description',
  '## 19. Conclusion',
]

for (const h of mainSectionHeadings) {
  main = main.split(h).join(pb + h)
}

main = main.replace(
  pb + '## 12. Real-World Use Cases',
  `${pb}<div class="page-break"></div>\n\n# Part II — Implementation, Quality & Career Materials\n\n${pb}## 12. Real-World Use Cases`,
)

const header = `---
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
  - '\\usepackage{fancyhdr}'
  - '\\pagestyle{fancy}'
  - '\\fancyhead[L]{PrepFlow X}'
  - '\\fancyhead[R]{Shiva Kasaudhan}'
  - '\\fancyfoot[C]{\\thepage}'
---

<style>
@media print {
  .page-break { page-break-after: always; break-after: page; }
  .cover-page { page-break-after: always; break-after: page; min-height: 90vh; }
  pre, .diagram-box { page-break-inside: avoid; break-inside: avoid; }
  h2, h3 { page-break-after: avoid; break-after: avoid; }
}
@page { size: A4; margin: 2.2cm; }
body { font-family: "Segoe UI", Inter, system-ui, sans-serif; font-size: 11pt; line-height: 1.55; max-width: 100%; color: #1e293b; }
h1 { font-size: 22pt; border-bottom: 2px solid #6366f1; padding-bottom: 0.3em; color: #0f172a; }
h2 { font-size: 16pt; color: #312e81; margin-top: 1.2em; }
h3 { font-size: 13pt; color: #4338ca; }
table { border-collapse: collapse; width: 100%; margin: 1em 0; font-size: 10pt; }
th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; vertical-align: top; }
th { background: #f1f5f9; font-weight: 600; }
.diagram-box { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #6366f1; padding: 1em 1.2em; margin: 1.2em 0; border-radius: 6px; overflow-x: auto; }
.diagram-box pre, .diagram-box code { background: transparent !important; font-size: 8pt; line-height: 1.3; font-family: Consolas, "Courier New", monospace; }
.cover-meta { font-size: 12pt; color: #475569; margin: 0.5em 0; }
.cover-rule { border: none; border-top: 2px solid #6366f1; margin: 2em auto; width: 60%; }
.appendix-banner { background: #eef2ff; border: 1px solid #c7d2fe; padding: 1em; border-radius: 8px; margin-bottom: 1.5em; font-size: 10.5pt; }
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
<p class="cover-meta"><strong>Source:</strong> PROJECT_DOCUMENTATION.md (complete edition, unabridged)</p>

<br /><br />

**Technology Stack**

React 19 · Vite 8 · React Router 7 · Context API · Recharts · Framer Motion · localStorage

<br /><br />

*Prepared for academic submission, portfolio review, recruiter packets, and technical interviews.*

*Recommended export: A4 portrait, 2.2 cm margins, print backgrounds enabled.*

</div>

</div>

<div class="page-break"></div>

# Table of Contents

| Section | Title | Page ref. |
| :------ | :---- | :-------- |
| **Part I** | Project Overview & Architecture (Sections 1–10) | — |
| **Part II** | Implementation, Quality & Career Materials (Sections 12–17, 19) | — |
| **Appendix A** | Interview Preparation Guide (55 Questions with Answers) | — |
| **Appendix B** | Code Explanation & Walkthrough | — |

### Section Index

| § | Title |
| :- | :---- |
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
| 12 | Real-World Use Cases |
| 13 | Challenges Faced |
| 14 | Optimizations Implemented |
| 15 | Accessibility Improvements |
| 16 | Future Enhancements |
| 17 | Resume Description |
| 19 | Conclusion |

> **Completeness statement:** This report contains the **full text** of \`PROJECT_DOCUMENTATION.md\`. Appendix A and Appendix B are relocated to the end for print-friendly navigation; **no content has been shortened or removed**.

<div class="page-break"></div>

# Part I — Project Overview & Architecture

`

const part3 = `

<div class="page-break"></div>

# Part III — Appendices

<div class="appendix-banner">

**Appendix A — Interview Preparation Guide** contains all **55 technical interview questions and detailed answers** (React, Context API, project-specific implementation, design decisions, analytics, library, and placement tracker). Use this appendix for viva, HR technical rounds, and portfolio defenses.

</div>

${appendixA}

<div class="page-break"></div>

<div class="appendix-banner">

**Appendix B — Code Explanation & Walkthrough** contains the complete code-level documentation: \`useMemo\`, custom hooks, localStorage utilities, sanitization, routing, and shared component implementation notes.

</div>

${appendixB}
`

const footer = `

<div class="page-break"></div>

<div align="center">

---

**— End of Report —**

**PrepFlow X · Technical Project Report v1.0**

**Developer: Shiva Kasaudhan**

---

### PDF Export (A4)

**Pandoc:**

\`\`\`bash
pandoc REPORT.md -o PrepFlowX-Report.pdf --pdf-engine=xelatex -V papersize=a4 -V geometry:margin=2.2cm --toc --number-sections -V mainfont="Segoe UI"
\`\`\`

**VS Code — Markdown PDF:** Format A4, margin 20mm, \`printBackground\`: true.

**Typora:** File → Export → PDF → A4.

</div>
`

const report = header + main + part3 + footer
fs.writeFileSync(out, report, 'utf8')

const srcLen = raw.length
const outLen = report.length
console.log(`Wrote ${out}`)
console.log(`Source: ${srcLen} chars → Report: ${outLen} chars`)
if (outLen < srcLen * 0.85) {
  console.warn('Warning: report may be shorter than source; verify completeness.')
}
