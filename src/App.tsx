import { useState, useRef, useEffect } from 'react'
import IntroPage from './components/IntroPage'
import HeroSection from './components/HeroSection'
import CardsGrid from './components/CardsGrid'
import ScrollingBanner from './components/ScrollingBanner'
import Footer from './components/Footer'
import VolumeButton from './components/VolumeButton'
import AdminPage from './pages/AdminPage'

type AppState = 'intro' | 'main'

// Show admin panel when URL path is /admin (no navigation link on site)
const IS_ADMIN = window.location.pathname === '/admin'

export default function App() {
  const [appState, setAppState] = useState<AppState>('intro')
  const [isMuted,  setIsMuted]  = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  if (IS_ADMIN) return <AdminPage />

  // Create audio on mount and start on first user interaction
  useEffect(() => {
    const audio = new Audio('/Audio/background_audio.mp3')
    audio.loop   = true
    audio.volume = 0.35
    audioRef.current = audio

    const tryPlay = () => audio.play().catch(() => {})
    // Try immediately (allowed in some browsers / when user navigated)
    tryPlay()
    // Fallback: resume on first touch/click anywhere on the page
    document.addEventListener('click',      tryPlay, { once: true })
    document.addEventListener('touchstart', tryPlay, { once: true })
    return () => {
      document.removeEventListener('click',      tryPlay)
      document.removeEventListener('touchstart', tryPlay)
    }
  }, [])

  function handleEnterMain() {
    // Audio already initialised — ensure it's playing when entering main
    audioRef.current?.play().catch(() => {})
    setAppState('main')
  }

  function handleToggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }

  // Mute background audio when a tile video is playing, restore when closed
  useEffect(() => {
    function handleVideoPlaying(e: Event) {
      const audio = audioRef.current
      if (!audio) return
      const playing = (e as CustomEvent<boolean>).detail
      if (playing) {
        audio.volume = 0
      } else {
        audio.volume = 0.35
      }
    }
    window.addEventListener('thallikalam:videoplaying', handleVideoPlaying)
    return () => window.removeEventListener('thallikalam:videoplaying', handleVideoPlaying)
  }, [])

  if (appState === 'intro') {
    return <IntroPage onEnter={handleEnterMain} />
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
