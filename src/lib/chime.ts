let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

export function playChime() {
  try {
    const ac = getCtx()
    if (ac.state === 'suspended') ac.resume()

    const now = ac.currentTime

    // Bell tone 1
    const osc1 = ac.createOscillator()
    const gain1 = ac.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(880, now)
    gain1.gain.setValueAtTime(0.3, now)
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2)
    osc1.connect(gain1).connect(ac.destination)
    osc1.start(now)
    osc1.stop(now + 1.2)

    // Bell tone 2 (harmony)
    const osc2 = ac.createOscillator()
    const gain2 = ac.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(1320, now + 0.15)
    gain2.gain.setValueAtTime(0, now)
    gain2.gain.setValueAtTime(0.2, now + 0.15)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.4)
    osc2.connect(gain2).connect(ac.destination)
    osc2.start(now + 0.15)
    osc2.stop(now + 1.4)

    // Bell tone 3 (resolve)
    const osc3 = ac.createOscillator()
    const gain3 = ac.createGain()
    osc3.type = 'sine'
    osc3.frequency.setValueAtTime(1760, now + 0.3)
    gain3.gain.setValueAtTime(0, now)
    gain3.gain.setValueAtTime(0.15, now + 0.3)
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.8)
    osc3.connect(gain3).connect(ac.destination)
    osc3.start(now + 0.3)
    osc3.stop(now + 1.8)
  } catch {
    // audio not available
  }
}
