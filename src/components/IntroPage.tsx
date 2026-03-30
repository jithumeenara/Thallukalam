import { useEffect, useState } from 'react'

interface Props {
  onEnter: () => void
}

// Deterministic particles — no randomness, stable render
const PARTICLES = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 37 + 11) % 100}%`,
  top: `${(i * 53 + 7) % 100}%`,
  size: `${2 + (i % 4)}px`,
  delay: `${(i * 0.28) % 3.5}s`,
  duration: `${2.8 + (i % 4) * 0.7}s`,
  opacity: (0.25 + (i % 6) * 0.1).toFixed(2),
  color: i % 3 === 0 ? '#C9A227' : i % 3 === 1 ? '#8B1A1A' : '#d4c5a0',
}))

export default function IntroPage({ onEnter }: Props) {
  const [logoVisible, setLogoVisible] = useState(false)
  const [btnVisible, setBtnVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLogoVisible(true), 350)
    const t2 = setTimeout(() => setBtnVisible(true), 2400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  function handleClick() {
    setIsExiting(true)
    setTimeout(onEnter, 750)
  }

  return (
    <div
      className={`
        relative min-h-screen w-full flex flex-col items-center justify-center
        overflow-hidden font-malayalam intro-bg
        transition-opacity duration-700 ease-in-out
        ${isExiting ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* Noise texture */}
      <div className="noise-overlay animate-flicker" />

      {/* Scanline */}
      <div className="scanline-overlay" />

      {/* Vignette */}
      <div className="vignette" />

      {/* Lightning bolt — left */}
      <div
        className="absolute top-0 left-[14%] w-[2px] h-full pointer-events-none animate-lightning z-10"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(240,192,64,0.9) 45%, transparent 100%)',
          filter: 'blur(1.5px)',
        }}
      />

      {/* Lightning bolt — right */}
      <div
        className="absolute top-[5%] right-[18%] w-[1.5px] h-[80%] pointer-events-none animate-lightning-2 z-10"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(192,57,43,0.85) 50%, transparent 100%)',
          filter: 'blur(1px)',
        }}
      />

      {/* Ambient bottom glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-48 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(139,26,26,0.2) 0%, transparent 70%)',
        }}
      />

      {/* Particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="particle animate-dust-float"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            background: p.color,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: p.duration,
            zIndex: 2,
          }}
        />
      ))}

      {/* ── Logo container ── */}
      <div
        className={`
          relative z-20 mb-12 w-[min(440px,82vw)]
          transition-all duration-[1800ms] ease-out
          ${logoVisible ? 'opacity-100 animate-logo-enter' : 'opacity-0 scale-[0.3] blur-[20px]'}
        `}
      >
        {/* Glow behind logo */}
        <div
          className={`absolute inset-[-25%] rounded-full pointer-events-none transition-opacity duration-1000 ${logoVisible ? 'opacity-100 animate-glow-pulse' : 'opacity-0'}`}
          style={{
            background: 'radial-gradient(ellipse, rgba(201,162,39,0.2) 0%, rgba(139,26,26,0.08) 50%, transparent 70%)',
          }}
        />

        {/* Gold ring */}
        <div
          className={`absolute inset-[-10%] rounded-full border border-cinema-gold/10 pointer-events-none transition-opacity duration-1500 ${logoVisible ? 'opacity-100' : 'opacity-0'}`}
          style={{ boxShadow: 'inset 0 0 30px rgba(201,162,39,0.08)' }}
        />

        <img
          src="/logo.svg"
          alt="തല്ലുകാലം"
          className="relative w-full h-auto"
          draggable={false}
          style={{
            animation: logoVisible
              ? 'logo-float 3.2s ease-in-out 1.8s infinite'
              : 'none',
          }}
        />
      </div>

      {/* ── CTA Button ── */}
      <div
        className={`
          relative z-20
          transition-all duration-700 ease-out
          ${btnVisible && !isExiting
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-8 pointer-events-none'
          }
        `}
      >
        <button
          onClick={handleClick}
          disabled={!btnVisible || isExiting}
          className="
            relative px-10 py-4
            text-cinema-gold border border-cinema-red/50
            bg-cinema-deep/85 backdrop-blur-sm
            hover:bg-cinema-red/15 hover:border-cinema-gold/70
            active:scale-95
            transition-colors duration-200
            animate-btn-glow
            group
          "
          style={{
            clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
            fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
            letterSpacing: '0.08em',
            fontWeight: 600,
          }}
        >
          {/* Shimmer overlay */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(192,57,43,0.12) 50%, transparent 100%)',
            }}
          />

          <span className="relative z-10">
            ആ കാലത്തിലേക്ക് പോകാം
          </span>

          {/* Animated bottom underline */}
          <span
            className="absolute bottom-0 left-[10%] right-[10%] h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(90deg, transparent, #C9A227, transparent)' }}
          />
        </button>

        {/* Subtle hint text */}
        <p
          className="text-center mt-4 text-cinema-border/50 text-xs tracking-widest"
          style={{ fontSize: '0.7rem' }}
        >
          ▼ &nbsp; SCROLL TO EXPLORE &nbsp; ▼
        </p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-cinema-deep to-transparent pointer-events-none z-10" />
    </div>
  )
}
