import { useState, useRef, useEffect } from 'react'
import IntroPage from './components/IntroPage'
import HeroSection from './components/HeroSection'
import CardsGrid from './components/CardsGrid'
import ScrollingBanner from './components/ScrollingBanner'
import Footer from './components/Footer'
import VolumeButton from './components/VolumeButton'
import AdminPage from './pages/AdminPage'

type AppState = 'intro' | 'main'

const IS_ADMIN = window.location.pathname === '/admin'

export default function App() {
  const [appState, setAppState] = useState<AppState>('intro')
  const [isMuted,  setIsMuted]  = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // ── All hooks BEFORE any conditional return ──────────────────────────────

  // Create audio once; started explicitly via onAudioStart prop on IntroPage
  useEffect(() => {
    if (IS_ADMIN) return
    const audio = new Audio('/Audio/background_audio.mp3')
    audio.loop   = true
    audio.volume = 0.35
    audioRef.current = audio
    return () => { audio.pause() }
  }, [])

  // Mute background audio while a tile YouTube video plays, restore on close
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

  // ── Admin route ──────────────────────────────────────────────────────────
  if (IS_ADMIN) return <AdminPage />

  // ── Handlers ─────────────────────────────────────────────────────────────
  function handleEnterMain() {
    setAppState('main')
  }

  function handleAudioStart() {
    audioRef.current?.play().catch(() => {})
  }

  function handleToggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (appState === 'intro') {
    return <IntroPage onEnter={handleEnterMain} onAudioStart={handleAudioStart} />
  }

  return (
    <div className="min-h-screen bg-cinema-bg font-malayalam">
      <VolumeButton isMuted={isMuted} onToggle={handleToggleMute} />
      <HeroSection />
      <CardsGrid />
      <ScrollingBanner />
      <Footer />
    </div>
  )
}
