export interface CardData {
  id: number
  title: string        // "തമ്മിൽ തല്ലി" (editable)
  subtitle: string     // custom subtitle
  icon: string         // emoji
  thumbnail: string    // background image/GIF URL
  accentColor: string  // hex
  accentRgb: string    // "r,g,b"
  youtubeUrl: string   // YouTube video URL or ID
}

export const DEFAULT_CARDS: CardData[] = [
  {
    id: 1,
    title: 'തമ്മിൽ തല്ലി',
    subtitle: 'അന്നം മുടക്കിയ കാലം',
    icon: '🌾',
    thumbnail: '/banar_video/ffout016.gif',
    accentColor: '#C9A227',
    accentRgb: '201,162,39',
    youtubeUrl: '',
  },
  {
    id: 2,
    title: 'തമ്മിൽ തല്ലി',
    subtitle: 'വിദ്യാഭ്യാസം തുലച്ച കാലം',
    icon: '📚',
    thumbnail: '/banar_video/ffout048.gif',
    accentColor: '#4A7FC1',
    accentRgb: '74,127,193',
    youtubeUrl: '',
  },
  {
    id: 3,
    title: 'തമ്മിൽ തല്ലി',
    subtitle: 'ആരോഗ്യം തകർത്ത കാലം',
    icon: '🩺',
    thumbnail: '/banar_video/ffout080.gif',
    accentColor: '#C0392B',
    accentRgb: '192,57,43',
    youtubeUrl: '',
  },
  {
    id: 4,
    title: 'തമ്മിൽ തല്ലി',
    subtitle: 'പെൻഷൻ തരാത്ത കാലം',
    icon: '👴',
    thumbnail: '/banar_video/ffout112.gif',
    accentColor: '#27AE60',
    accentRgb: '39,174,96',
    youtubeUrl: '',
  },
  {
    id: 5,
    title: 'തമ്മിൽ തല്ലി',
    subtitle: 'വികസനം മുടക്കിയ കാലം',
    icon: '🏗️',
    thumbnail: '/banar_video/ffout144.gif',
    accentColor: '#E67E22',
    accentRgb: '230,126,34',
    youtubeUrl: '',
  },
  {
    id: 6,
    title: 'തമ്മിൽ തല്ലി',
    subtitle: 'തൊഴിലില്ലാതാക്കിയ കാലം',
    icon: '⚒️',
    thumbnail: '/banar_video/ffout176.gif',
    accentColor: '#9B59B6',
    accentRgb: '155,89,182',
    youtubeUrl: '',
  },
]

const STORAGE_KEY = 'thallikalam_cards_v1'

export function loadCards(): CardData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return DEFAULT_CARDS
}

export function saveCards(cards: CardData[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

/** Extract YouTube video ID from various URL formats or bare ID */
export function extractYouTubeId(url: string): string | null {
  if (!url || !url.trim()) return null
  const u = url.trim()
  const m = u.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (m) return m[1]
  if (/^[a-zA-Z0-9_-]{11}$/.test(u)) return u
  return null
}

export const ACCENT_PRESETS = [
  { label: 'Gold',   color: '#C9A227', rgb: '201,162,39' },
  { label: 'Blue',   color: '#4A7FC1', rgb: '74,127,193' },
  { label: 'Red',    color: '#C0392B', rgb: '192,57,43'  },
  { label: 'Green',  color: '#27AE60', rgb: '39,174,96'  },
  { label: 'Orange', color: '#E67E22', rgb: '230,126,34' },
  { label: 'Purple', color: '#9B59B6', rgb: '155,89,182' },
  { label: 'Teal',   color: '#16A085', rgb: '22,160,133' },
  { label: 'Pink',   color: '#E91E8C', rgb: '233,30,140' },
]

export const THUMBNAIL_OPTIONS = [
  '/banar_video/ffout016.gif',
  '/banar_video/ffout048.gif',
  '/banar_video/ffout080.gif',
  '/banar_video/ffout112.gif',
  '/banar_video/ffout144.gif',
  '/banar_video/ffout176.gif',
]
