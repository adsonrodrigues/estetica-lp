// ============================================================
// MOCKS — hoisted before all imports by Jest
// ============================================================

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn().mockReturnValue(undefined),
  }),
}))

jest.mock('next/server', () => {
  function makeResponse(body: unknown, status: number) {
    const cookieStore: Record<string, { value: string; options: Record<string, unknown> }> = {}
    const res = {
      body,
      status,
      _cookies: cookieStore,
      cookies: {
        set(name: string, value: string, options: Record<string, unknown>) {
          cookieStore[name] = { value, options }
        },
      },
    }
    return res
  }
  return {
    NextResponse: {
      json: (body: unknown, init?: { status?: number }) =>
        makeResponse(body, (init && init.status) ? init.status : 200),
    },
    NextRequest: function () {},
  }
})

jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(false),
  unlinkSync: jest.fn(),
  mkdirSync: jest.fn(),
}))

jest.mock('@/lib/gallery', () => ({
  readGallery: jest.fn().mockReturnValue([]),
  writeGallery: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  verifyAdmin: jest.fn().mockReturnValue(true),
  getAdminCookie: jest.fn().mockResolvedValue('valid-token'),
  generateToken: jest.fn().mockReturnValue(`${Date.now()}.mockedhmacvalue`),
  COOKIE_NAME: 'admin_token',
  MAX_AGE: 86400,
}))

// ============================================================
// IMPORTS — after mocks
// ============================================================

import { POST as loginPOST } from '@/app/api/auth/login/route'
import { GET as galleryGET, POST as galleryPOST } from '@/app/api/gallery/route'
import { PATCH as galleryPATCH, DELETE as galleryDELETE } from '@/app/api/gallery/[id]/route'
import { PUT as galleryReorder } from '@/app/api/gallery/reorder/route'
import { readGallery, writeGallery } from '@/lib/gallery'
import { verifyAdmin, getAdminCookie } from '@/lib/auth'

// ============================================================
// TYPE HELPERS
// ============================================================

type MockResponse = {
  body: unknown
  status: number
  _cookies: Record<string, { value: string; options: Record<string, unknown> }>
}

type RouteContext = { params: Promise<{ id: string }> }

// ============================================================
// REQUEST HELPERS
// ============================================================

function createJsonRequest(body: unknown): unknown {
  return {
    json: () => Promise.resolve(body),
    formData: () => Promise.reject(new Error('not a form request')),
  }
}

/**
 * Creates a mock request whose formData().get() returns each field by name.
 * Supports string values and mock file objects.
 */
function createFormRequest(fields: Record<string, unknown>): unknown {
  const mockFd = {
    get: (name: string) => (name in fields ? fields[name] : null),
  }
  return { formData: () => Promise.resolve(mockFd) }
}

function makeJpgMock(size = 100): {
  size: number
  name: string
  type: string
  arrayBuffer: () => Promise<ArrayBuffer>
} {
  const buf = Buffer.alloc(size)
  buf[0] = 0xff
  buf[1] = 0xd8
  buf[2] = 0xff
  return {
    size,
    name: 'test.jpg',
    type: 'image/jpeg',
    arrayBuffer: () => Promise.resolve(buf.buffer),
  }
}

function makePdfMock(): {
  size: number
  name: string
  type: string
  arrayBuffer: () => Promise<ArrayBuffer>
} {
  // %PDF magic bytes — not a valid image
  const buf = Buffer.from([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34])
  return {
    size: buf.length,
    name: 'document.pdf',
    type: 'application/pdf',
    arrayBuffer: () => Promise.resolve(buf.buffer),
  }
}

function makeLargeFileMock(): {
  size: number
  name: string
  type: string
  arrayBuffer: () => Promise<ArrayBuffer>
} {
  // Reports size > 5MB without allocating real memory
  const jpgBuf = Buffer.from([0xff, 0xd8, 0xff])
  return {
    size: 5 * 1024 * 1024 + 1,
    name: 'large.jpg',
    type: 'image/jpeg',
    arrayBuffer: () => Promise.resolve(jpgBuf.buffer),
  }
}

// ============================================================
// FIXTURES
// ============================================================

const sampleCase = {
  id: 'test-uuid-1',
  label: 'Harmonização Facial',
  image: '/images/gallery/test.jpg',
  order: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
}

// ============================================================
// TESTS
// ============================================================

describe('Gallery Backoffice — 15 cenários', () => {
  const mockReadGallery = readGallery as jest.MockedFunction<typeof readGallery>
  const mockWriteGallery = writeGallery as jest.MockedFunction<typeof writeGallery>
  const mockVerifyAdmin = verifyAdmin as jest.MockedFunction<typeof verifyAdmin>
  const mockGetAdminCookie = getAdminCookie as jest.MockedFunction<typeof getAdminCookie>

  beforeEach(() => {
    jest.clearAllMocks()
    mockReadGallery.mockReturnValue([])
    mockWriteGallery.mockImplementation(() => {})
    mockVerifyAdmin.mockReturnValue(true)
    mockGetAdminCookie.mockResolvedValue('valid-token')
    process.env.ADMIN_PASSWORD = 'test-password-123'
  })

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD
  })

  // ---- HAPPY PATHS ----

  test('1. login com senha correta → 200 + Set-Cookie admin_token httpOnly', async () => {
    const req = createJsonRequest({ password: 'test-password-123' })
    const res = (await loginPOST(req as never)) as unknown as MockResponse

    expect(res.status).toBe(200)
    expect(res._cookies['admin_token']).toBeDefined()
    expect(res._cookies['admin_token'].options).toMatchObject({
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 86400,
    })
  })

  test('2. adicionar caso com imagem JPG válida + label → 201 + caso retornado', async () => {
    const image = makeJpgMock()
    const req = createFormRequest({ image, label: 'Harmonização Facial' })
    const res = (await galleryPOST(req as never)) as unknown as MockResponse

    expect(res.status).toBe(201)
    const body = res.body as { data: { id: string; label: string } }
    expect(body.data).toBeDefined()
    expect(body.data.label).toBe('Harmonização Facial')
    expect(body.data.id).toBeDefined()
    expect(mockWriteGallery).toHaveBeenCalledTimes(1)
  })

  test('3. editar label de um caso existente → 200 + label atualizado', async () => {
    mockReadGallery.mockReturnValue([{ ...sampleCase }])

    const req = createJsonRequest({ label: 'Novo Label' })
    const context: RouteContext = { params: Promise.resolve({ id: 'test-uuid-1' }) }
    const res = (await galleryPATCH(req as never, context)) as unknown as MockResponse

    expect(res.status).toBe(200)
    const body = res.body as { data: { label: string } }
    expect(body.data.label).toBe('Novo Label')
    expect(mockWriteGallery).toHaveBeenCalledTimes(1)
  })

  test('4. remover caso → 200 + caso não aparece no GET', async () => {
    mockReadGallery
      .mockReturnValueOnce([{ ...sampleCase }]) // called inside DELETE
      .mockReturnValueOnce([]) // called inside GET after delete

    const context: RouteContext = { params: Promise.resolve({ id: 'test-uuid-1' }) }
    const delRes = (await galleryDELETE({} as never, context)) as unknown as MockResponse
    expect(delRes.status).toBe(200)
    expect((delRes.body as { message: string }).message).toBe('Caso removido')

    const getRes = (await galleryGET()) as unknown as MockResponse
    const body = getRes.body as { data: unknown[] }
    expect(body.data).toHaveLength(0)
  })

  test('5. reordenar via IDs → 200 + ordem refletida no GET', async () => {
    const case1 = { ...sampleCase, id: 'id-1', order: 1 }
    const case2 = { ...sampleCase, id: 'id-2', order: 2, label: 'Rinoplastia' }
    mockReadGallery.mockReturnValue([case1, case2])

    const req = createJsonRequest({ ids: ['id-2', 'id-1'] })
    const res = (await galleryReorder(req as never)) as unknown as MockResponse

    expect(res.status).toBe(200)
    const data = (res.body as { data: Array<{ id: string; order: number }> }).data
    expect(data[0].id).toBe('id-2')
    expect(data[0].order).toBe(1)
    expect(data[1].id).toBe('id-1')
    expect(data[1].order).toBe(2)
  })

  // ---- EDGE CASES ----

  test('6. login com senha errada → 401', async () => {
    const req = createJsonRequest({ password: 'senha-errada' })
    const res = (await loginPOST(req as never)) as unknown as MockResponse

    expect(res.status).toBe(401)
    expect((res.body as { error: string }).error).toBe('Senha incorreta')
    expect(res._cookies['admin_token']).toBeUndefined()
  })

  test('7. upload de arquivo não-imagem (PDF, magic bytes inválidos) → 400', async () => {
    const req = createFormRequest({ image: makePdfMock(), label: 'Label Qualquer' })
    const res = (await galleryPOST(req as never)) as unknown as MockResponse

    expect(res.status).toBe(400)
    expect((res.body as { error: string }).error).toContain('Formatos aceitos')
  })

  test('8. upload de imagem > 5MB → 400', async () => {
    const req = createFormRequest({ image: makeLargeFileMock(), label: 'Label Qualquer' })
    const res = (await galleryPOST(req as never)) as unknown as MockResponse

    expect(res.status).toBe(400)
    expect((res.body as { error: string }).error).toBe('Imagem deve ter no máximo 5MB')
  })

  test('9. label vazio no POST → 400', async () => {
    const req = createFormRequest({ image: makeJpgMock(), label: '' })
    const res = (await galleryPOST(req as never)) as unknown as MockResponse

    expect(res.status).toBe(400)
    expect((res.body as { error: string }).error).toContain('Label obrigatório')
  })

  test('10. label com 101+ caracteres → 400', async () => {
    const req = createFormRequest({ image: makeJpgMock(), label: 'a'.repeat(101) })
    const res = (await galleryPOST(req as never)) as unknown as MockResponse

    expect(res.status).toBe(400)
    expect((res.body as { error: string }).error).toContain('Label obrigatório')
  })

  test('11. remover último caso → GET retorna []', async () => {
    mockReadGallery
      .mockReturnValueOnce([{ ...sampleCase }]) // for DELETE
      .mockReturnValueOnce([]) // for GET after delete

    const context: RouteContext = { params: Promise.resolve({ id: 'test-uuid-1' }) }
    await galleryDELETE({} as never, context)

    const getRes = (await galleryGET()) as unknown as MockResponse
    const body = getRes.body as { data: unknown[] }
    expect(body.data).toEqual([])
  })

  test('12. POST /api/gallery sem cookie → 401', async () => {
    mockGetAdminCookie.mockResolvedValue(undefined)
    mockVerifyAdmin.mockReturnValue(false)

    const req = createFormRequest({ image: makeJpgMock(), label: 'Label' })
    const res = (await galleryPOST(req as never)) as unknown as MockResponse

    expect(res.status).toBe(401)
    expect((res.body as { error: string }).error).toBe('Não autorizado')
  })

  test('13. PATCH /api/gallery/:id sem cookie → 401', async () => {
    mockGetAdminCookie.mockResolvedValue(undefined)
    mockVerifyAdmin.mockReturnValue(false)

    const req = createJsonRequest({ label: 'Novo Label' })
    const context: RouteContext = { params: Promise.resolve({ id: 'test-uuid-1' }) }
    const res = (await galleryPATCH(req as never, context)) as unknown as MockResponse

    expect(res.status).toBe(401)
    expect((res.body as { error: string }).error).toBe('Não autorizado')
  })

  test('14. gallery.json inexistente → GET retorna { data: [] }', async () => {
    mockReadGallery.mockReturnValue([])

    const res = (await galleryGET()) as unknown as MockResponse

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ data: [] })
  })

  test('15. ADMIN_PASSWORD não definida → login retorna 500', async () => {
    delete process.env.ADMIN_PASSWORD

    const req = createJsonRequest({ password: 'qualquer' })
    const res = (await loginPOST(req as never)) as unknown as MockResponse

    expect(res.status).toBe(500)
    expect((res.body as { error: string }).error).toBe('Configuração de admin ausente')
  })
})
