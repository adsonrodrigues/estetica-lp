'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

interface AddCaseModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddCaseModal({ onClose, onSuccess }: AddCaseModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [fileError, setFileError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function validateFile(f: File): string | null {
    if (!ALLOWED_TYPES.includes(f.type)) return 'Formato não aceito'
    if (f.size > MAX_SIZE) return 'Imagem muito grande (máx 5MB)'
    return null
  }

  function handleFile(f: File) {
    const error = validateFile(f)
    if (error) {
      setFileError(error)
      setFile(null)
      setPreview(null)
      return
    }
    setFileError('')
    setFile(f)
    const url = URL.createObjectURL(f)
    setPreview(url)
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setIsDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault()
    setIsDragOver(true)
  }

  function handleDragLeave() {
    setIsDragOver(false)
  }

  async function handleSubmit() {
    if (!file || !label.trim()) return
    setSaving(true)
    setSubmitError('')

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('label', label.trim())

      const res = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        onSuccess()
      } else {
        const data = await res.json()
        setSubmitError(data.error || 'Erro ao salvar. Tente novamente.')
      }
    } catch {
      setSubmitError('Erro ao salvar. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const canSubmit = file && label.trim().length > 0 && label.trim().length <= 100 && !saving

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Adicionar caso"
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
      onClick={onClose}
    >
      <div
        style={{
          background: '#F0EBE1',
          borderRadius: '1.25rem',
          padding: '2rem',
          maxWidth: '480px',
          width: '100%',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2
          className="font-playfair"
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            color: 'var(--dark)',
            marginBottom: '1.5rem',
          }}
        >
          Adicionar caso
        </h2>

        {/* Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={0}
          onKeyDown={e => { if (e.key === 'Enter') fileInputRef.current?.click() }}
          aria-label="Selecionar imagem"
          style={{
            border: `2px dashed ${fileError ? '#C53030' : isDragOver ? 'var(--gold)' : 'rgba(125, 107, 63, 0.35)'}`,
            borderRadius: '1rem',
            padding: '1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragOver ? 'rgba(125, 107, 63, 0.08)' : 'var(--cream)',
            transition: 'all 0.2s ease',
            marginBottom: '0.5rem',
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
            style={{ display: 'none' }}
            aria-hidden="true"
          />
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                borderRadius: '0.75rem',
                objectFit: 'contain',
              }}
            />
          ) : (
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              Clique ou arraste a imagem aqui
            </p>
          )}
        </div>

        {fileError && (
          <p role="alert" style={{ fontSize: '0.75rem', color: '#C53030', marginBottom: '0.75rem' }}>
            {fileError}
          </p>
        )}

        {!fileError && <div style={{ marginBottom: '0.75rem' }} />}

        {/* Label input */}
        <label
          htmlFor="case-label"
          style={{
            display: 'block',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--muted)',
            marginBottom: '0.5rem',
          }}
        >
          Label do procedimento
        </label>
        <input
          id="case-label"
          type="text"
          placeholder="Ex: Harmonização Facial"
          value={label}
          onChange={e => setLabel(e.target.value)}
          maxLength={100}
          disabled={saving}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            borderRadius: '0.75rem',
            border: '1.5px solid rgba(125, 107, 63, 0.25)',
            backgroundColor: 'var(--cream)',
            fontSize: '0.875rem',
            color: 'var(--dark)',
            outline: 'none',
            marginBottom: '1rem',
          }}
          aria-label="Label do procedimento"
        />

        {submitError && (
          <p role="alert" style={{ fontSize: '0.75rem', color: '#C53030', marginBottom: '0.75rem' }}>
            {submitError}
          </p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button
            className="btn-outline-gold"
            onClick={onClose}
            disabled={saving}
            style={{ fontSize: '0.65rem', padding: '0.6rem 1.2rem' }}
          >
            Cancelar
          </button>
          <button
            className="btn-gold btn-gold-sm"
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              opacity: canSubmit ? 1 : 0.6,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
            aria-busy={saving}
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
