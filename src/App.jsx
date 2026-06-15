import { useRef, useState, useEffect, Suspense } from 'react'
import { Scene3D } from './Scene3D.jsx'
import { HeroOverlay } from './HeroOverlay.jsx'
import { ContentZones, BIBLIOGRAPHY } from './ContentZones.jsx'
import { Navbar } from './Navbar.jsx'
import { HUD } from './HUD.jsx'
import { MinigameHUD } from './MinigameHUD.jsx'

// ─── Floating toggle: immersive ↔ teacher/static view ───────────
function ViewToggle({ teacher, onToggle, onPrint }) {
  const btn = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '0.62rem', letterSpacing: '0.16em', textTransform: 'uppercase',
    padding: '9px 16px', borderRadius: 8, cursor: 'pointer',
    background: 'rgba(4,12,24,0.72)', backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(0,180,216,0.45)', color: 'rgba(200,240,255,0.92)',
    boxShadow: '0 6px 22px rgba(0,0,0,0.45)', transition: 'all 0.2s ease',
  }
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 100, display: 'flex', gap: 8 }}>
      {teacher && (
        <button style={btn} onClick={onPrint}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,40,60,0.85)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(4,12,24,0.72)' }}
        >🖨 Print / PDF</button>
      )}
      <button style={btn} onClick={onToggle}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,230,255,0.8)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,180,216,0.45)' }}
      >{teacher ? '✕ Exit Teacher View' : '📄 Teacher View'}</button>
    </div>
  )
}

// ─── Plain header shown at the top of the teacher/static document ──
function TeacherHeader() {
  return (
    <header style={{
      padding: 'clamp(4rem,9vh,6rem) clamp(2rem,6vw,7rem) 2rem',
      borderBottom: '1px solid rgba(0,180,216,0.18)',
    }}>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: '0.64rem',
        letterSpacing: '0.28em', textTransform: 'uppercase',
        color: 'rgba(201,168,76,0.85)', marginBottom: '1.2rem',
      }}>
        HSP 3U · ISU · Teacher / Static Reading View
      </div>
      <h1 style={{
        fontFamily: '"Playfair Display", Georgia, serif',
        fontSize: 'clamp(2.6rem, 7vw, 4.6rem)', fontWeight: 700,
        lineHeight: 0.95, letterSpacing: '-0.02em', color: '#ffffff', marginBottom: '1.2rem',
      }}>
        Digital <em style={{ fontWeight: 400, color: 'rgba(255,255,255,0.88)' }}>Intimacy</em>
      </h1>
      <p style={{
        fontFamily: '"Inter Tight", sans-serif', fontWeight: 300,
        fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)', lineHeight: 1.6,
        color: 'rgba(205,232,244,0.85)', maxWidth: 720, marginBottom: '0.8rem',
      }}>
        The Changing Culture of Sexual Activity Among High School Students and Its Social and Psychological Implications
      </p>
      <p style={{
        fontFamily: '"Inter Tight", sans-serif', fontWeight: 300, fontSize: '0.85rem',
        letterSpacing: '0.06em', color: 'rgba(150,190,210,0.7)', marginBottom: '1.6rem',
      }}>
        Krethish Nirmalarajan · Founder of Project Paramount
      </p>
      <p style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: '0.62rem',
        letterSpacing: '0.06em', lineHeight: 1.7, color: 'rgba(140,180,200,0.6)', maxWidth: 720,
      }}>
        This is the static reading version: every interactive research card, the case-study
        timeline, and all sources are expanded inline — nothing is hidden behind clicks or
        animation. To export a PDF, use Print and enable "Background graphics."
      </p>
    </header>
  )
}

// ─── Sky citations overlay (the "reverse whirlpool" destination) ──
function CitationsOverlay({ flight, onReturn, bibliography }) {
  if (flight === 'none') return null
  const inSky = flight === 'sky'
  const transition = flight === 'launch' || flight === 'descend'
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 160, pointerEvents: inSky ? 'auto' : 'none', overflow: 'hidden' }}>
      {/* mood / legibility vignette */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: inSky
          ? 'radial-gradient(ellipse at 50% 36%, rgba(2,10,22,0) 28%, rgba(2,8,20,0.8) 100%)'
          : 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 20%, rgba(0,4,12,0.62) 100%)',
        transition: 'background 0.6s ease',
      }} />

      {/* whirlpool (launch) / dive rings (descend) */}
      {transition && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} className={flight === 'launch' ? 'whirl-ring' : 'dive-ring'} style={{ animationDelay: `${i * 0.16}s` }} />
          ))}
          <div style={{
            position: 'absolute', bottom: '13%',
            fontFamily: '"JetBrains Mono", monospace', fontSize: '0.7rem', letterSpacing: '0.4em',
            textTransform: 'uppercase', color: 'rgba(190,225,240,0.85)',
          }}>{flight === 'launch' ? 'Surfacing' : 'Diving'}</div>
        </div>
      )}

      {/* citations panel — fades in once in the sky */}
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 'clamp(1.5rem,4vw,3rem)',
        opacity: inSky ? 1 : 0,
        transform: inSky ? 'translateY(0)' : 'translateY(22px)',
        transition: 'opacity 0.8s ease 0.15s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s',
        pointerEvents: inSky ? 'auto' : 'none',
      }}>
        <div style={{
          width: 'min(760px, 100%)', maxHeight: '82vh', display: 'flex', flexDirection: 'column',
          background: 'rgba(4,14,28,0.5)', backdropFilter: 'blur(18px) saturate(150%)', WebkitBackdropFilter: 'blur(18px) saturate(150%)',
          border: '1px solid rgba(120,200,180,0.3)', borderRadius: 18,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 50px rgba(82,183,136,0.1)', overflow: 'hidden',
        }}>
          <div style={{ padding: '1.4rem 1.8rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.6rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(130,220,180,0.85)', marginBottom: '0.5rem' }}>
              Above the Surface · {bibliography.length} Sources
            </div>
            <h2 style={{ fontFamily: '"Playfair Display", serif', fontSize: 'clamp(1.6rem,3.5vw,2.4rem)', fontWeight: 700, color: '#eafff6', lineHeight: 1 }}>
              Bibliography
            </h2>
          </div>
          <div style={{ padding: '1.4rem 1.8rem', overflowY: 'auto' }}>
            {bibliography.map((entry, i) => (
              <p key={i} style={{
                fontFamily: '"Inter Tight", sans-serif', fontSize: '0.88rem', fontWeight: 400,
                lineHeight: 1.7, color: 'rgba(212,234,228,0.88)',
                marginBottom: '0.95rem', paddingLeft: '1.4rem', textIndent: '-1.4rem',
              }}>{entry}</p>
            ))}
          </div>
          <div style={{ padding: '1.1rem 1.8rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'center' }}>
            <button onClick={onReturn} style={{
              display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 30px', cursor: 'pointer',
              background: 'linear-gradient(180deg, rgba(0,180,216,0.3), rgba(0,180,216,0.12))',
              border: '1px solid rgba(0,210,240,0.6)', borderRadius: 10, color: '#eafdff',
              fontFamily: '"JetBrains Mono", monospace', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              boxShadow: '0 0 22px rgba(0,180,216,0.25)',
            }}>
              <span aria-hidden="true">↓</span> Dive Back to the Sea
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .whirl-ring, .dive-ring {
          position: absolute; width: 42vmin; height: 42vmin; border-radius: 50%;
          border: 1px solid rgba(120,210,235,0.5);
          box-shadow: 0 0 30px rgba(0,180,216,0.25), inset 0 0 30px rgba(0,180,216,0.15);
        }
        .whirl-ring { animation: whirl 1.6s cubic-bezier(0.3,0,0.5,1) infinite; }
        .dive-ring  { animation: dive  1.6s cubic-bezier(0.3,0,0.5,1) infinite; }
        @keyframes whirl {
          0%   { transform: scale(0.15) rotate(0deg);   opacity: 0; }
          25%  { opacity: 0.8; }
          100% { transform: scale(2.2) rotate(220deg);  opacity: 0; }
        }
        @keyframes dive {
          0%   { transform: scale(2.2) rotate(0deg);    opacity: 0; }
          25%  { opacity: 0.8; }
          100% { transform: scale(0.15) rotate(-220deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .whirl-ring, .dive-ring { animation-duration: 0.01ms; }
        }
      `}</style>
    </div>
  )
}

// ─── Water-on-the-lens splash during hard turns ──────────────
function SplashFX({ gameRef }) {
  const [s, setS] = useState({ intensity: 0, side: 'right' })
  const drops = useRef(Array.from({ length: 22 }).map(() => {
    const w = 10 + Math.random() * 34
    return {
      left: Math.random() * 100, top: Math.random() * 78,
      w, h: w * (1.1 + Math.random() * 0.7), // slightly teardrop
      delay: Math.random() * 1.4, dur: 0.9 + Math.random() * 1.2,
    }
  })).current

  useEffect(() => {
    const iv = setInterval(() => {
      const g = gameRef.current
      const next = { intensity: g && g.active ? (g.turn || 0) : 0, side: g?.turnSide || 'right' }
      setS(prev => (prev.intensity === next.intensity && prev.side === next.side) ? prev : next)
    }, 90)
    return () => clearInterval(iv)
  }, [gameRef])

  const o = Math.min(1, s.intensity * 1.45)
  return (
    <div aria-hidden="true" style={{
      position: 'fixed', inset: 0, zIndex: 45, pointerEvents: 'none', overflow: 'hidden',
      opacity: o, transition: 'opacity 0.35s ease',
    }}>
      {/* directional spray sheet from the side you're turning toward */}
      <div style={{
        position: 'absolute', inset: 0, filter: 'blur(2px)',
        background: s.side === 'left'
          ? 'linear-gradient(to right, rgba(206,228,238,0.24), rgba(206,228,238,0.05) 26%, transparent 48%)'
          : 'linear-gradient(to left, rgba(206,228,238,0.24), rgba(206,228,238,0.05) 26%, transparent 48%)',
      }} />
      {/* droplets clinging to and dripping down the lens */}
      {drops.map((d, i) => {
        const onSide = s.side === 'left' ? d.left < 56 : d.left > 44
        if (!onSide) return null
        return <span key={i} style={{
          position: 'absolute', left: `${d.left}%`, top: `${d.top}%`, width: d.w, height: d.h,
          borderRadius: '48% 48% 50% 50% / 42% 42% 58% 58%',
          background: 'radial-gradient(ellipse at 42% 28%, rgba(255,255,255,0.52), rgba(206,228,240,0.16) 55%, transparent 74%)',
          boxShadow: 'inset 0 -1px 8px rgba(255,255,255,0.25)', filter: 'blur(0.6px)',
          animation: `splash-drip ${d.dur}s ease-in ${d.delay}s infinite`,
        }} />
      })}
      <style>{`
        @keyframes splash-drip {
          0%   { opacity: 0;    transform: translateY(-8px) scale(0.65); }
          16%  { opacity: 0.95; transform: translateY(0) scale(1); }
          68%  { opacity: 0.7; }
          100% { opacity: 0;    transform: translateY(52px) scaleY(1.35) scaleX(0.82); }
        }
        @media (prefers-reduced-motion: reduce) { span { animation: none !important; } }
      `}</style>
    </div>
  )
}

export default function App() {
  // scrollRef is read every frame by Scene3D — no re-renders
  const scrollRef = useRef(0)
  // scrollDisplay is throttled state for UI components that need re-renders
  const [scrollDisplay, setScrollDisplay] = useState(0)
  const [teacher, setTeacher] = useState(false)

  // sky-flight state (citations launch). flightRef is read per-frame by Scene3D.
  const flightRef = useRef({ mode: 'none', t: 0 })
  const [flight, setFlight] = useState('none')
  // helm-challenge minigame state, read per-frame by Scene3D's Checkpoints
  const gameRef = useRef({ active: false, idx: 0, collected: 0, total: 8, started: false, elapsed: 0, done: false, speed: 0, engaged: false, turn: 0, turnSide: 'right', resetRequested: false })
  const timers = useRef([])
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = [] }
  const flying = flight !== 'none'

  useEffect(() => {
    let raf = null
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      scrollRef.current = max > 0 ? window.scrollY / max : 0
      // Throttle UI updates to ~30fps
      if (!raf) {
        raf = requestAnimationFrame(() => {
          setScrollDisplay(scrollRef.current)
          raf = null
        })
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => () => clearTimers(), [])

  const toggleTeacher = () => {
    window.scrollTo(0, 0)
    setTeacher(t => !t)
  }

  // ── Citations flight: launch up to the sky, then dive back ──
  const launchCitations = () => {
    clearTimers()
    document.body.style.overflow = 'hidden' // lock the page while airborne
    flightRef.current = { mode: 'launch', t: 0 }
    setFlight('launch')
    timers.current.push(setTimeout(() => { flightRef.current.mode = 'sky'; setFlight('sky') }, 3400))
  }
  const returnToSea = () => {
    clearTimers()
    flightRef.current = { mode: 'descend', t: 0 }
    setFlight('descend')
    timers.current.push(setTimeout(() => {
      scrollRef.current = 0
      setScrollDisplay(0)
      // instant (not smooth) so we don't replay the dive zones on the way up
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      flightRef.current = { mode: 'none', t: 0 }
      setFlight('none')
      document.body.style.overflow = ''
    }, 3000))
  }

  const Footer = (
    <footer style={{
      minHeight: teacher ? 'auto' : '40vh',
      background: 'rgba(0,0,4,0.98)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '4rem 2rem',
    }}>
      <div style={{
        fontFamily: '"Playfair Display", serif', fontSize: '1.2rem', letterSpacing: '0.22em',
        color: 'rgba(200,230,240,0.4)', fontWeight: 600,
      }}>
        The <em style={{ fontWeight: 400 }}>Deep</em>
      </div>
      <div style={{
        fontFamily: '"JetBrains Mono", monospace', fontSize: '0.58rem', letterSpacing: '0.22em',
        textTransform: 'uppercase', color: 'rgba(100,140,160,0.35)',
      }}>
        Challenger Deep Expedition · Grade 11 APS ISU
      </div>
    </footer>
  )

  // ── Teacher / static reading view: no 3D, no animation, all expanded ──
  if (teacher) {
    return (
      <div style={{ background: '#03060c', minHeight: '100vh' }}>
        <ViewToggle teacher onToggle={toggleTeacher} onPrint={() => window.print()} />
        <TeacherHeader />
        <ContentZones staticView />
        {Footer}
      </div>
    )
  }

  // ── Immersive scroll experience ──
  return (
    <div style={{ background: '#000308' }}>
      {!flying && <ViewToggle teacher={false} onToggle={toggleTeacher} />}

      {/* ── Fixed 3D Canvas behind everything ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Suspense fallback={null}>
          <Scene3D scrollRef={scrollRef} flightRef={flightRef} gameRef={gameRef} />
        </Suspense>
      </div>

      {/* ── Fixed HUD elements (hidden while airborne) ── */}
      {!flying && <Navbar scrollProgress={scrollDisplay} />}
      {!flying && <HUD scrollProgress={scrollDisplay} />}
      {!flying && <MinigameHUD gameRef={gameRef} />}
      {!flying && <SplashFX gameRef={gameRef} />}

      {/* ── Scrollable content layer (fades out during the flight) ── */}
      <div style={{
        position: 'relative', zIndex: 10,
        opacity: flying ? 0 : 1,
        pointerEvents: flying ? 'none' : 'auto',
        transition: 'opacity 0.6s ease',
      }}>
        {/* Hero section — transparent background lets 3D canvas show through */}
        <HeroOverlay gameRef={gameRef} />

        {/* Content zones — each has semi-opaque dark background */}
        <ContentZones onViewCitations={launchCitations} />

        {Footer}
      </div>

      {/* ── Sky citations overlay ── */}
      <CitationsOverlay flight={flight} onReturn={returnToSea} bibliography={BIBLIOGRAPHY} />
    </div>
  )
}
