/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinema: {
          bg:     '#0B0F14',
          deep:   '#070A0D',
          gold:   '#C9A227',
          gold2:  '#F0C040',
          red:    '#8B1A1A',
          red2:   '#C0392B',
          ash:    '#1A1F26',
          border: '#2A3040',
        },
      },
      fontFamily: {
        malayalam: ['"Anek Malayalam Variable"', 'sans-serif'],
      },
      keyframes: {
        'logo-enter': {
          '0%':   { transform: 'scale(0.3)', opacity: '0', filter: 'blur(20px) brightness(3)' },
          '60%':  { transform: 'scale(1.08)', opacity: '0.9', filter: 'blur(0px) brightness(1.5)' },
          '80%':  { transform: 'scale(0.97)', opacity: '1', filter: 'blur(0px) brightness(1)' },
          '100%': { transform: 'scale(1)',    opacity: '1', filter: 'blur(0px) brightness(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px 4px rgba(201,162,39,0.3)' },
          '50%':      { boxShadow: '0 0 60px 16px rgba(201,162,39,0.7)' },
        },
        'lightning': {
          '0%, 90%, 100%':      { opacity: '0' },
          '91%, 93%, 95%, 97%': { opacity: '0.85' },
          '92%, 94%, 96%':      { opacity: '0' },
        },
        'lightning-2': {
          '0%, 85%, 100%':      { opacity: '0' },
          '86%, 88%, 90%, 92%': { opacity: '0.7' },
          '87%, 89%, 91%':      { opacity: '0' },
        },
        'dust-float': {
          '0%':   { transform: 'translateY(0px) translateX(0px)', opacity: '0' },
          '20%':  { opacity: '0.6' },
          '80%':  { opacity: '0.3' },
          '100%': { transform: 'translateY(-120px) translateX(40px)', opacity: '0' },
        },
        'card-smash': {
          '0%':   { transform: 'scale(1.03)' },
          '20%':  { transform: 'scale(1.06) rotate(-1.5deg)' },
          '40%':  { transform: 'scale(1.04) rotate(0.8deg)' },
          '60%':  { transform: 'scale(1.05) rotate(-0.5deg)' },
          '80%':  { transform: 'scale(1.05) rotate(0.2deg)' },
          '100%': { transform: 'scale(1.05) rotate(0deg)' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '33%':      { opacity: '0.94' },
          '66%':      { opacity: '0.97' },
        },
        'btn-glow': {
          '0%, 100%': { boxShadow: '0 0 12px 2px rgba(139,26,26,0.5), inset 0 0 12px rgba(139,26,26,0.2)' },
          '50%':      { boxShadow: '0 0 30px 8px rgba(192,57,43,0.8), inset 0 0 20px rgba(192,57,43,0.35)' },
        },
        'spin-slow': {
          'from': { transform: 'rotate(0deg)' },
          'to':   { transform: 'rotate(360deg)' },
        },
        'slide-in': {
          '0%':   { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%':   { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'logo-float': {
          '0%, 100%': {
            transform: 'translateY(0px) scale(1)',
            filter: 'drop-shadow(0 0 28px rgba(201,162,39,0.5)) drop-shadow(0 0 55px rgba(139,26,26,0.25))',
          },
          '50%': {
            transform: 'translateY(-12px) scale(1.018)',
            filter: 'drop-shadow(0 0 60px rgba(201,162,39,0.9)) drop-shadow(0 0 100px rgba(139,26,26,0.45))',
          },
        },
        'logo-dance': {
          '0%':    { transform: 'translateY(0px) rotate(0deg) scale(1)',        filter: 'drop-shadow(0 0 22px rgba(201,162,39,0.45))' },
          '8%':    { transform: 'translateY(-14px) rotate(-2.5deg) scale(1.04)', filter: 'drop-shadow(0 0 55px rgba(201,162,39,0.85))' },
          '16%':   { transform: 'translateY(-6px) rotate(2deg) scale(1.02)',    filter: 'drop-shadow(0 0 35px rgba(201,162,39,0.6))' },
          '26%':   { transform: 'translateY(-20px) rotate(-1.5deg) scale(1.06)', filter: 'drop-shadow(0 0 70px rgba(201,162,39,0.95))' },
          '36%':   { transform: 'translateY(-9px) rotate(3deg) scale(1.03)',    filter: 'drop-shadow(0 0 45px rgba(139,26,26,0.7))' },
          '46%':   { transform: 'translateY(-17px) rotate(-2deg) scale(1.05)',  filter: 'drop-shadow(0 0 60px rgba(201,162,39,0.85))' },
          '56%':   { transform: 'translateY(-5px) rotate(1.5deg) scale(1.02)',  filter: 'drop-shadow(0 0 32px rgba(201,162,39,0.55))' },
          '66%':   { transform: 'translateY(-15px) rotate(-3deg) scale(1.045)', filter: 'drop-shadow(0 0 52px rgba(201,162,39,0.8))' },
          '76%':   { transform: 'translateY(-4px) rotate(2deg) scale(1.01)',    filter: 'drop-shadow(0 0 26px rgba(201,162,39,0.5))' },
          '88%':   { transform: 'translateY(-11px) rotate(-1deg) scale(1.025)', filter: 'drop-shadow(0 0 42px rgba(201,162,39,0.7))' },
          '100%':  { transform: 'translateY(0px) rotate(0deg) scale(1)',        filter: 'drop-shadow(0 0 22px rgba(201,162,39,0.45))' },
        },
        'crack-reveal': {
          '0%':   { opacity: '0', transform: 'scaleY(0)', transformOrigin: 'top' },
          '60%':  { opacity: '1', transform: 'scaleY(1.05)', transformOrigin: 'top' },
          '100%': { opacity: '1', transform: 'scaleY(1)',    transformOrigin: 'top' },
        },
        'vol-wave-1': {
          '0%, 100%': { transform: 'scaleY(0.3)', transformOrigin: 'center' },
          '50%':      { transform: 'scaleY(1)',   transformOrigin: 'center' },
        },
        'vol-wave-2': {
          '0%, 100%': { transform: 'scaleY(0.6)', transformOrigin: 'center' },
          '30%':      { transform: 'scaleY(1)',   transformOrigin: 'center' },
          '70%':      { transform: 'scaleY(0.2)', transformOrigin: 'center' },
        },
        'vol-wave-3': {
          '0%, 100%': { transform: 'scaleY(0.8)', transformOrigin: 'center' },
          '20%':      { transform: 'scaleY(0.2)', transformOrigin: 'center' },
          '60%':      { transform: 'scaleY(1)',   transformOrigin: 'center' },
        },
      },
      animation: {
        'logo-enter':    'logo-enter 1.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'logo-float':    'logo-float 3.2s ease-in-out infinite',
        'glow-pulse':    'glow-pulse 2.5s ease-in-out infinite',
        'lightning':     'lightning 6s linear infinite',
        'lightning-2':   'lightning-2 8s linear 2.5s infinite',
        'dust-float':    'dust-float 4s ease-in-out infinite',
        'card-smash':    'card-smash 0.35s ease-out forwards',
        'fade-up':       'fade-up 0.9s ease-out forwards',
        'flicker':       'flicker 4s ease-in-out infinite',
        'btn-glow':      'btn-glow 2s ease-in-out infinite',
        'spin-slow':     'spin-slow 8s linear infinite',
        'logo-dance':    'logo-dance 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'crack-reveal':  'crack-reveal 0.4s cubic-bezier(0.22,1,0.36,1) forwards',
        'vol-wave-1':    'vol-wave-1 0.8s ease-in-out infinite',
        'vol-wave-2':    'vol-wave-2 0.8s ease-in-out 0.15s infinite',
        'vol-wave-3':    'vol-wave-3 0.8s ease-in-out 0.3s infinite',
      },
    },
  },
  plugins: [],
}
