export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center"
      style={{ background: '#F5F0E8', paddingTop: '72px' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full py-16 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <div className="order-2 lg:order-1">
            <span className="section-label">Odontologia & Harmonização Orofacial</span>

            <h1 className="font-playfair font-semibold leading-[1.08] tracking-tight" style={{ color: '#1C1C1C' }}>
              <span
                className="block text-[2.6rem] sm:text-[3.2rem] lg:text-[3.75rem] xl:text-[4.25rem]"
                style={{
                  animation: 'fadeUp 0.8s ease-out 0.1s both',
                }}
              >
                Arquitetura Facial
              </span>
              <span
                className="block italic"
                style={{
                  color: '#7D6B3F',
                  fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                  animation: 'fadeUp 0.8s ease-out 0.25s both',
                }}
              >
                em Harmonia.
              </span>
            </h1>

            <p
              className="mt-6 text-base leading-relaxed max-w-md"
              style={{
                color: '#555',
                animation: 'fadeUp 0.8s ease-out 0.4s both',
              }}
            >
              Um olhar curado sobre a estética. Preservando sua identidade através de intervenções
              precisas e resultados que respiram naturalidade.
            </p>

            <div
              className="mt-10 flex items-center gap-6 flex-wrap"
              style={{ animation: 'fadeUp 0.8s ease-out 0.55s both' }}
            >
              <a href="#agendamento" className="btn-gold">
                Agende sua Avaliação
              </a>
              <span className="font-playfair italic text-sm" style={{ color: '#7D6B3F' }}>
                CRO 15191
              </span>
            </div>
          </div>

          {/* Right — Photo card */}
          <div
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
            style={{ animation: 'fadeIn 1s ease-out 0.2s both' }}
          >
            <div
              className="relative w-full max-w-[440px] aspect-[4/5]"
              style={{
                borderRadius: '2rem',
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(28,28,28,0.12)',
              }}
            >
              <img
                src="/images/hero-doctor.png"
                alt="Dra. Vanessa Jalles"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
