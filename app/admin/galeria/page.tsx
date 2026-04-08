'use client'

import { useEffect, useState } from 'react'
import AdminLoginForm from './AdminLoginForm'
import AdminGalleryPage from './AdminGalleryPage'

export default function AdminGaleriaPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch('/api/auth/check')
      .then(res => {
        if (res.ok) setAuthenticated(true)
      })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  if (checking) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--cream)',
        }}
      >
        <p style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
          Verificando acesso...
        </p>
      </div>
    )
  }

  if (!authenticated) {
    return <AdminLoginForm onSuccess={() => setAuthenticated(true)} />
  }

  return <AdminGalleryPage onLogout={() => setAuthenticated(false)} />
}
