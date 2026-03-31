import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Self-hosted Anek Malayalam Variable font (condensed width axis) — no CDN dependency
import '@fontsource-variable/anek-malayalam/wdth.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
