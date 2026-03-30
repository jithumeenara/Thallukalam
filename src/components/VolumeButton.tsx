interface Props {
  isMuted:      boolean
  onToggle:     () => void
}

export default function VolumeButton({ isMuted, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      className="vol-btn group"
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      title={isMuted ? 'Unmute' : 'Mute'}
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Speaker body — always visible */}
        <path
          d="M3 8H7L12 4V18L7 14H3V8Z"
          fill="rgba(201,162,39,0.85)"
          stroke="rgba(201,162,39,0.6)"
          strokeWidth="0.5"
        />

        {isMuted ? (
          /* ── Muted: red X marks ── */
          <g stroke="#C0392B" strokeWidth="1.8" strokeLinecap="round">
            <line x1="14" y1="8"  x2="19" y2="13" />
            <line x1="19" y1="8"  x2="14" y2="13" />
          </g>
        ) : (
          /* ── Unmuted: animated sound waves ── */
          <g>
            {/* Wave 1 — closest, shortest */}
            <path
              d="M14 9.5 C15 10.2 15 11.8 14 12.5"
              stroke="rgba(201,162,39,0.9)"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              style={{
                transformOrigin: '14px 11px',
                animation: 'vol-wave-1 0.8s ease-in-out infinite',
              }}
            />
            {/* Wave 2 — medium */}
            <path
              d="M16 7.5 C18.2 8.8 18.2 13.2 16 14.5"
              stroke="rgba(201,162,39,0.7)"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
              style={{
                transformOrigin: '16px 11px',
                animation: 'vol-wave-2 0.8s ease-in-out 0.15s infinite',
              }}
            />
            {/* Wave 3 — outermost, faintest */}
            <path
              d="M18.2 5.5 C21.5 7.5 21.5 14.5 18.2 16.5"
              stroke="rgba(201,162,39,0.45)"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
              style={{
                transformOrigin: '18px 11px',
                animation: 'vol-wave-3 0.8s ease-in-out 0.3s infinite',
              }}
            />
          </g>
        )}
      </svg>

      {/* Ripple glow on hover */}
      <span
        className="absolute inset-0 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle, rgba(201,162,39,0.15) 0%, transparent 70%)',
        }}
      />
    </button>
  )
}
