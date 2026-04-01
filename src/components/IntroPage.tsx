import { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'

interface Props {
  onEnter: () => void
  onAudioStart?: () => void
}

// YouTube embed: autoplay muted, no controls, stop at 50 s, no related
const YT_SRC =
  'https://www.youtube.com/embed/4NaY00WjFME' +
  '?autoplay=1&mute=1&controls=0&loop=0&end=50' +
  '&rel=0&modestbranding=1&playsinline=1&enablejsapi=1'

export default function IntroPage({ onEnter, onAudioStart }: Props) {
  const [btnVisible,  setBtnVisible]  = useState(false)
  const [isExiting,   setIsExiting]   = useState(false)
  const [btnAnim,     setBtnAnim]     = useState(false)
  const [muted,       setMuted]       = useState(true)
  const [showLottie,  setShowLottie]  = useState(false)
  const [lottieData,  setLottieData]  = useState<object | null>(null)
  const desktopIframeRef = useRef<HTMLIFrameElement>(null)
  const mobileIframeRef  = useRef<HTMLIFrameElement>(null)
  const exitingRef       = useRef(false)   // non-reactive flag for message handler

  // Send command to both YouTube iframes via postMessage
  const postYT = (func: string, args: unknown = '') => {
    const msg = JSON.stringify({ event: 'command', func, args })
    desktopIframeRef.current?.contentWindow?.postMessage(msg, '*')
    mobileIframeRef.current?.contentWindow?.postMessage(msg, '*')
  }

  // Show button after 1.5 s
  useEffect(() => {
    const t = setTimeout(() => setBtnVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  // Load cursor-click Lottie animation from local file
  useEffect(() => {
    fetch('/lottie/click.json')
      .then(r => r.json())
      .then(setLottieData)
      .catch(() => {})
  }, [])

  // Loop YouTube: when video ends at 50 s, seek back to 0 and replay
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (exitingRef.current) return
      try {
        const d = JSON.parse(e.data as string)
        if (d.event === 'onStateChange' && d.info === 0) {
          postYT('seekTo', [0, true])
          postYT('playVideo')
        }
      } catch { /* non-YT messages */ }
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  // First tap anywhere → unmute YouTube (browser allows this in gesture context)
  function handlePageTap() {
    if (!muted) return
    postYT('unMute')
    setMuted(false)
  }

  // Button click → mute YT first (no overlap), start mp3, animate, transition
  function handleClick() {
    postYT('mute')          // silence YT BEFORE starting mp3
    setMuted(true)
    onAudioStart?.()        // start background mp3 within gesture context
    setBtnAnim(true)
    setShowLottie(true)
    setTimeout(() => {
      exitingRef.current = true
      postYT('pauseVideo')
      setIsExiting(true)
      setTimeout(onEnter, 750)
    }, 300)
  }

  // ── Desktop CTA button ───────────────────────────────────────────────────
  const desktopBtn = (
    <button
      onClick={handleClick}
      disabled={!btnVisible || isExiting}
      className={`relative px-10 py-4 text-cinema-gold border border-cinema-red/60 bg-cinema-deep/90
        hover:bg-cinema-red/20 hover:border-cinema-gold/80 active:scale-95 transition-all duration-200
        group btn-pulse-anim ${btnAnim ? 'btn-tap-anim' : ''}`}
      style={{
        clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
        fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)',
        letterSpacing: '0.08em',
        fontWeight: 600,
      }}
    >
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(192,57,43,0.15), transparent)' }} />
      <span className="relative z-10">ആ കാലത്തിലേക്ക് പോകാം</span>
      <span className="absolute bottom-0 left-[10%] right-[10%] h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A227, transparent)' }} />
    </button>
  )

  // ── Mobile CTA button (red + continuous pulse + Lottie click burst) ──────
  const mobileBtn = (
    <div className="relative flex items-center justify-center">
      {/* Cursor-click Lottie burst on tap */}
      {showLottie && lottieData && (
        <div className="absolute pointer-events-none z-50"
          style={{ width: 220, height: 220, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
          <Lottie animationData={lottieData} loop={false} autoplay={true}
            onComplete={() => setShowLottie(false)} />
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={!btnVisible || isExiting}
        className={`font-malayalam relative px-10 py-4 text-white btn-pulse-anim ${btnAnim ? 'btn-tap-anim' : ''}`}
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
  )

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden font-malayalam transition-opacity duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
      onPointerDown={handlePageTap}
    >

      {/* ════════ DESKTOP (≥ 640 px) ════════ */}
      <div className="hidden sm:block">

        {/* YouTube background — scaled to cover viewport like a video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <iframe
            ref={desktopIframeRef}
            src={YT_SRC}
            title="intro"
            allow="autoplay; encrypted-media"
            className="absolute"
            style={{
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100vw',
              height: '56.25vw',
              minHeight: '100vh',
              minWidth: '177.78vh',
              border: 'none',
            }}
          />
        </div>

        <div className="absolute inset-0 z-10 bg-black/35 pointer-events-none" />
        <div className="noise-overlay animate-flicker z-10" />
        <div className="scanline-overlay z-10" />
        <div className="vignette z-10" />
        <div className="absolute top-0 left-[14%] w-[2px] h-full pointer-events-none animate-lightning z-20"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(240,192,64,0.9) 45%, transparent 100%)', filter: 'blur(1.5px)' }} />
        <div className="absolute top-[5%] right-[18%] w-[1.5px] h-[80%] pointer-events-none animate-lightning-2 z-20"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(192,57,43,0.85) 50%, transparent 100%)', filter: 'blur(1px)' }} />

        {/* Tap-to-unmute hint */}
        {muted && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.75rem', color: '#fff', letterSpacing: '0.05em' }}>
            <span>🔇</span> tap for audio
          </div>
        )}

        <div className={`absolute bottom-0 left-0 right-0 z-30 flex flex-col items-center pb-16 transition-all duration-700 ease-out ${btnVisible && !isExiting ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
          {desktopBtn}
          <p className="mt-4 text-cinema-border/50 tracking-widest" style={{ fontSize: '0.7rem' }}>
            ▼ &nbsp; SCROLL TO EXPLORE &nbsp; ▼
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-cinema-deep to-transparent pointer-events-none z-20" />
      </div>

      {/* ════════ MOBILE (< 640 px) ════════ */}
      <div className="sm:hidden flex flex-col items-center justify-center min-h-screen relative gap-6 py-8">

        {/* Tap-to-unmute hint */}
        {muted && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full pointer-events-none"
            style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.7rem', color: '#fff', letterSpacing: '0.05em' }}>
            <span>🔇</span> tap for audio
          </div>
        )}

        {/* Speed-lines background */}
        <div className="absolute inset-0 z-0" style={{
          backgroundColor: '#050505',
          backgroundImage: [
            'radial-gradient(ellipse 90% 70% at 50% 44%, rgba(28,28,28,0.6) 0%, rgba(2,2,2,0.97) 62%)',
            'repeating-conic-gradient(from 0deg at 50% 44%, #060606 0deg 2.5deg, #191919 2.5deg 5deg)',
          ].join(', '),
        }} />

        {/* Lightning bolt decorations */}
        <div className="absolute top-5 left-2 z-0 select-none pointer-events-none"
          style={{ fontSize: '3.8rem', color: '#5a5a5a', opacity: 0.45, transform: 'rotate(-25deg) scaleX(-1)', filter: 'blur(0.4px)' }}>⚡</div>
        <div className="absolute top-5 right-2 z-0 select-none pointer-events-none"
          style={{ fontSize: '3.8rem', color: '#5a5a5a', opacity: 0.45, transform: 'rotate(25deg)', filter: 'blur(0.4px)' }}>⚡</div>
        <div className="absolute top-[40%] left-0 z-0 select-none pointer-events-none"
          style={{ fontSize: '2.6rem', color: '#444', opacity: 0.25, transform: 'rotate(-15deg) scaleX(-1)' }}>⚡</div>
        <div className="absolute top-[40%] right-0 z-0 select-none pointer-events-none"
          style={{ fontSize: '2.6rem', color: '#444', opacity: 0.25, transform: 'rotate(15deg)' }}>⚡</div>

        {/* Logo */}
        <div className="relative z-10 flex flex-col items-center">
          <img src="/logo.svg" alt="തല്ലുകാലം" draggable={false}
            style={{
              width: 'min(72vw, 300px)',
              filter: 'drop-shadow(0 0 22px rgba(201,162,39,0.75)) drop-shadow(0 2px 10px rgba(192,57,43,0.5))',
            }}
          />
          <div className="flex gap-3 mt-1 opacity-80">
            <span style={{ color: '#f97316', fontSize: '1.1rem' }}>⚡</span>
            <span style={{ color: '#f97316', fontSize: '1.1rem' }}>⚡</span>
          </div>
        </div>

        {/* TV box with YouTube iframe */}
        <div className="relative z-10 px-4 w-full">
          <div className="absolute left-1/2 -translate-x-1/2 z-20"
            style={{ top: '-15px', width: 0, height: 0,
              borderLeft: '22px solid transparent', borderRight: '22px solid transparent',
              borderBottom: '16px solid #cc0000' }}
          />
          <div className="w-full rounded-[18px] overflow-hidden" style={{
            border: '5px solid #cc0000',
            boxShadow: '0 0 0 1px rgba(204,0,0,0.3), 0 0 32px rgba(204,0,0,0.55), 0 0 70px rgba(204,0,0,0.18), 0 8px 32px rgba(0,0,0,0.8)',
          }}>
            <iframe
              ref={mobileIframeRef}
              src={YT_SRC}
              title="intro-mobile"
              allow="autoplay; encrypted-media"
              className="w-full block"
              style={{ aspectRatio: '16/9', border: 'none' }}
            />
          </div>
        </div>

        {/* CTA button */}
        <div className={`relative z-10 flex flex-col items-center transition-all duration-700 ease-out ${btnVisible && !isExiting ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
          {mobileBtn}
          <p className="mt-4 text-cinema-border/40 tracking-widest" style={{ fontSize: '0.7rem' }}>
            ▼ &nbsp; SCROLL TO EXPLORE &nbsp; ▼
          </p>
        </div>
      </div>
    </div>
  )
}
