import { useState } from 'react'

interface CardData {
  id: number
  title: string
  subtitle: string
  icon: string
  frame: string       // background GIF frame from banar_video
  accentColor: string
  accentRgb: string
}

const CARDS: CardData[] = [
  {
    id: 1,
    title: 'തമ്മിൽ തല്ലി',
    subtitle: 'അന്നം മുടക്കിയ കാലം',
    icon: '🌾',
    frame: '/banar_video/ffout016.gif',
    accentColor: '#C9A227',
    accentRgb: '201,162,39',
  },
  {
    id: 2,
    title: 'തമ്മിൽ തല്ലി',
    subtitle: 'വിദ്യാഭ്യാസം തുലച്ച കാലം',
    icon: '📚',
    frame: '/banar_video/ffout048.gif',
    accentColor: '#4A7FC1',
    accentRgb: '74,127,193',
  },
  {
    id: 3,
    title: 'തമ്മിൽ തല്ലി',
    subtitle: 'ആരോഗ്യം തകർത്ത കാലം',
    icon: '🩺',
    frame: '/banar_video/ffout080.gif',
    accentColor: '#C0392B',
    accentRgb: '192,57,43',
  },
  {
    id: 4,
    title: 'തമ്മിൽ തല്ലി',
    subtitle: 'പെൻഷൻ തരാത്ത കാലം',
    icon: '👴',
    frame: '/banar_video/ffout112.gif',
    accentColor: '#27AE60',
    accentRgb: '39,174,96',
  },
  {
    id: 5,
    title: 'തമ്മിൽ തല്ലി',
    subtitle: 'വികസനം മുടക്കിയ കാലം',
    icon: '🏗️',
    frame: '/banar_video/ffout144.gif',
    accentColor: '#E67E22',
    accentRgb: '230,126,34',
  },
  {
    id: 6,
    title: 'തമ്മിൽ തല്ലി',
    subtitle: 'തൊഴിലില്ലാതാക്കിയ കാലം',
    icon: '⚒️',
    frame: '/banar_video/ffout176.gif',
    accentColor: '#9B59B6',
    accentRgb: '155,89,182',
  },
]

// Crack SVG paths — ground fracture radiating downward from card bottom
function CrackSvg({ color, accentRgb }: { color: string; accentRgb: string }) {
  return (
    <svg
      className="crack-svg w-full h-full"
      viewBox="0 0 400 55"
      fill="none"
      preserveAspectRatio="none"
      style={{ color }}
    >
      {/* Main left crack */}
      <path
        d="M200,2 L184,16 L193,14 L174,38 L186,34 L165,55"
        stroke={`rgba(${accentRgb},0.9)`}
        strokeWidth="1.8"
      />
      {/* Main right crack */}
      <path
        d="M200,2 L216,16 L207,14 L226,38 L214,34 L235,55"
        stroke={`rgba(${accentRgb},0.9)`}
        strokeWidth="1.8"
      />
      {/* Left branch crack */}
      <path
        d="M184,12 L165,26 L175,24 L152,48"
        stroke={`rgba(${accentRgb},0.65)`}
        strokeWidth="1.2"
      />
      {/* Right branch crack */}
      <path
        d="M216,12 L235,26 L225,24 L248,48"
        stroke={`rgba(${accentRgb},0.65)`}
        strokeWidth="1.2"
      />
      {/* Micro crack left */}
      <path
        d="M178,22 L162,40"
        stroke={`rgba(${accentRgb},0.45)`}
        strokeWidth="0.9"
      />
      {/* Micro crack right */}
      <path
        d="M222,22 L238,40"
        stroke={`rgba(${accentRgb},0.45)`}
        strokeWidth="0.9"
      />
      {/* Tiny splinters */}
      <path
        d="M188,6 L178,18"
        stroke={`rgba(${accentRgb},0.5)`}
        strokeWidth="0.8"
      />
      <path
        d="M212,6 L222,18"
        stroke={`rgba(${accentRgb},0.5)`}
        strokeWidth="0.8"
      />
    </svg>
  )
}

interface CardProps {
  card: CardData
  index: number
}

function Card({ card, index }: CardProps) {
  const [hovered, setHovered] = useState(false)
  const [crackKey, setCrackKey] = useState(0)

  function handleMouseEnter() {
    setHovered(true)
    setCrackKey(k => k + 1)  // remount crack SVG to restart draw animation
  }

  return (
    /* Outer wrapper — overflow visible so crack extends below card */
    <div
      className="relative"
      style={{ paddingBottom: '2rem' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Inner card ── */}
      <div
        className={`
          relative overflow-hidden cursor-pointer select-none
          border transition-all duration-300 ease-out
          ${hovered ? 'card-active scale-[1.03]' : 'scale-100'}
        `}
        style={{
          minHeight: '200px',
          borderColor: hovered ? `rgba(${card.accentRgb},0.65)` : 'rgba(42,48,64,0.45)',
          boxShadow: hovered
            ? `0 12px 48px -8px rgba(${card.accentRgb},0.5), 0 0 0 1px rgba(${card.accentRgb},0.25)`
            : '0 2px 20px rgba(0,0,0,0.6)',
          animationDelay: `${index * 0.08}s`,
          animationFillMode: 'both',
          backgroundImage: `url(${card.frame})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* ── Dark overlay over GIF background ── */}
        <div
          className="absolute inset-0 card-bg-overlay transition-opacity duration-300"
          style={{ opacity: hovered ? 0.82 : 0.88 }}
        />

        {/* ── Accent radial glow on hover ── */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(ellipse at 30% 45%, rgba(${card.accentRgb},0.2) 0%, transparent 60%)`,
          }}
        />

        {/* ── Top accent bar ── */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none transition-all duration-300"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${card.accentColor} 50%, transparent 100%)`,
            opacity: hovered ? 1 : 0.4,
            boxShadow: hovered ? `0 0 16px 4px rgba(${card.accentRgb},0.7)` : 'none',
          }}
        />

        {/* ── Scanline ── */}
        <div className="scanline-overlay opacity-25" />

        {/* ── Card content ── */}
        <div className="relative z-10 p-5 sm:p-6 h-full flex flex-col gap-3">

          {/* Icon */}
          <div
            className="text-[2.4rem] leading-none transition-all duration-300 ease-out"
            style={{ transform: hovered ? 'scale(1.25) rotate(-10deg)' : 'scale(1) rotate(0deg)' }}
            aria-hidden="true"
          >
            {card.icon}
          </div>

          {/* Text */}
          <div>
            <p
              className="text-[0.72rem] tracking-[0.2em] uppercase mb-1.5 transition-colors duration-300"
              style={{ color: hovered ? card.accentColor : 'rgba(212,197,160,0.55)' }}
            >
              {card.title}
            </p>
            <h3
              className="font-semibold leading-snug text-[#e0d5b8] tracking-wide"
              style={{
                fontSize: 'clamp(0.95rem, 1.8vw, 1.12rem)',
                textShadow: hovered
                  ? `0 0 24px rgba(${card.accentRgb},0.7), 0 2px 8px rgba(0,0,0,0.8)`
                  : '0 2px 6px rgba(0,0,0,0.7)',
                transition: 'text-shadow 0.3s ease',
              }}
            >
              {card.subtitle}
            </h3>
          </div>

          {/* Bottom slide bar */}
          <div
            className="absolute bottom-0 left-0 h-[3px] transition-all duration-500 ease-out pointer-events-none"
            style={{
              width: hovered ? '100%' : '0%',
              background: `linear-gradient(90deg, ${card.accentColor}, transparent)`,
              boxShadow: hovered ? `0 0 8px 2px rgba(${card.accentRgb},0.5)` : 'none',
            }}
          />
        </div>
      </div>

      {/* ── Crack effect below card ── */}
      <div
        key={crackKey}
        className={`absolute bottom-0 left-0 right-0 h-8 pointer-events-none overflow-visible ${hovered ? 'crack-active' : ''}`}
        style={{
          opacity: hovered ? 1 : 0,
          transition: hovered ? 'none' : 'opacity 0.3s ease',
          zIndex: 30,
        }}
      >
        <CrackSvg color={card.accentColor} accentRgb={card.accentRgb} />
      </div>
    </div>
  )
}

export default function CardsGrid() {
  return (
    <section className="relative py-20 px-4 sm:px-6 bg-cinema-deep font-malayalam overflow-hidden">

      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-cinema-bg to-cinema-deep pointer-events-none z-10" />

      <div className="noise-overlay opacity-[0.025]" />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Section heading */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="w-16 sm:w-28 gold-line" />
            <div
              className="w-2.5 h-2.5 rotate-45 bg-cinema-red"
              style={{ boxShadow: '0 0 10px 3px rgba(139,26,26,0.6)' }}
            />
            <div className="w-16 sm:w-28 gold-line" />
          </div>
          <p
            className="text-[clamp(1rem,2.2vw,1.3rem)] tracking-wider"
            style={{ color: 'rgba(201,162,39,0.75)', fontWeight: 500 }}
          >
            തമ്മിൽ തല്ലി നാട് കുട്ടിച്ചോറാക്കിയ കാലം
          </p>
        </div>

        {/* Grid — extra bottom padding so crack SVGs are visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5" style={{ paddingBottom: '1rem' }}>
          {CARDS.map((card, i) => (
            <Card key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* Bottom separator */}
        <div className="mt-12 flex items-center gap-4 justify-center opacity-30">
          <div className="flex-1 max-w-xs gold-line" />
          <div className="w-1.5 h-1.5 rotate-45 bg-cinema-gold/50" />
          <div className="flex-1 max-w-xs gold-line" />
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cinema-bg to-cinema-deep pointer-events-none z-10" />
    </section>
  )
}
