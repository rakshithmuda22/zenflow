# ZenFlow

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)](https://zenflow-lyart.vercel.app)
[![PWA](https://img.shields.io/badge/PWA-Installable-5A0FC8?logo=pwa&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **[Live Demo  -->  zenflow-lyart.vercel.app](https://zenflow-lyart.vercel.app)**

pomodoro timer that doesn't suck. built it because every focus app wanted $5/month for a countdown timer.

works offline. installable on mac and iphone. dark mode. ambient sounds. floating always-on-top timer. that's it.

---

## Features

- **Offline-capable PWA** -- installable on any device (iPhone, Mac, Android, desktop browsers)
- **Ambient soundscapes** generated with Tone.js (rain, cafe, deep focus, forest -- not pre-recorded audio files)
- **Visual progress heatmap** + streak tracking with daily bars and weekly view
- **Customizable work/break durations** -- 25/5/15 pomodoro cycle with full control
- **Dark/light theme** -- one-click toggle
- **Electron desktop app** with always-on-top floating mini timer (macOS)
- **Zustand** for lightweight state management
- **Task tagging** -- attach tasks to focus sessions
- **Fullscreen focus mode** with distraction reminders
- **Landscape support** -- works in any orientation, no account needed

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19, TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| State Management | Zustand |
| Audio Engine | Tone.js (procedural generation) |
| Storage | idb-keyval (IndexedDB) |
| Desktop | Electron (macOS, always-on-top PIP) |
| Deployment | Vercel |

---

## Quick Start

```bash
git clone https://github.com/rakshithmuda22/zenflow.git
cd zenflow
npm install
npm run dev            # browser at localhost:5173
npm run electron:dev   # electron app
```

---

## Install

### iPhone

1. open [zenflow-lyart.vercel.app](https://zenflow-lyart.vercel.app) in **safari**
2. tap the **share button** (square with arrow at the bottom)
3. scroll down --> tap **"add to home screen"**
4. tap **add**

opens fullscreen with no browser chrome. works offline after first load. supports portrait and landscape.

### Mac -- Desktop App (recommended)

the electron build gives you a native mac app with an always-on-top floating timer.

```bash
git clone https://github.com/rakshithmuda22/zenflow.git
cd zenflow
npm install
npm run electron:build
```

the built app will be at `release/mac-arm64/ZenFlow.app` -- drag it to your Applications folder.

**floating timer:** start a focus session --> click the pip icon (top right) --> a small timer widget floats on top of all your windows. drag it anywhere. it shows the countdown, session label, and your tasks.

### Mac -- PWA (lightweight alternative)

if you don't want the full electron app:

1. open [zenflow-lyart.vercel.app](https://zenflow-lyart.vercel.app) in **chrome** or **edge**
2. click the **three dots** menu --> **"install zenflow"**
3. it'll appear in your dock

note: the pwa version doesn't have the always-on-top floating timer -- that's electron only.

---

## License

MIT
