import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, extname } from 'path'
import { verifyAdmin, getAdminCookie } from '@/lib/auth'
import { readGallery, writeGallery } from '@/lib/gallery'

const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const UPLOAD_DIR = join(process.cwd(), 'public', 'images', 'gallery')

/** Detecta tipo real do arquivo via magic bytes — não confia em image.type do client */
function detectImageType(buf: Buffer): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg'
  if (
    buf[0] === 0x89 && buf[1] === 0x50 &&
    buf[2] === 0x4e && buf[3] === 0x47
  ) return 'image/png'
  if (
    buf[0] === 0x52 && buf[1] === 0x49 &&
    buf[2] === 0x46 && buf[3] === 0x46 &&
    buf[8] === 0x57 && buf[9] === 0x45 &&
    buf[10] === 0x42 && buf[11] === 0x50
  ) return 'image/webp'
  return null
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function GET() {
  const cases = readGallery()
  return NextResponse.json({ data: cases })
}

export async function POST(request: NextRequest) {
  const cookie = await getAdminCookie()
  if (!verifyAdmin(cookie)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const formData = await request.formData()
  const image = formData.get('image') as File | null
  const label = formData.get('label') as string | null

  if (!image) {
    return NextResponse.json(
      { error: 'Imagem obrigatória. Formatos aceitos: JPG, PNG, WebP' },
      { status: 400 }
    )
  }

  if (image.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'Imagem deve ter no máximo 5MB' },
      { status: 400 }
    )
  }

  // Valida tipo real via magic bytes (não confia em image.type do client)
  const buffer = Buffer.from(await image.arrayBuffer())
  const detectedType = detectImageType(buffer)
  if (!detectedType) {
    return NextResponse.json(
      { error: 'Imagem obrigatória. Formatos aceitos: JPG, PNG, WebP' },
      { status: 400 }
    )
  }

  if (!label || label.trim().length === 0 || label.trim().length > 100) {
    return NextResponse.json(
      { error: 'Label obrigatório (máximo 100 caracteres)' },
      { status: 400 }
    )
  }

  const sanitizedLabel = label.trim().replace(/<[^>]*>/g, '')
  const ext = extname(image.name) || '.png'
  const safeName = `gallery-${Date.now()}-${slugify(sanitizedLabel)}${ext}`
    .replace(/\.\./g, '')
    .replace(/\//g, '')

  if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true })

  writeFileSync(join(UPLOAD_DIR, safeName), buffer)

  const cases = readGallery()
  const maxOrder = cases.length > 0 ? Math.max(...cases.map(c => c.order)) : 0

  const newCase = {
    id: randomUUID(),
    label: sanitizedLabel,
    image: `/images/gallery/${safeName}`,
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
  }

  cases.push(newCase)
  writeGallery(cases)

  return NextResponse.json({ data: newCase }, { status: 201 })
}
