export default function Footer() {
  return (
    <footer className="relative bg-cinema-bg border-t border-cinema-border/25 font-malayalam overflow-hidden">

      {/* Scanline */}
      <div className="scanline-overlay" />

      {/* Noise */}
      <div className="noise-overlay opacity-[0.025]" />

      {/* Ambient bottom red glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-40 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at bottom, rgba(139,26,26,0.18) 0%, transparent 70%)' }}
      />

      {/* Ambient top gold glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-24 pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse at top, rgba(201,162,39,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 flex flex-col items-center gap-7 text-center">

        {/* Logo */}
        <div
          className="w-[min(260px,56vw)] opacity-75 hover:opacity-100 transition-opacity duration-500"
          style={{ filter: 'drop-shadow(0 0 30px rgba(201,162,39,0.28))' }}
        >
          <img
            src="/logo.svg"
            alt="തല്ലുകാലം"
            className="w-full h-auto"
            draggable={false}
          />
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-3 opacity-35 w-full max-w-xs">
          <div className="flex-1 gold-line" />
          <div className="w-2 h-2 rotate-45 bg-cinema-red/70" />
          <div className="flex-1 gold-line" />
        </div>

        {/* Main footer text */}
        <p
          className="font-semibold leading-snug text-red-gradient"
          style={{
            fontSize:      'clamp(1.4rem, 4.5vw, 2.1rem)',
            letterSpacing: '0.02em',
          }}
        >
          ഇനി വേണ്ട ആ നശിച്ച കാലം
        </p>

        {/* Full-width divider */}
        <div
          className="w-full h-px mt-2"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(42,48,64,0.6), transparent)' }}
        />

        {/* Copyright */}
        <p
          className="text-cinema-border/40 tracking-widest uppercase"
          style={{ fontSize: '0.65rem', letterSpacing: '0.22em' }}
        >
          © 2024 &nbsp;·&nbsp; തല്ലുകാലം &nbsp;·&nbsp; All Rights Reserved
        </p>
      </div>
    </footer>
  )
}
