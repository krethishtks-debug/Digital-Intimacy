import { useRef, useState, useEffect, Suspense } from 'react'
import { Scene3D } from './Scene3D.jsx'
import { HeroOverlay } from './HeroOverlay.jsx'
import { ContentZones } from './ContentZones.jsx'
import { Navbar } from './Navbar.jsx'
import { HUD } from './HUD.jsx'

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

export default function App() {
  // scrollRef is read every frame by Scene3D — no re-renders
  const scrollRef = useRef(0)
  // scrollDisplay is throttled state for UI components that need re-renders
  const [scrollDisplay, setScrollDisplay] = useState(0)
  const [teacher, setTeacher] = useState(false)

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

  const toggleTeacher = () => {
    window.scrollTo(0, 0)
    setTeacher(t => !t)
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
      <ViewToggle teacher={false} onToggle={toggleTeacher} />

      {/* ── Fixed 3D Canvas behind everything ── */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <Suspense fallback={null}>
          <Scene3D scrollRef={scrollRef} />
        </Suspense>
      </div>

      {/* ── Fixed HUD elements ── */}
      <Navbar scrollProgress={scrollDisplay} />
      <HUD scrollProgress={scrollDisplay} />

      {/* ── Scrollable content layer ── */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Hero section — transparent background lets 3D canvas show through */}
        <HeroOverlay />

        {/* Content zones — each has semi-opaque dark background */}
        <ContentZones />

        {Footer}
      </div>
    </div>
  )
}
