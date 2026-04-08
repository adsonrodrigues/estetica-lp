'use client'

import { useState, useEffect } from 'react'

const links = [
  { label: 'A Especialista', href: '#especialista' },
  { label: 'Metodologia', href: '#metodologia' },
  { label: 'Casos', href: '#galeria' },
  { label: 'Agendamento', href: '#agendamento' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="navbar"
      style={{
        boxShadow: scrolled ? '0 2px 20px rgba(28,28,28,0.06)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-[72px]">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 shrink-0 group">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(125,107,63,0.1)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2C9 2 7 4 7 6.5C7 8 7.5 9.5 7 11.5C6.5 13.5 5 16 5 18.5C5 20.4 6.1 22 8 22C9.5 22 10.5 21 11 19.5L12 16L13 19.5C13.5 21 14.5 22 16 22C17.9 22 19 20.4 19 18.5C19 16 17.5 13.5 17 11.5C16.5 9.5 17 8 17 6.5C17 4 15 2 12 2Z"
                stroke="#7D6B3F"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <p className="font-playfair text-sm font-semibold text-dark leading-tight tracking-tight">
              Dra. Vanessa Jalles
            </p>
            <p className="text-[0.58rem] font-medium tracking-[0.08em] uppercase text-muted leading-tight">
              CRO 15191 &nbsp;|&nbsp; Odontologia & Harmonização
            </p>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`nav-link ${active === l.href ? 'active' : ''}`}
              onClick={() => setActive(l.href)}
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex">
          <a href="#agendamento" className="btn-gold btn-gold-sm">
            Agendar Consulta
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span
            className="block w-5 h-0.5 bg-dark transition-all duration-300"
            style={{ transform: menuOpen ? 'translateY(8px) rotate(45deg)' : '' }}
          />
          <span
            className="block w-5 h-0.5 bg-dark transition-all duration-300"
            style={{ opacity: menuOpen ? 0 : 1 }}
          />
          <span
            className="block w-5 h-0.5 bg-dark transition-all duration-300"
            style={{ transform: menuOpen ? 'translateY(-8px) rotate(-45deg)' : '' }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="lg:hidden border-t px-6 py-4 flex flex-col gap-4"
          style={{ borderColor: 'rgba(125,107,63,0.12)', background: 'rgba(245,240,232,0.98)' }}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav-link py-1"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a href="#agendamento" className="btn-gold mt-2 self-start">
            Agendar Consulta
          </a>
        </div>
      )}
    </nav>
  )
}
