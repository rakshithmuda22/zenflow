const COLORS = ['#FF6B35', '#34D399', '#FBBF24', '#818CF8', '#F472B6', '#38BDF8']

export function launchConfetti(count = 40) {
  const container = document.createElement('div')
  container.setAttribute('aria-hidden', 'true')
  document.body.appendChild(container)

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div')
    particle.className = 'confetti-particle'
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const left = Math.random() * 100
    const duration = 2 + Math.random() * 2
    const delay = Math.random() * 0.5

    particle.style.cssText = `
      left: ${left}vw;
      background: ${color};
      --fall-duration: ${duration}s;
      --fall-delay: ${delay}s;
      width: ${6 + Math.random() * 6}px;
      height: ${6 + Math.random() * 6}px;
    `
    container.appendChild(particle)
  }

  setTimeout(() => container.remove(), 5000)
}
