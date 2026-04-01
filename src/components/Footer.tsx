import { useEffect, useState } from 'react'
import { loadSocial, saveSocialLocal, SocialLinks } from '../data/cards'

const GH_SOCIAL = 'https://raw.githubusercontent.com/jithumeenara/Thallukalam/master/public/social-links.json'

async function fetchRemoteSocial(): Promise<SocialLinks | null> {
  try {
    const res = await fetch(`${GH_SOCIAL}?t=${Date.now()}`)
    if (res.ok) {
      const data = await res.json()
      if (data && typeof data === 'object') return data
    }
  } catch {}
  return null
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

export default function Footer() {
  const [social, setSocial] = useState<SocialLinks>(() => loadSocial())

  useEffect(() => {
    fetchRemoteSocial().then(remote => {
      if (remote) { setSocial(remote); saveSocialLocal(remote) }
    })
  }, [])

  const links = [
    { key: 'instagram', url: social.instagram, icon: <InstagramIcon />, label: 'Instagram', color: '#E1306C', hover: 'rgba(225,48,108,0.18)' },
    { key: 'facebook',  url: social.facebook,  icon: <FacebookIcon />,  label: 'Facebook',  color: '#1877F2', hover: 'rgba(24,119,242,0.18)' },
    { key: 'youtube',   url: social.youtube,   icon: <YoutubeIcon />,   label: 'YouTube',   color: '#FF0000', hover: 'rgba(255,0,0,0.18)' },
  ]

  const activeSocial = links.filter(l => l.url)

  return (
    <footer className="relative bg-cinema-bg border-t border-cinema-border/25 font-malayalam overflow-hidden">

      <div className="scanline-overlay" />
      <div className="noise-overlay opacity-[0.025]" />

      {/* Ambient glows */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-40 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at bottom, rgba(139,26,26,0.18) 0%, transparent 70%)' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-24 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at top, rgba(201,162,39,0.07) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

        {/* ── Row: [spacer] Logo (center) Social Icons (right) ── */}
        <div className="flex items-center mb-6 w-full">

          {/* Left spacer — matches social icons width so logo stays centered */}
          <div className="flex-1" />

          {/* Logo — centered */}
          <div className="opacity-75 hover:opacity-100 transition-opacity duration-500 flex-shrink-0"
            style={{ width: 'min(200px, 44vw)', filter: 'drop-shadow(0 0 24px rgba(201,162,39,0.28))' }}
          >
            <img src="/logo.svg" alt="തല്ലുകാലം" className="w-full h-auto block" draggable={false} />
          </div>

          {/* Social Icons — right */}
          <div className="flex-1 flex items-center justify-end gap-3">
            {activeSocial.map(l => (
              <a
                key={l.key}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={l.label}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-cinema-border/30 transition-all duration-300 hover:scale-110"
                style={{ color: 'rgba(201,162,39,0.55)' }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = l.color
                  el.style.background = l.hover
                  el.style.borderColor = l.color
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement
                  el.style.color = 'rgba(201,162,39,0.55)'
                  el.style.background = ''
                  el.style.borderColor = 'rgba(42,48,64,0.3)'
                }}
              >
                {l.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-3 opacity-30 mb-6">
          <div className="flex-1 gold-line" />
          <div className="w-2 h-2 rotate-45 bg-cinema-red/70" />
          <div className="flex-1 gold-line" />
        </div>

        {/* Main footer text */}
        <p className="font-semibold leading-snug text-red-gradient text-center mb-5"
          style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', letterSpacing: '0.02em' }}
        >
          ഇനി വേണ്ട ആ നശിച്ച കാലം
        </p>

        {/* Ownership text */}
        <p className="text-center tracking-wide"
          style={{ fontSize: '1rem', color: '#8c6060' }}
        >
          Site owned by CPI(M) Thiruvananthapuram District Committee
        </p>

      </div>
    </footer>
  )
}
