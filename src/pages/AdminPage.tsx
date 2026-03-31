import { useState } from 'react'
import {
  loadCards, saveCards, CardData,
  extractYouTubeId, ACCENT_PRESETS, THUMBNAIL_OPTIONS,
} from '../data/cards'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'ElectionThallukaalam2026'
const SESSION_KEY = 'thallikalam_admin'

// ── Helpers ────────────────────────────────────────────────────────────────

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === '1'
}

function emptyCard(id: number): CardData {
  return {
    id,
    title: 'തമ്മിൽ തല്ലി',
    subtitle: '',
    icon: '🎬',
    thumbnail: THUMBNAIL_OPTIONS[0],
    accentColor: '#C9A227',
    accentRgb: '201,162,39',
    youtubeUrl: '',
  }
}

// ── Login ──────────────────────────────────────────────────────────────────

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err,  setErr]  = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onLogin()
    } else {
      setErr('Invalid username or password.')
    }
  }

  return (
    <div className="min-h-screen bg-cinema-bg flex items-center justify-center px-4 font-malayalam">
      <div className="w-full max-w-sm">
        {/* Logo area */}
        <div className="text-center mb-8">
          <img src="/logo.svg" alt="തല്ലുകാലം" className="h-16 mx-auto mb-3 opacity-90" />
          <h1 className="text-cinema-gold text-lg tracking-[0.2em] uppercase font-semibold">
            Admin Panel
          </h1>
          <div className="gold-line mt-2 max-w-[120px] mx-auto" />
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-cinema-deep border border-cinema-border/50 p-6 rounded-sm shadow-2xl"
          style={{ boxShadow: '0 0 40px rgba(201,162,39,0.08)' }}
        >
          <div className="mb-4">
            <label className="block text-cinema-gold/70 text-xs tracking-widest uppercase mb-1.5">
              Username
            </label>
            <input
              type="text"
              value={user}
              onChange={e => setUser(e.target.value)}
              className="admin-input"
              autoComplete="username"
              required
            />
          </div>

          <div className="mb-5">
            <label className="block text-cinema-gold/70 text-xs tracking-widest uppercase mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              className="admin-input"
              autoComplete="current-password"
              required
            />
          </div>

          {err && (
            <p className="text-red-400 text-sm mb-4 text-center">{err}</p>
          )}

          <button type="submit" className="admin-btn-primary w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Card Edit Modal ────────────────────────────────────────────────────────

interface EditModalProps {
  card: CardData
  onSave: (card: CardData) => void
  onClose: () => void
}

function EditModal({ card, onSave, onClose }: EditModalProps) {
  const [draft, setDraft] = useState<CardData>({ ...card })
  const [ytErr, setYtErr] = useState('')

  function set<K extends keyof CardData>(key: K, val: CardData[K]) {
    setDraft(d => ({ ...d, [key]: val }))
  }

  function handleAccent(preset: typeof ACCENT_PRESETS[0]) {
    setDraft(d => ({ ...d, accentColor: preset.color, accentRgb: preset.rgb }))
  }

  function handleSave() {
    if (!draft.subtitle.trim()) return
    if (draft.youtubeUrl && !extractYouTubeId(draft.youtubeUrl)) {
      setYtErr('Invalid YouTube URL. Paste the full link from YouTube.')
      return
    }
    setYtErr('')
    onSave(draft)
  }

  const ytPreview = extractYouTubeId(draft.youtubeUrl)

  return (
    <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto font-malayalam">
      <div className="w-full max-w-lg bg-cinema-deep border border-cinema-border/60 my-6 rounded-sm shadow-2xl">
        {/* Top bar */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-cinema-gold to-transparent" />

        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-cinema-gold font-semibold text-base tracking-wider">
              {card.id === 0 ? '+ New Card' : 'Edit Card'}
            </h2>
            <button onClick={onClose} className="text-cinema-border hover:text-white text-xl leading-none">✕</button>
          </div>

          {/* Icon */}
          <label className="admin-label">Icon (emoji)</label>
          <input
            type="text"
            value={draft.icon}
            onChange={e => set('icon', e.target.value)}
            className="admin-input mb-4"
            placeholder="🎬"
          />

          {/* Main Title */}
          <label className="admin-label">Main Title</label>
          <input
            type="text"
            value={draft.title}
            onChange={e => set('title', e.target.value)}
            className="admin-input mb-4"
            placeholder="തമ്മിൽ തല്ലി"
          />

          {/* Subtitle */}
          <label className="admin-label">Subtitle *</label>
          <input
            type="text"
            value={draft.subtitle}
            onChange={e => set('subtitle', e.target.value)}
            className="admin-input mb-4"
            placeholder="e.g. അന്നം മുടക്കിയ കാലം"
            required
          />

          {/* YouTube URL */}
          <label className="admin-label">YouTube Video URL</label>
          <input
            type="text"
            value={draft.youtubeUrl}
            onChange={e => { set('youtubeUrl', e.target.value); setYtErr('') }}
            className="admin-input mb-1"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {ytErr && <p className="text-red-400 text-xs mb-2">{ytErr}</p>}
          {ytPreview && (
            <div className="mb-4 mt-2 rounded overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <img
                src={`https://img.youtube.com/vi/${ytPreview}/mqdefault.jpg`}
                alt="YouTube thumbnail"
                className="w-full h-full object-cover"
              />
              <p className="text-green-400 text-xs mt-1">✓ Valid YouTube video</p>
            </div>
          )}
          {!ytPreview && <div className="mb-4" />}

          {/* Thumbnail */}
          <label className="admin-label">Card Background Thumbnail</label>
          <input
            type="text"
            value={draft.thumbnail}
            onChange={e => set('thumbnail', e.target.value)}
            className="admin-input mb-2"
            placeholder="https://... or leave default"
          />
          <div className="flex gap-2 flex-wrap mb-4">
            {THUMBNAIL_OPTIONS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => set('thumbnail', t)}
                className={`w-12 h-8 rounded border overflow-hidden ${draft.thumbnail === t ? 'border-cinema-gold' : 'border-cinema-border/40'}`}
                title={t}
              >
                <img src={t} className="w-full h-full object-cover" alt="" />
              </button>
            ))}
          </div>

          {/* Accent Color */}
          <label className="admin-label">Accent Color</label>
          <div className="flex gap-2 flex-wrap mb-5">
            {ACCENT_PRESETS.map(p => (
              <button
                key={p.color}
                type="button"
                onClick={() => handleAccent(p)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${draft.accentColor === p.color ? 'border-white scale-110' : 'border-transparent'}`}
                style={{ background: p.color }}
                title={p.label}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={handleSave} className="admin-btn-primary flex-1">
              Save Card
            </button>
            <button onClick={onClose} className="admin-btn-ghost flex-1">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Admin Panel ────────────────────────────────────────────────────────────

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [cards, setCards] = useState<CardData[]>(() => loadCards())
  const [editing, setEditing] = useState<CardData | null>(null)
  const [saved, setSaved] = useState(false)

  function handleSaveCard(updated: CardData) {
    setCards(prev => {
      const idx = prev.findIndex(c => c.id === updated.id)
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = updated
        return next
      }
      return [...prev, updated]
    })
    setEditing(null)
  }

  function handleDelete(id: number) {
    if (!window.confirm('Delete this card?')) return
    setCards(prev => prev.filter(c => c.id !== id))
  }

  function handleAddNew() {
    const nextId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1
    setEditing(emptyCard(nextId))
  }

  function handleSaveAll() {
    saveCards(cards)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const ytId = (url: string) => extractYouTubeId(url)

  return (
    <div className="min-h-screen bg-cinema-bg font-malayalam">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-cinema-deep border-b border-cinema-border/40 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="h-8 opacity-80" />
            <div>
              <p className="text-cinema-gold text-sm font-semibold tracking-wider leading-none">Admin Panel</p>
              <p className="text-cinema-border/60 text-xs">തല്ലുകാലം</p>
            </div>
          </div>
          <button onClick={onLogout} className="admin-btn-ghost text-sm px-3 py-1.5">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button onClick={handleAddNew} className="admin-btn-primary">
            + Add New Card
          </button>
          <button onClick={handleSaveAll} className="admin-btn-save">
            {saved ? '✓ Saved!' : '💾 Save All Changes'}
          </button>
          {saved && (
            <span className="text-green-400 text-sm">
              Changes saved to this browser.
            </span>
          )}
        </div>

        {/* Cards list */}
        <div className="space-y-3">
          {cards.map((card, idx) => (
            <div
              key={card.id}
              className="bg-cinema-deep border border-cinema-border/40 rounded-sm overflow-hidden"
              style={{ borderLeft: `3px solid ${card.accentColor}` }}
            >
              <div className="flex items-center gap-3 p-3">
                {/* Thumbnail */}
                <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-black">
                  <img
                    src={ytId(card.youtubeUrl)
                      ? `https://img.youtube.com/vi/${ytId(card.youtubeUrl)}/mqdefault.jpg`
                      : card.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[#f0e8cc] font-black text-sm leading-tight truncate">
                    {card.title}
                  </p>
                  <p className="text-cinema-gold/80 text-xs truncate">{card.subtitle || '—'}</p>
                  <p className={`text-xs mt-0.5 ${ytId(card.youtubeUrl) ? 'text-green-400' : 'text-cinema-border/50'}`}>
                    {ytId(card.youtubeUrl) ? '▶ YouTube linked' : 'No video'}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                  {idx > 0 && (
                    <button
                      onClick={() => setCards(prev => { const a = [...prev]; [a[idx-1], a[idx]] = [a[idx], a[idx-1]]; return a })}
                      className="admin-btn-icon" title="Move up"
                    >↑</button>
                  )}
                  {idx < cards.length - 1 && (
                    <button
                      onClick={() => setCards(prev => { const a = [...prev]; [a[idx], a[idx+1]] = [a[idx+1], a[idx]]; return a })}
                      className="admin-btn-icon" title="Move down"
                    >↓</button>
                  )}
                  <button onClick={() => setEditing(card)} className="admin-btn-icon text-cinema-gold">✎</button>
                  <button onClick={() => handleDelete(card.id)} className="admin-btn-icon text-red-400">✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cards.length === 0 && (
          <div className="text-center py-12 text-cinema-border/40">
            <p className="text-lg mb-2">No cards yet</p>
            <p className="text-sm">Click "+ Add New Card" to get started</p>
          </div>
        )}

        {/* Save button (bottom) */}
        <div className="mt-6 pt-4 border-t border-cinema-border/20">
          <button onClick={handleSaveAll} className="admin-btn-save w-full sm:w-auto">
            {saved ? '✓ All Changes Saved!' : '💾 Save All Changes'}
          </button>
          <p className="text-cinema-border/40 text-xs mt-2">
            Changes are saved to this browser. Reload the main page to see updates.
          </p>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <EditModal
          card={editing}
          onSave={handleSaveCard}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

// ── Main export ────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn)

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY)
    setLoggedIn(false)
  }

  return loggedIn
    ? <AdminPanel onLogout={handleLogout} />
    : <LoginForm onLogin={() => setLoggedIn(true)} />
}
