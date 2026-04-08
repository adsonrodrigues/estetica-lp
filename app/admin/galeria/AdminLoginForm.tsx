'use client'

import { useState, FormEvent } from 'react'

interface AdminLoginFormProps {
  onSuccess: () => void
}

export default function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        onSuccess()
      } else {
        const data = await res.json()
        setError(data.error || 'Senha incorreta')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--cream)',
        padding: '1rem',
      }}
    >
      <div
        style={{
          background: '#F0EBE1',
          borderRadius: '1.25rem',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h1
          className="font-playfair"
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--dark)',
            marginBottom: '0.5rem',
            textAlign: 'center',
          }}
        >
          Área Administrativa
        </h1>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--muted)',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          Galeria de Resultados
        </p>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="admin-password"
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
            Senha
          </label>
          <input
            id="admin-password"
            type="password"
            placeholder="Digite a senha de acesso"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '0.75rem',
              border: '1.5px solid rgba(125, 107, 63, 0.25)',
              backgroundColor: 'var(--cream)',
              fontSize: '0.875rem',
              color: 'var(--dark)',
              outline: 'none',
              marginBottom: '0.75rem',
            }}
            aria-label="Senha de acesso administrativo"
          />

          {error && (
            <p
              role="alert"
              style={{
                fontSize: '0.8rem',
                color: '#C53030',
                marginBottom: '0.75rem',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn-gold"
            disabled={loading || !password}
            style={{
              width: '100%',
              justifyContent: 'center',
              opacity: loading || !password ? 0.6 : 1,
              cursor: loading || !password ? 'not-allowed' : 'pointer',
            }}
            aria-busy={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
