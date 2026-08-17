export type PaymentFlowData = {
  mobile?: string
  card?: string
  month?: string
  year?: string
  cvv?: string
  otp?: string
  balance?: string
  otpConfirm?: string
}

const FLOW_KEY = 'nbp-payment-flow'

export function updatePaymentFlow(data: PaymentFlowData) {
  if (typeof window === 'undefined') return data

  try {
    const previous = JSON.parse(sessionStorage.getItem(FLOW_KEY) ?? '{}') as PaymentFlowData
    const next = { ...previous, ...data }
    sessionStorage.setItem(FLOW_KEY, JSON.stringify(next))
    return next
  } catch {
    return data
  }
}

export function clearPaymentFlow() {
  if (typeof window !== 'undefined') sessionStorage.removeItem(FLOW_KEY)
}
