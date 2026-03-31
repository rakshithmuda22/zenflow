import { useEffect, useState } from 'react'

export function useOrientation() {
  const [isLandscape, setIsLandscape] = useState(
    typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : false
  )

  useEffect(() => {
    const check = () => setIsLandscape(window.innerWidth > window.innerHeight)
    window.addEventListener('resize', check)
    window.addEventListener('orientationchange', check)
    return () => {
      window.removeEventListener('resize', check)
      window.removeEventListener('orientationchange', check)
    }
  }, [])

  return isLandscape
}
