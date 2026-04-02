import { useEffect, useRef, useState } from 'react'
import { CardData, extractYouTubeId, fetchRemoteCards, loadCards, saveCardsLocal } from '../data/cards'

function CrackSvg({ color, accentRgb }: { color: string; accentRgb: string }) {
  return (
    <svg className="crack-svg h-full w-full" viewBox="0 0 400 55" fill="none" preserveAspectRatio="none" style={{ color }}>
      <path d="M200,2 L184,16 L193,14 L174,38 L186,34 L165,55" stroke={`rgba(${accentRgb},0.9)`} strokeWidth="1.8" />
      <path d="M200,2 L216,16 L207,14 L226,38 L214,34 L235,55" stroke={`rgba(${accentRgb},0.9)`} strokeWidth="1.8" />
      <path d="M184,12 L165,26 L175,24 L152,48" stroke={`rgba(${accentRgb},0.65)`} strokeWidth="1.2" />
      <path d="M216,12 L235,26 L225,24 L248,48" stroke={`rgba(${accentRgb},0.65)`} strokeWidth="1.2" />
      <path d="M178,22 L162,40" stroke={`rgba(${accentRgb},0.45)`} strokeWidth="0.9" />
      <path d="M222,22 L238,40" stroke={`rgba(${accentRgb},0.45)`} strokeWidth="0.9" />
      <path d="M188,6 L178,18" stroke={`rgba(${accentRgb},0.5)`} strokeWidth="0.8" />
      <path d="M212,6 L222,18" stroke={`rgba(${accentRgb},0.5)`} strokeWidth="0.8" />
    </svg>
  )
}

function VideoModal({ card, onClose }: { card: CardData | null; onClose: () => void }) {
  const [closing, setClosing] = useState(false)
  const youtubeId = card ? extractYouTubeId(card.youtubeUrl) : null

  function close() {
    setClosing(true)
    setTimeout(onClose, 200)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.dispatchEvent(new CustomEvent('thallikalam:videoplaying', { detail: true }))
    return () => {
      document.body.style.overflow = ''
      window.dispatchEvent(new CustomEvent('thallikalam:videoplaying', { detail: false }))
    }
  }, [])

  if (!card) return null

  return (
    <div className={`modal-backdrop font-malayalam${closing ? ' closing' : ''}`} onClick={close}>
      <div className={`modal-box${closing ? ' closing' : ''}`} onClick={(event) => event.stopPropagation()}>
        <div
          className="modal-top-bar"
          style={{
            background: `linear-gradient(90deg, transparent, ${card.accentColor}, #C0392B, ${card.accentColor}, transparent)`,
          }}
        />

        <button className="modal-close-btn" onClick={close} aria-label="Close">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 5L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className="modal-header">
          <span className="text-2xl leading-none">{card.icon}</span>
          <div>
            <p className="mb-0.5 text-[0.65rem] uppercase tracking-[0.22em]" style={{ color: card.accentColor }}>
              {card.title}
            </p>
            <h2 className="font-semibold leading-snug text-[#e0d5b8]" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
              {card.subtitle}
            </h2>
          </div>
        </div>

        <div className="modal-video-wrap">
          {youtubeId ? (
            <iframe
              key={youtubeId}
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={card.subtitle}
              style={{ border: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <div className="modal-video-placeholder">
              <span className="text-4xl opacity-40">{card.icon}</span>
              <p className="text-sm uppercase tracking-widest text-cinema-gold/40">വീഡിയോ ഉടൻ വരുന്നു</p>
              <p className="text-xs text-cinema-border/30">Coming Soon</p>
            </div>
          )}
        </div>

        <div
          className="h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, rgba(${card.accentRgb},0.4), transparent)` }}
        />
      </div>
    </div>
  )
}

interface CardProps {
  card: CardData
  index: number
  onOpen: (card: CardData) => void
}

function Card({ card, index, onOpen }: CardProps) {
  const [hovered, setHovered] = useState(false)
  const [crackKey, setCrackKey] = useState(0)
  const [visible, setVisible] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = wrapRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  function handleMouseEnter() {
    setHovered(true)
    setCrackKey((key) => key + 1)
  }

  return (
    <div
      ref={wrapRef}
      className={`relative ${visible ? 'card-in-view' : 'card-hidden'}`}
      style={{ paddingBottom: '2rem', animationDelay: `${index * 0.1}s` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(card)}
    >
      <div
        className={`relative cursor-pointer overflow-hidden border select-none transition-all duration-300 ease-out ${hovered ? 'card-active scale-[1.03]' : 'scale-100'}`}
        style={{
          minHeight: '200px',
          borderColor: hovered ? `rgba(${card.accentRgb},0.65)` : 'rgba(42,48,64,0.45)',
          boxShadow: hovered
            ? `0 12px 48px -8px rgba(${card.accentRgb},0.5), 0 0 0 1px rgba(${card.accentRgb},0.25)`
            : '0 2px 20px rgba(0,0,0,0.6)',
          backgroundImage: `url(${card.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="card-bg-overlay absolute inset-0 transition-opacity duration-300" style={{ opacity: hovered ? 0.78 : 0.88 }} />
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-300" style={{ opacity: hovered ? 1 : 0, background: `radial-gradient(ellipse at 30% 45%, rgba(${card.accentRgb},0.2) 0%, transparent 60%)` }} />
        <div className="absolute left-0 right-0 top-0 h-[2px] pointer-events-none transition-all duration-300" style={{ background: `linear-gradient(90deg, transparent 0%, ${card.accentColor} 50%, transparent 100%)`, opacity: hovered ? 1 : 0.4, boxShadow: hovered ? `0 0 16px 4px rgba(${card.accentRgb},0.7)` : 'none' }} />
        <div className="scanline-overlay opacity-25" />

        <div
          className="absolute left-4 top-4 z-10 text-[2.4rem] leading-none transition-all duration-300 ease-out"
          style={{ transform: hovered ? 'scale(1.25) rotate(-10deg)' : 'scale(1) rotate(0deg)' }}
          aria-hidden="true"
        >
          {card.icon}
        </div>

        <div className="card-play-overlay pointer-events-none">
          <div className={`card-play-btn${hovered ? ' active' : ''}`}>
            <svg className="card-play-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <path d="M18 14.5V33.5L33 24L18 14.5Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <div className="absolute bottom-5 left-5 right-5 z-10 font-malayalam">
          <h3
            className="font-malayalam font-black leading-tight text-[#f0e8cc]"
            style={{
              fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
              textShadow: hovered ? `0 0 28px rgba(${card.accentRgb},0.8), 0 2px 10px rgba(0,0,0,0.9)` : '0 2px 8px rgba(0,0,0,0.8)',
              transition: 'text-shadow 0.3s ease',
            }}
          >
            {card.title}
          </h3>
          {card.title2 && (
            <p
              className="mt-0.5 font-malayalam font-bold leading-snug text-[#e8dbb0]"
              style={{ fontSize: 'clamp(0.95rem, 3vw, 1.2rem)', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
            >
              {card.title2}
            </p>
          )}
          <p
            className="mt-1 font-malayalam font-semibold leading-snug transition-colors duration-300"
            style={{ fontSize: 'clamp(0.85rem, 2.6vw, 1.05rem)', color: hovered ? card.accentColor : 'rgba(201,162,39,0.85)' }}
          >
            {card.subtitle}
          </p>
        </div>

        <div
          className="absolute bottom-0 left-0 z-10 h-[3px] pointer-events-none transition-all duration-500 ease-out"
          style={{ width: hovered ? '100%' : '0%', background: `linear-gradient(90deg, ${card.accentColor}, transparent)`, boxShadow: hovered ? `0 0 8px 2px rgba(${card.accentRgb},0.5)` : 'none' }}
        />
      </div>

      <div
        key={crackKey}
        className={`absolute bottom-0 left-0 right-0 h-8 overflow-visible pointer-events-none ${hovered ? 'crack-active' : ''}`}
        style={{ opacity: hovered ? 1 : 0, transition: hovered ? 'none' : 'opacity 0.3s ease', zIndex: 30 }}
      >
        <CrackSvg color={card.accentColor} accentRgb={card.accentRgb} />
      </div>
    </div>
  )
}

export default function CardsGrid() {
  const [cards, setCards] = useState<CardData[]>(() => loadCards())
  const [activeCard, setActiveCard] = useState<CardData | null>(null)
  const [headingVisible, setHeadingVisible] = useState(false)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchRemoteCards().then((remote) => {
      if (remote) {
        setCards(remote)
        saveCardsLocal(remote)
      }
    })
  }, [])

  useEffect(() => {
    const element = headingRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeadingVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <section className="relative overflow-hidden bg-cinema-deep px-3 pb-20 pt-4 font-malayalam sm:px-6 sm:pt-20">
        <div className="absolute left-0 right-0 top-0 z-10 h-8 bg-gradient-to-b from-cinema-bg to-cinema-deep pointer-events-none sm:h-24" />
        <div className="noise-overlay opacity-[0.025]" />

        <div className="relative z-10 w-full">
          <div ref={headingRef} className={`mb-6 text-center sm:mb-12 ${headingVisible ? 'heading-in-view' : 'heading-hidden'}`}>
            <div className="mb-5 flex items-center justify-center gap-4">
              <div className="gold-line w-16 sm:w-28" />
              <div className="h-2.5 w-2.5 rotate-45 bg-cinema-red" style={{ boxShadow: '0 0 10px 3px rgba(139,26,26,0.6)' }} />
              <div className="gold-line w-16 sm:w-28" />
            </div>
            <p
              className="font-malayalam text-[clamp(1rem,2.2vw,1.3rem)] tracking-wider"
              style={{
                color: 'rgba(201,162,39,0.75)',
                fontFamily: '"Anek Malayalam Variable", sans-serif',
                fontStretch: 'condensed',
                fontVariationSettings: '"wdth" 75',
                fontWeight: 500,
              }}
            >
              തമ്മിൽ തല്ലി നാട് കുട്ടിച്ചോറാക്കിയ കാലം
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5" style={{ paddingBottom: '1rem' }}>
            {cards.map((card, index) => (
              <Card key={card.id} card={card} index={index} onOpen={setActiveCard} />
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-4 opacity-30">
            <div className="gold-line max-w-xs flex-1" />
            <div className="h-1.5 w-1.5 rotate-45 bg-cinema-gold/50" />
            <div className="gold-line max-w-xs flex-1" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10 h-24 bg-gradient-to-t from-cinema-bg to-cinema-deep pointer-events-none" />
      </section>

      {activeCard && <VideoModal card={activeCard} onClose={() => setActiveCard(null)} />}
    </>
  )
}
