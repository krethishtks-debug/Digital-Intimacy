export function HeroOverlay({ onDive }) {
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

      {/* Text block */}
      <div
        className="relative z-10 pointer-events-auto"
        style={{ padding: '0 clamp(2rem, 6vw, 7rem) 5rem' }}
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
        <div style={{ marginBottom: '2.4rem' }}>
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
              outline: 'none',
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
            fontSize: '0.60rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(150,190,210,0.35)',
          }}>
            Scroll to dive
          </p>
        </div>
      </div>

      {/* Bounce arrow animation */}
      <style>{`
        @keyframes bounce-down {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(4px); }
        }
      `}</style>
    </div>
  )
}
