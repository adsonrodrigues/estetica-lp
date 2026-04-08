import { NextRequest, NextResponse } from 'next/server'
import { generateToken, COOKIE_NAME, MAX_AGE } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) {
    return NextResponse.json(
      { error: 'Configuração de admin ausente' },
      { status: 500 }
    )
  }

  const body = await request.json()
  const { password } = body as { password?: string }

  if (!password || password !== secret) {
    return NextResponse.json(
      { error: 'Senha incorreta' },
      { status: 401 }
    )
  }

  const token = generateToken()
  const response = NextResponse.json({ success: true })

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    path: '/',
    maxAge: MAX_AGE,
  })

  return response
}
