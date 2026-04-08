import { createHmac } from 'crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'admin_token'
const MAX_AGE = 86400 // 24h

export function generateToken(): string {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) throw new Error('ADMIN_PASSWORD not configured')

  const timestamp = Date.now().toString()
  const hmac = createHmac('sha256', secret).update(timestamp).digest('hex')
  return `${timestamp}.${hmac}`
}

export function verifyAdmin(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false

  const secret = process.env.ADMIN_PASSWORD
  if (!secret) return false

  const dotIndex = cookieValue.indexOf('.')
  if (dotIndex === -1) return false

  const timestamp = cookieValue.slice(0, dotIndex)
  const hmac = cookieValue.slice(dotIndex + 1)

  const ts = Number(timestamp)
  if (isNaN(ts)) return false

  // Check if token is expired (24h)
  if (Date.now() - ts > MAX_AGE * 1000) return false

  // Verify HMAC
  const expected = createHmac('sha256', secret).update(timestamp).digest('hex')

  // Constant-time comparison
  if (hmac.length !== expected.length) return false
  let mismatch = 0
  for (let i = 0; i < hmac.length; i++) {
    mismatch |= hmac.charCodeAt(i) ^ expected.charCodeAt(i)
  }
  return mismatch === 0
}

export async function getAdminCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value
}

export { COOKIE_NAME, MAX_AGE }
