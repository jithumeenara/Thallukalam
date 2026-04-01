export interface CardData {
  id: number
  title: string
  title2: string
  subtitle: string
  icon: string
  thumbnail: string
  accentColor: string
  accentRgb: string
  youtubeUrl: string
}

export const DEFAULT_CARDS: CardData[] = [
  { id: 1, title: 'തമ്മിൽ തല്ലി', title2: 'തല്ലുകാർ വന്നാൽ', subtitle: 'അന്നം മുടക്കിയ കാലം',        icon: '🌾',  thumbnail: '/banar_video/ffout016.gif', accentColor: '#C9A227', accentRgb: '201,162,39', youtubeUrl: '' },
  { id: 2, title: 'തമ്മിൽ തല്ലി', title2: 'തല്ലുകാർ വന്നാൽ', subtitle: 'വിദ്യാഭ്യാസം തുലച്ച കാലം', icon: '📚',  thumbnail: '/banar_video/ffout048.gif', accentColor: '#4A7FC1', accentRgb: '74,127,193',  youtubeUrl: '' },
  { id: 3, title: 'തമ്മിൽ തല്ലി', title2: 'തല്ലുകാർ വന്നാൽ', subtitle: 'ആരോഗ്യം തകർത്ത കാലം',      icon: '🩺',  thumbnail: '/banar_video/ffout080.gif', accentColor: '#C0392B', accentRgb: '192,57,43',   youtubeUrl: '' },
  { id: 4, title: 'തമ്മിൽ തല്ലി', title2: 'തല്ലുകാർ വന്നാൽ', subtitle: 'പെൻഷൻ തരാത്ത കാലം',         icon: '👴',  thumbnail: '/banar_video/ffout112.gif', accentColor: '#27AE60', accentRgb: '39,174,96',   youtubeUrl: '' },
  { id: 5, title: 'തമ്മിൽ തല്ലി', title2: 'തല്ലുകാർ വന്നാൽ', subtitle: 'വികസനം മുടക്കിയ കാലം',       icon: '🏗️', thumbnail: '/banar_video/ffout144.gif', accentColor: '#E67E22', accentRgb: '230,126,34',  youtubeUrl: '' },
  { id: 6, title: 'തമ്മിൽ തല്ലി', title2: 'തല്ലുകാർ വന്നാൽ', subtitle: 'തൊഴിലില്ലാതാക്കിയ കാലം',    icon: '⚒️', thumbnail: '/banar_video/ffout176.gif', accentColor: '#9B59B6', accentRgb: '155,89,182',  youtubeUrl: '' },
]

// ── localStorage (local cache) ─────────────────────────────────────────────
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

export function saveCardsLocal(cards: CardData[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

// ── GitHub (permanent, shared across all devices) ──────────────────────────
export const GH_OWNER    = 'jithumeenara'
export const GH_REPO     = 'Thallukalam'
export const GH_FILE     = 'public/cards-data.json'
export const GH_TOKEN_KEY = 'thallikalam_gh_token'

/** Fetch the latest cards data — reads directly from GitHub raw (instant, no rebuild wait) */
export async function fetchRemoteCards(): Promise<CardData[] | null> {
  // Primary: GitHub raw URL — updates instantly after admin saves (no Vercel rebuild needed)
  try {
    const ghRaw = `https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/master/${GH_FILE}?t=${Date.now()}`
    const res = await fetch(ghRaw)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) return data
    }
  } catch {}
  // Fallback: Vercel-served static file
  try {
    const res = await fetch(`/cards-data.json?t=${Date.now()}`)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) return data
    }
  } catch {}
  return null
}

/** Commit updated cards JSON to GitHub → triggers Vercel redeploy */
export async function saveCardsToGitHub(
  token: string,
  cards: CardData[]
): Promise<void> {
  const apiBase = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_FILE}`

  // Strip base64 images > 100KB to keep the JSON file manageable in git
  const sanitised = cards.map(c => ({
    ...c,
    thumbnail: c.thumbnail.startsWith('data:') && c.thumbnail.length > 100_000
      ? DEFAULT_CARDS.find(d => d.id === c.id)?.thumbnail ?? DEFAULT_CARDS[0].thumbnail
      : c.thumbnail,
  }))

  // Get current file SHA (required for updates)
  const metaRes = await fetch(apiBase, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })
  if (!metaRes.ok) {
    const e = await metaRes.json().catch(() => ({}))
    throw new Error((e as { message?: string }).message || `GitHub read failed (${metaRes.status})`)
  }
  const meta = await metaRes.json() as { sha: string }

  // Encode JSON as base64 (handles Malayalam Unicode correctly)
  const jsonStr = JSON.stringify(sanitised, null, 2)
  const bytes   = new TextEncoder().encode(jsonStr)
  let binary    = ''
  bytes.forEach(b => (binary += String.fromCharCode(b)))
  const content = btoa(binary)

  const putRes = await fetch(apiBase, {
    method: 'PUT',
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Update cards data via admin panel',
      content,
      sha: meta.sha,
    }),
  })

  if (!putRes.ok) {
    const e = await putRes.json().catch(() => ({}))
    throw new Error((e as { message?: string }).message || `GitHub write failed (${putRes.status})`)
  }

  // Mirror to localStorage as local cache
  saveCardsLocal(sanitised)
}

/** Verify a token can read the repo */
export async function testGitHubToken(token: string): Promise<void> {
  const res = await fetch(
    `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${GH_FILE}`,
    {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )
  if (!res.ok) {
    const e = await res.json().catch(() => ({}))
    throw new Error((e as { message?: string }).message || `Token error (${res.status})`)
  }
}

// ── Social Links ───────────────────────────────────────────────────────────
export interface SocialLinks {
  instagram: string
  facebook: string
  youtube: string
}

const SOCIAL_KEY = 'thallikalam_social_v1'

export const DEFAULT_SOCIAL: SocialLinks = {
  instagram: '',
  facebook: '',
  youtube: '',
}

export function loadSocial(): SocialLinks {
  try {
    const raw = localStorage.getItem(SOCIAL_KEY)
    if (raw) return { ...DEFAULT_SOCIAL, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_SOCIAL
}

export function saveSocialLocal(s: SocialLinks): void {
  localStorage.setItem(SOCIAL_KEY, JSON.stringify(s))
}

// ── Helpers ────────────────────────────────────────────────────────────────
export function extractYouTubeId(url: string): string | null {
  if (!url?.trim()) return null
  const u = url.trim()
  const m = u.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
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
