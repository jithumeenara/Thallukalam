import { useEffect, useRef, useState } from 'react'

interface BannerItem {
  text: string
  bg: string
  textColor: string
}

const ROW1: BannerItem[] = [
  { text: 'തമ്മിൽ തല്ലി',          bg: '#8B1A1A', textColor: '#FFE08A' },
  { text: 'ഭരണം ഭ്രഷ്ടാക്കി',      bg: '#C9A227', textColor: '#0B0F14' },
  { text: 'നാട് കുട്ടിച്ചോറാക്കി', bg: '#1a1a2e', textColor: '#C9A227' },
  { text: 'വഴിതിരിച്ചു!',           bg: '#4A7FC1', textColor: '#ffffff' },
  { text: 'ജനം വഞ്ചിക്കപ്പെട്ടു',   bg: '#C0392B', textColor: '#FFE08A' },
  { text: 'UDF ഭരണം',               bg: '#2d4a1e', textColor: '#7CFC00' },
  { text: 'തല്ലുകാലം',              bg: '#6B2D8B', textColor: '#FFD700' },
]

const ROW2: BannerItem[] = [
  { text: 'ഇനി വേണ്ട',             bg: '#27AE60', textColor: '#0B0F14' },
  { text: 'ആ നശിച്ച കാലം',          bg: '#C0392B', textColor: '#FFE08A' },
  { text: 'മാറ്റം വേണം',            bg: '#C9A227', textColor: '#0B0F14' },
  { text: 'ജനത ഉണരണം',             bg: '#1a3a5c', textColor: '#4A7FC1' },
  { text: 'തൊഴിൽ വേണം',            bg: '#E67E22', textColor: '#0B0F14' },
  { text: 'വികസനം വേണം',            bg: '#8B1A1A', textColor: '#FFE08A' },
  { text: 'ശക്തമായ Kerala',         bg: '#16A085', textColor: '#ffffff' },
]

// Duplicate items for seamless infinite loop
const ITEMS1 = [...ROW1, ...ROW1, ...ROW1]
const ITEMS2 = [...ROW2, ...ROW2, ...ROW2]

function Separator() {
  return (
    <span className="inline-flex items-center mx-3 text-cinema-gold/50 text-lg select-none" aria-hidden>
      ✦
    </span>
  )
}

interface RowProps {
  items: BannerItem[]
  direction: 'left' | 'right'
  paused: boolean
  speed: number
}

function MarqueeRow({ items, direction, paused, speed }: RowProps) {
  return (
    <div className="overflow-hidden w-full py-2" style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}>
      <div
        className="flex items-center whitespace-nowrap"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          willChange: 'transform',
        }}
      >
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center">
            <span
              className="inline-block px-4 py-1.5 rounded-sm font-bold font-malayalam tracking-wide transition-all duration-200"
              style={{
                background: item.bg,
                color: item.textColor,
                fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
                boxShadow: `0 2px 12px ${item.bg}88`,
                letterSpacing: '0.04em',
              }}
            >
              {item.text}
            </span>
            <Separator />
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
      className="relative overflow-hidden font-malayalam"
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
      {/* Top gold line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-cinema-gold/60 to-transparent" />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.04) 0%, transparent 70%)' }}
      />

      {/* Row 1 — scrolls left */}
      <div className="py-1">
        <MarqueeRow items={ITEMS1} direction="left" paused={paused} speed={38} />
      </div>

      {/* Divider between rows */}
      <div className="flex items-center gap-2 px-6 opacity-20">
        <div className="flex-1 h-[1px] bg-cinema-gold" />
        <div className="w-1.5 h-1.5 rotate-45 bg-cinema-red" />
        <div className="flex-1 h-[1px] bg-cinema-gold" />
      </div>

      {/* Row 2 — scrolls right */}
      <div className="py-1">
        <MarqueeRow items={ITEMS2} direction="right" paused={paused} speed={44} />
      </div>

      {/* Bottom gold line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-cinema-red/50 to-transparent" />

      {/* Hover hint */}
      {paused && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
          <span className="text-cinema-gold/30 text-xs tracking-[0.3em] uppercase">⏸ paused</span>
        </div>
      )}
    </div>
  )
}
