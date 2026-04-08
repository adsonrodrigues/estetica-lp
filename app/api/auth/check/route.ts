import { NextResponse } from 'next/server'
import { verifyAdmin, getAdminCookie } from '@/lib/auth'

export async function GET() {
  const cookie = await getAdminCookie()
  const authenticated = verifyAdmin(cookie)

  if (!authenticated) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ authenticated: true })
}
