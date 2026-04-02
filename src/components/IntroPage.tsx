import { useEffect, useRef, useState, type TouchEvent } from 'react'
import { loadSocial, saveSocialLocal, type SocialLinks } from '../data/cards'
import VisitCounter from './VisitCounter'

interface Props {
  onEnter: () => void
  onAudioStart?: () => void
  onAudioUnlock?: () => void
}

const LANDING_VIDEO_SRC = '/Landing/landing.mp4'
const MOBILE_FRAME_INSET = {
  top: '25.8%',
  right: '25.1%',
  bottom: '30.8%',
  left: '25.6%',
}
const WAVE_BARS = [0, 1, 2, 3, 4, 5, 6]
const CTA_WAVE_BARS = [0, 1, 2, 3, 4]
const CTA_RIPPLES = [1, 2, 3]
const MOBILE_BOTTOM_WAVE_BARS = [
  14, 22, 34, 18, 12, 28, 42, 24, 16, 30, 20, 36,
  18, 26, 40, 22, 14, 32, 20, 38, 24, 16, 28,
]
const GH_SOCIAL = 'https://raw.githubusercontent.com/jithumeenara/Thallukalam/master/public/social-links.json'

function getIsMobile() {
  return window.matchMedia('(max-width: 639px)').matches
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

export default function IntroPage({ onEnter, onAudioStart, onAudioUnlock }: Props) {
  const [visible, setVisible] = useState(false)
  const [btnReady, setBtnReady] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [audioUnlocked, setAudioUnlocked] = useState(false)
  const [showUnlockOverlay, setShowUnlockOverlay] = useState(true)
  const [unlockClosing, setUnlockClosing] = useState(false)
  const [isMobile, setIsMobile] = useState(getIsMobile)
  const [social, setSocial] = useState<SocialLinks>(() => loadSocial())

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
    fetch(`${GH_SOCIAL}?t=${Date.now()}`)
      .then((response) => response.json())
      .then((data) => {
        if (!data || typeof data !== 'object') return
        setSocial(data as SocialLinks)
        saveSocialLocal(data as SocialLinks)
      })
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
  const socialLinks = [
    { key: 'instagram', url: social.instagram, icon: <InstagramIcon />, label: 'Instagram', color: '#E1306C' },
    { key: 'facebook', url: social.facebook, icon: <FacebookIcon />, label: 'Facebook', color: '#1877F2' },
    { key: 'youtube', url: social.youtube, icon: <YoutubeIcon />, label: 'YouTube', color: '#FF0000' },
  ].filter((item) => item.url)

  function renderCtaInner() {
    return (
      <>
        <span className="intro-cta-btn-main">
          <span className="intro-cta-btn-text">ആ കാലത്തിലേക്ക് പോകാം</span>
          <span className="intro-cta-indicator" aria-hidden="true">{'>>>'}</span>
        </span>

        {CTA_RIPPLES.map((ripple) => (
          <span key={ripple} className={`intro-cta-ripple intro-cta-ripple-${ripple}`} aria-hidden="true" />
        ))}

        <span className="intro-cta-hand" aria-hidden="true">👆</span>
      </>
    )
  }

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

      <div className="hidden sm:block absolute inset-x-0 bottom-0 z-10">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#05080b]/95 via-[#05080b]/62 to-transparent" />

        <div className="relative mx-auto flex w-full flex-col items-center px-6 pb-8 pt-24 text-center">
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
                width: 'min(36vw, 520px)',
                filter:
                  'drop-shadow(0 0 30px rgba(201,162,39,0.72)) drop-shadow(0 8px 22px rgba(0,0,0,0.75))',
                animation: visible
                  ? 'logo-dance 3s cubic-bezier(0.4,0,0.6,1) 0.9s infinite'
                  : 'none',
              }}
            />
          </div>

          <div
            className={`mt-10 flex flex-col items-center transition-all duration-700 ease-out ${
              btnReady ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <div className="intro-desktop-cta-line">
              <div className="intro-cta-wave intro-cta-wave-left" aria-hidden="true">
                {CTA_WAVE_BARS.map((bar) => (
                  <span key={`desktop-left-${bar}`} style={{ animationDelay: `${bar * 0.12}s` }} />
                ))}
              </div>

              <button
                onClick={handleEnter}
                disabled={ctaDisabled}
                className="intro-cta-btn font-malayalam relative disabled:cursor-not-allowed disabled:opacity-60"
              >
                {renderCtaInner()}
              </button>

              <div className="intro-cta-wave intro-cta-wave-right" aria-hidden="true">
                {CTA_WAVE_BARS.map((bar) => (
                  <span key={`desktop-right-${bar}`} style={{ animationDelay: `${bar * 0.12 + 0.18}s` }} />
                ))}
              </div>
            </div>
          </div>

          <div
            className={`absolute transition-all duration-700 ease-out ${
              btnReady ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
            style={{
              right: 'clamp(24px, 4vw, 72px)',
              bottom: 'clamp(18px, 3vh, 34px)',
            }}
          >
            <VisitCounter variant="desktop" />
          </div>
        </div>
      </div>

      <div className="sm:hidden relative z-10 flex h-full flex-col items-center px-0 pt-6 pb-28">
        <div
          className={`intro-mobile-frame-wrap w-full transition-all duration-700 ease-out ${
            visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div
            className="intro-mobile-frame-shell relative mx-auto"
            style={{ width: 'min(118vw, 640px)', aspectRatio: '1969 / 1634' }}
          >
            <img
              src="/PHOL.png"
              alt=""
              aria-hidden="true"
              className="intro-mobile-frame-blur absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
              draggable={false}
            />
            <div
              className="intro-mobile-video-window absolute overflow-hidden bg-black"
              style={MOBILE_FRAME_INSET}
            >
              <video
                className="h-full w-full object-cover object-center"
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
          className={`-mt-12 flex flex-col items-center transition-all duration-700 ease-out ${
            btnReady ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="intro-cta-shell intro-mobile-cta-shell">
            <div className="flex flex-col items-center">
              <button
                onClick={handleEnter}
                disabled={ctaDisabled}
                className="intro-cta-btn font-malayalam relative disabled:cursor-not-allowed disabled:opacity-60"
              >
                {renderCtaInner()}
              </button>
            </div>
          </div>

          {socialLinks.length > 0 && (
            <div className="intro-mobile-social-row">
              {socialLinks.map((item) => (
                <a
                  key={item.key}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="intro-mobile-social-btn"
                  style={{ ['--intro-social-color' as string]: item.color }}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          )}

          <div className="mt-7 w-full px-4">
            <VisitCounter variant="mobile" />
          </div>
        </div>

        <div className="intro-mobile-bottom-wave-rail" aria-hidden="true">
          <div className="intro-mobile-bottom-wave">
            {MOBILE_BOTTOM_WAVE_BARS.map((height, index) => (
              <span
                key={`mobile-bottom-wave-${index}`}
                style={{
                  ['--intro-mobile-wave-height' as string]: `${height}px`,
                  animationDelay: `${(index % 8) * 0.11}s`,
                }}
              />
            ))}
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
