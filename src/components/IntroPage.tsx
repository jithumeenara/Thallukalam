import { useEffect, useRef, useState } from 'react'

interface Props {
  onEnter: () => void
}

export default function IntroPage({ onEnter }: Props) {
  const [btnVisible, setBtnVisible]   = useState(false)
  const [isExiting, setIsExiting]     = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setBtnVisible(true), 1800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [])

  function handleClick() {
    setIsExiting(true)
    setTimeout(onEnter, 750)
  }

  return (
    <div
      className={`
        relative min-h-screen w-full flex flex-col items-end justify-end
        overflow-hidden font-malayalam
        transition-opacity duration-700 ease-in-out
        ${isExiting ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* ── Background video ── */}
      <video
        ref={videoRef}
        src="/banar_video/Thallukalam.mp4"
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full z-0"
        style={{ objectFit: 'cover', objectPosition: 'center center' }}
        aria-hidden="true"
      />

      {/* Dark overlay so button is readable */}
      <div className="absolute inset-0 z-10 bg-black/35 pointer-events-none" />

      {/* Noise texture */}
      <div className="noise-overlay animate-flicker z-10" />

      {/* Scanline */}
      <div className="scanline-overlay z-10" />

      {/* Vignette */}
      <div className="vignette z-10" />

      {/* Lightning bolt — left */}
      <div
        className="absolute top-0 left-[14%] w-[2px] h-full pointer-events-none animate-lightning z-20"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(240,192,64,0.9) 45%, transparent 100%)',
          filter: 'blur(1.5px)',
        }}
      />

      {/* Lightning bolt — right */}
      <div
        className="absolute top-[5%] right-[18%] w-[1.5px] h-[80%] pointer-events-none animate-lightning-2 z-20"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(192,57,43,0.85) 50%, transparent 100%)',
          filter: 'blur(1px)',
        }}
      />

      {/* ── CTA Button — bottom center ── */}
      <div
        className={`
          relative z-30 w-full flex flex-col items-center pb-12 sm:pb-16
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
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-cinema-deep to-transparent pointer-events-none z-20" />
    </div>
  )
}
