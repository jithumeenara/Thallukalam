import { Suspense, lazy, useEffect, useRef, useState } from 'react'

const Lottie = lazy(() => import('lottie-react'))

interface Props {
  onEnter: () => void
  onAudioStart?: () => void
}

export default function IntroPage({ onEnter, onAudioStart }: Props) {
  const [visible,   setVisible]   = useState(false)
  const [exiting,   setExiting]   = useState(false)
  const [btnReady,  setBtnReady]  = useState(false)
  const [tapData,   setTapData]   = useState<object | null>(null)
  const [rippling,  setRippling]  = useState(false)
  const rippleRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Staggered entrance
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true),  80)
    const t2 = setTimeout(() => setBtnReady(true), 900)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Load tap Lottie
  useEffect(() => {
    fetch('/lottie/tap.json').then(r => r.json()).then(setTapData).catch(() => {})
  }, [])

  function handleClick() {
    if (exiting) return
    onAudioStart?.()
    setRippling(true)
    rippleRef.current = setTimeout(() => setRippling(false), 700)
    setExiting(true)
    setTimeout(onEnter, 750)
  }

  useEffect(() => () => { if (rippleRef.current) clearTimeout(rippleRef.current) }, [])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center
        overflow-hidden select-none font-malayalam
        transition-opacity duration-700 ease-in-out
        ${exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{ background: 'radial-gradient(ellipse 120% 80% at 50% 110%, rgba(139,0,0,0.18) 0%, rgba(7,10,13,0) 65%), #070A0D' }}
    >

      {/* ── noise + scanlines ───────────────────────────────── */}
      <div className="noise-overlay animate-flicker pointer-events-none" style={{ zIndex: 1 }} />
      <div className="scanline-overlay pointer-events-none" style={{ zIndex: 1 }} />
      <div className="vignette pointer-events-none" style={{ zIndex: 1 }} />

      {/* ── lightning streaks ───────────────────────────────── */}
      <div className="absolute top-0 left-[12%] w-[2px] h-[60%] pointer-events-none animate-lightning"
        style={{ zIndex: 2, background: 'linear-gradient(180deg,transparent,rgba(240,192,64,0.7) 50%,transparent)', filter: 'blur(1.5px)' }} />
      <div className="absolute top-[8%] right-[15%] w-[1.5px] h-[50%] pointer-events-none animate-lightning-2"
        style={{ zIndex: 2, background: 'linear-gradient(180deg,transparent,rgba(192,57,43,0.7) 50%,transparent)', filter: 'blur(1px)' }} />

      {/* ── top corner sparks ───────────────────────────────── */}
      <span className="absolute top-5 left-3 pointer-events-none"
        style={{ zIndex: 2, fontSize:'3.2rem', color:'#4a4a4a', opacity:0.45, transform:'rotate(-20deg) scaleX(-1)', filter:'blur(0.5px)' }}>⚡</span>
      <span className="absolute top-5 right-3 pointer-events-none"
        style={{ zIndex: 2, fontSize:'3.2rem', color:'#4a4a4a', opacity:0.45, transform:'rotate(20deg)', filter:'blur(0.5px)' }}>⚡</span>

      {/* ── content ─────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center gap-7 px-6 w-full max-w-sm"
        style={{ zIndex: 10 }}>

        {/* Logo */}
        <div
          className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '0ms' }}
        >
          <img
            src="/logo.svg"
            alt="തല്ലുകാലം"
            fetchPriority="high"
            draggable={false}
            style={{
              width: 'min(78vw, 290px)',
              filter: 'drop-shadow(0 0 28px rgba(201,162,39,0.75)) drop-shadow(0 2px 14px rgba(192,57,43,0.5))',
              animation: visible ? 'logo-dance 3s cubic-bezier(0.4,0,0.6,1) 0.9s infinite' : 'none',
            }}
          />
        </div>

        {/* Tagline */}
        <div
          className={`text-center transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
          style={{ transitionDelay: '220ms' }}
        >
          <p style={{ color:'rgba(201,162,39,0.65)', fontSize:'0.72rem', letterSpacing:'0.22em', fontFamily:'sans-serif', textTransform:'uppercase', marginBottom:'6px' }}>
            ഒരിക്കൽ കൂടി ആ കാലം വന്നാൽ
          </p>
          <div style={{ width:'100%', height:'1px', background:'linear-gradient(90deg,transparent,rgba(201,162,39,0.35),transparent)' }} />
        </div>

        {/* CTA area */}
        <div
          className={`flex flex-col items-center gap-0 transition-all duration-700 ease-out
            ${btnReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '0ms' }}
        >
          {/* Tap Lottie — loops above button */}
          <div style={{ width: 80, height: 88, marginBottom: -12, pointerEvents: 'none' }}>
            {tapData && (
              <Suspense fallback={<div style={{ width: 80, height: 88 }} />}>
                <Lottie animationData={tapData} loop autoplay style={{ width: '100%', height: '100%' }} />
              </Suspense>
            )}
          </div>

          {/* CTA Button */}
          <div className="relative">
            {/* Ripple burst on click */}
            {rippling && (
              <span className="absolute inset-0 rounded pointer-events-none intro-ripple" />
            )}

            <button
              onClick={handleClick}
              disabled={!btnReady || exiting}
              className="intro-cta-btn font-malayalam relative overflow-hidden"
            >
              <span className="relative z-10">ആ കാലത്തിലേക്ക് പോകാം</span>
            </button>
          </div>

          {/* scroll hint */}
          <p className="mt-5 tracking-[0.28em] uppercase" style={{ fontSize:'0.62rem', color:'rgba(201,162,39,0.3)', fontFamily:'sans-serif' }}>
            ▼ &nbsp; SCROLL TO EXPLORE &nbsp; ▼
          </p>
        </div>
      </div>

      {/* bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ zIndex: 2, height: 2, background: 'linear-gradient(90deg,transparent,rgba(204,0,0,0.5) 30%,rgba(201,162,39,0.6) 50%,rgba(204,0,0,0.5) 70%,transparent)' }} />
    </div>
  )
}
