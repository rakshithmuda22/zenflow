import * as Tone from 'tone'
import type { AmbientSound } from '../types'

let currentNodes: Tone.ToneAudioNode[] = []
let isPlaying = false

function disposeAll() {
  currentNodes.forEach((n) => {
    try { n.dispose() } catch { /* already disposed */ }
  })
  currentNodes = []
  isPlaying = false
}

function createRain(): Tone.ToneAudioNode[] {
  const noise = new Tone.Noise('brown').toDestination()
  const filter = new Tone.AutoFilter({ frequency: 0.3, baseFrequency: 400, octaves: 3 }).toDestination()
  noise.connect(filter)
  filter.start()
  noise.start()
  return [noise, filter]
}

function createCafe(): Tone.ToneAudioNode[] {
  const noise = new Tone.Noise('pink')
  const filter = new Tone.Filter({ frequency: 2000, type: 'lowpass' }).toDestination()
  const vol = new Tone.Volume(-12).connect(filter)
  noise.connect(vol)
  noise.start()
  return [noise, filter, vol]
}

function createDeepFocus(): Tone.ToneAudioNode[] {
  const left = new Tone.Oscillator({ frequency: 40, type: 'sine', volume: -20 })
  const right = new Tone.Oscillator({ frequency: 42, type: 'sine', volume: -20 })
  const panL = new Tone.Panner(-1).toDestination()
  const panR = new Tone.Panner(1).toDestination()
  left.connect(panL)
  right.connect(panR)
  left.start()
  right.start()
  return [left, right, panL, panR]
}

function createForest(): Tone.ToneAudioNode[] {
  const noise = new Tone.Noise('white')
  const filter = new Tone.Filter({ frequency: 800, type: 'bandpass' }).toDestination()
  const vol = new Tone.Volume(-18).connect(filter)
  noise.connect(vol)
  noise.start()
  return [noise, filter, vol]
}

export async function startSound(sound: AmbientSound, volume: number) {
  disposeAll()
  if (sound === 'none') return

  await Tone.start()
  Tone.getDestination().volume.value = Tone.gainToDb(volume / 100)

  switch (sound) {
    case 'rain': currentNodes = createRain(); break
    case 'cafe': currentNodes = createCafe(); break
    case 'deepFocus': currentNodes = createDeepFocus(); break
    case 'forest': currentNodes = createForest(); break
  }
  isPlaying = true
}

export function stopSound() {
  disposeAll()
}

export function setVolume(volume: number) {
  if (isPlaying) {
    Tone.getDestination().volume.value = Tone.gainToDb(volume / 100)
  }
}

export function getIsPlaying() {
  return isPlaying
}
