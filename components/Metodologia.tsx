export default function Metodologia() {
  return (
    <section id="metodologia" className="py-24 lg:py-32" style={{ background: '#FFFFFF' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="font-playfair font-semibold tracking-tight"
            style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: '#1C1C1C' }}
          >
            Metodologia de Cuidado
          </h2>
          <p className="mt-3 text-base" style={{ color: '#6B6B6B' }}>
            Um protocolo exclusivo que une diagnóstico clínico refinado e toque artístico.
          </p>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-3 gap-4 lg:gap-5">
          {/* Dark photo — left */}
          <div
            className="lg:row-span-2 relative overflow-hidden"
            style={{ borderRadius: '1.25rem', minHeight: '480px', background: '#1A1A1A' }}
          >
            <img
              src="/images/metodologia-tablet.png"
              alt="Dra. Vanessa Jalles — Metodologia"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center top' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(20,16,10,0.3) 0%, transparent 60%)' }}
            />
          </div>

          {/* Card — Mapeamento Facial */}
          <div className="card-base flex flex-col gap-4">
            <div className="method-icon">
              {/* Compass icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#7D6B3F" strokeWidth="1.5"/>
                <path d="M16.24 7.76L14.12 14.12L7.76 16.24L9.88 9.88L16.24 7.76Z" stroke="#7D6B3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="font-playfair font-semibold text-lg text-dark mb-2">
                Mapeamento Facial
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5A5A5A' }}>
                Análise minuciosa das proporções e estruturas para um planejamento individualizado
                e seguro.
              </p>
            </div>
          </div>

          {/* Card — Bioestimulação */}
          <div className="card-base flex flex-col gap-4">
            <div className="method-icon">
              {/* Sparkles icon */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L19 6L14.74 10.91L21 12L14.74 13.09L19 19L13.09 14.74L12 21L10.91 14.74L5 19L9.26 13.09L3 12L9.26 10.91L5 5L10.91 9.26L12 2Z" stroke="#7D6B3F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="font-playfair font-semibold text-lg text-dark mb-2">
                Bioestimulação
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5A5A5A' }}>
                Foco na regeneração natural dos tecidos e estímulo de colágeno para um
                rejuvenescimento sustentável.
              </p>
            </div>
          </div>

          {/* CTA card — wide, spanning 2 cols */}
          <div
            className="lg:col-span-2 relative overflow-hidden flex items-end p-8"
            style={{ borderRadius: '1.25rem', minHeight: '200px', background: '#2A2520' }}
          >
            <img
              src="/images/metodologia-ipad.png"
              alt="Inicie sua jornada"
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              style={{ objectPosition: 'center 20%' }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(30,22,14,0.85) 30%, transparent 100%)' }} />
            <div className="relative z-10 flex items-center justify-between w-full">
              <div>
                <h3 className="font-playfair font-semibold text-white text-xl mb-1">
                  Inicie sua Jornada
                </h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Agende uma consulta diagnóstica personalizada.
                </p>
              </div>
              <a
                href="#agendamento"
                className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border border-white/30 text-white hover:bg-white/10 transition-colors"
                aria-label="Agendar consulta"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12H19M13 6L19 12L13 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
