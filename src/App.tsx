import { useState, useRef } from 'react'
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

  function handleEnterMain() {
    if (!audioRef.current) {
      const audio = new Audio('/Audio/background_audio.mp3')
      audio.loop   = true
      audio.volume = 0.35
      audio.play().catch(() => {})
      audioRef.current = audio
    }
    setAppState('main')
  }

  function handleToggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }

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
