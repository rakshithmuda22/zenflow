# zenflow

pomodoro timer that doesn't suck. built it because every focus app wanted $5/month for a countdown timer.

works offline. installable on mac and iphone. dark mode. ambient sounds. that's it.

## features

- 25/5/15 pomodoro cycle (customizable)
- ambient soundscapes (rain, café, deep focus, forest) — generated with tone.js, no audio files
- visual progress — daily bar, weekly heatmap, streak tracking
- task tagging — attach tasks to focus sessions
- fullscreen focus mode with distraction reminders
- pwa — install on mac or add to iphone home screen
- dark/light theme
- works in landscape. works offline. no account needed.

## stack

react + typescript, vite, tailwind, zustand, tone.js, idb-keyval

## run locally

```bash
npm install
npm run dev
```

## install as app

**mac:** open in chrome/edge → three dots → "install zenflow"
**iphone:** safari → share → "add to home screen"

## license

mit
