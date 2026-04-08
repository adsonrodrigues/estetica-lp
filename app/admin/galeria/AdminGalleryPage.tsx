'use client'

import { useEffect, useState, useRef, DragEvent, KeyboardEvent } from 'react'
import AddCaseModal from './AddCaseModal'

interface GalleryCase {
  id: string
  label: string
  image: string
  order: number
  createdAt: string
}

interface AdminGalleryPageProps {
  onLogout: () => void
}

export default function AdminGalleryPage({ onLogout }: AdminGalleryPageProps) {
  const [cases, setCases] = useState<GalleryCase[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [savingLabel, setSavingLabel] = useState(false)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteCase, setConfirmDeleteCase] = useState<GalleryCase | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragItemIndex = useRef<number | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  async function fetchCases() {
    try {
      const res = await fetch('/api/gallery')
      const data = await res.json()
      setCases(data.data || [])
    } catch {
      setCases([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCases()
  }, [])

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    onLogout()
  }

  // --- Inline label edit ---
  function startEdit(c: GalleryCase) {
    setEditingId(c.id)
    setEditLabel(c.label)
  }

  async function saveLabel(id: string) {
    if (!editLabel.trim() || editLabel.trim().length > 100) return
    setSavingLabel(true)
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: editLabel.trim() }),
      })
      if (res.ok) {
        const data = await res.json()
        setCases(prev => prev.map(c => (c.id === id ? data.data : c)))
        setSavedId(id)
        setTimeout(() => setSavedId(null), 1000)
      }
    } catch {
      // silently fail
    } finally {
      setEditingId(null)
      setSavingLabel(false)
    }
  }

  function handleEditKeyDown(e: KeyboardEvent<HTMLInputElement>, id: string) {
    if (e.key === 'Enter') {
      e.preventDefault()
      saveLabel(id)
    } else if (e.key === 'Escape') {
      setEditingId(null)
    }
  }

  // --- Delete ---
  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setCases(prev => prev.filter(c => c.id !== id))
      }
    } catch {
      // silently fail
    } finally {
      setDeletingId(null)
      setConfirmDeleteCase(null)
    }
  }

  // --- Drag and drop ---
  function handleDragStart(index: number) {
    dragItemIndex.current = index
  }

  function handleDragOver(e: DragEvent, index: number) {
    e.preventDefault()
    setDragOverIndex(index)
  }

  function handleDragLeave() {
    setDragOverIndex(null)
  }

  async function handleDrop(e: DragEvent, dropIndex: number) {
    e.preventDefault()
    setDragOverIndex(null)
    const dragIndex = dragItemIndex.current
    if (dragIndex === null || dragIndex === dropIndex) return

    const reordered = [...cases]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, moved)
    setCases(reordered)

    const ids = reordered.map(c => c.id)
    try {
      await fetch('/api/gallery/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
    } catch {
      fetchCases()
    }
    dragItemIndex.current = null
  }

  function handleDragEnd() {
    dragItemIndex.current = null
    setDragOverIndex(null)
  }

  // --- Arrow reorder (mobile fallback) ---
  async function moveCase(index: number, direction: 'up' | 'down') {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= cases.length) return

    const reordered = [...cases]
    const temp = reordered[index]
    reordered[index] = reordered[newIndex]
    reordered[newIndex] = temp
    setCases(reordered)

    const ids = reordered.map(c => c.id)
    try {
      await fetch('/api/gallery/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
    } catch {
      fetchCases()
    }
  }

  // --- Skeleton loading ---
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream)', padding: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ width: '200px', height: '2rem', background: '#E5E0D6', borderRadius: '0.5rem' }} />
            <div style={{ width: '140px', height: '2.5rem', background: '#E5E0D6', borderRadius: '9999px' }} />
          </div>
          {[1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                background: '#F0EBE1',
                borderRadius: '1.25rem',
                padding: '1rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div style={{ width: '80px', height: '80px', background: '#E5E0D6', borderRadius: '0.75rem', flexShrink: 0 }} />
              <div style={{ flex: 1, height: '1rem', background: '#E5E0D6', borderRadius: '0.25rem' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--cream)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <h1
            className="font-playfair"
            style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--dark)' }}
          >
            Galeria de Resultados
          </h1>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn-gold btn-gold-sm"
              onClick={() => setShowAddModal(true)}
              aria-label="Adicionar caso"
            >
              + Adicionar caso
            </button>
            <button
              className="btn-outline-gold"
              onClick={handleLogout}
              style={{ fontSize: '0.65rem', padding: '0.6rem 1.2rem' }}
              aria-label="Sair da administração"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Empty state */}
        {cases.length === 0 && (
          <div
            style={{
              background: '#F0EBE1',
              borderRadius: '1.25rem',
              padding: '3rem 2rem',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '0.9rem', color: 'var(--muted)' }}>
              Nenhum caso cadastrado. Clique em &ldquo;Adicionar caso&rdquo; para começar.
            </p>
          </div>
        )}

        {/* Cases list */}
        <div role="list" aria-label="Lista de casos da galeria">
          {cases.map((c, index) => (
            <div
              key={c.id}
              role="listitem"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={e => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={e => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              style={{
                background: '#F0EBE1',
                borderRadius: '1.25rem',
                padding: '1rem',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'grab',
                opacity: dragItemIndex.current === index ? 0.5 : 1,
                borderTop: dragOverIndex === index ? '3px solid var(--gold)' : '3px solid transparent',
                transition: 'border-top 0.15s ease, opacity 0.15s ease',
              }}
            >
              {/* Thumbnail */}
              <img
                src={c.image}
                alt={c.label}
                style={{
                  width: '80px',
                  height: '80px',
                  objectFit: 'cover',
                  borderRadius: '0.75rem',
                  flexShrink: 0,
                }}
              />

              {/* Label (view or edit) */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {editingId === c.id ? (
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editLabel}
                    onChange={e => setEditLabel(e.target.value)}
                    onKeyDown={e => handleEditKeyDown(e, c.id)}
                    onBlur={() => saveLabel(c.id)}
                    disabled={savingLabel}
                    maxLength={100}
                    style={{
                      width: '100%',
                      padding: '0.4rem 0.6rem',
                      borderRadius: '0.5rem',
                      border: '1.5px solid var(--gold)',
                      backgroundColor: 'var(--cream)',
                      fontSize: '0.875rem',
                      color: 'var(--dark)',
                      outline: 'none',
                    }}
                    aria-label="Editar label do caso"
                  />
                ) : (
                  <span
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--dark)',
                      transition: 'color 0.3s ease',
                      ...(savedId === c.id ? { color: '#38A169' } : {}),
                    }}
                  >
                    {c.label}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                {/* Arrow up */}
                <button
                  onClick={() => moveCase(index, 'up')}
                  disabled={index === 0}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: index === 0 ? 'not-allowed' : 'pointer',
                    opacity: index === 0 ? 0.3 : 0.7,
                    fontSize: '1rem',
                    padding: '0.25rem',
                    color: 'var(--dark)',
                  }}
                  aria-label={`Mover ${c.label} para cima`}
                  title="Mover para cima"
                >
                  ▲
                </button>

                {/* Arrow down */}
                <button
                  onClick={() => moveCase(index, 'down')}
                  disabled={index === cases.length - 1}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: index === cases.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: index === cases.length - 1 ? 0.3 : 0.7,
                    fontSize: '1rem',
                    padding: '0.25rem',
                    color: 'var(--dark)',
                  }}
                  aria-label={`Mover ${c.label} para baixo`}
                  title="Mover para baixo"
                >
                  ▼
                </button>

                {/* Edit */}
                <button
                  onClick={() => startEdit(c)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '0.25rem',
                    color: 'var(--gold)',
                  }}
                  aria-label={`Editar label de ${c.label}`}
                  title="Editar label"
                >
                  ✏️
                </button>

                {/* Delete */}
                <button
                  onClick={() => setConfirmDeleteCase(c)}
                  disabled={deletingId === c.id}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: deletingId === c.id ? 'not-allowed' : 'pointer',
                    fontSize: '1rem',
                    padding: '0.25rem',
                    color: '#C53030',
                    opacity: deletingId === c.id ? 0.5 : 1,
                  }}
                  aria-label={`Remover caso ${c.label}`}
                  title="Remover caso"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add modal */}
      {showAddModal && (
        <AddCaseModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchCases()
          }}
        />
      )}

      {/* Delete confirmation modal */}
      {confirmDeleteCase && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar remoção"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
          onClick={() => setConfirmDeleteCase(null)}
        >
          <div
            style={{
              background: '#F0EBE1',
              borderRadius: '1.25rem',
              padding: '2rem',
              maxWidth: '400px',
              width: '100%',
            }}
            onClick={e => e.stopPropagation()}
          >
            <p style={{ fontSize: '0.9rem', color: 'var(--dark)', marginBottom: '1.5rem' }}>
              Tem certeza que deseja remover o caso &ldquo;{confirmDeleteCase.label}&rdquo;?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-outline-gold"
                onClick={() => setConfirmDeleteCase(null)}
                style={{ fontSize: '0.65rem', padding: '0.6rem 1.2rem' }}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteCase.id)}
                disabled={deletingId === confirmDeleteCase.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  backgroundColor: '#C53030',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: deletingId === confirmDeleteCase.id ? 'not-allowed' : 'pointer',
                  opacity: deletingId === confirmDeleteCase.id ? 0.6 : 1,
                }}
                aria-label="Confirmar remoção"
              >
                {deletingId === confirmDeleteCase.id ? 'Removendo...' : 'Remover'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
