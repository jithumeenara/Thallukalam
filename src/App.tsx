import { Suspense, lazy, useState, useRef, useEffect } from 'react'
import HeroSection from './components/HeroSection'
import VolumeButton from './components/VolumeButton'

// ── Lazy-load everything below the fold (code-split into separate chunks)
// These never block the initial parse — browser downloads them in parallel
// while the hero section renders.
const CardsGrid      = lazy(() => import('./components/CardsGrid'))
const ScrollingBanner = lazy(() => import('./components/ScrollingBanner'))
const Footer         = lazy(() => import('./components/Footer'))
const AdminPage      = lazy(() => import('./pages/AdminPage'))

const IS_ADMIN = window.location.pathname === '/admin'

export default function App() {
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Create audio; try autoplay, unlock on first click if browser blocks it.
  // Guard against React StrictMode double-invoke: reuse existing instance
  // instead of creating a new Audio() (which causes a duplicate network fetch).
  useEffect(() => {
    if (IS_ADMIN) return
    if (!audioRef.current) {
      const a = new Audio('/Audio/background_audio.mp3')
      a.loop   = true
      a.volume = 0.35
      audioRef.current = a
    }
    const audio = audioRef.current
    audio.play().catch(() => {
      function unlock() { audio.play().catch(() => {}) }
      document.addEventListener('click', unlock, { once: true })
    })
    return () => { audio.pause() }
  }, [])

  // Mute background audio while a tile video plays, restore on close
  useEffect(() => {
    if (IS_ADMIN) return
    function handleVideoPlaying(e: Event) {
      const audio = audioRef.current
      if (!audio) return
      audio.volume = (e as CustomEvent<boolean>).detail ? 0 : 0.35
    }
    window.addEventListener('thallikalam:videoplaying', handleVideoPlaying)
    return () => window.removeEventListener('thallikalam:videoplaying', handleVideoPlaying)
  }, [])

  if (IS_ADMIN) return (
    <Suspense fallback={null}>
      <AdminPage />
    </Suspense>
  )

  function handleToggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }

  return (
    <div className="min-h-screen bg-cinema-bg font-malayalam">
      <VolumeButton isMuted={isMuted} onToggle={handleToggleMute} />

      {/* Critical path — loads immediately */}
      <HeroSection />

      {/* Below the fold — deferred, load in parallel after initial render */}
      <Suspense fallback={null}>
        <CardsGrid />
      </Suspense>
      <Suspense fallback={null}>
        <ScrollingBanner />
      </Suspense>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}
