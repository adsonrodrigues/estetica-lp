export default function Especialista() {
  return (
    <section
      id="especialista"
      className="py-24 lg:py-32"
      style={{ background: '#F0EBE1' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Photo + Quote */}
          <div className="relative">
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: '1.5rem',
                aspectRatio: '4/5',
                maxHeight: '640px',
              }}
            >
              <img
                src="/images/especialista-doctor.png"
                alt="Dra. Vanessa Jalles"
                className="w-full h-full object-cover object-top"
                style={{ objectPosition: 'center top' }}
              />
            </div>

            {/* Quote overlay card */}
            <div
              className="absolute bottom-6 right-0 translate-x-4 lg:translate-x-8 bg-white p-6 shadow-xl"
              style={{
                borderRadius: '1rem',
                maxWidth: '300px',
                boxShadow: '0 16px 48px rgba(28,28,28,0.12)',
              }}
            >
              <p
                className="font-playfair italic leading-snug mb-3"
                style={{ fontSize: '1rem', color: '#3A3020' }}
              >
                &ldquo;A beleza real é aquela que não grita, mas que encanta pelo equilíbrio.&rdquo;
              </p>
              <p
                className="text-[0.62rem] font-semibold tracking-[0.12em] uppercase"
                style={{ color: '#7D6B3F' }}
              >
                — Dra. Vanessa Jalles
              </p>
            </div>
          </div>

          {/* Right — Content */}
          <div className="lg:pl-4">
            <h2
              className="font-playfair font-semibold tracking-tight"
              style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: '#1C1C1C' }}
            >
              A Especialista
            </h2>
            <div className="gold-divider" />

            <p
              className="text-base leading-relaxed mb-4"
              style={{ color: '#4A4A4A' }}
            >
              Com formação sólida e dedicação à excelência clínica, a Dra. Vanessa Jalles alia o
              rigor técnico da odontologia à sensibilidade estética da harmonização orofacial. Sua
              abordagem é pautada na{' '}
              <strong style={{ color: '#1C1C1C' }}>Bioestimulação</strong> e na preservação da
              mímica facial, garantindo que cada tratamento seja uma extensão natural da beleza do
              paciente.
            </p>

            <p className="text-base leading-relaxed" style={{ color: '#4A4A4A' }}>
              Cada procedimento é planejado de forma individualizada, considerando a estrutura
              facial única de cada paciente — porque harmonia verdadeira nasce do respeito à
              identidade.
            </p>

            {/* Stats */}
            <div
              className="mt-10 pt-8 grid grid-cols-2 gap-8"
              style={{ borderTop: '1px solid rgba(125,107,63,0.2)' }}
            >
              <div>
                <p className="stat-number">10+</p>
                <p className="stat-label">Anos de Experiência</p>
              </div>
              <div>
                <p className="stat-number">5k+</p>
                <p className="stat-label">Sorrisos Renovados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
