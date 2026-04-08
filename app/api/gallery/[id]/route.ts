import { NextRequest, NextResponse } from 'next/server'
import { unlinkSync, existsSync } from 'fs'
import { join } from 'path'
import { verifyAdmin, getAdminCookie } from '@/lib/auth'
import { readGallery, writeGallery } from '@/lib/gallery'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: NextRequest, context: RouteContext) {
  const cookie = await getAdminCookie()
  if (!verifyAdmin(cookie)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await context.params
  const body = await request.json()
  const { label } = body as { label?: string }

  if (!label || label.trim().length === 0 || label.trim().length > 100) {
    return NextResponse.json(
      { error: 'Label obrigatório (máximo 100 caracteres)' },
      { status: 400 }
    )
  }

  const cases = readGallery()
  const caseIndex = cases.findIndex(c => c.id === id)

  if (caseIndex === -1) {
    return NextResponse.json({ error: 'Caso não encontrado' }, { status: 404 })
  }

  const sanitizedLabel = label.trim().replace(/<[^>]*>/g, '')
  cases[caseIndex].label = sanitizedLabel
  writeGallery(cases)

  return NextResponse.json({ data: cases[caseIndex] })
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const cookie = await getAdminCookie()
  if (!verifyAdmin(cookie)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id } = await context.params
  const cases = readGallery()
  const caseIndex = cases.findIndex(c => c.id === id)

  if (caseIndex === -1) {
    return NextResponse.json({ error: 'Caso não encontrado' }, { status: 404 })
  }

  const removed = cases[caseIndex]

  // Delete image file from disk
  const imagePath = join(process.cwd(), 'public', removed.image)
  if (existsSync(imagePath)) {
    unlinkSync(imagePath)
  }

  cases.splice(caseIndex, 1)
  writeGallery(cases)

  return NextResponse.json({ message: 'Caso removido' })
}
