let audioContext: AudioContext | null = null

function getAudioContext() {
  if (!audioContext) audioContext = new AudioContext()
  return audioContext
}

function emitPop(ctx: AudioContext) {
  const now = ctx.currentTime

  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(520, now)
  oscillator.frequency.exponentialRampToValueAtTime(780, now + 0.08)

  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16)

  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(now)
  oscillator.stop(now + 0.18)
}

export function playPlaceSound() {
  try {
    const ctx = getAudioContext()
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => emitPop(ctx)).catch(() => {})
      return
    }
    emitPop(ctx)
  } catch {
    // Web Audio unavailable or blocked — placement still works without sound.
  }
}
