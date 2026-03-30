import { useEffect, useRef, useState, useCallback } from 'react'
import Lottie from 'lottie-react'
import goldSpinner from '../animations/gold-spinner.json'
import loadingDots from '../animations/loading-dots.json'

const FRAME_COUNT = 192
const TARGET_FPS  = 24
const FRAME_MS    = 1000 / TARGET_FPS

function frameUrl(index: number): string {
  return `/banar_video/ffout${String(index).padStart(3, '0')}.gif`
}

const HERO_PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left:     `${(i * 43 + 5) % 90 + 5}%`,
  bottom:   `${(i * 17 + 3) % 35 + 5}%`,
  size:     `${2 + (i % 3)}px`,
  delay:    `${(i * 0.35) % 3}s`,
  duration: `${3 + (i % 4)}s`,
  color:    i % 2 === 0 ? 'rgba(201,162,39,0.65)' : 'rgba(192,57,43,0.55)',
}))

type LoadState = 'loading' | 'ready'

export default function HeroSection() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const framesRef   = useRef<HTMLImageElement[]>([])
  const frameIdxRef = useRef(0)
  const lastTimeRef = useRef(0)
  const rafRef      = useRef<number>(0)
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [progress,  setProgress]  = useState(0)

  // ── Preload all 192 frames ─────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    let loaded    = 0
    const images: HTMLImageElement[] = new Array(FRAME_COUNT)

    function countFrame() {
      if (cancelled) return
      loaded++
      setProgress(Math.round((loaded / FRAME_COUNT) * 100))
      if (loaded === FRAME_COUNT) {
        framesRef.current = images
        setLoadState('ready')
      }
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img   = new Image()
      img.src     = frameUrl(i + 1)
      img.onload  = countFrame
      img.onerror = countFrame
      images[i]   = img
    }
    return () => { cancelled = true }
  }, [])

  // ── Canvas 24 fps loop ─────────────────────────────────────────────
  const startAnimation = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const first = framesRef.current[0]
    if (first?.naturalWidth) {
      canvas.width  = first.naturalWidth
      canvas.height = first.naturalHeight
    } else {
      canvas.width  = 1280
      canvas.height = 720
    }

    function tick(ts: number) {
      const elapsed = ts - lastTimeRef.current
      if (elapsed >= FRAME_MS) {
        frameIdxRef.current = (frameIdxRef.current + 1) % FRAME_COUNT
        lastTimeRef.current = ts - (elapsed % FRAME_MS)
        const frame = framesRef.current[frameIdxRef.current]
        if (frame?.complete && frame.naturalWidth > 0) {
          ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
          ctx!.drawImage(frame, 0, 0, canvas!.width, canvas!.height)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    lastTimeRef.current = performance.now()
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (loadState !== 'ready') return
    startAnimation()
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [loadState, startAnimation])

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-cinema-bg font-malayalam">

      {/* Canvas background */}
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          style={{ display: loadState === 'ready' ? 'block' : 'none' }}
          aria-hidden="true"
        />
      </div>

      {/* ── Lottie loading overlay ── */}
      {loadState === 'loading' && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-cinema-bg">

          {/* Lottie: concentric spinning gold + red arcs */}
          <div className="relative w-36 h-36 mb-4">
            <Lottie
              animationData={goldSpinner}
              loop
              autoplay
              className="w-full h-full"
            />
            {/* Logo centred inside the Lottie ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/logo.svg"
                alt=""
                className="w-12 h-12 opacity-60 animate-flicker"
              />
            </div>
          </div>

          <p className="text-cinema-gold/55 text-[0.7rem] tracking-[0.28em] uppercase mb-4">
            ലോഡ് ചെയ്യുന്നു...
          </p>

          {/* Lottie: staggered gold dots */}
          <div className="w-24 h-8">
            <Lottie
              animationData={loadingDots}
              loop
              autoplay
              className="w-full h-full"
            />
          </div>

          {/* Classic progress bar below */}
          <div className="loading-bar-track mt-4">
            <div className="loading-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-cinema-border/45 text-xs mt-2 tabular-nums font-mono">
            {progress}%
          </p>
        </div>
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-cinema-bg/60 via-transparent to-cinema-bg/80" />
      <div className="vignette z-10" />
      <div className="scanline-overlay z-10" />

      {/* Lightning */}
      <div
        className="absolute top-0 left-[7%] w-[3px] h-[75%] pointer-events-none animate-lightning z-20"
        style={{
          background: 'linear-gradient(180deg, rgba(240,192,64,0) 0%, rgba(240,192,64,0.95) 50%, rgba(240,192,64,0) 100%)',
          filter: 'blur(2px)',
        }}
      />
      <div
        className="absolute top-[8%] right-[10%] w-[2px] h-[65%] pointer-events-none animate-lightning-2 z-20"
        style={{
          background: 'linear-gradient(180deg, rgba(192,57,43,0) 0%, rgba(192,57,43,0.85) 45%, rgba(192,57,43,0) 100%)',
          filter: 'blur(1.5px)',
        }}
      />

      {/* Dust particles */}
      {HERO_PARTICLES.map((p) => (
        <div
          key={p.id}
          className="particle animate-dust-float z-20"
          style={{
            left:              p.left,
            bottom:            p.bottom,
            width:             p.size,
            height:            p.size,
            background:        p.color,
            animationDelay:    p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}

      {/* ── Hero content ── */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen px-4 pt-16 pb-28 text-center">

        {/* Logo — always dancing */}
        <div
          className="w-[min(560px,78vw)] mb-6"
          style={{ animation: 'fade-up 1s ease-out 0.3s both, logo-dance 2.8s cubic-bezier(0.4,0,0.6,1) 1.3s infinite' }}
        >
          <img
            src="/logo.svg"
            alt="തല്ലുകാലം"
            className="w-full h-auto"
            draggable={false}
          />
        </div>



        {/* Scroll hint */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-35"
          style={{ animation: 'fade-up 1s ease-out 1.5s both' }}
        >
          <p className="text-cinema-gold/70 text-xs tracking-[0.3em] uppercase">Scroll</p>
          <div className="w-[1px] h-8 bg-gradient-to-b from-cinema-gold/60 to-transparent" />
        </div>
      </div>
    </section>
  )
}
