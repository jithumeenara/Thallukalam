import { useState, useRef } from 'react'
import IntroPage from './components/IntroPage'
import HeroSection from './components/HeroSection'
import CardsGrid from './components/CardsGrid'
import Footer from './components/Footer'
import VolumeButton from './components/VolumeButton'

type AppState = 'intro' | 'main'

export default function App() {
  const [appState, setAppState] = useState<AppState>('intro')
  const [isMuted,  setIsMuted]  = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
      {/* Global volume toggle — fixed top-right */}
      <VolumeButton isMuted={isMuted} onToggle={handleToggleMute} />

      <HeroSection />
      <CardsGrid />
      <Footer />
    </div>
  )
}
