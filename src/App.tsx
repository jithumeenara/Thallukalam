import { useState, useRef, useEffect } from 'react'
import HeroSection from './components/HeroSection'
import CardsGrid from './components/CardsGrid'
import ScrollingBanner from './components/ScrollingBanner'
import Footer from './components/Footer'
import VolumeButton from './components/VolumeButton'
import AdminPage from './pages/AdminPage'

const IS_ADMIN = window.location.pathname === '/admin'

export default function App() {
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Create audio; try autoplay, unlock on first click if browser blocks it
  useEffect(() => {
    if (IS_ADMIN) return
    const audio = new Audio('/Audio/background_audio.mp3')
    audio.loop   = true
    audio.volume = 0.35
    audioRef.current = audio

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

  if (IS_ADMIN) return <AdminPage />

  function handleToggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
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
