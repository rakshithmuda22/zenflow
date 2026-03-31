# zenflow

pomodoro timer that doesn't suck. built it because every focus app wanted $5/month for a countdown timer.

**[live demo →](https://zenflow-lyart.vercel.app)**

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

### iphone

1. open [zenflow-lyart.vercel.app](https://zenflow-lyart.vercel.app) in **safari**
2. tap the **share button** (square with arrow at the bottom)
3. scroll down → tap **"add to home screen"**
4. tap **add**

opens fullscreen, no safari chrome. works offline after first load. supports portrait + landscape.

### mac

1. open [zenflow-lyart.vercel.app](https://zenflow-lyart.vercel.app) in **chrome** or **edge**
2. click the **three dots** menu (top right)
3. click **"install zenflow"** (or "install app")
4. it'll appear in your dock/applications

runs as a standalone window. use the pip button during a focus session to get a floating timer on top of all your windows.

## license

mit
