import { useEffect, useState } from 'react'

export function useNotification() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )

  useEffect(() => {
    if (permission === 'default') {
      Notification.requestPermission().then(setPermission)
    }
  }, [permission])

  return { permission }
}
