import { diveProgress } from './journey.js'

const LINKS = [
  { label: 'Descent',       href: '#zone-1' },
  { label: 'Mesopelagic',   href: '#zone-2' },
  { label: 'Midnight',      href: '#zone-3' },
  { label: 'Challenger',    href: '#zone-5' },
]

export function Navbar({ scrollProgress }) {
  const sp = scrollProgress
  const dp = diveProgress(sp) // 0 until the camera dives off the yacht
  const atm = Math.round(1 + dp * 1093)
  const depthM = Math.round(dp * 11034)
  const isDeep = sp > 0.04

  return (
    <nav
      style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        width: 'min(920px, calc(100vw - 40px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 28px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.09)',
        background: isDeep
          ? 'rgba(0,2,16,0.78)'
          : 'rgba(4,12,24,0.46)',
        backdropFilter: 'blur(18px) saturate(160%)',
        WebkitBackdropFilter: 'blur(18px) saturate(160%)',
        transition: 'background 0.6s ease',
      }}
    >
      {/* Wordmark */}
      <div style={{
        fontFamily: '"Playfair Display", serif',
        fontSize: '0.95rem',
        letterSpacing: '0.22em',
        color: '#e8f4f8',
        fontWeight: 600,
      }}>
        Digital{' '}
        <em style={{ color: 'rgba(201,168,76,0.92)', fontWeight: 400 }}>Intimacy</em>
      </div>

      {/* Links */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        {LINKS.map(({ label, href }) => (
          <a key={label} href={href} style={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: '0.66rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(130,170,190,0.7)',
            textDecoration: 'none',
            transition: 'color 0.25s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(200,240,255,0.95)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(130,170,190,0.7)' }}
          >
            {label}
          </a>
        ))}
      </div>

      {/* Depth readout */}
      <div style={{
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: '0.62rem',
        letterSpacing: '0.14em',
        color: dp === 0 ? 'rgba(150,200,220,0.7)' : 'rgba(0,210,240,0.8)',
        padding: '5px 12px',
        border: '1px solid rgba(0,180,216,0.22)',
        borderRadius: '20px',
        transition: 'color 0.5s ease',
      }}>
        {dp === 0
          ? (sp > 0.05 ? 'Aboard · 0m' : 'Surface · 0m')
          : `${depthM.toLocaleString()}m · ${atm} atm`}
      </div>
    </nav>
  )
}
