import { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'

interface Props {
  onEnter: () => void
  onAudioStart?: () => void
}

const VIDEO_SRC = '/Landing/landing.mp4'

export default function IntroPage({ onEnter, onAudioStart }: Props) {
  const [btnVisible, setBtnVisible] = useState(false)
  const [isExiting,  setIsExiting]  = useState(false)
  const [btnAnim,    setBtnAnim]    = useState(false)
  const [showLottie, setShowLottie] = useState(false)
  const [lottieData, setLottieData] = useState<object | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)

  // ── Boot ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    const t = setTimeout(() => setBtnVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  // Load cursor-click Lottie
  useEffect(() => {
    fetch('/lottie/click.json').then(r => r.json()).then(setLottieData).catch(() => {})
  }, [])

  // Try autoplay with audio (works on desktop / return visitors).
  // On block, fall back to muted so video still plays visually.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = false
    video.play().catch(() => {
      video.muted = true
      video.play().catch(() => {})
    })
  }, [])

  // Silent fallback for mobile first-visit: unlock audio on the very first click
  // (capture fires before any React handler, transparent to user — no UI required).
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    function unlock() {
      if (!video!.muted) return   // already unmuted by auto-unmute above
      video!.muted = false
      if (video!.paused) video!.play().catch(() => {})
    }
    document.addEventListener('click', unlock, { once: true, capture: true })
    return () => document.removeEventListener('click', unlock, { capture: true })
  }, [])

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleClick() {
    const video = videoRef.current
    onAudioStart?.()   // start background mp3 within gesture context
    setBtnAnim(true)
    setShowLottie(true)

    setTimeout(() => {
      if (video) video.pause()   // video audio stops naturally; mp3 continues
      setIsExiting(true)
      setTimeout(onEnter, 700)
    }, 320)
  }

  // ── Shared button ─────────────────────────────────────────────────────────

  const ctaButton = (extraClass = '') => (
    <div className="flex flex-col items-center gap-2">
      <div className="relative flex items-center justify-center">
        {showLottie && lottieData && (
          <div className="absolute pointer-events-none z-50"
            style={{ width: 220, height: 220, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
            <Lottie animationData={lottieData} loop={false} autoplay
              onComplete={() => setShowLottie(false)} />
          </div>
        )}
        <button
          onClick={handleClick}
          disabled={!btnVisible || isExiting}
          className={`font-malayalam relative px-10 py-4 text-white btn-pulse-anim ${btnAnim ? 'btn-tap-anim' : ''} ${extraClass}`}
          style={{
            clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
            fontSize: 'clamp(1.05rem, 5vw, 1.25rem)',
            letterSpacing: '0.08em',
            fontWeight: 700,
            fontStretch: 'condensed',
            background: 'linear-gradient(135deg, #cc0000 0%, #8b0000 100%)',
            border: '2px solid rgba(255,100,100,0.5)',
          }}
        >
          <span className="relative z-10">ആ കാലത്തിലേക്ക് പോകാം</span>
        </button>
      </div>
      <span className="hand-click-anim text-2xl select-none pointer-events-none">👆</span>
    </div>
  )

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={`relative min-h-screen w-full overflow-hidden font-malayalam transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>

      {/* ══════════════════════════════════════════════
          Single <video> — one ref, works for all sizes
          ══════════════════════════════════════════════ */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* ════════ DESKTOP overlays (≥ 640 px) ════════ */}
      <div className="hidden sm:block">
        <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none" />
        <div className="noise-overlay animate-flicker z-10" />
        <div className="scanline-overlay z-10" />
        <div className="vignette z-10" />
        <div className="absolute top-0 left-[14%] w-[2px] h-full pointer-events-none animate-lightning z-20"
          style={{ background: 'linear-gradient(180deg,transparent,rgba(240,192,64,0.9) 45%,transparent)', filter: 'blur(1.5px)' }} />
        <div className="absolute top-[5%] right-[18%] w-[1.5px] h-[80%] pointer-events-none animate-lightning-2 z-20"
          style={{ background: 'linear-gradient(180deg,transparent,rgba(192,57,43,0.85) 50%,transparent)', filter: 'blur(1px)' }} />

        <div className={`absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center pb-14 transition-all duration-700 ease-out ${btnVisible && !isExiting ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
          {ctaButton()}
          <p className="mt-3 text-cinema-border/50 tracking-widest" style={{ fontSize: '0.7rem' }}>
            ▼ &nbsp; SCROLL TO EXPLORE &nbsp; ▼
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-cinema-deep to-transparent pointer-events-none z-20" />
      </div>

      {/* ════════ MOBILE layout (< 640 px) ════════ */}
      <div className="sm:hidden flex flex-col items-center justify-center min-h-screen relative gap-5 py-8">

        {/* Speed-lines background (sits above the video) */}
        <div className="absolute inset-0 z-10 pointer-events-none" style={{
          background: [
            'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(2,2,2,0.85) 100%)',
            'repeating-conic-gradient(from 0deg at 50% 44%, rgba(6,6,6,0.7) 0deg 2.5deg, rgba(25,25,25,0.7) 2.5deg 5deg)',
          ].join(', '),
        }} />

        {/* Lightning decorations */}
        <div className="absolute top-5 left-2 z-20 select-none pointer-events-none"
          style={{ fontSize: '3.8rem', color: '#5a5a5a', opacity: 0.5, transform: 'rotate(-25deg) scaleX(-1)', filter: 'blur(0.4px)' }}>⚡</div>
        <div className="absolute top-5 right-2 z-20 select-none pointer-events-none"
          style={{ fontSize: '3.8rem', color: '#5a5a5a', opacity: 0.5, transform: 'rotate(25deg)', filter: 'blur(0.4px)' }}>⚡</div>

        {/* Logo */}
        <div className="relative z-20 flex flex-col items-center">
          <img src="/logo.svg" alt="തല്ലുകാലം" draggable={false}
            style={{
              width: 'min(72vw, 300px)',
              filter: 'drop-shadow(0 0 22px rgba(201,162,39,0.8)) drop-shadow(0 2px 10px rgba(192,57,43,0.6))',
            }}
          />
          <div className="flex gap-3 mt-1">
            <span style={{ color: '#cc0000', fontSize: '1.1rem' }}>⚡</span>
            <span style={{ color: '#cc0000', fontSize: '1.1rem' }}>⚡</span>
          </div>
        </div>

        {/* TV box — video already fills screen behind; this clips a framed portion */}
        <div className="relative z-20 px-4 w-full">
          {/* Triangle crown */}
          <div className="absolute left-1/2 -translate-x-1/2"
            style={{ top: -15, width: 0, height: 0, zIndex: 30,
              borderLeft: '22px solid transparent', borderRight: '22px solid transparent',
              borderBottom: '16px solid #cc0000' }} />
          <div className="w-full rounded-[18px] overflow-hidden" style={{
            border: '5px solid #cc0000',
            boxShadow: '0 0 0 1px rgba(204,0,0,0.3), 0 0 32px rgba(204,0,0,0.6), 0 0 70px rgba(204,0,0,0.2), 0 8px 32px rgba(0,0,0,0.85)',
          }}>
            {/* Mirror the background video in a contained 16:9 box */}
            <video
              src={VIDEO_SRC}
              loop
              muted
              playsInline
              autoPlay
              preload="auto"
              className="w-full block"
              style={{ aspectRatio: '16/9', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className={`relative z-20 flex flex-col items-center transition-all duration-700 ease-out ${btnVisible && !isExiting ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
          {ctaButton()}
          <p className="mt-3 text-cinema-border/40 tracking-widest" style={{ fontSize: '0.7rem' }}>
            ▼ &nbsp; SCROLL TO EXPLORE &nbsp; ▼
          </p>
        </div>
      </div>
    </div>
  )
}
