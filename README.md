# PrepFlow X

> A placement preparation dashboard built with React to organize coding practice, SQL preparation, job applications, and progress tracking in one workspace.

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-8-purple)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![Status](https://img.shields.io/badge/Status-Completed-success)

---

## About The Project

PrepFlow X is a frontend application designed to help students manage their placement preparation workflow.

During interview preparation, students often maintain separate spreadsheets, notes, coding sheets, and application trackers. This project brings those activities into a single dashboard with progress tracking and analytics.

The focus of this project is building a structured React application with reusable components, centralized state management, and a clean user experience.

---

## Key Features

### Dashboard

- Overview of complete preparation progress
- Interview readiness insights
- Recent activity tracking
- Progress visualization

### Question Library

- Curated DSA question collection
- Search and filtering support
- Topic and company based organization
- Bookmark important problems
- Add problems directly into personal tracker

### DSA Tracker

- Manage coding problems
- Track difficulty and topics
- Update completion status
- Monitor solving progress

### SQL Tracker

- Maintain SQL practice questions
- Track learning progress
- Organize by topics and difficulty

### Placement Tracker

- Kanban based application management
- Track interview stages

Application flow:

```
Applied → Online Assessment → Interview → Offer → Rejected
```

### Analytics Dashboard

- Preparation progress charts
- Topic-wise analysis
- Difficulty distribution
- Placement insights

### User Preferences

- Dark / Light theme
- Data import and export
- Persistent browser storage

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React | UI Development |
| Vite | Build Tool |
| React Router | Routing |
| Context API | Global State |
| Recharts | Data Visualization |
| Framer Motion | Animations |
| CSS | Styling |
| LocalStorage | Data Persistence |

---

## Architecture Overview

```text
src
│
├── components
│   └── Reusable UI components
│
├── context
│   └── Global state providers
│
├── data
│   └── Question dataset
│
├── hooks
│   └── Custom React hooks
│
├── layouts
│   └── Application layouts
│
├── pages
│   └── Route pages
│
├── routes
│   └── Routing configuration
│
└── utils
    └── Helper utilities
```

---

## State Management Flow

```text
User Action
     ↓
React Component
     ↓
Context API
     ↓
LocalStorage
     ↓
Dashboard / Analytics Update
```

---

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Shiva181006/prepflow-x.git
```

Move into project:

```bash
cd prepflow-x
```

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

---

## Screenshots

(Add project screenshots here)

```text
docs/screenshots/
```

---

## Learning Outcomes

Through this project I worked with:

- Component based architecture
- React Hooks
- Context API state management
- Client-side routing
- Data persistence
- Dashboard creation
- Reusable UI patterns
- Performance optimization

---

## Future Scope

- Backend integration
- Authentication system
- Cloud database support
- User profiles
- Advanced preparation analytics

---

## Author

**Shiva Kasaudhan**

GitHub:  
https://github.com/Shiva181006

---