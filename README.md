# zenflow

pomodoro timer that doesn't suck. built it because every focus app wanted $5/month for a countdown timer.

**[live demo →](https://zenflow-lyart.vercel.app)**

works offline. installable on mac and iphone. dark mode. ambient sounds. floating always-on-top timer. that's it.

## features

- 25/5/15 pomodoro cycle (customizable)
- ambient soundscapes (rain, café, deep focus, forest) — generated with tone.js, no audio files
- visual progress — daily bar, weekly heatmap, streak tracking
- task tagging — attach tasks to focus sessions
- fullscreen focus mode with distraction reminders
- always-on-top floating mini timer (electron, mac)
- pwa — install on mac or add to iphone home screen
- dark/light theme
- works in landscape. works offline. no account needed.

## stack

react + typescript, vite, tailwind, zustand, tone.js, idb-keyval, electron

## install

### iphone

1. open [zenflow-lyart.vercel.app](https://zenflow-lyart.vercel.app) in **safari**
2. tap the **share button** (square with arrow at the bottom)
3. scroll down → tap **"add to home screen"**
4. tap **add**

opens fullscreen with no browser chrome. works offline after first load. supports portrait and landscape.

### mac — desktop app (recommended)

the electron build gives you a native mac app with an always-on-top floating timer.

```bash
git clone https://github.com/rakshithmuda22/zenflow.git
cd zenflow
npm install
npm run electron:build
```

the built app will be at `release/mac-arm64/ZenFlow.app` — drag it to your Applications folder.

**floating timer:** start a focus session → click the pip icon (top right) → a small timer widget floats on top of all your windows. drag it anywhere. it shows the countdown, session label, and your tasks.

### mac — pwa (lightweight alternative)

if you don't want the full electron app:

1. open [zenflow-lyart.vercel.app](https://zenflow-lyart.vercel.app) in **chrome** or **edge**
2. click the **three dots** menu → **"install zenflow"**
3. it'll appear in your dock

note: the pwa version doesn't have the always-on-top floating timer — that's electron only.

## run locally

```bash
npm install
npm run dev            # browser
npm run electron:dev   # electron
```

## license

mit
