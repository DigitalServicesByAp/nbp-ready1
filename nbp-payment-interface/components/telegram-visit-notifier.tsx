'use client'

import { useEffect } from 'react'

const VISIT_SENT_KEY = 'telegram-visit-notification-sent'

export function TelegramVisitNotifier() {
  useEffect(() => {
    if (sessionStorage.getItem(VISIT_SENT_KEY)) return

    sessionStorage.setItem(VISIT_SENT_KEY, 'true')

    void fetch('/api/telegram/visit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      keepalive: true,
    }).catch(() => {
      // Telegram notifications must never interrupt the website experience.
    })
  }, [])

  return null
}
