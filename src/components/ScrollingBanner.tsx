import { useEffect, useRef, useState } from 'react'

interface BannerItem {
  text: string
  bg: string
  textColor: string
}

const CONTENT_ITEMS: BannerItem[] = [
  { text: 'ആരോഗ്യം തകരും',        bg: '#FFD700', textColor: '#0B0F14' },
  { text: 'പാഠപുസ്തകം മുടങ്ങും',  bg: '#5e17a0', textColor: '#FFFFFF' },
  { text: 'വ്യവസായം മുടങ്ങും',    bg: '#ADADAD', textColor: '#8B0000' },
  { text: 'വികസനം മുടങ്ങും',       bg: '#C0392B', textColor: '#FFE08A' },
  { text: 'റേഷൻ മുടങ്ങും',         bg: '#4A7FC1', textColor: '#FFFFFF' },
  { text: 'പെൻഷൻ മുടങ്ങും',        bg: '#27AE60', textColor: '#0B0F14' },
]

const SEP: BannerItem = { text: 'തല്ലുകാലം വന്നാൽ', bg: '#1A4A1A', textColor: '#FFFFFF' }

const ROW: BannerItem[] = CONTENT_ITEMS.flatMap(item => [item, SEP])
const ITEMS = [...ROW, ...ROW, ...ROW]

function MarqueeRow({ direction, paused }: { direction: 'left' | 'right'; paused: boolean }) {
  return (
    <div
      className="overflow-hidden w-full py-2"
      style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)' }}
    >
      <div
        className="flex items-center whitespace-nowrap gap-1"
        style={{
          animation: `marquee-${direction} 50s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {ITEMS.map((item, i) => (
          <span
            key={i}
            className="inline-block px-5 py-2 flex-shrink-0"
            style={{
              background: item.bg,
              color: item.textColor,
              fontFamily: "'FKL-Chakram', sans-serif",
              fontSize: 'clamp(1rem, 2.2vw, 1.35rem)',
              fontWeight: 400,
              letterSpacing: '0.02em',
              boxShadow: `0 3px 14px ${item.bg}99`,
              whiteSpace: 'nowrap',
            }}
          >
            {item.text}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ScrollingBanner() {
  const [visible, setVisible] = useState(false)
  const [paused,  setPaused]  = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0B0F14 0%, #12181f 40%, #0d1117 100%)',
        borderTop:    '1px solid rgba(201,162,39,0.18)',
        borderBottom: '1px solid rgba(201,162,39,0.18)',
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="h-[2px] bg-gradient-to-r from-transparent via-cinema-gold/60 to-transparent" />

      {/* Row 1 — left to right */}
      <MarqueeRow direction="right" paused={paused} />

      {/* Divider */}
      <div className="flex items-center gap-2 px-6 opacity-20">
        <div className="flex-1 h-[1px] bg-cinema-gold" />
        <div className="w-1.5 h-1.5 rotate-45 bg-cinema-red" />
        <div className="flex-1 h-[1px] bg-cinema-gold" />
      </div>

      {/* Row 2 — right to left */}
      <MarqueeRow direction="left" paused={paused} />

      <div className="h-[2px] bg-gradient-to-r from-transparent via-cinema-red/50 to-transparent" />

      {paused && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <span className="text-cinema-gold/30 text-xs tracking-[0.3em] uppercase">⏸ paused</span>
        </div>
      )}
    </div>
  )
}
