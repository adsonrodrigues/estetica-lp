'use client'

import { useRef, useState, useEffect } from 'react'

interface GalleryCase {
  id: string
  label: string
  image: string
  order: number
  createdAt: string
}

export default function Galeria() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [cases, setCases] = useState<GalleryCase[]>([])
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(json => setCases(json.data || []))
      .catch(() => setCases([]))
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (!trackRef.current) return
    const amount = 320
    trackRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  const onScroll = () => {
    if (!trackRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current
    setCanScrollLeft(scrollLeft > 8)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 8)
  }

  return (
    <section
      id="galeria"
      className="py-24 lg:py-32"
      style={{ background: '#F5F0E8' }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <h2
              className="font-playfair font-semibold tracking-tight"
              style={{ fontSize: 'clamp(1.85rem, 4vw, 2.75rem)', color: '#1C1C1C' }}
            >
              Galeria de Resultados
            </h2>
            <p className="mt-2 text-sm" style={{ color: '#6B6B6B' }}>
              Intervenções sutis, transformações profundas e preservação da identidade.
            </p>
          </div>

          {/* Navigation buttons */}
          <div className="hidden sm:flex items-center gap-2 mt-1 shrink-0">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200"
              style={{
                borderColor: canScrollLeft ? '#7D6B3F' : 'rgba(125,107,63,0.3)',
                color: canScrollLeft ? '#7D6B3F' : 'rgba(125,107,63,0.4)',
                background: 'white',
              }}
              aria-label="Anterior"
              disabled={!canScrollLeft}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200"
              style={{
                borderColor: canScrollRight ? '#7D6B3F' : 'rgba(125,107,63,0.3)',
                color: canScrollRight ? '#7D6B3F' : 'rgba(125,107,63,0.4)',
                background: 'white',
              }}
              aria-label="Próximo"
              disabled={!canScrollRight}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="gallery-track"
          style={{ cursor: 'grab' }}
        >
          {cases.map((c) => (
            <div key={c.id} className="gallery-item flex flex-col gap-3" style={{ width: '280px' }}>
              {/* Before/after image — each photo already contains side-by-side */}
              <div
                className="overflow-hidden"
                style={{
                  borderRadius: '1rem',
                  aspectRatio: '1/1',
                  background: '#D5CFC4',
                }}
              >
                <img
                  src={c.image}
                  alt={`Resultado ${c.label}`}
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center top' }}
                />
              </div>
              <p
                className="text-center text-[0.62rem] font-semibold tracking-[0.12em] uppercase"
                style={{ color: '#6B6B6B' }}
              >
                {c.label}
              </p>
            </div>
          ))}
        </div>

        {/* Mobile scroll hint */}
        <p className="sm:hidden mt-4 text-center text-xs" style={{ color: '#9B9B9B' }}>
          ← deslize para ver mais →
        </p>
      </div>
    </section>
  )
}
