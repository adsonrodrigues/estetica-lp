export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: '#F5F0E8', borderTop: '1px solid rgba(125,107,63,0.15)' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(125,107,63,0.1)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
            <p className="font-playfair font-semibold text-dark">Dra. Vanessa Jalles</p>
            <p className="text-[0.58rem] tracking-[0.08em] uppercase" style={{ color: '#7D6B3F' }}>
              CRO 15191
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-center text-sm" style={{ color: '#6B6B6B', maxWidth: '380px' }}>
          Especialista em Harmonização Orofacial e Odontologia Estética Avançada. CRO 15191.
        </p>

        {/* Links */}
        <nav className="flex items-center gap-8">
          {[
            { label: 'Instagram', href: 'https://instagram.com/dravanessajalles' },
            { label: 'WhatsApp', href: 'https://wa.me/5500000000000' },
            { label: 'Privacidade', href: '/privacidade' },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-[0.6rem] font-semibold tracking-[0.12em] uppercase"
              style={{ color: '#8B8B8B' }}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Copyright */}
        <p className="text-[0.6rem] tracking-[0.08em] uppercase" style={{ color: '#B0B0B0' }}>
          © {year} Dra. Vanessa Jalles — Odontologia & Harmonização Orofacial. CRO 15191
        </p>
      </div>
    </footer>
  )
}
