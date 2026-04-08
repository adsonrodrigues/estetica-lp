export default function Agendamento() {
  const whatsappUrl =
    'https://wa.me/5500000000000?text=Olá%2C%20gostaria%20de%20agendar%20uma%20avaliação%20com%20a%20Dra.%20Vanessa%20Jalles.'

  return (
    <section
      id="agendamento"
      className="py-24 lg:py-36"
      style={{ background: '#F8F5EF' }}
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2
          className="font-playfair font-semibold tracking-tight leading-tight"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', color: '#1C1C1C' }}
        >
          Pronta para redescobrir sua melhor versão?
        </h2>

        <p
          className="mt-5 text-base leading-relaxed"
          style={{ color: '#5A5A5A', maxWidth: '520px', margin: '1.25rem auto 0' }}
        >
          Reserve seu horário para uma consulta exclusiva com a Dra. Vanessa Jalles. Vagas
          limitadas para garantir atendimento personalizado.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{ fontSize: '0.72rem', padding: '1rem 2rem', gap: '0.75rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
                fill="white"
              />
              <path
                d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.104 1.508 5.833L0 24l6.335-1.482A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.377l-.36-.214-3.732.873.905-3.63-.234-.373A9.774 9.774 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"
                fill="white"
              />
            </svg>
            Agendar via WhatsApp
          </a>

          <p
            className="text-[0.6rem] font-semibold tracking-[0.15em] uppercase"
            style={{ color: '#9B9B9B' }}
          >
            Atendimento exclusivo com Dra. Vanessa Jalles
          </p>
        </div>
      </div>
    </section>
  )
}
