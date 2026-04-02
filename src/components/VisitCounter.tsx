import { useEffect, useRef, useState } from 'react'

const COUNT_API_ENDPOINT = '/api/ga-visits'
const VISIT_CACHE_KEY = 'thallikalam_ga_visit_cache_v1'
const REFRESH_INTERVAL_MS = 30000
const COUNT_ANIMATION_MS = 1400

type Variant = 'desktop' | 'mobile'
type CounterStatus = 'loading' | 'ready' | 'error' | 'setup'

interface VisitCountResponse {
  value: number
}

interface ApiError extends Error {
  code?: string
}

function getCachedCount() {
  try {
    const raw = localStorage.getItem(VISIT_CACHE_KEY)
    const value = Number(raw)
    return Number.isFinite(value) && value > 0 ? value : 0
  } catch {
    return 0
  }
}

function setCachedCount(value: number) {
  try {
    localStorage.setItem(VISIT_CACHE_KEY, String(value))
  } catch {}
}

async function fetchVisitCount(signal?: AbortSignal) {
  const response = await fetch(COUNT_API_ENDPOINT, {
    signal,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  })

  const data = await response.json().catch(() => null) as { value?: number; error?: string; code?: string } | null

  if (!response.ok) {
    const error = new Error(data?.error || `Visit count request failed (${response.status})`) as ApiError
    error.code = data?.code
    throw error
  }

  if (!data || typeof data.value !== 'number' || !Number.isFinite(data.value)) {
    throw new Error('Visit count response missing numeric value')
  }

  return data as VisitCountResponse
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-IN').format(Math.max(0, Math.round(value)))
}

function animateCount(
  from: number,
  to: number,
  onFrame: (value: number) => void,
) {
  const start = performance.now()
  let frameId = 0

  const tick = (now: number) => {
    const progress = Math.min((now - start) / COUNT_ANIMATION_MS, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const value = Math.round(from + (to - from) * eased)

    onFrame(value)

    if (progress < 1) {
      frameId = window.requestAnimationFrame(tick)
    }
  }

  frameId = window.requestAnimationFrame(tick)
  return () => window.cancelAnimationFrame(frameId)
}

export default function VisitCounter({ variant }: { variant: Variant }) {
  const [status, setStatus] = useState<CounterStatus>('loading')
  const [displayCount, setDisplayCount] = useState(0)

  const targetCountRef = useRef(0)
  const displayCountRef = useRef(0)

  useEffect(() => {
    displayCountRef.current = displayCount
  }, [displayCount])

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    const updateCount = (nextCount: number) => {
      targetCountRef.current = nextCount

      const stopAnimation = animateCount(displayCountRef.current, nextCount, (value) => {
        displayCountRef.current = value
        if (!cancelled) setDisplayCount(value)
      })

      return stopAnimation
    }

    let stopAnimation = () => {}

    async function syncInitialCount() {
      try {
        const { value } = await fetchVisitCount(controller.signal)
        if (cancelled) return

        setCachedCount(value)
        setStatus('ready')
        stopAnimation()
        stopAnimation = updateCount(value)
      } catch (error) {
        if (cancelled) return

        const typedError = error as ApiError
        if (typedError.code === 'CONFIG_ERROR') {
          setStatus('setup')
          return
        }

        const cachedCount = getCachedCount()
        if (cachedCount > 0) {
          setStatus('ready')
          stopAnimation()
          stopAnimation = updateCount(cachedCount)
          return
        }

        setStatus('error')
      }
    }

    async function refreshCount() {
      try {
        const { value } = await fetchVisitCount(controller.signal)
        setCachedCount(value)
        if (cancelled || value === targetCountRef.current) return

        setStatus('ready')
        stopAnimation()
        stopAnimation = updateCount(value)
      } catch (error) {
        const typedError = error as ApiError
        if (!cancelled && typedError.code === 'CONFIG_ERROR') {
          setStatus('setup')
        }
      }
    }

    syncInitialCount()

    const intervalId = window.setInterval(refreshCount, REFRESH_INTERVAL_MS)

    return () => {
      cancelled = true
      controller.abort()
      window.clearInterval(intervalId)
      stopAnimation()
    }
  }, [])

  const isLoading = status === 'loading'
  const isError = status === 'error'
  const isSetup = status === 'setup'

  return (
    <section
      className={`visit-counter visit-counter--${variant} ${isLoading ? 'is-loading' : ''} ${isError ? 'is-error' : ''} ${isSetup ? 'is-setup' : ''}`}
      aria-live="polite"
    >
      <div className="visit-counter__glow" aria-hidden="true" />

      <div className="visit-counter__head">
        <span className="visit-counter__eyebrow">TOTAL VISITS</span>
        <span className="visit-counter__status">
          {isSetup ? 'setup' : isError ? 'offline' : isLoading ? 'loading' : 'ga4'}
        </span>
      </div>

      <div className="visit-counter__value-row">
        <span className="visit-counter__value">
          {isSetup || isError ? '--' : formatCount(displayCount)}
        </span>
      </div>

      <p className="visit-counter__caption">
        {isSetup
          ? 'Set GA4 server credentials in Vercel'
          : isError
            ? 'Google Analytics unavailable right now'
            : 'Google Analytics page views for this landing page'}
      </p>
    </section>
  )
}
