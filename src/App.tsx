import { Suspense, lazy, useState, useRef, useEffect } from 'react'
import IntroPage from './components/IntroPage'
import HeroSection from './components/HeroSection'
import VolumeButton from './components/VolumeButton'

const CardsGrid      = lazy(() => import('./components/CardsGrid'))
const ScrollingBanner = lazy(() => import('./components/ScrollingBanner'))
const Footer         = lazy(() => import('./components/Footer'))
const AdminPage      = lazy(() => import('./pages/AdminPage'))

const IS_ADMIN = window.location.pathname === '/admin'

export default function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [isMuted,   setIsMuted]   = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioUnlockedRef = useRef(false)

  // Create audio once; reuse across StrictMode double-invoke
  useEffect(() => {
    if (IS_ADMIN) return
    if (!audioRef.current) {
      const a = new Audio('/Audio/background_audio.mp3')
      a.preload = 'auto'
      a.loop   = true
      a.volume = 0.35
      audioRef.current = a
    }
    return () => { audioRef.current?.pause() }
  }, [])

  // Mute background audio while a tile video plays
  useEffect(() => {
    if (IS_ADMIN) return
    function onVideoPlaying(e: Event) {
      const audio = audioRef.current
      if (!audio) return
      audio.volume = (e as CustomEvent<boolean>).detail ? 0 : 0.35
    }
    window.addEventListener('thallikalam:videoplaying', onVideoPlaying)
    return () => window.removeEventListener('thallikalam:videoplaying', onVideoPlaying)
  }, [])

  if (IS_ADMIN) return (
    <Suspense fallback={null}><AdminPage /></Suspense>
  )

  function handleAudioStart() {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.35
    audio.muted = isMuted
    if (audio.paused) {
      audio.play().catch(() => {})
    }
  }

  function handleAudioUnlock() {
    if (audioUnlockedRef.current) return
    audioUnlockedRef.current = true

    const audio = audioRef.current
    if (!audio) return

    audio.muted = isMuted
    audio.volume = 0.35
    audio.currentTime = 0

    audio.play()
      .catch(() => {})
  }

  function handleToggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setIsMuted(audio.muted)
  }

  return (
    <>
      {/* Landing page — sits on top via fixed positioning, fades out on enter */}
      {showIntro && (
        <IntroPage
          onEnter={() => setShowIntro(false)}
          onAudioUnlock={handleAudioUnlock}
          onAudioStart={handleAudioStart}
        />
      )}

      {/* Main site — always mounted so HeroSection video starts loading immediately */}
      <div className="min-h-screen bg-cinema-bg font-malayalam">
        {!showIntro && <VolumeButton isMuted={isMuted} onToggle={handleToggleMute} />}
        <HeroSection />
        <Suspense fallback={null}><CardsGrid /></Suspense>
        <Suspense fallback={null}><ScrollingBanner /></Suspense>
        <Suspense fallback={null}><Footer /></Suspense>
      </div>
    </>
  )
}
