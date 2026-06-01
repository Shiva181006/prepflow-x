# PrepFlow X

A modern, single-page placement preparation workspace for tracking DSA problems, SQL practice, interview applications, and a curated question library—with analytics, progress insights, and persistent local storage.

![PrepFlow X](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)

---

## Project Overview

**PrepFlow X** helps students and job seekers organize placement prep in one place. Instead of juggling spreadsheets and bookmarks, you get a unified dashboard, dedicated trackers, a 50-question interview library, and visual analytics—all running in the browser with data saved to `localStorage` (no backend required).

The app uses a glassmorphism-inspired UI, light/dark themes, animated page transitions, and responsive layouts suitable for daily study workflows.

---

## Features

### Dashboard
- At-a-glance stats for DSA, SQL, and placement pipeline
- **Interview Readiness** score based on tracker completion
- Progress rings for DSA, SQL, Question Library, and overall prep
- Question Library summary with top company progress
- Applications-by-stage breakdown and recent activity timeline
- Sidebar widgets: study streak and prep progress

### Question Library
- Browse **50** curated LeetCode-style problems (topic, difficulty, company tags)
- Search and filter by difficulty, topic, company, or bookmarks
- One-click **Add to DSA Tracker** with duplicate detection
- Bookmarks/favorites, solved indicators (synced when tracker status is **Done**)
- Overall, company-wise, topic-wise, and difficulty-wise progress bars

### DSA Tracker
- Add, edit, delete problems with title, difficulty, topic, platform, link, and status
- Status workflow: `Todo` → `In Progress` → `Done`
- Search and filter chips

### SQL Tracker
- Same CRUD and filtering model as the DSA tracker for SQL practice items

### Placement Tracker
- Kanban board for application stages: Applied, Online Assessment, Interview, Offer, Rejected
- Drag-and-drop stage updates

### Analytics
- Pie charts for DSA difficulty/status, SQL status, and placement stages
- Bar charts for DSA/SQL completion breakdown
- Question Library charts: topic, company, and difficulty progress

### Settings
- Light / dark theme toggle
- Export and import all app data as JSON
- Clear data with confirmation modal

---

## Screenshots

> Replace the placeholders below with real screenshots after capturing your app (recommended: 1280×720 or 1440×900 PNG).

| Dashboard | Question Library |
| :---: | :---: |
| ![Dashboard](docs/screenshots/dashboard.png) | ![Question Library](docs/screenshots/question-library.png) |
| *Overview, readiness score, progress rings* | *Filters, bookmarks, company progress* |

| DSA Tracker | Analytics |
| :---: | :---: |
| ![DSA Tracker](docs/screenshots/dsa-tracker.png) | ![Analytics](docs/screenshots/analytics.png) |
| *Problem table and filters* | *Charts and library insights* |

| Placement Kanban | Settings |
| :---: | :---: |
| ![Placement](docs/screenshots/placement.png) | ![Settings](docs/screenshots/settings.png) |
| *Stage-based pipeline* | *Theme and data backup* |

**Quick setup for screenshots**

```bash
mkdir -p docs/screenshots
# Add your PNG files using the filenames above, then commit them.
```

---

## Tech Stack

| Category | Technologies |
| -------- | ------------ |
| **Framework** | React 19 |
| **Build tool** | Vite 8 |
| **Routing** | React Router DOM 7 |
| **Charts** | Recharts 3 |
| **Animation** | Framer Motion 12 |
| **Icons** | Lucide React |
| **Styling** | CSS (design tokens, glass surfaces, modular stylesheets) |
| **State & persistence** | React Context API + `localStorage` |
| **Utilities** | date-fns |

---

## Folder Structure

```text
project/
├── public/                 # Static assets (favicon, etc.)
├── docs/
│   └── screenshots/        # README screenshot images (optional)
├── src/
│   ├── assets/             # SVG and static media
│   ├── components/         # Shared UI (ProgressRing, ProgressBar, modals, …)
│   ├── constants/          # Routes, tracker enums, chart colors
│   ├── context/            # Theme, DSA, SQL, Placement, Library providers
│   ├── data/               # Curated question library dataset
│   ├── hooks/              # Custom hooks (e.g. useLibraryProgress)
│   ├── layouts/            # MainLayout, Sidebar, TopBar
│   ├── pages/              # Route-level views
│   ├── routes/             # AppRouter configuration
│   ├── styles/             # Global tokens, base, components, page CSS
│   └── utils/              # Storage, sanitize, library progress helpers
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Installation Steps

### Prerequisites

- **Node.js** 18.x or newer (20 LTS recommended)
- **npm** 9+ (or pnpm / yarn)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/prepflow-x.git
cd prepflow-x
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### 4. Other scripts

| Command | Description |
| ------- | ----------- |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Deployment Instructions

PrepFlow X is a **static SPA**. Build once and deploy the `dist` folder to any static host.

### Build

```bash
npm run build
```

Output directory: **`dist/`**

### Vercel

1. Import the GitHub repository on [vercel.com](https://vercel.com).
2. Framework preset: **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy.

### Netlify

1. Connect the repo at [netlify.com](https://www.netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy.

### GitHub Pages

1. Install the helper (one-time): `npm install -D gh-pages`
2. Set `base` in `vite.config.js` to your repo name, e.g. `base: '/prepflow-x/'`.
3. Add to `package.json`:

```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

4. Run `npm run deploy` and enable Pages from the `gh-pages` branch in repository settings.

### Environment notes

- No API keys or server environment variables are required.
- Data lives in the user’s browser (`localStorage`). Clearing site data resets the app.

---

## Future Enhancements

- [ ] Cloud sync and authentication (Firebase / Supabase)
- [ ] Spaced-repetition reminders and calendar integration
- [ ] Custom question lists and import from CSV
- [ ] Mock interview timer and session notes
- [ ] PWA offline support and install prompt
- [ ] Unit and E2E tests (Vitest, Playwright)
- [ ] Code-splitting for smaller initial bundle (Recharts lazy load)
- [ ] Multi-profile / workspace support

---

## Resume Description

Use or adapt the following on your resume, LinkedIn, or portfolio:

**PrepFlow X — Placement Preparation Dashboard**  
*React · Vite · React Router · Recharts · Framer Motion*

- Built a full-stack-style placement prep SPA with DSA/SQL trackers, a 50-question interview library (bookmarks, solved sync, company/topic analytics), and a drag-and-drop placement Kanban—persisted via Context API and `localStorage`.
- Designed a responsive glassmorphism UI with light/dark themes, animated routing, dashboard readiness metrics, Recharts analytics, and JSON export/import for portable user data.
- Implemented duplicate-safe library-to-tracker flows, progress aggregation across company/topic/difficulty dimensions, and a production-ready Vite build deployable to static hosting.

---

## License

This project is open source under the **MIT License**. See [LICENSE](LICENSE) if included in the repository; otherwise, add a `LICENSE` file before publishing.

---

## Author

**Your Name**  
[GitHub](https://github.com/YOUR_USERNAME) · [LinkedIn](https://linkedin.com/in/YOUR_PROFILE) · [Portfolio](https://your-portfolio.com)

---

<p align="center">
  <sub>Built with PrepFlow X — track smarter, interview stronger.</sub>
</p>
#   p r e p f l o w - x  
 