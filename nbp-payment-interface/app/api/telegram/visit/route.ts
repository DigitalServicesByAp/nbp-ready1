import { NextResponse } from 'next/server'

export async function POST() {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return NextResponse.json({ ok: false }, { status: 503 })
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: 'Someone opened the NBP website.',
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ ok: false }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 })
  }
}

export function GET() {
  return NextResponse.json({ ok: false }, { status: 405 })
}
