import { Suspense, lazy, useEffect, useRef, useState, type TouchEvent } from 'react'

const Lottie = lazy(() => import('lottie-react'))

interface Props {
  onEnter: () => void
  onAudioStart?: () => void
  onAudioUnlock?: () => void
}

const LANDING_VIDEO_SRC = '/Landing/landing.mp4'
const MOBILE_FRAME_INSET = {
  top: '19.8%',
  right: '24.2%',
  bottom: '32.9%',
  left: '24.2%',
}
const WAVE_BARS = [0, 1, 2, 3, 4, 5, 6]
const CTA_WAVE_BARS = [0, 1, 2, 3, 4]

function getIsMobile() {
  return window.matchMedia('(max-width: 639px)').matches
}

export default function IntroPage({ onEnter, onAudioStart, onAudioUnlock }: Props) {
  const [visible, setVisible] = useState(false)
  const [btnReady, setBtnReady] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const [showUnlockOverlay, setShowUnlockOverlay] = useState(true)
  const [unlockClosing, setUnlockClosing] = useState(false)
  const [isMobile, setIsMobile] = useState(getIsMobile)
  const [tapData, setTapData] = useState<object | null>(null)

  const touchStartYRef = useRef<number | null>(null)
  const enterTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const unlockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const revealTimer = setTimeout(() => setVisible(true), 80)
    const buttonTimer = setTimeout(() => setBtnReady(true), 620)

    return () => {
      clearTimeout(revealTimer)
      clearTimeout(buttonTimer)
    }
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)')
    const syncMobileState = (event: MediaQueryListEvent) => setIsMobile(event.matches)

    setIsMobile(media.matches)

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', syncMobileState)
      return () => media.removeEventListener('change', syncMobileState)
    }

    media.addListener(syncMobileState)
    return () => media.removeListener(syncMobileState)
  }, [])

  useEffect(() => {
    fetch('/lottie/tap.json')
      .then((response) => response.json())
      .then(setTapData)
      .catch(() => {})
  }, [])

  useEffect(() => () => {
    if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current)
    if (unlockTimeoutRef.current) clearTimeout(unlockTimeoutRef.current)
  }, [])

  function unlockAudio() {
    if (audioUnlocked || unlockClosing) return

    onAudioUnlock?.()
    setAudioUnlocked(true)
    setUnlockClosing(true)

    unlockTimeoutRef.current = setTimeout(() => {
      setShowUnlockOverlay(false)
      setUnlockClosing(false)
    }, 260)
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartYRef.current = event.touches[0]?.clientY ?? null
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const startY = touchStartYRef.current
    touchStartYRef.current = null

    if (startY === null) return

    const endY = event.changedTouches[0]?.clientY ?? startY
    if (startY - endY > 48) unlockAudio()
  }

  function handleEnter() {
    if (exiting || !btnReady || !audioUnlocked) return

    onAudioStart?.()
    setExiting(true)
    enterTimeoutRef.current = setTimeout(onEnter, 700)
  }

  const ctaDisabled = !btnReady || !audioUnlocked || exiting

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden select-none font-malayalam transition-opacity duration-700 ease-out ${
        exiting ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="absolute inset-0 bg-[#05080b]" />

      {!isMobile && (
        <video
          className="intro-landing-video absolute inset-0 h-full w-full object-cover"
          src={LANDING_VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      )}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,162,39,0.12),transparent_38%),linear-gradient(180deg,rgba(3,5,8,0.2),rgba(3,5,8,0.76)_76%,rgba(3,5,8,0.94))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_34%,rgba(0,0,0,0.62)_100%)]" />
      <div className="noise-overlay animate-flicker pointer-events-none" style={{ zIndex: 1 }} />
      <div className="scanline-overlay pointer-events-none" style={{ zIndex: 1 }} />
      <div className="vignette pointer-events-none" style={{ zIndex: 1 }} />

      <div
        className="absolute left-[12%] top-0 h-[55%] w-[2px] pointer-events-none animate-lightning"
        style={{
          zIndex: 2,
          background:
            'linear-gradient(180deg, transparent, rgba(240,192,64,0.72) 50%, transparent)',
          filter: 'blur(1.5px)',
        }}
      />
      <div
        className="absolute right-[15%] top-[7%] h-[46%] w-[1.5px] pointer-events-none animate-lightning-2"
        style={{
          zIndex: 2,
          background:
            'linear-gradient(180deg, transparent, rgba(192,57,43,0.72) 50%, transparent)',
          filter: 'blur(1px)',
        }}
      />

      <div className="hidden sm:flex relative z-10 h-full items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-3xl flex-col items-center gap-8 text-center">
          <div
            className={`transition-all duration-700 ease-out ${
              visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <img
              src="/logo.svg"
              alt="തല്ലുകാലം"
              fetchPriority="high"
              draggable={false}
              style={{
                width: 'min(38vw, 520px)',
                filter:
                  'drop-shadow(0 0 34px rgba(201,162,39,0.72)) drop-shadow(0 8px 22px rgba(0,0,0,0.7))',
                animation: visible
                  ? 'logo-dance 3s cubic-bezier(0.4,0,0.6,1) 0.9s infinite'
                  : 'none',
              }}
            />
          </div>

          <div
            className={`flex flex-col items-center transition-all duration-700 ease-out ${
              btnReady ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <div className="intro-cta-shell">
              <div className="intro-cta-wave intro-cta-wave-left" aria-hidden="true">
                {CTA_WAVE_BARS.map((bar) => (
                  <span key={`desktop-left-${bar}`} style={{ animationDelay: `${bar * 0.12}s` }} />
                ))}
              </div>

              <div className="flex flex-col items-center">
                <div className="pointer-events-none mb-[-12px] h-[92px] w-[86px]">
                  {tapData && (
                    <Suspense fallback={<div className="h-[92px] w-[86px]" />}>
                      <Lottie animationData={tapData} loop autoplay style={{ width: '100%', height: '100%' }} />
                    </Suspense>
                  )}
                </div>

                <button
                  onClick={handleEnter}
                  disabled={ctaDisabled}
                  className="intro-cta-btn font-malayalam relative overflow-hidden disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="relative z-10">ആ കാലത്തിലേക്ക് പോകാം</span>
                </button>
              </div>

              <div className="intro-cta-wave intro-cta-wave-right" aria-hidden="true">
                {CTA_WAVE_BARS.map((bar) => (
                  <span key={`desktop-right-${bar}`} style={{ animationDelay: `${bar * 0.12 + 0.18}s` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden relative z-10 flex h-full flex-col items-center px-1 pt-1 pb-4">
        <div
          className={`w-[calc(100vw-0.35rem)] max-w-none transition-all duration-700 ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="relative mx-auto" style={{ aspectRatio: '1969 / 1634' }}>
            <div
              className="absolute overflow-hidden bg-black"
              style={MOBILE_FRAME_INSET}
            >
              <video
                className="h-full w-full object-cover"
                src={LANDING_VIDEO_SRC}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
              />
            </div>

            <img
              src="/PHOL.png"
              alt=""
              aria-hidden="true"
              className="relative z-10 h-full w-full object-contain pointer-events-none select-none"
              draggable={false}
            />
          </div>
        </div>

        <div
          className={`-mt-2 flex flex-col items-center transition-all duration-700 ease-out ${
            btnReady ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="intro-cta-shell">
            <div className="intro-cta-wave intro-cta-wave-left" aria-hidden="true">
              {CTA_WAVE_BARS.map((bar) => (
                <span key={`mobile-left-${bar}`} style={{ animationDelay: `${bar * 0.12}s` }} />
              ))}
            </div>

            <div className="flex flex-col items-center">
              <div className="pointer-events-none mb-[-12px] h-[84px] w-[78px]">
                {tapData && (
                  <Suspense fallback={<div className="h-[84px] w-[78px]" />}>
                    <Lottie animationData={tapData} loop autoplay style={{ width: '100%', height: '100%' }} />
                  </Suspense>
                )}
              </div>

              <button
                onClick={handleEnter}
                disabled={ctaDisabled}
                className="intro-cta-btn font-malayalam relative overflow-hidden disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="relative z-10">ആ കാലത്തിലേക്ക് പോകാം</span>
              </button>
            </div>

            <div className="intro-cta-wave intro-cta-wave-right" aria-hidden="true">
              {CTA_WAVE_BARS.map((bar) => (
                <span key={`mobile-right-${bar}`} style={{ animationDelay: `${bar * 0.12 + 0.18}s` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {showUnlockOverlay && (
        <div
          className={`absolute inset-0 z-30 flex items-center justify-center px-5 transition-all duration-300 ${
            unlockClosing ? 'scale-[0.98] opacity-0' : 'scale-100 opacity-100'
          }`}
          onClick={unlockAudio}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="absolute inset-0 bg-[rgba(4,6,9,0.76)] backdrop-blur-md" />

          <div className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-[#c9a227]/25 bg-[rgba(8,11,16,0.9)] px-6 py-9 text-center shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(201,162,39,0.65),transparent)]" />

            <div className="flex items-end justify-center gap-2" aria-hidden="true">
              {WAVE_BARS.map((bar) => (
                <span
                  key={bar}
                  className="audio-wave-bar"
                  style={{ animationDelay: `${bar * 0.11}s` }}
                />
              ))}
            </div>

            <img
              src="/logo.svg"
              alt="തല്ലുകാലം"
              className="mx-auto mt-8 w-[min(58vw,220px)]"
              draggable={false}
            />

            <div className="mt-7 flex items-center justify-center gap-3 text-[0.76rem] font-semibold uppercase tracking-[0.34em] text-[#f3e8c3]/80">
              <span className="h-px w-10 bg-[#c9a227]/35" />
              <span>TAP / SLIDE</span>
              <span className="h-px w-10 bg-[#c9a227]/35" />
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          zIndex: 2,
          height: 2,
          background:
            'linear-gradient(90deg,transparent,rgba(204,0,0,0.45) 28%,rgba(201,162,39,0.65) 50%,rgba(204,0,0,0.45) 72%,transparent)',
        }}
      />
    </div>
  )
}
