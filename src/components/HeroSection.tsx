import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import goldSpinner from '../animations/gold-spinner.json'
import loadingDots from '../animations/loading-dots.json'

// ── lottie-react is ~250 KB — split into its own chunk so it never blocks
// the initial HTML parse. The loading overlay text + logo show instantly;
// the Lottie animations swap in once the chunk arrives (fast, same CDN).
const Lottie = lazy(() => import('lottie-react'))

const BANNER_VIDEO_WEBM = '/banar_video/banner.webm'
const BANNER_VIDEO_MP4  = '/banar_video/banner.mp4'

const HERO_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left:     `${(i * 43 + 5) % 90 + 5}%`,
  bottom:   `${(i * 17 + 3) % 35 + 5}%`,
  size:     `${2 + (i % 3)}px`,
  delay:    `${(i * 0.35) % 3}s`,
  duration: `${3 + (i % 4)}s`,
  color:    i % 2 === 0 ? 'rgba(201,162,39,0.65)' : 'rgba(192,57,43,0.55)',
}))

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const done = () => setReady(true)
    video.addEventListener('canplay', done)
    video.addEventListener('error',   done)
    video.load()
    return () => {
      video.removeEventListener('canplay', done)
      video.removeEventListener('error',   done)
    }
  }, [])

  useEffect(() => {
    if (!ready) return
    videoRef.current?.play().catch(() => {})
  }, [ready])

  return (
    <section className="relative w-full sm:min-h-screen overflow-hidden bg-cinema-bg font-malayalam">

      {/* Mobile: logo above banner */}
      <div className="sm:hidden relative z-30 flex justify-center items-center py-4 bg-cinema-bg">
        <img
          src="/logo.svg"
          alt="തല്ലുകാലം"
          className="w-[72vw] h-auto"
          draggable={false}
          fetchPriority="high"
          style={{ animation: 'fade-up 0.9s ease-out 0.2s both, logo-dance 2.8s cubic-bezier(0.4,0,0.6,1) 1.2s infinite' }}
        />
      </div>

      {/* Banner video */}
      <div className="canvas-wrapper">
        <video ref={videoRef} loop muted playsInline preload="auto" aria-hidden="true">
          <source src={BANNER_VIDEO_WEBM} type="video/webm" />
          <source src={BANNER_VIDEO_MP4}  type="video/mp4" />
        </video>
      </div>

      {/* Loading overlay — text + logo render instantly; Lottie swaps in async */}
      {!ready && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-cinema-bg">
          <div className="relative w-36 h-36 mb-4">
            <Suspense fallback={<div className="w-full h-full" />}>
              <Lottie animationData={goldSpinner} loop autoplay className="w-full h-full" />
            </Suspense>
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/logo.svg" alt="" className="w-12 h-12 opacity-60 animate-flicker" fetchPriority="high" />
            </div>
          </div>
          <p className="text-cinema-gold/55 text-[0.7rem] tracking-[0.28em] uppercase mb-4">
            ലോഡ് ചെയ്യുന്നു...
          </p>
          <div className="w-24 h-8">
            <Suspense fallback={<div className="w-24 h-8" />}>
              <Lottie animationData={loadingDots} loop autoplay className="w-full h-full" />
            </Suspense>
          </div>
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-cinema-bg/60 via-transparent to-cinema-bg/80" />
      <div className="vignette z-10" />
      <div className="scanline-overlay z-10" />

      {/* Lightning */}
      <div className="absolute top-0 left-[7%] w-[3px] h-[75%] pointer-events-none animate-lightning z-20"
        style={{ background: 'linear-gradient(180deg,rgba(240,192,64,0) 0%,rgba(240,192,64,0.95) 50%,rgba(240,192,64,0) 100%)', filter: 'blur(2px)' }} />
      <div className="absolute top-[8%] right-[10%] w-[2px] h-[65%] pointer-events-none animate-lightning-2 z-20"
        style={{ background: 'linear-gradient(180deg,rgba(192,57,43,0) 0%,rgba(192,57,43,0.85) 45%,rgba(192,57,43,0) 100%)', filter: 'blur(1.5px)' }} />

      {/* Dust particles */}
      {HERO_PARTICLES.map((p) => (
        <div key={p.id} className="particle animate-dust-float z-20"
          style={{ left: p.left, bottom: p.bottom, width: p.size, height: p.size,
            background: p.color, animationDelay: p.delay, animationDuration: p.duration }} />
      ))}

      {/* Desktop: logo centred over video */}
      <div className="hidden sm:flex relative z-30 flex-col items-center justify-center min-h-screen px-4 pt-16 pb-28 text-center">
        <div className="w-[min(560px,78vw)] mb-6"
          style={{ animation: 'fade-up 1s ease-out 0.3s both, logo-dance 2.8s cubic-bezier(0.4,0,0.6,1) 1.3s infinite' }}>
          <img src="/logo.svg" alt="തല്ലുകാലം" className="w-full h-auto" draggable={false} fetchPriority="high" />
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-35"
          style={{ animation: 'fade-up 1s ease-out 1.5s both' }}>
          <p className="text-cinema-gold/70 text-xs tracking-[0.3em] uppercase">Scroll</p>
          <div className="w-[1px] h-8 bg-gradient-to-b from-cinema-gold/60 to-transparent" />
        </div>
      </div>

    </section>
  )
}
