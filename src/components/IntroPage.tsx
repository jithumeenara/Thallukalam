import { useEffect, useRef, useState } from 'react'

interface Props {
  onEnter: () => void
}

// Determine once at load time — doesn't need to be reactive
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 640

export default function IntroPage({ onEnter }: Props) {
  const [btnVisible, setBtnVisible] = useState(false)
  const [isExiting,  setIsExiting]  = useState(false)
  const [btnPressed, setBtnPressed] = useState(false)
  const desktopVideoRef = useRef<HTMLVideoElement>(null)
  const mobileVideoRef  = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setBtnVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    // Only play the visible video
    if (IS_MOBILE) {
      mobileVideoRef.current?.play().catch(() => {})
    } else {
      desktopVideoRef.current?.play().catch(() => {})
    }
  }, [])

  function handleClick() {
    desktopVideoRef.current?.pause()
    mobileVideoRef.current?.pause()
    setBtnPressed(true)
    setIsExiting(true)
    setTimeout(onEnter, 750)
  }

  // ── Shared CTA button ────────────────────────────────────────────────────
  const ctaButton = (
    <button
      onClick={handleClick}
      disabled={!btnVisible || isExiting}
      className="relative px-10 py-4 text-cinema-gold border border-cinema-red/60 bg-cinema-deep/90 hover:bg-cinema-red/20 hover:border-cinema-gold/80 group"
      style={{
        clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
        fontSize: 'clamp(0.95rem, 4vw, 1.15rem)',
        letterSpacing: '0.08em',
        fontWeight: 600,
        transform: btnPressed ? 'scale(0.90)' : 'scale(1)',
        transition: 'transform 0.12s ease, background 0.2s ease, border-color 0.2s ease',
        boxShadow: btnPressed ? 'none' : '0 0 20px rgba(201,162,39,0.25)',
      }}
    >
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(192,57,43,0.15), transparent)' }}
      />
      <span className="relative z-10">ആ കാലത്തിലേക്ക് പോകാം</span>
      <span
        className="absolute bottom-0 left-[10%] right-[10%] h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A227, transparent)' }}
      />
    </button>
  )

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden font-malayalam transition-opacity duration-700 ease-in-out ${isExiting ? 'opacity-0' : 'opacity-100'}`}
    >

      {/* ══════════════════════════════════════════
          DESKTOP layout  (≥ 640 px) — unchanged
          ══════════════════════════════════════════ */}
      <div className="hidden sm:block">
        {/* Full-screen background video */}
        <video
          ref={desktopVideoRef}
          src="/banar_video/Thallukalam.mp4"
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ objectPosition: 'center center' }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 z-10 bg-black/35 pointer-events-none" />
        <div className="noise-overlay animate-flicker z-10" />
        <div className="scanline-overlay z-10" />
        <div className="vignette z-10" />

        <div className="absolute top-0 left-[14%] w-[2px] h-full pointer-events-none animate-lightning z-20"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(240,192,64,0.9) 45%, transparent 100%)', filter: 'blur(1.5px)' }} />
        <div className="absolute top-[5%] right-[18%] w-[1.5px] h-[80%] pointer-events-none animate-lightning-2 z-20"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(192,57,43,0.85) 50%, transparent 100%)', filter: 'blur(1px)' }} />

        {/* CTA — bottom center */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center pb-16 transition-all duration-700 ease-out ${btnVisible && !isExiting ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}
        >
          {ctaButton}
          <p className="mt-4 text-cinema-border/50 tracking-widest" style={{ fontSize: '0.7rem' }}>
            ▼ &nbsp; SCROLL TO EXPLORE &nbsp; ▼
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-cinema-deep to-transparent pointer-events-none z-20" />
      </div>

      {/* ══════════════════════════════════════════
          MOBILE layout  (< 640 px) — comic book TV
          ══════════════════════════════════════════ */}
      <div className="sm:hidden flex flex-col items-center min-h-screen relative">

        {/* ── Speed-lines background ── */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: '#050505',
            backgroundImage: [
              'radial-gradient(ellipse 90% 70% at 50% 44%, rgba(28,28,28,0.6) 0%, rgba(2,2,2,0.97) 62%)',
              'repeating-conic-gradient(from 0deg at 50% 44%, #060606 0deg 2.5deg, #191919 2.5deg 5deg)',
            ].join(', '),
          }}
        />

        {/* ── Lightning bolt decorations ── */}
        {/* top-left */}
        <div className="absolute top-5 left-2 z-0 select-none pointer-events-none"
          style={{ fontSize: '3.8rem', color: '#5a5a5a', opacity: 0.45, transform: 'rotate(-25deg) scaleX(-1)', filter: 'blur(0.4px)' }}>⚡</div>
        {/* top-right */}
        <div className="absolute top-5 right-2 z-0 select-none pointer-events-none"
          style={{ fontSize: '3.8rem', color: '#5a5a5a', opacity: 0.45, transform: 'rotate(25deg)', filter: 'blur(0.4px)' }}>⚡</div>
        {/* mid-left */}
        <div className="absolute top-[38%] left-0 z-0 select-none pointer-events-none"
          style={{ fontSize: '2.6rem', color: '#444', opacity: 0.28, transform: 'rotate(-15deg) scaleX(-1)' }}>⚡</div>
        {/* mid-right */}
        <div className="absolute top-[38%] right-0 z-0 select-none pointer-events-none"
          style={{ fontSize: '2.6rem', color: '#444', opacity: 0.28, transform: 'rotate(15deg)' }}>⚡</div>

        {/* ── Logo title ── */}
        <div className="relative z-10 pt-7 w-full flex justify-center">
          <img
            src="/logo.svg"
            alt="തല്ലുകാലം"
            className="h-24 w-auto"
            style={{
              filter: 'drop-shadow(0 0 22px rgba(201,162,39,0.75)) drop-shadow(0 2px 8px rgba(192,57,43,0.5))',
            }}
          />
        </div>

        {/* ── TV box ── */}
        <div className="relative z-10 mt-5 px-4 w-full">
          {/* Triangle crown / notch at top center */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-20"
            style={{
              top: '-16px',
              width: 0,
              height: 0,
              borderLeft: '22px solid transparent',
              borderRight: '22px solid transparent',
              borderBottom: '18px solid #f97316',
            }}
          />

          {/* Orange bordered screen */}
          <div
            className="w-full rounded-[18px] overflow-hidden"
            style={{
              border: '5px solid #f97316',
              boxShadow: [
                '0 0 0 1px rgba(249,115,22,0.3)',
                '0 0 30px rgba(249,115,22,0.55)',
                '0 0 70px rgba(249,115,22,0.2)',
                '0 8px 32px rgba(0,0,0,0.8)',
              ].join(', '),
            }}
          >
            <video
              ref={mobileVideoRef}
              src="/banar_video/Thallukalam.mp4"
              loop
              playsInline
              preload="auto"
              className="w-full block"
              style={{ aspectRatio: '16/9', objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
        </div>

        {/* ── CTA button ── */}
        <div
          className={`relative z-10 mt-8 flex flex-col items-center transition-all duration-700 ease-out ${btnVisible && !isExiting ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}
        >
          {ctaButton}
          <p className="mt-4 text-cinema-border/40 tracking-widest" style={{ fontSize: '0.7rem' }}>
            ▼ &nbsp; SCROLL TO EXPLORE &nbsp; ▼
          </p>
        </div>

      </div>
    </div>
  )
}
