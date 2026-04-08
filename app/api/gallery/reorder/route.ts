import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, getAdminCookie } from '@/lib/auth'
import { readGallery, writeGallery } from '@/lib/gallery'

export async function PUT(request: NextRequest) {
  const cookie = await getAdminCookie()
  if (!verifyAdmin(cookie)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { ids } = body as { ids?: string[] }

  if (!ids || !Array.isArray(ids)) {
    return NextResponse.json({ error: 'IDs inválidos' }, { status: 400 })
  }

  const cases = readGallery()
  const caseMap = new Map(cases.map(c => [c.id, c]))

  // Validate all IDs exist
  const allExist = ids.every(id => caseMap.has(id))
  if (!allExist || ids.length !== cases.length) {
    return NextResponse.json({ error: 'IDs inválidos' }, { status: 400 })
  }

  // Reorder
  const reordered = ids.map((id, index) => {
    const c = caseMap.get(id)!
    return { ...c, order: index + 1 }
  })

  writeGallery(reordered)

  return NextResponse.json({ data: reordered })
}
