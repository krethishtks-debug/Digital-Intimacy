import { diveProgress } from './journey.js'

const ZONES = [
  { name: 'Surface',            depth: '0m' },
  { name: 'Epipelagic Zone',    depth: '0–200m' },
  { name: 'Mesopelagic Zone',   depth: '200–1,000m' },
  { name: 'Bathypelagic Zone',  depth: '1,000–4,000m' },
  { name: 'Abyssopelagic Zone', depth: '4,000–6,000m' },
  { name: 'Challenger Deep',    depth: '6,000–11,034m' },
  { name: 'Ascending',          depth: 'Decompressing' },
]

// Dive-progress thresholds for each zone, tuned to the content positions
const ZONE_AT = [0, 0.09, 0.195, 0.29, 0.385, 0.64]

export function HUD({ scrollProgress }) {
  const sp = scrollProgress
  const dp = diveProgress(sp) // 0 until the camera leaves the yacht
  let zi = 0
  if (dp > 0) {
    zi = 1
    for (let k = 1; k < ZONE_AT.length; k++) if (dp >= ZONE_AT[k]) zi = k + 1
    zi = Math.min(zi, 6)
  }
  const zone = ZONES[zi]
  const atm = Math.round(1 + dp * 1093)

  // Gauge color shifts from cyan → purple → red as depth increases
  const gaugeHue = Math.round(180 - dp * 180)
  const gaugeColor = `hsl(${gaugeHue}, 90%, 62%)`

  return (
    <>
      {/* ── Pressure gauge (left side) ── */}
      <div style={{
        position: 'fixed', left: 16, top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 20,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.58rem', letterSpacing: '0.20em',
          color: 'rgba(100,150,170,0.6)',
          textTransform: 'uppercase',
        }}>atm</div>

        {/* Bar */}
        <div style={{
          width: 5, height: 180,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 3,
          border: '1px solid rgba(255,255,255,0.07)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, width: '100%',
            height: `${dp * 100}%`,
            background: `linear-gradient(to top, #d62828, #e76f51 35%, #7209b7 65%, ${gaugeColor} 100%)`,
            boxShadow: `0 0 8px ${gaugeColor}55`,
            transition: 'height 0.3s ease, box-shadow 0.3s ease',
            borderRadius: 3,
          }} />
        </div>

        {/* Value */}
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.58rem',
          color: `${gaugeColor}99`,
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          letterSpacing: '0.12em',
        }}>
          {atm}
        </div>
      </div>

      {/* ── Zone indicator (right side) ── */}
      <div style={{
        position: 'fixed', right: 16, top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 20,
        textAlign: 'right',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.64rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(170,220,240,0.75)',
          transition: 'color 0.5s ease',
          lineHeight: 1.4,
        }}>
          {zone.name}
        </div>
        <div style={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: '0.58rem',
          letterSpacing: '0.14em',
          color: 'rgba(100,150,170,0.5)',
          marginTop: 3,
        }}>
          {zone.depth}
        </div>

        {/* Tick marks */}
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
          {ZONES.slice(0, 6).map((z, i) => (
            <div key={i} style={{
              width: i === zi ? 20 : 10,
              height: 1,
              background: i === zi
                ? 'rgba(0,210,240,0.8)'
                : 'rgba(255,255,255,0.15)',
              transition: 'width 0.4s ease, background 0.4s ease',
              borderRadius: 1,
            }} />
          ))}
        </div>
      </div>
    </>
  )
}
