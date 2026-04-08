import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

export interface GalleryCase {
  id: string
  label: string
  image: string
  order: number
  createdAt: string
}

const DATA_PATH = join(process.cwd(), 'data', 'gallery.json')

export function readGallery(): GalleryCase[] {
  if (!existsSync(DATA_PATH)) return []

  const raw = readFileSync(DATA_PATH, 'utf-8')
  const cases: GalleryCase[] = JSON.parse(raw)
  return cases.sort((a, b) => a.order - b.order)
}

export function writeGallery(cases: GalleryCase[]): void {
  const dir = join(process.cwd(), 'data')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

  writeFileSync(DATA_PATH, JSON.stringify(cases, null, 2) + '\n', 'utf-8')
}
