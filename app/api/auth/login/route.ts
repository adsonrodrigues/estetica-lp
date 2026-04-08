import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { generateToken, COOKIE_NAME, MAX_AGE } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret) {
    return NextResponse.json(
      { error: 'Configuração de admin ausente' },
      { status: 500 }
    )
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 })
  }
  const { password } = body

  if (!password) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  // Comparação constant-time para prevenir timing attacks.
  // Pad do password para o tamanho do secret garante que timingSafeEqual
  // sempre executa — evita vazar comprimento da senha via timing do short-circuit.
  const pwdBuf = Buffer.from(password)
  const secretBuf = Buffer.from(secret)
  const paddedPwd = Buffer.alloc(secretBuf.length, 0)
  pwdBuf.copy(paddedPwd)
  const match = timingSafeEqual(paddedPwd, secretBuf) && pwdBuf.length === secretBuf.length

  if (!match) {
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
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
