import { useState, useEffect } from 'react'

// Small keycap chip used in the helm-controls popup
function KeyCap({ children, wide }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      minWidth: wide ? 'auto' : 26, height: 26, padding: wide ? '0 10px' : '0 6px',
      fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem', fontWeight: 500,
      color: '#dff4ff',
      background: 'rgba(0,180,216,0.16)',
      border: '1px solid rgba(0,210,240,0.5)',
      borderRadius: 5,
      boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.06)',
    }}>{children}</span>
  )
}

export function HeroOverlay({ onDive, gameRef }) {
  const [showControls, setShowControls] = useState(true)
  // Hide the editorial text while the helm challenge is being raced;
  // bring it back once the course is complete (or before the race starts).
  const [hideText, setHideText] = useState(false)
  useEffect(() => {
    if (!gameRef) return
    const iv = setInterval(() => {
      const g = gameRef.current
      setHideText(!!(g && g.engaged && !g.done))
    }, 120)
    return () => clearInterval(iv)
  }, [gameRef])

  const handleDive = () => {
    onDive?.()
    const target = document.getElementById('zone-1')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-end pointer-events-none">
      {/* Multi-layer vignette for text readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            'linear-gradient(to top, rgba(0,2,10,0.88) 0%, rgba(0,4,14,0.55) 28%, rgba(0,4,12,0.18) 55%, transparent 100%)',
            'linear-gradient(to right, rgba(0,2,10,0.52) 0%, rgba(0,2,10,0.18) 40%, transparent 70%)',
          ].join(', '),
        }}
      />

      {/* Text block — fades away while racing the helm challenge */}
      <div
        className="relative z-10"
        style={{
          padding: '0 clamp(2rem, 6vw, 7rem) 5rem',
          opacity: hideText ? 0 : 1,
          transform: hideText ? 'translateY(14px)' : 'translateY(0)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          pointerEvents: hideText ? 'none' : 'auto',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            marginBottom: '1.4rem',
          }}
        >
          <div style={{ width: 32, height: 1, background: 'rgba(201,168,76,0.7)' }} />
          <p style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.65rem',
            letterSpacing: '0.30em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.85)',
          }}>
            Digital Intimacy · ISU Research Paper · Grade 11 APS
          </p>
        </div>

        {/* Main title — strong text shadow ensures readability over any bg */}
        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(5rem, 13vw, 9.5rem)',
            fontWeight: 700,
            lineHeight: 0.88,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            textShadow: [
              '0 2px 24px rgba(0,0,0,0.9)',
              '0 8px 60px rgba(0,0,0,0.7)',
              '0 0 120px rgba(0,0,0,0.4)',
            ].join(', '),
            marginBottom: '1.4rem',
          }}
        >
          Digital<br />
          <em style={{ color: 'rgba(255,255,255,0.88)', fontWeight: 400 }}>Intimacy</em>
        </h1>

        {/* Subtitle lines */}
        <div style={{ marginBottom: '2.4rem', maxWidth: 'min(62ch, 96%)' }}>
          <p style={{
            fontFamily: '"Inter Tight", sans-serif',
            fontWeight: 300,
            fontSize: 'clamp(0.85rem, 1.4vw, 1.05rem)',
            letterSpacing: '0.06em',
            color: 'rgba(200,235,245,0.75)',
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            marginBottom: '0.3rem',
          }}>
            The Changing Culture of Sexual Activity Among High School Students and Its Social and Psychological Implications
          </p>
          <p style={{
            fontFamily: '"Inter Tight", sans-serif',
            fontWeight: 300,
            fontSize: '0.82rem',
            letterSpacing: '0.08em',
            color: 'rgba(150,190,210,0.55)',
            textShadow: '0 2px 8px rgba(0,0,0,0.8)',
          }}>
            Krethish Nirmalarajan · Founder of Project Paramount
          </p>
        </div>

        {/* CTA row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>

          {/* ── DESCEND BUTTON ── */}
          <button
            onClick={handleDive}
            className="descend-pulse"
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 44px',
              background: 'rgba(0,180,216,0.14)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(0,210,240,0.55)',
              borderRadius: '2px',
              cursor: 'pointer',
              // Glow
              boxShadow: [
                '0 0 20px rgba(0,180,216,0.25)',
                '0 0 60px rgba(0,180,216,0.10)',
                'inset 0 1px 0 rgba(255,255,255,0.08)',
              ].join(', '),
              transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0,200,230,0.24)'
              e.currentTarget.style.borderColor = 'rgba(0,230,255,0.80)'
              e.currentTarget.style.boxShadow = [
                '0 0 32px rgba(0,180,216,0.50)',
                '0 0 80px rgba(0,180,216,0.20)',
                'inset 0 1px 0 rgba(255,255,255,0.12)',
              ].join(', ')
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(0,180,216,0.14)'
              e.currentTarget.style.borderColor = 'rgba(0,210,240,0.55)'
              e.currentTarget.style.boxShadow = [
                '0 0 20px rgba(0,180,216,0.25)',
                '0 0 60px rgba(0,180,216,0.10)',
                'inset 0 1px 0 rgba(255,255,255,0.08)',
              ].join(', ')
            }}
          >
            <span style={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '0.72rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(200,240,255,0.95)',
              textShadow: '0 0 12px rgba(0,200,240,0.6)',
            }}>
              Descend
            </span>
            {/* Animated arrow */}
            <span style={{
              fontSize: '1.1rem',
              color: 'rgba(0,220,255,0.9)',
              textShadow: '0 0 10px rgba(0,200,240,0.8)',
              display: 'inline-block',
              animation: 'bounce-down 1.8s ease-in-out infinite',
            }}>↓</span>
          </button>

          <p style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.64rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(190,225,240,0.62)',
          }}>
            or scroll to dive
          </p>
        </div>
      </div>

      {/* ── Helm controls popup (states the arrow-key sailing feature) ── */}
      {showControls && !hideText && (
        <div
          className="controls-pop pointer-events-auto"
          style={{
            position: 'absolute',
            right: 'clamp(1.25rem, 4vw, 2.5rem)',
            top: 'clamp(6rem, 14vh, 8rem)',
            zIndex: 20,
            width: 'min(290px, 72vw)',
            padding: '1.1rem 1.2rem 1.2rem',
            background: 'rgba(3,12,24,0.62)',
            backdropFilter: 'blur(16px) saturate(150%)',
            WebkitBackdropFilter: 'blur(16px) saturate(150%)',
            border: '1px solid rgba(0,180,216,0.32)',
            borderRadius: 14,
            boxShadow: '0 18px 50px rgba(0,0,0,0.55), 0 0 36px rgba(0,180,216,0.08)',
          }}
        >
          <button
            onClick={() => setShowControls(false)}
            aria-label="Dismiss controls"
            style={{
              position: 'absolute', top: 8, right: 8, width: 26, height: 26,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 7, color: 'rgba(200,225,235,0.75)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1,
            }}
          >×</button>

          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.95rem',
          }}>
            <span aria-hidden="true" style={{ fontSize: '0.95rem' }}>🛥️</span>
            <span style={{
              fontFamily: '"JetBrains Mono", monospace', fontSize: '0.6rem',
              letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(0,210,240,0.9)',
            }}>Helm Controls</span>
          </div>

          {[
            { keys: ['↑', '↓'], label: 'Sail the yacht' },
            { keys: ['←', '→'], label: 'Steer' },
          ].map(({ keys, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.7rem' }}>
              <span style={{ display: 'inline-flex', gap: 4 }}>
                {keys.map(k => <KeyCap key={k}>{k}</KeyCap>)}
              </span>
              <span style={{
                fontFamily: '"Inter Tight", sans-serif', fontSize: '0.86rem', fontWeight: 400,
                color: 'rgba(214,236,246,0.92)',
              }}>{label}</span>
            </div>
          ))}

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0.5rem 0 0.8rem' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <KeyCap wide>Scroll</KeyCap>
            <span style={{
              fontFamily: '"Inter Tight", sans-serif', fontSize: '0.86rem', fontWeight: 400,
              color: 'rgba(214,236,246,0.92)',
            }}>Descend into the deep</span>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes bounce-down {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(4px); }
        }
        @keyframes controls-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .controls-pop { animation: controls-in 0.6s cubic-bezier(0.16,1,0.3,1) 0.5s both; }
        @media (prefers-reduced-motion: reduce) { .controls-pop { animation: none; } }
      `}</style>
    </div>
  )
}
