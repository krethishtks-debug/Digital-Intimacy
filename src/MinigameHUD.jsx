import { useEffect, useState } from 'react'

const fmtTime = (s) => {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toFixed(1).padStart(4, '0')}`
}

// Compact scoreboard for the "helm challenge" — reads the shared game ref
// on a light interval so it never re-renders the 3D tree.
export function MinigameHUD({ gameRef }) {
  const [s, setS] = useState({ active: false, collected: 0, total: 8, elapsed: 0, done: false, started: false, speed: 0 })
  const [best, setBest] = useState(() => {
    const v = typeof localStorage !== 'undefined' ? localStorage.getItem('di_helm_best') : null
    return v ? +v : null
  })

  useEffect(() => {
    const iv = setInterval(() => {
      const g = gameRef.current
      if (g) setS({ active: g.active, collected: g.collected, total: g.total, elapsed: g.elapsed, done: g.done, started: g.started, speed: g.speed })
    }, 100)
    return () => clearInterval(iv)
  }, [gameRef])

  useEffect(() => {
    if (s.done && s.elapsed > 0 && (best == null || s.elapsed < best)) {
      try { localStorage.setItem('di_helm_best', String(s.elapsed)) } catch {}
      setBest(s.elapsed)
    }
  }, [s.done, s.elapsed, best])

  if (!s.active) return null

  const speedKn = Math.max(0, Math.round(s.speed * 1.45)) // 0–26 units ≈ 0–38 kn
  const remaining = s.total - s.collected

  return (
    <div style={{
      position: 'fixed', top: 'clamp(5.5rem, 13vh, 7.5rem)', left: 'clamp(1rem, 3vw, 1.6rem)',
      zIndex: 30, width: 'min(248px, 70vw)', pointerEvents: s.done ? 'auto' : 'none',
      padding: '0.95rem 1.05rem 1.05rem',
      background: 'rgba(3,12,24,0.62)',
      backdropFilter: 'blur(16px) saturate(150%)', WebkitBackdropFilter: 'blur(16px) saturate(150%)',
      border: '1px solid rgba(0,180,216,0.32)', borderRadius: 14,
      boxShadow: '0 16px 44px rgba(0,0,0,0.5), 0 0 30px rgba(0,180,216,0.07)',
      fontFamily: '"JetBrains Mono", monospace',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.85rem' }}>
        <span aria-hidden="true" style={{ fontSize: '0.95rem' }}>⛵</span>
        <span style={{ fontSize: '0.6rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: 'rgba(0,210,240,0.9)' }}>
          Helm Challenge
        </span>
      </div>

      {/* gate progress dots */}
      <div style={{ display: 'flex', gap: 5, marginBottom: '0.9rem', flexWrap: 'wrap' }}>
        {Array.from({ length: s.total }).map((_, i) => (
          <span key={i} style={{
            width: 14, height: 6, borderRadius: 3,
            background: i < s.collected ? 'rgba(0,224,255,0.9)' : 'rgba(255,255,255,0.12)',
            boxShadow: i < s.collected ? '0 0 8px rgba(0,210,240,0.7)' : 'none',
            transition: 'background 0.2s ease',
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <Stat label="Gates" value={`${s.collected}/${s.total}`} />
        <Stat label="Time" value={fmtTime(s.elapsed)} />
        <Stat label="Speed" value={`${speedKn}kn`} />
      </div>

      {!s.done && (
        <p style={{ fontFamily: '"Inter Tight", sans-serif', fontSize: '0.74rem', lineHeight: 1.5, color: 'rgba(190,222,238,0.78)', margin: '0.5rem 0 0' }}>
          {s.started
            ? `Steer through the glowing gates — ${remaining} to go.`
            : 'Sail into the cyan gate ahead to start the clock. ↑↓ throttle · ←→ steer.'}
        </p>
      )}

      {s.done && (
        <div style={{ marginTop: '0.6rem' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(120,230,180,0.95)', marginBottom: '0.25rem' }}>
            Course Complete
          </div>
          <div style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.5rem', color: '#eafff6', lineHeight: 1, marginBottom: '0.2rem' }}>
            {fmtTime(s.elapsed)}
          </div>
          {best != null && (
            <div style={{ fontSize: '0.6rem', color: 'rgba(160,200,220,0.7)', marginBottom: '0.7rem' }}>
              Best {fmtTime(best)}{s.elapsed <= best ? ' · new record!' : ''}
            </div>
          )}
          <button
            onClick={() => { gameRef.current.resetRequested = true }}
            style={{
              width: '100%', padding: '9px 12px', cursor: 'pointer',
              background: 'rgba(0,180,216,0.18)', border: '1px solid rgba(0,210,240,0.55)', borderRadius: 8,
              color: 'rgba(200,240,255,0.95)', fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.64rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            }}
          >↻ Race Again</button>
        </div>
      )}
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: '0.5rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(140,180,200,0.6)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: '0.86rem', color: '#dff4ff' }}>{value}</div>
    </div>
  )
}
