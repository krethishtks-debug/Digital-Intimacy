// Content zones — Digital Intimacy ISU
// Aquarium carousel with jellyfish creatures + Inter Tight font

import { useState, useEffect, useRef, useContext } from 'react'
import { StaticViewContext } from './viewContext.js'

// ─── ANIMATION CSS ─────────────────────────────────────────────
const ANIM_CSS = `
@keyframes fadeInModal  { from { opacity:0 } to { opacity:1 } }
@keyframes slideUpModal { from { transform:translateY(28px);opacity:0 } to { transform:translateY(0);opacity:1 } }

/* Swim — 5 unique roaming paths that drift around the whole enclosure */
@keyframes swim-1 { 0%{transform:translate(-34px,58px) rotate(-5deg)} 25%{transform:translate(30px,12px) rotate(4deg)} 50%{transform:translate(40px,-60px) rotate(6deg)} 75%{transform:translate(-20px,-18px) rotate(-4deg)} 100%{transform:translate(-34px,58px) rotate(-5deg)} }
@keyframes swim-2 { 0%{transform:translate(36px,-58px) rotate(5deg)} 30%{transform:translate(-28px,-12px) rotate(-4deg)} 55%{transform:translate(-40px,52px) rotate(-6deg)} 80%{transform:translate(14px,20px) rotate(3deg)} 100%{transform:translate(36px,-58px) rotate(5deg)} }
@keyframes swim-3 { 0%{transform:translate(0px,60px) rotate(0deg)} 20%{transform:translate(-38px,10px) rotate(-5deg)} 45%{transform:translate(0px,-58px) rotate(0deg)} 70%{transform:translate(38px,8px) rotate(5deg)} 100%{transform:translate(0px,60px) rotate(0deg)} }
@keyframes swim-4 { 0%{transform:translate(-30px,-40px) rotate(-4deg)} 35%{transform:translate(34px,-58px) rotate(4deg)} 60%{transform:translate(30px,46px) rotate(5deg)} 85%{transform:translate(-32px,30px) rotate(-5deg)} 100%{transform:translate(-30px,-40px) rotate(-4deg)} }
@keyframes swim-5 { 0%{transform:translate(28px,54px) rotate(4deg)} 25%{transform:translate(40px,-16px) rotate(6deg)} 50%{transform:translate(-12px,-60px) rotate(-2deg)} 75%{transform:translate(-40px,4px) rotate(-6deg)} 100%{transform:translate(28px,54px) rotate(4deg)} }

/* tentacle sway */
@keyframes tentacle { 0%,100%{transform:scaleX(1) rotate(0deg)} 50%{transform:scaleX(1.08) rotate(2.5deg)} }

/* core glow pulse */
@keyframes glow-pulse { 0%,100%{opacity:0.85;filter:brightness(1)} 50%{opacity:1;filter:brightness(1.28)} }

/* carousel arrow breathing — draws the eye to the controls */
@keyframes arrow-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.1)} }

/* aquarium caustic light */
@keyframes caustic {
  0%,100%{opacity:0.03;transform:scale(1) rotate(0deg)}
  50%    {opacity:0.08;transform:scale(1.09) rotate(4deg)}
}

/* ── deep-water ambience (marine snow + rising bio-motes) ── */
@keyframes snow-fall {
  0%  {transform:translateY(-20px);opacity:0}
  8%  {opacity:var(--o,0.4)}
  90% {opacity:var(--o,0.4)}
  100%{transform:translateY(var(--d,220px));opacity:0}
}
@keyframes mote-rise {
  0%  {transform:translate(0,30px) scale(0.5);opacity:0}
  22% {opacity:0.85}
  78% {opacity:0.85}
  100%{transform:translate(var(--mx,8px),-160px) scale(1.1);opacity:0}
}

/* ── shark jumpscare ── */
@keyframes shark-strike {
  0%  {transform:translate(-50%,150%) scale(0.16) rotate(-12deg);opacity:0}
  12% {opacity:1}
  50% {transform:translate(-50%,-50%) scale(1.95) rotate(4deg);opacity:1}
  60% {transform:translate(-51%,-49%) scale(2.25) rotate(-3deg)}
  64% {transform:translate(-49%,-51%) scale(2.18) rotate(3deg)}
  100%{transform:translate(-50%,-165%) scale(2.7) rotate(9deg);opacity:0}
}
@keyframes shark-chomp {
  0%,46%{transform:translateY(0)}
  56%   {transform:translateY(-40px)}
  64%   {transform:translateY(-34px)}
  74%   {transform:translateY(-10px)}
  100%  {transform:translateY(0)}
}
@keyframes shark-shake {
  0%,100%{transform:translate(0,0)}
  20%{transform:translate(-8px,5px)}
  40%{transform:translate(7px,-6px)}
  60%{transform:translate(-6px,-4px)}
  80%{transform:translate(5px,6px)}
}
@keyframes shark-flash {
  0%  {opacity:0}
  46% {opacity:0.2}
  58% {opacity:0.92}
  72% {opacity:0.55}
  100%{opacity:0}
}

/* cell hover */
.jelly-cell { cursor:pointer; transition:background 0.28s ease; }
.jelly-cell:hover { background:rgba(255,255,255,0.04) !important; }
.jelly-cell:hover .jelly-label { opacity:1 !important; transform:translateY(0px) !important; }
.jelly-cell:hover .jelly-core  { filter:brightness(1.55) saturate(1.4); }
.jelly-cell:active .jelly-core { filter:brightness(2.0) saturate(1.6); }
`

const SWIM_ANIMS  = ['swim-1','swim-2','swim-3','swim-4','swim-5']
const SWIM_SPEEDS = [11, 13, 10, 14, 12]

// ─── JELLY CREATURE ───────────────────────────────────────────
function JellyCreature({ accent, index }) {
  const anim  = SWIM_ANIMS[index % 5]
  const speed = SWIM_SPEEDS[index % 5]
  const size  = 52 + (index % 3) * 13

  const r = parseInt(accent.slice(1,3), 16)
  const g = parseInt(accent.slice(3,5), 16)
  const b = parseInt(accent.slice(5,7), 16)
  const rgba = (a) => `rgba(${r},${g},${b},${a})`

  return (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center',
      animation:`${anim} ${speed}s ease-in-out infinite`,
      userSelect:'none',
    }}>
      <div style={{ position:'relative', width:size, height:size*1.58, display:'flex', flexDirection:'column', alignItems:'center' }}>
        {/* Outer glow ring */}
        <div style={{
          position:'absolute', top:size*0.04, left:'50%', transform:'translateX(-50%)',
          width:size*0.92, height:size*0.92, borderRadius:'50%',
          border:`1.5px solid ${rgba(0.32)}`,
          animation:`glow-pulse ${3+index*0.45}s ease-in-out infinite`,
          pointerEvents:'none',
        }} />
        {/* Bell */}
        <div className="jelly-core" style={{
          width:size, height:size*0.68,
          borderRadius:'50% 50% 32% 32% / 62% 62% 38% 38%',
          background:`radial-gradient(ellipse at 38% 30%,${rgba(0.92)},${rgba(0.36)} 55%,${rgba(0.07)} 100%)`,
          boxShadow:[
            `0 0 ${size*0.42}px ${rgba(0.55)}`,
            `0 0 ${size*0.88}px ${rgba(0.20)}`,
            `inset 0 2px ${size*0.18}px ${rgba(0.28)}`,
          ].join(','),
          animation:`glow-pulse ${2.2+index*0.55}s ease-in-out infinite`,
          transition:'filter 0.2s',
          position:'relative',
        }}>
          <div style={{
            position:'absolute', top:'17%', left:'27%',
            width:'31%', height:'22%', borderRadius:'50%',
            background:rgba(0.68), filter:`blur(${size*0.055}px)`,
          }} />
        </div>
        {/* Tentacles */}
        <div style={{
          display:'flex', gap:size*0.08, marginTop:2,
          animation:`tentacle ${1.8+index*0.35}s ease-in-out infinite`,
        }}>
          {Array.from({length:5+(index%3)}).map((_,t) => (
            <div key={t} style={{
              width:1.8+(t%3)*0.6,
              height:size*(0.44+(t%4)*0.11),
              borderRadius:'0 0 2px 2px',
              background:`linear-gradient(to bottom,${rgba(0.68)},${rgba(0.05)})`,
              transform:`rotate(${(t-2.5)*4.5}deg)`,
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── DEEP-WATER AMBIENCE (marine snow + bio-motes) ────────────
function DeepAmbience({ count = 18, accent = '#3aa0c8' }) {
  const r = parseInt(accent.slice(1,3), 16)
  const g = parseInt(accent.slice(3,5), 16)
  const b = parseInt(accent.slice(5,7), 16)

  const flakes = []
  for (let i = 0; i < count; i++) {
    const left  = (i * 61) % 100
    const size  = 1.2 + ((i * 7) % 5) * 0.5     // 1.2 – 3.2px
    const dur   = 9 + ((i * 13) % 8)            // 9 – 16s
    const delay = -(((i * 23) % 140) / 10)      // staggered
    const drift = 180 + ((i * 29) % 140)        // fall distance
    const opa   = 0.16 + ((i * 17) % 6) * 0.05  // 0.16 – 0.41
    const bio   = i % 5 === 0
    flakes.push(<span key={i} style={{
      position:'absolute', top:0, left:`${left}%`,
      width:size, height:size, borderRadius:'50%',
      background: bio ? `rgba(${r},${g},${b},1)` : 'rgba(195,222,236,1)',
      boxShadow: bio ? `0 0 8px rgba(${r},${g},${b},0.85)` : '0 0 5px rgba(175,210,230,0.5)',
      opacity:0, pointerEvents:'none',
      animation:`snow-fall ${dur}s linear ${delay}s infinite`,
      '--o':opa, '--d':`${drift}px`,
    }} />)
  }

  const motes = []
  const mc = Math.max(3, Math.round(count / 5))
  for (let i = 0; i < mc; i++) {
    const left  = 8 + ((i * 53) % 84)
    const size  = 2.5 + ((i * 5) % 4)
    const dur   = 10 + ((i * 11) % 7)
    const delay = -(((i * 37) % 90) / 10)
    motes.push(<span key={`m${i}`} style={{
      position:'absolute', bottom:0, left:`${left}%`,
      width:size, height:size, borderRadius:'50%',
      background:`rgba(${r},${g},${b},1)`,
      boxShadow:`0 0 11px rgba(${r},${g},${b},0.9)`,
      opacity:0, pointerEvents:'none',
      animation:`mote-rise ${dur}s ease-in ${delay}s infinite`,
      '--mx':`${(i % 2 ? 1 : -1) * ((i * 9) % 26)}px`,
    }} />)
  }

  return (
    <div aria-hidden="true" style={{
      position:'absolute', inset:0, zIndex:-1,
      overflow:'hidden', pointerEvents:'none',
    }}>{flakes}{motes}</div>
  )
}

// ─── SHARK JUMPSCARE ──────────────────────────────────────────
function SharkSVG() {
  const upper = [], lower = []
  const n = 9
  for (let i = 0; i < n; i++) {
    const x = 132 + (i * (156 / (n - 1)))
    const ua = 304 + (i % 3) * 11           // upper apex (points down)
    upper.push(<polygon key={`u${i}`} points={`${x-12},250 ${x+12},250 ${x},${ua}`} fill="#f6f8f5" />)
    const la = 336 - (i % 3) * 9            // lower apex (points up)
    lower.push(<polygon key={`l${i}`} points={`${x-12},392 ${x+12},392 ${x},${la}`} fill="#eef2ee" />)
  }
  return (
    <svg viewBox="0 0 420 560" width="100%" height="100%" style={{ display:'block', filter:'drop-shadow(0 18px 40px rgba(0,0,0,0.7))' }}>
      <defs>
        <linearGradient id="sharkBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#28333d" />
          <stop offset="45%" stopColor="#46596a" />
          <stop offset="100%" stopColor="#9fb2bd" />
        </linearGradient>
        <radialGradient id="sharkMaw" cx="50%" cy="42%" r="62%">
          <stop offset="0%"  stopColor="#360711" />
          <stop offset="55%" stopColor="#16060a" />
          <stop offset="100%" stopColor="#040507" />
        </radialGradient>
      </defs>

      {/* pectoral fins */}
      <path d="M122,300 L8,476 L156,384 Z"  fill="#313f49" />
      <path d="M298,300 L412,476 L264,384 Z" fill="#313f49" />

      {/* body */}
      <path d="M210,16 C150,28 110,108 102,210 C95,302 120,474 210,548 C300,474 325,302 318,210 C310,108 270,28 210,16 Z" fill="url(#sharkBody)" />
      {/* belly highlight */}
      <path d="M210,250 C176,260 156,356 184,470 C198,512 210,532 210,532 C210,532 222,512 236,470 C264,356 244,260 210,250 Z" fill="rgba(205,218,227,0.45)" />

      {/* gill slits */}
      {[0,1,2].map(i => (
        <g key={`g${i}`} stroke="#1c262e" strokeWidth="3" strokeLinecap="round" opacity="0.7">
          <path d={`M120,${236+i*16} q-14,10 -16,26`} fill="none" />
          <path d={`M300,${236+i*16} q14,10 16,26`} fill="none" />
        </g>
      ))}

      {/* eyes */}
      <g>
        <ellipse cx="150" cy="150" rx="15" ry="21" fill="#05080a" transform="rotate(-12 150 150)" />
        <ellipse cx="270" cy="150" rx="15" ry="21" fill="#05080a" transform="rotate(12 270 150)" />
        <circle cx="145" cy="143" r="4" fill="rgba(220,235,240,0.85)" />
        <circle cx="265" cy="143" r="4" fill="rgba(220,235,240,0.85)" />
      </g>

      {/* maw cavity */}
      <ellipse cx="210" cy="320" rx="104" ry="78" fill="url(#sharkMaw)" />
      {/* upper teeth (fixed to head) */}
      {upper}
      {/* lower jaw — animated chomp */}
      <g style={{ animation:'shark-chomp 1.7s cubic-bezier(0.5,0,0.4,1) forwards' }}>
        <path d="M108,322 C150,398 270,398 312,322 L312,340 C270,414 150,414 108,340 Z" fill="#2b3a45" />
        {lower}
      </g>
    </svg>
  )
}

function SharkJumpscare() {
  const ref = useRef(null)
  const staticView = useContext(StaticViewContext)
  const [phase, setPhase] = useState('idle') // idle | strike | done

  useEffect(() => {
    if (staticView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let fired = false, rafId = 0
    const check = () => {
      const el = ref.current
      if (!el || fired) return false
      const r = el.getBoundingClientRect()
      const line = window.innerHeight * 0.45
      // fire once the section's top scrolls up past the 45% line
      if (r.top <= line && r.bottom >= line) {
        fired = true
        window.removeEventListener('scroll', check)
        setPhase('strike')
        setTimeout(() => setPhase('done'), 1750)
        return true
      }
      return false
    }
    window.addEventListener('scroll', check, { passive: true })
    // settle interval — covers landing in view via scroll-restoration
    // (a refresh mid-page), which doesn't dispatch a scroll event
    let ticks = 0
    const iv = setInterval(() => { if (check() || ticks++ > 60) clearInterval(iv) }, 100)
    rafId = iv
    return () => { window.removeEventListener('scroll', check); clearInterval(iv) }
  }, [staticView])

  return (
    <div ref={ref} aria-hidden="true" style={{ position:'absolute', inset:0, pointerEvents:'none' }}>
      {phase === 'strike' && (
        <div style={{ position:'fixed', inset:0, zIndex:60, pointerEvents:'none', overflow:'hidden' }}>
          {/* darkening flash */}
          <div style={{
            position:'absolute', inset:0,
            background:'radial-gradient(circle at 50% 56%, rgba(0,0,0,0) 22%, rgba(2,1,4,0.9) 100%)',
            animation:'shark-flash 1.7s ease-out forwards',
          }} />
          {/* shake layer */}
          <div style={{ position:'absolute', inset:0, animation:'shark-shake 0.5s ease-in-out 0.58s 1' }}>
            {/* strike layer */}
            <div style={{
              position:'absolute', left:'50%', top:'50%',
              width:'min(82vh, 94vw)', transformOrigin:'50% 50%',
              animation:'shark-strike 1.7s cubic-bezier(0.5,0,0.4,1) forwards',
            }}>
              <SharkSVG />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── AQUARIUM CAROUSEL ────────────────────────────────────────
function Aquarium({ creatures, accent, onSelect }) {
  const staticView = useContext(StaticViewContext)
  const [page, setPage] = useState(0)
  const PER  = 3
  const N    = creatures.length
  const maxP = Math.max(0, N - PER)

  const r = parseInt(accent.slice(1,3), 16)
  const g = parseInt(accent.slice(3,5), 16)
  const b = parseInt(accent.slice(5,7), 16)
  const rgba = (a) => `rgba(${r},${g},${b},${a})`

  // ── Teacher / static view: every research card expanded inline ──
  if (staticView) {
    return (
      <div style={{ marginTop:'1.8rem', marginBottom:'0.5rem' }}>
        <div style={{
          fontFamily:'"JetBrains Mono",monospace', fontSize:'0.60rem',
          letterSpacing:'0.18em', textTransform:'uppercase', color:rgba(0.6),
          marginBottom:'1.2rem',
        }}>
          Research Cards ({N})
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
          {creatures.map((orb, i) => (
            <div key={i} style={{
              padding:'1.4rem 1.6rem', borderRadius:14,
              background:rgba(0.05), border:`1px solid ${rgba(0.28)}`,
              borderLeft:`3px solid ${accent}`,
            }}>
              {orb.eyebrow && (
                <div style={{
                  fontFamily:'"JetBrains Mono",monospace', fontSize:'0.58rem',
                  letterSpacing:'0.24em', textTransform:'uppercase',
                  color:rgba(0.85), marginBottom:'0.5rem',
                }}>{orb.eyebrow}</div>
              )}
              <h3 style={{
                fontFamily:'"Playfair Display",serif', fontSize:'clamp(1.2rem,2.4vw,1.5rem)',
                fontWeight:700, color:'#e8f4f8', lineHeight:1.2, marginBottom:'1rem',
              }}>{orb.title}</h3>
              <div style={{ fontFamily:'"Inter Tight",sans-serif' }}>{orb.body}</div>
              {orb.source && (
                <div style={{
                  marginTop:'1rem', paddingTop:'0.8rem', borderTop:`1px solid ${accent}28`,
                  fontFamily:'"JetBrains Mono",monospace', fontSize:'0.62rem',
                  letterSpacing:'0.04em', color:'rgba(150,185,205,0.7)', lineHeight:1.7,
                }}>Sources: {orb.source}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Track is N/PER * container width wide; each cell is 1/N of track = 1/PER of container
  const trackW = `${N * 100 / PER}%`
  const cellW  = `${100 / N}%`
  // Translate by page cells: each cell = 1/N of track, so translate = page/N * 100%
  const offset = `calc(-${page} * 100% / ${N})`

  function ArrowBtn({ dir, disabled, onClick: handleClick }) {
    const idleGlow  = `0 0 0 1px ${rgba(0.30)}, 0 6px 20px ${rgba(0.30)}, 0 0 22px ${rgba(0.30)}`
    const hoverGlow = `0 0 0 2px ${rgba(0.65)}, 0 8px 28px ${rgba(0.50)}, 0 0 40px ${rgba(0.60)}`
    const idleBg    = `radial-gradient(circle at 50% 38%, ${rgba(0.42)}, ${rgba(0.18)})`
    const hoverBg   = `radial-gradient(circle at 50% 38%, ${rgba(0.78)}, ${rgba(0.34)})`
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        aria-label={dir === 'left' ? 'Previous creatures' : 'Next creatures'}
        style={{
          flexShrink:0, width:58, height:58, borderRadius:'50%',
          background: disabled ? 'rgba(255,255,255,0.03)' : idleBg,
          border:`2px solid ${disabled ? 'rgba(255,255,255,0.07)' : rgba(0.85)}`,
          boxShadow: disabled ? 'none' : idleGlow,
          color: disabled ? 'rgba(255,255,255,0.20)' : '#ffffff',
          cursor: disabled ? 'default' : 'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:'1.8rem', fontWeight:700, paddingBottom:3,
          transition:'background 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          outline:'none', lineHeight:1,
          // gentle breathing scale to draw the eye (transform owned by the keyframe)
          animation: disabled ? 'none' : `arrow-pulse 1.9s ease-in-out infinite ${dir === 'left' ? '0s' : '0.95s'}`,
        }}
        onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = hoverBg; e.currentTarget.style.boxShadow = hoverGlow; e.currentTarget.style.borderColor = rgba(1) } }}
        onMouseLeave={e => { if (!disabled) { e.currentTarget.style.background = idleBg; e.currentTarget.style.boxShadow = idleGlow; e.currentTarget.style.borderColor = rgba(0.85) } }}
      >{dir === 'left' ? '‹' : '›'}</button>
    )
  }

  return (
    <div style={{ marginTop:'2.2rem', marginBottom:'0.5rem' }}>
      {/* Instruction text */}
      <div style={{
        display:'flex', alignItems:'center', gap:'0.5rem',
        marginBottom:'0.9rem',
      }}>
        <span style={{ fontSize:'1rem', lineHeight:1 }}>🪼</span>
        <span style={{
          fontFamily:'"Inter Tight",sans-serif',
          fontSize:'0.72rem', fontWeight:500,
          letterSpacing:'0.09em', textTransform:'uppercase',
          color:rgba(0.52),
        }}>
          Click a creature to explore its research content
        </span>
        {N > PER && (
          <span style={{
            marginLeft:'auto',
            fontFamily:'"JetBrains Mono",monospace',
            fontSize:'0.58rem', letterSpacing:'0.12em',
            color:rgba(0.32),
          }}>{page+1} / {maxP+1}</span>
        )}
      </div>

      {/* Arrow + Tank + Arrow row */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
        {N > PER && (
          <ArrowBtn dir="left" disabled={page===0} onClick={() => setPage(p => Math.max(0, p-1))} />
        )}

        {/* Tank */}
        <div style={{
          flex:1, overflow:'hidden', borderRadius:14, height:292,
          background:'linear-gradient(180deg,#000e1e 0%,#001530 55%,#000c1a 100%)',
          border:`1px solid ${rgba(0.22)}`,
          boxShadow:[
            `inset 0 0 48px ${rgba(0.09)}`,
            `inset 0 0 0 1px rgba(255,255,255,0.025)`,
            `0 10px 44px rgba(0,0,0,0.58)`,
          ].join(','),
          position:'relative',
        }}>
          {/* Caustic light blobs */}
          {[12, 46, 78].map((l, ci) => (
            <div key={ci} style={{
              position:'absolute', top:`${8+ci*14}%`, left:`${l}%`,
              width:90, height:90, borderRadius:'50%',
              background:`radial-gradient(circle,${rgba(0.11)},transparent 70%)`,
              animation:`caustic ${3.0+ci*0.9}s ease-in-out infinite`,
              animationDelay:`${ci*1.1}s`,
              pointerEvents:'none',
            }} />
          ))}

          {/* Top glass sheen */}
          <div style={{
            position:'absolute', top:0, left:0, right:0, height:2,
            background:`linear-gradient(90deg,transparent,${rgba(0.38)},transparent)`,
            pointerEvents:'none', zIndex:2,
          }} />

          {/* Carousel track */}
          <div style={{
            display:'flex', height:'100%',
            width:trackW,
            transform:`translateX(${offset})`,
            transition:'transform 0.52s cubic-bezier(0.4,0,0.2,1)',
          }}>
            {creatures.map((orb, i) => (
              <div
                key={i}
                className="jelly-cell"
                onClick={() => onSelect(orb)}
                title={orb.label}
                style={{
                  width:cellW, flexShrink:0, height:'100%',
                  display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center',
                  gap:10, padding:'1.2rem 0.5rem',
                  borderRight: i < N-1 ? `1px solid ${rgba(0.08)}` : 'none',
                  position:'relative',
                }}
              >
                <JellyCreature accent={accent} index={i} />
                <div className="jelly-label" style={{
                  fontFamily:'"JetBrains Mono",monospace',
                  fontSize:'0.57rem', letterSpacing:'0.18em', textTransform:'uppercase',
                  color:rgba(0.82), textShadow:`0 0 10px ${rgba(0.5)}`,
                  textAlign:'center', maxWidth:120, lineHeight:1.35,
                  opacity:0, transform:'translateY(5px)',
                  transition:'opacity 0.25s,transform 0.25s',
                  pointerEvents:'none',
                }}>{orb.label}</div>
              </div>
            ))}
          </div>
        </div>

        {N > PER && (
          <ArrowBtn dir="right" disabled={page>=maxP} onClick={() => setPage(p => Math.min(maxP, p+1))} />
        )}
      </div>
    </div>
  )
}

// ─── MODAL ────────────────────────────────────────────────────
function OrbModal({ orb, accent, onClose }) {
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:1000,
        background:'rgba(0,0,12,0.88)',
        backdropFilter:'blur(14px)',
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:'2rem',
        animation:'fadeInModal 0.22s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:'rgba(6,10,22,0.98)',
          border:`1px solid ${accent}44`,
          borderRadius:20,
          padding:'clamp(2rem,4vw,2.8rem)',
          maxWidth:680, width:'100%',
          maxHeight:'85vh', overflowY:'auto',
          boxShadow:`0 0 60px ${accent}22,0 24px 80px rgba(0,0,0,0.72)`,
          position:'relative',
          animation:'slideUpModal 0.26s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position:'sticky', top:0, float:'right',
            background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.10)',
            borderRadius:8, width:32, height:32,
            color:'rgba(200,220,230,0.8)', cursor:'pointer', fontSize:'1.1rem',
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            marginBottom:'0.5rem',
          }}
        >×</button>

        {orb.eyebrow && (
          <div style={{
            fontFamily:'"JetBrains Mono",monospace',
            fontSize:'0.60rem', letterSpacing:'0.28em', textTransform:'uppercase',
            color:`${accent}bb`, marginBottom:'0.6rem',
          }}>{orb.eyebrow}</div>
        )}

        <h3 style={{
          fontFamily:'"Playfair Display",serif',
          fontSize:'clamp(1.3rem,3vw,1.7rem)', fontWeight:700,
          color:'#e8f4f8', marginBottom:'1.4rem', lineHeight:1.2, clear:'both',
        }}>{orb.title}</h3>

        <div style={{ fontFamily:'"Inter Tight",sans-serif', fontSize:'1rem', fontWeight:400, lineHeight:1.85, color:'rgba(223,239,247,0.97)' }}>
          {orb.body}
        </div>

        {orb.source && (
          <div style={{
            marginTop:'1.8rem', paddingTop:'1rem',
            borderTop:`1px solid ${accent}28`,
            fontFamily:'"JetBrains Mono",monospace',
            fontSize:'0.58rem', letterSpacing:'0.08em',
            color:'rgba(120,160,180,0.55)', lineHeight:1.7,
          }}>{orb.source}</div>
        )}

        <div style={{ marginTop:'1.6rem', height:2, background:`linear-gradient(90deg,${accent}88,transparent)`, borderRadius:1 }} />
      </div>
    </div>
  )
}

// ─── HELPER COMPONENTS ────────────────────────────────────────
function Callout({ text, accent }) {
  return (
    <div style={{
      margin:'1.4rem 0', padding:'1rem 1.4rem',
      borderLeft:`3px solid ${accent}88`,
      background:`${accent}0d`, borderRadius:'0 10px 10px 0',
      fontFamily:'"Inter Tight",sans-serif', fontSize:'0.97rem', fontStyle:'italic',
      lineHeight:1.75, color:'rgba(224,240,248,0.96)',
      textShadow:'0 1px 10px rgba(0,6,14,0.55)',
    }}>"{text}"</div>
  )
}

function BulletList({ items, accent }) {
  return (
    <ul style={{ margin:'0.8rem 0 1rem 0', padding:0 }}>
      {items.map((item,i) => (
        <li key={i} style={{
          fontFamily:'"Inter Tight",sans-serif', fontSize:'0.97rem',
          fontWeight:400, lineHeight:1.8, color:'rgba(221,237,245,0.96)',
          textShadow:'0 1px 9px rgba(0,6,14,0.5)',
          marginBottom:'0.45rem', listStyleType:'none',
          position:'relative', paddingLeft:'1.2rem',
        }}>
          <span style={{ position:'absolute', left:0, color:accent, fontSize:'0.7rem', top:'0.4rem' }}>▸</span>
          {item}
        </li>
      ))}
    </ul>
  )
}

function P({ children }) {
  return (
    <p style={{ fontFamily:'"Inter Tight",sans-serif', fontSize:'1rem', fontWeight:400, lineHeight:1.85, color:'rgba(222,238,246,0.97)', marginBottom:'1rem', textShadow:'0 1px 10px rgba(0,6,14,0.55)' }}>
      {children}
    </p>
  )
}

// ─── ZONE SHELL ───────────────────────────────────────────────
function Zone({ id, label, depth, atm, bg, accent, title, children, ambient = 0 }) {
  const staticView = useContext(StaticViewContext)
  return (
    <section
      id={id}
      style={{
        minHeight: staticView ? 'auto' : '100vh', background:bg,
        padding: staticView ? 'clamp(2.4rem,5vh,3.6rem) clamp(2rem,6vw,7rem)' : 'clamp(4rem,10vh,7rem) clamp(2rem,6vw,7rem)',
        display:'flex', flexDirection:'column', justifyContent: staticView ? 'flex-start' : 'center',
        position:'relative', borderTop:`1px solid ${accent}18`,
        overflow:'hidden', isolation:'isolate',
      }}
    >
      {!staticView && ambient > 0 && <DeepAmbience count={ambient} accent={accent} />}

      {/* Zone badge */}
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.8rem', position:'relative', zIndex:10 }}>
        <div style={{ width:28, height:1, background:`${accent}80` }} />
        <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.62rem', letterSpacing:'0.28em', textTransform:'uppercase', color:`${accent}cc` }}>
          {label} · {depth}
        </span>
      </div>

      {/* Section title */}
      <h2 style={{
        fontFamily:'"Playfair Display",serif',
        fontSize:'clamp(2rem,5vw,3.6rem)', fontWeight:700,
        lineHeight:1.12, letterSpacing:'-0.01em',
        color:'#eef5f9', marginBottom:'1.8rem', maxWidth:760,
        position:'relative', zIndex:10,
      }}>{title}</h2>

      {/* Body content */}
      <div style={{ position:'relative', zIndex:10 }}>
        {children}
      </div>

      {/* Right-side depth indicator */}
      {!staticView && (
        <div style={{
          position:'absolute', right:'clamp(1rem,4vw,5rem)', top:'50%', transform:'translateY(-50%)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:8,
          opacity:0.30, pointerEvents:'none', zIndex:1,
        }}>
          <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.56rem', letterSpacing:'0.20em', color:accent, writingMode:'vertical-rl' }}>{atm}</div>
          <div style={{ width:1, height:80, background:`linear-gradient(to bottom,${accent}88,transparent)` }} />
        </div>
      )}
    </section>
  )
}

// ─── STATS ROW ────────────────────────────────────────────────
function Stats({ items, accent }) {
  return (
    <div style={{ display:'flex', gap:'3rem', flexWrap:'wrap', marginTop:'3rem' }}>
      {items.map(({ val, label }) => (
        <div key={label}>
          <div style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(1.6rem,3vw,2.4rem)', fontWeight:700, color:accent, lineHeight:1, marginBottom:'0.3rem' }}>{val}</div>
          <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.60rem', letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(120,160,180,0.65)' }}>{label}</div>
        </div>
      ))}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// ZONE 1 — ABOARD (thesis only, read on the pool deck)
// ═══════════════════════════════════════════════════════════════
function Zone1() {
  const accent = '#00b4d8'
  return (
    <Zone id="zone-1" label="Aboard the Vessel" depth="Deck 04 · 0 m" atm="1 atm"
      bg="rgba(0,18,40,0.52)" accent={accent}
      title="The Digital Transformation of Adolescent Sexuality"
    >
      {/* Thesis block — the only content read aboard */}
      <div style={{ maxWidth:760, marginBottom:'2.2rem', padding:'1.6rem 2rem', background:`${accent}0d`, border:`1px solid ${accent}30`, borderRadius:14 }}>
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.58rem', letterSpacing:'0.22em', textTransform:'uppercase', color:`${accent}99`, marginBottom:'0.8rem' }}>Thesis</div>
        <p style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(0.95rem,1.6vw,1.08rem)', fontWeight:400, fontStyle:'italic', lineHeight:1.9, color:'rgba(225,242,252,0.92)', marginBottom:'1rem' }}>
          "The normalization of sexual activity among Canadian high school students is not simply the result of individual choices or moral decline; it is the product of intersecting technological, psychological, sociological, and cultural forces that have fundamentally restructured how adolescents understand relationships, intimacy, identity, and belonging in the digital age."
        </p>
        <p style={{ fontFamily:'"Inter Tight",sans-serif', fontSize:'0.92rem', fontWeight:400, lineHeight:1.75, color:`${accent}cc` }}>
          Education, open family communication, and structural policy reform are more effective responses than fear-based approaches, and the evidence supports this.
        </p>
      </div>

      <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.60rem', letterSpacing:'0.24em', textTransform:'uppercase', color:'rgba(150,200,220,0.45)' }}>
        Keep scrolling. Over the rail, the descent begins ↓
      </div>
    </Zone>
  )
}

// ═══════════════════════════════════════════════════════════════
// ZONE 1B — EPIPELAGIC (back outside; first creatures appear)
// ═══════════════════════════════════════════════════════════════
function Zone1b() {
  const accent = '#00b4d8'
  const [open, setOpen] = useState(null)
  const creatures = [
    {
      label: 'Key Definition',
      eyebrow: 'Key Definition',
      title: 'Digital Sexual Culture',
      body: (
        <div>
          <P>The set of norms, expectations, and behaviours around sexuality and relationships that are shaped, transmitted, and reinforced through digital platforms, social media, and algorithmic content curation.</P>
          <P>This definition is important because it locates the issue not in individual teen behaviour, but in the structural environment those teens inhabit. The norms exist in the platform architecture itself, in what gets amplified, rewarded, and seen.</P>
          <Callout accent={accent} text="This is a social science problem, not a moral one. Changing individual behaviour without changing the digital environment is like mopping the floor while the tap is still running." />
        </div>
      ),
    },
  ]

  return (
    <Zone id="zone-1b" label="Epipelagic Zone" depth="0 – 200m" atm="1 – 21 atm"
      bg="rgba(0,40,80,0.72)" accent={accent} ambient={10}
      title="The Shift: Before and After Digital Culture"
    >
      {/* Before / After grid */}
      <div style={{ maxWidth:860, marginBottom:'1.5rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.2rem' }}>
        <div style={{ padding:'1.4rem', background:'rgba(0,30,60,0.55)', border:'1px solid rgba(0,180,216,0.18)', borderRadius:12 }}>
          <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.60rem', letterSpacing:'0.20em', textTransform:'uppercase', color:'rgba(100,180,210,0.7)', marginBottom:'1rem' }}>Before Digital Culture (Pre-2007)</div>
          {[
            'Sexual information came primarily from parents, schools, and healthcare providers',
            'Relationships developed face-to-face; peer influence was localized to immediate social circles',
            'Less access to explicit content; less public visibility of intimate relationships',
            'Identity formation was a relatively private, internal developmental process',
            'Peer norms existed but were grounded in direct observable behaviour',
          ].map((item,i) => (
            <div key={i} style={{ display:'flex', gap:'0.6rem', marginBottom:'0.6rem', alignItems:'flex-start' }}>
              <span style={{ color:'rgba(100,180,210,0.5)', fontSize:'0.7rem', marginTop:'0.3rem', flexShrink:0 }}>○</span>
              <span style={{ fontFamily:'"Inter Tight",sans-serif', fontSize:'0.92rem', fontWeight:400, lineHeight:1.7, color:'rgba(206,230,242,0.95)', textShadow:'0 1px 8px rgba(0,6,14,0.5)' }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ padding:'1.4rem', background:'rgba(0,80,120,0.35)', border:`1px solid ${accent}28`, borderRadius:12 }}>
          <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.60rem', letterSpacing:'0.20em', textTransform:'uppercase', color:`${accent}bb`, marginBottom:'1rem' }}>After the Digital Shift (2007–Present)</div>
          {[
            'Algorithms and peer forums have replaced trusted adults as primary information sources',
            'Social interactions became continuous (24/7), public, and quantified through metrics',
            'Attractiveness and social value became measurable through likes, followers, and views',
            'Identity formation now happens publicly and permanently, with a real-time audience',
            'Perceived norms are heavily distorted by curated performances rather than reality',
          ].map((item,i) => (
            <div key={i} style={{ display:'flex', gap:'0.6rem', marginBottom:'0.6rem', alignItems:'flex-start' }}>
              <span style={{ color:accent, fontSize:'0.7rem', marginTop:'0.3rem', flexShrink:0 }}>▸</span>
              <span style={{ fontFamily:'"Inter Tight",sans-serif', fontSize:'0.92rem', fontWeight:400, lineHeight:1.7, color:'rgba(212,233,244,0.96)', textShadow:'0 1px 8px rgba(0,6,14,0.5)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <Aquarium creatures={creatures} accent={accent} onSelect={setOpen} />

      <Stats accent={accent} items={[
        { val:'200m',  label:'Zone Depth' },
        { val:'2007',  label:'Digital Inflection' },
        { val:'~28%',  label:'Cdn Youth 15–17 Sexually Active' },
      ]} />

      {open && <OrbModal orb={open} accent={accent} onClose={() => setOpen(null)} />}
    </Zone>
  )
}

// ═══════════════════════════════════════════════════════════════
// ZONE 2 — MESOPELAGIC / FACTORS
// ═══════════════════════════════════════════════════════════════
function Zone2() {
  const accent = '#4361ee'
  const [open, setOpen] = useState(null)
  const creatures = [
    {
      label: 'Social Media',
      eyebrow: 'Factor 1 · Twilight Zone',
      title: 'Social Media',
      body: (
        <div>
          <P>Social media platforms have fundamentally changed how teenagers experience relationships, identity, and desirability, not by giving them new information, but by restructuring how identity itself is formed.</P>
          <P><strong style={{ color:'rgba(210,232,245,0.95)' }}>The Mechanism:</strong> Teens don't just observe social media; they perform identity for an audience. This performance shapes what they pursue. When sexualized content receives more engagement, that is what the algorithm amplifies. When attractiveness is publicly scored through likes, it enters the identity formation process directly.</P>
          <P>A 2024 systematic review found that platform architecture (the design of feedback systems, algorithmic amplification, and public metrics) directly shapes how adolescents experiment with and consolidate identity, a process Erikson identified as the central developmental task of adolescence (Avci et al., 2024).</P>
          <BulletList accent={accent} items={[
            'Constant exposure to idealized, curated relationships creates automatic upward social comparison',
            'Influencer culture directly ties attractiveness and relationship status to social value and belonging',
            'Public validation systems (likes, views, follower counts) gamify desirability',
            'Teens face compounding pressure to appear attractive, sexually mature, and experienced',
          ]} />
          <Callout accent={accent} text="Digital culture also carries genuine positive effects: teens today have far greater access to accurate sexual health information than previous generations, LGBTQ+ youth can find community and affirming support online, and visibility of diverse relationships can reduce shame and stigma. The problem is not digital culture itself, but algorithmically-driven digital culture deployed without accompanying media literacy education." />
        </div>
      ),
      source: 'Avci, G., et al. (2024). Adolescent Research Review. https://doi.org/10.1007/s40894-024-00251-1',
    },
    {
      label: 'Peer Pressure',
      eyebrow: 'Factor 2 · Twilight Zone',
      title: 'Peer Pressure & Perceived Norms',
      body: (
        <div>
          <P>Peer groups are more influential than statistics or parental rules, but the mechanism is more specific and more troubling than simple pressure.</P>
          <P><strong style={{ color:'rgba(210,232,245,0.95)' }}>The Critical Nuance:</strong> Teens act based on what they think peers are doing, not what peers are actually doing. A comprehensive meta-analysis found that perceived peer norms (what teens believe their peers are doing) are consistently stronger predictors of sexual behaviour than actual peer behaviour. Perceived norms consistently and significantly overestimate actual sexual activity (van de Bongardt et al., 2015).</P>
          <P>The 2020 Public Health Agency of Canada report confirmed this pattern in Canadian adolescents specifically, documenting the gap between perceived and actual peer sexual activity as a consistent finding across age groups and regions (Craig et al., 2020).</P>
          <Callout accent={accent} text="The perception gap is itself a social force. It creates pressure even when the behaviour it describes is not widespread. This connects directly to Durkheim's social facts: the norm exerts coercive pressure as an external reality, entirely independent of statistical truth. Changing the behaviour requires changing the perceived norm, not just the actual behaviour." />
        </div>
      ),
      source: "van de Bongardt, D., et al. (2015). Personality and Social Psychology Review, 19(3), 203–234. | Craig, W., et al. (2020). Public Health Agency of Canada.",
    },
    {
      label: 'Sexting Culture',
      eyebrow: 'Factor 3 · Twilight Zone',
      title: 'Sexting Culture',
      body: (
        <div>
          <P>Sexting (the sending of sexually explicit messages, images, or video via digital devices) has become normalized in many teen relationships, viewed as a relationship milestone, a proof of trust, or a response to persistent pressure.</P>
          <P>A provincially representative Ontario study found that sexting is prevalent among Canadian adolescents and is associated with broader patterns of sexual behaviour and peer influence (Kim et al., 2020). A national Canadian study further distinguished between consensual and non-consensual sexting, finding that non-consensual forwarding of images (exactly what happened to Rehtaeh Parsons) is a distinct behaviour pattern associated with specific risk factors including attitudes about gender and peer approval (Holfeld et al., 2024).</P>
          <BulletList accent={accent} items={[
            'Driven by peer pressure, relationship expectations, and the desire for acceptance and belonging',
            'Once an image is sent, the sender loses all control over where it goes and who sees it',
            'Girls face dramatically disproportionate reputational consequences when images are shared without consent',
          ]} />
          <P><strong style={{ color:'rgba(210,232,245,0.95)' }}>Legal Reality in Canada:</strong> Under the Criminal Code of Canada (s. 163.1), distribution of intimate images of minors constitutes child pornography, regardless of whether the teens involved consented to the original image.</P>
          <Callout accent={accent} text="The law is a blunt instrument here. Charging a 15-year-old with child pornography for sending a photo of themselves does not address the cultural conditions, relationship pressures, and normative expectations that made them feel they had to. Criminal law treats a structural problem as an individual one." />
        </div>
      ),
      source: 'Kim, S., et al. (2020). Canadian Journal of Psychiatry, 65(7). | Holfeld, B., et al. (2024). Youth & Society.',
    },
    {
      label: 'Gender Scripts',
      eyebrow: 'Factor 4 · Twilight Zone',
      title: 'Gender Scripts',
      body: (
        <div>
          <P>Gender scripts are socially learned expectations about how people of different genders should behave sexually and romantically. They are not natural, biological, or inevitable; they are socially produced and reinforced through media, peers, cultural messaging, and now algorithmic amplification.</P>
          <P><strong style={{ color:'rgba(210,232,245,0.95)' }}>The Male Script:</strong> Sexuality is tied directly to social status, dominance, and peer respect. Pressure to accumulate sexual experience as a marker of maturity. Emotional vulnerability and hesitation are stigmatized as weakness.</P>
          <P><strong style={{ color:'rgba(210,232,245,0.95)' }}>The Female Script:</strong> Expected to connect sexual intimacy with romance and emotional commitment. Faces far greater reputational risk: the same behaviour that confers status on boys becomes grounds for harassment and social destruction for girls.</P>
          <Callout accent={accent} text="These scripts are asymmetric in their consequences, by design. In the Rehtaeh Parsons case, this asymmetry was not incidental; it was fatal. She bore the full social weight of what happened to her while the boys involved initially faced no comparable social consequence whatsoever." />
        </div>
      ),
      source: 'Tolman, D. L., & McClelland, S. I. (2011). Journal of Research on Adolescence, 21(1), 242–255. | Holfeld, B., et al. (2024). Youth & Society.',
    },
    {
      label: 'Pornography',
      eyebrow: 'Factor 5 · Twilight Zone',
      title: 'Pornography',
      body: (
        <div>
          <P><strong style={{ color:'rgba(210,232,245,0.95)' }}>Important framing:</strong> Pornography is a contributing factor, not a root cause. Research on its effects is correlational, not causal. Presenting it as the primary driver of teen sexual culture is a moral panic framing that locates the problem in content rather than in structural conditions.</P>
          <P>A 2023 systematic review in the Journal of Medical Internet Research (the most comprehensive review currently available) found that while exposure is associated with certain attitude shifts, causal relationships are difficult to establish, effects vary significantly by context, and the absence of comprehensive sex education is a key mediating factor (Bőthe et al., 2023).</P>
          <BulletList accent={accent} items={[
            'Early or frequent exposure can shape expectations of intimacy, consent, and body image before other experiences provide a counterpoint',
            'May contribute to unrealistic expectations about sexual performance, body morphology, and relationship dynamics',
            'Can provide direct misinformation about consent and healthy relationships in the absence of comprehensive sex education',
            'Research does NOT establish that pornography directly causes sexual activity or earlier initiation',
          ]} />
          <Callout accent={accent} text="Treating pornography as the primary cause of teen sexual culture is a moral panic framing. It locates the problem in content rather than in the structural conditions (inadequate sex education, absent critical media literacy, unregulated algorithmic amplification) that determine how that content lands and what meaning young people make of it." />
        </div>
      ),
      source: 'Bőthe, B., et al. (2023). Journal of Medical Internet Research, 25, e43116. https://doi.org/10.2196/43116',
    },
  ]

  return (
    <Zone id="zone-2" label="Mesopelagic Zone" depth="200 – 1,000m" atm="21 – 100 atm"
      bg="rgba(0,6,24,0.85)" accent={accent} ambient={20}
      title="The Five Contributing Factors"
    >
      <SharkJumpscare />
      <div style={{ maxWidth:680 }}>
        <P>The normalization of sexual activity among Canadian teens is not a single-cause phenomenon. Five interlocking factors (each documented in peer-reviewed research) work together to restructure how teenagers understand sexuality, relationships, and their own identity in the digital age.</P>
        <P>Five creatures swim in the aquarium below. Each carries a contributing factor. Use the arrows to scroll through them, and click any creature to read the full academic analysis.</P>
      </div>

      <Aquarium creatures={creatures} accent={accent} onSelect={setOpen} />

      <Stats accent={accent} items={[
        { val:'1,000m', label:'Maximum Depth' },
        { val:'5',      label:'Intersecting Factors' },
        { val:'100 atm',label:'Pressure' },
      ]} />

      {open && <OrbModal orb={open} accent={accent} onClose={() => setOpen(null)} />}
    </Zone>
  )
}

// ═══════════════════════════════════════════════════════════════
// ZONE 3 — BATHYPELAGIC / THEORIES
// ═══════════════════════════════════════════════════════════════
function Zone3() {
  const accent = '#7209b7'
  const [open, setOpen] = useState(null)
  const creatures = [
    {
      label: 'Erikson',
      eyebrow: 'Theory 1 · Midnight Zone',
      title: 'Erikson: Identity Formation',
      body: (
        <div>
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>The Theory:</strong> Erik Erikson's fifth stage of psychosocial development (Identity vs. Role Confusion) is the central developmental challenge of adolescence. The core questions are: Who am I? What do I value? How do others see me? How do I fit into the social world?</P>
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>The Mechanism:</strong> Erikson argued that identity forms through experimentation: trying on different roles, values, relationships, and self-presentations, then consolidating a stable, coherent sense of self. In the pre-digital era, this experimentation was relatively private, localized, and low-stakes.</P>
          <P>In the digital era, this experimentation happens publicly and permanently. A 2024 systematic review found that social media platform architecture directly intervenes in Erikson's identity formation process: the public feedback systems, algorithmic amplification, and permanent record of digital platforms add an audience, a scoreboard, and an archive to what Erikson described as an internal developmental task (Avci et al., 2024).</P>
          <Callout accent={accent} text="This changes identity formation from a private developmental process into a public performance. Erikson described a stage in human development. Digital culture turned that stage into a literal stage, with an audience, a scoreboard, an archive, and an algorithm deciding what gets seen." />
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>Connection to Sexual Culture:</strong> When sexual desirability becomes a measurable metric of social value online, it enters the identity formation process. Teens may come to understand sexual experience or attractiveness not as personal choices or feelings but as necessary components of a viable, respected social identity.</P>
        </div>
      ),
      source: 'Avci, G., et al. (2024). Adolescent Research Review. | Tolman, D. L., & McClelland, S. I. (2011). Journal of Research on Adolescence, 21(1), 242–255.',
    },
    {
      label: 'Durkheim',
      eyebrow: 'Theory 2 · Midnight Zone',
      title: "Durkheim: Social Facts & Anomie",
      body: (
        <div>
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>Social Facts:</strong> Émile Durkheim argued that social facts are ways of acting, thinking, and feeling that exist outside of individuals but exert coercive power over them. They are not chosen by individuals; they are inherited from the social environment and enforced through social sanction (shame, exclusion, mockery, rejection).</P>
          <P>Sexual norms among teenagers function as social facts in exactly Durkheim's sense. A teenager does not choose the norm that "everyone is sexually active by grade 11"; that norm exists in the social environment before they arrive. It exerts pressure regardless of whether it accurately reflects reality (Craig et al., 2020).</P>
          <Callout accent={accent} text="This means changing individual behaviour requires changing the social fact, not just educating individuals. You cannot educate your way out of a social fact: the norm will continue to exert pressure regardless of what any individual knows. To change the behaviour, you need to change the conditions that produce and sustain the norm." />
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>Anomie:</strong> Durkheim's concept of anomie describes a state of normlessness: when the rules that normally guide behaviour break down or become contradictory. Traditional guidance has weakened as a source of sexual norms for teenagers. Digital guidance has replaced it, but digital guidance is fragmented, contradictory, and optimized for engagement and profit rather than wellbeing. The result is anomie, and it is structurally produced, not individually chosen.</P>
        </div>
      ),
      source: 'Craig, W., et al. (2020). Public Health Agency of Canada. | Költő, A., et al. (2025). International Journal of Public Health.',
    },
    {
      label: 'Goffman',
      eyebrow: 'Theory 3 · Midnight Zone',
      title: 'Goffman: Dramaturgy',
      body: (
        <div>
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>Scholarly Note:</strong> Goffman developed his dramaturgical model for face-to-face interaction in his 1959 work The Presentation of Self in Everyday Life. Applying it to social media is a scholarly extension of his framework, not a direct application; acknowledging this demonstrates stronger theoretical understanding.</P>
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>The Theory:</strong> Erving Goffman argued that social life is fundamentally a performance. The front stage is where we perform for our audience. The back stage is where we are our real selves, away from the audience's gaze.</P>
          <P>On Instagram, Snapchat, and TikTok, teenagers maintain a highly curated front stage, presenting idealized versions of their relationships, attractiveness, and sexual confidence. The back stage (anxiety, insecurity, fear of rejection, body dissatisfaction) is entirely invisible. Research confirms that the gap between front stage performance and back stage reality produces measurable psychological harm (Papageorgiou et al., 2022; Flaudias et al., 2025).</P>
          <Callout accent={accent} text="What we observe in teen sexual culture online is performance, not necessarily reality. This is the direct mechanism behind the normative paradox: the front stage performance of sexual confidence creates perceived norms among observers that diverge dramatically from the back stage statistical reality. Everyone sees everyone else's highlight reel and concludes it is their normal life." />
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>Connection to Rehtaeh Parsons:</strong> The distribution of the photo collapsed the boundary between her front stage and back stage entirely and permanently. She had no private self left. Every aspect of her back stage was exposed to a hostile audience with no possibility of retreat or recovery.</P>
        </div>
      ),
      source: "Papageorgiou, A., et al. (2022). BMC Women's Health, 22, 261. | Flaudias, V., et al. (2025). Journal of Eating Disorders, 13(1), 192.",
    },
    {
      label: 'Anthropology',
      eyebrow: 'Theory 4 · Midnight Zone',
      title: 'Anthropology: Enculturation & Cultural Transmission',
      body: (
        <div>
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>Enculturation:</strong> Anthropology studies how individuals absorb the norms, values, and behaviours of their culture through a lifelong process called enculturation. Adolescent sexual norms are not biological inevitabilities; they are culturally transmitted, learned from the agents of socialization a young person is exposed to.</P>
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>The Shift in the Agent of Transmission:</strong> Historically, sexual norms were transmitted through family, community, religious institutions, and face-to-face peer groups. The central anthropological change of the digital era is that the primary agent of cultural transmission has shifted to algorithmic platforms. Culture is now learned, in significant part, from a feed engineered for engagement rather than from elders or local community.</P>
          <Callout accent={accent} text="From an anthropological perspective, the platform has become a new institution of enculturation, transmitting a sexual culture optimized for profit and attention rather than for the wellbeing of the young people absorbing it." />
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>Cultural Relativism & Cross-National Evidence:</strong> The WHO study tracking 44 countries (Költő et al., 2025) shows that adolescent sexual behaviour varies widely across cultural contexts, confirming the anthropological principle that these patterns are cultural rather than universal. The same digital platforms produce different outcomes depending on the cultural environment they enter.</P>
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>Cultural Negotiation:</strong> Canadian migrant adolescents navigating dual cultural expectations (Ji et al., 2025; Meherali et al., 2022) are a clear example of culture in tension: young people actively negotiating between the enculturated norms of their family's culture of origin and the digital culture of their peers.</P>
        </div>
      ),
      source: 'Költő, A., et al. (2025). International Journal of Public Health. | Ji, D., et al. (2025). BMC Public Health. | Meherali, S., et al. (2022). Frontiers in Reproductive Health, 4, 940979.',
    },
    {
      label: 'Normative Paradox',
      eyebrow: 'Key Insight · Midnight Zone',
      title: 'The Normative Paradox',
      body: (
        <div>
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>The Apparent Contradiction:</strong> The thesis argues that digital culture is normalizing sexual activity among Canadian teens. But the statistical data tells a different story. A cross-national WHO study tracking adolescent sexual initiation across 44 countries from 2002 to 2022 found that early sexual initiation has been declining, not increasing (Költő et al., 2025). In Canada, approximately 28% of youth aged 15–17 reported having had sexual intercourse, meaning roughly 72% had not (Rotermann & McKay, 2020). If normalization is happening, why is behaviour declining?</P>
          <Callout accent={accent} text="Teens are not primarily responding to what peers are actually doing; they are responding to what they think peers are doing, which is heavily shaped by social media performance (Goffman's front stage) and social facts (Durkheim's coercive norms). The cultural normalization of teen sexuality is psychologically and sociologically real (it operates through perception, pressure, and performance) even when it does not perfectly map to actual statistical prevalence." />
          <P>The meta-analysis by van de Bongardt et al. (2015) confirmed that perceived peer norms are stronger predictors of sexual behaviour than actual peer behaviour, meaning teens are responding to a digital construction of social reality, not statistical reality.</P>
          <BulletList accent={accent} items={[
            'Better communication with partners about boundaries and expectations',
            'More consistent and correct contraceptive use',
            'Improved emotional readiness and decision-making capacity',
            'Lower rates of STIs and unintended pregnancy',
            'Higher rates of reporting that the experience was wanted and positive',
          ]} />
        </div>
      ),
      source: 'Rotermann, M., & McKay, A. (2020). Health Reports, 31(9). | Költő, A., et al. (2025). International Journal of Public Health. | van de Bongardt, D., et al. (2015). PSPR, 19(3).',
    },
    {
      label: 'Inequality',
      eyebrow: 'Inequality · Midnight Zone',
      title: 'Stratification & Inequality',
      body: (
        <div>
          <P>A sociological analysis that treats all teenagers as facing identical pressures and having identical access to support is incomplete and misleading. Social location (class, immigration status, geography) fundamentally shapes both exposure to risk and access to protective resources.</P>
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>Socioeconomic Status:</strong> A 16-year longitudinal analysis of Canadian HBSC data (2002–2018) found persistent and widening socioeconomic inequalities in adolescent mental health outcomes: lower-income youth consistently showed worse mental health trajectories, with the gap widening rather than narrowing over time (Hammami et al., 2022).</P>
          <Callout accent={accent} text="Solutions that only work for families with resources, time, and education are not universal solutions; they are privileges dressed as advice. Any policy response that ignores socioeconomic stratification will reproduce existing inequalities." />
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>Migrant & Minority Youth:</strong> A 2025 analysis of nationally representative Canadian data found that migrant adolescents show distinct sexual health behaviour patterns shaped by the navigation of dual cultural expectations (Ji et al., 2025). Navigating incompatible cultural expectations creates compartmentalization, secrecy, and reduced help-seeking, consistently linked to riskier outcomes (Aibangbee et al., 2023).</P>
          <P><strong style={{ color:'rgba(220,195,248,0.95)' }}>Geographic Inequality:</strong> Research confirms that socio-contextual factors including geography, transportation access, and anonymity concerns significantly shape young people's ability to access sexual health services: rural youth face structural barriers that are not explained by individual attitudes or knowledge (Shoveller et al., 2004).</P>
        </div>
      ),
      source: "Hammami, N., et al. (2022). HPCDP Canada, 42(2). | Ji, D., et al. (2025). BMC Public Health. | Aibangbee, M., et al. (2023). Int'l J. Public Health. | Shoveller, J. A., et al. (2004). Social Science & Medicine, 59(3).",
    },
  ]

  return (
    <Zone id="zone-3" label="Bathypelagic Zone" depth="1,000 – 4,000m" atm="100 – 400 atm" ambient={28}
      bg="rgba(0,2,12,0.92)" accent={accent}
      title="The Theoretical Framework"
    >
      <div style={{ maxWidth:680 }}>
        <P>Total darkness. No sunlight penetrates here. The social science theories that explain what the surface factors describe (Erikson's psychology of identity, Durkheim's and Goffman's sociology, and anthropology's account of cultural transmission) illuminate what cannot be seen from above. This is where all three disciplines of the course meet.</P>
        <P>Six theoretical frameworks and analytical insights swim through the aquarium below. Use the arrows to navigate and click any creature to open the full academic treatment.</P>
      </div>

      <Aquarium creatures={creatures} accent={accent} onSelect={setOpen} />

      <Stats accent={accent} items={[
        { val:'4,000m', label:'Maximum Depth' },
        { val:'~2°C',   label:'Temperature' },
        { val:'400 atm',label:'Pressure' },
      ]} />

      {open && <OrbModal orb={open} accent={accent} onClose={() => setOpen(null)} />}
    </Zone>
  )
}

// ═══════════════════════════════════════════════════════════════
// ZONE 4 — ABYSSOPELAGIC / CASE STUDY
// ═══════════════════════════════════════════════════════════════
function Zone4() {
  const accent = '#e76f51'
  const staticView = useContext(StaticViewContext)
  const [revealed, setRevealed] = useState(0)
  const [showTable, setShowTable] = useState(false)

  const lines = [
    { date:'November 2011', text:'Rehtaeh Parsons, 15 years old, attended a party in Cole Harbour, Nova Scotia.' },
    { date:null, text:'She was allegedly sexually assaulted. A photo of the incident was distributed digitally and spread among students at her school and beyond.' },
    { date:null, text:'For the next 17 months, she was subjected to relentless, sustained online harassment. She was publicly labelled a slut. Strangers sent her sexual messages. She could not escape it; it followed her on every device, in every space. Her school, her police force, and her legal system were entirely unprepared and largely unwilling to respond.' },
    { date:'April 2013', text:'Rehtaeh attempted suicide. She was taken off life support by her family. She was 17 years old.' },
    { date:null, text:'An initial RCMP investigation found "insufficient evidence" to proceed with sexual assault charges, a finding that was later reviewed and widely criticized. Two individuals were eventually charged with child pornography offences for distributing the image.' },
    { date:null, text:'Her death directly triggered federal legislation (Bill C-13, the Protecting Canadians from Online Crime Act, 2014) and provincial legislation (the Nova Scotia Cyber-Safety Act, 2013), the first anti-cyberbullying law in Canada.' },
  ]

  const connections = [
    { factor:'Sexting / image distribution', connection:'The photo was the weapon. It was distributed through the same digital infrastructure (phones, messaging apps, social networks) that teens use every day for ordinary communication.' },
    { factor:'Female gender script', connection:'She was publicly labelled and harassed for what was done to her. The boys involved faced no comparable social consequence in the immediate aftermath. The asymmetry of gender scripts was not incidental; it determined who was destroyed.' },
    { factor:"Goffman: front/back stage", connection:'The distribution of the photo collapsed the boundary between her front stage and back stage entirely and permanently. She had no private self left, no space to exist outside the harassment.' },
    { factor:'Durkheim: anomie', connection:'Not one institution (not the school, not the RCMP, not the legal system, not the platform) had an adequate framework to respond. Every system that should have provided guidance failed simultaneously.' },
    { factor:'Psychological harm', connection:'What happened to Rehtaeh is the extreme, concentrated version of the diffuse psychological harm the research documents: sustained social humiliation, loss of privacy, inability to escape harassment, destruction of identity.' },
  ]

  const handleReveal = () => {
    if (revealed < lines.length) {
      setRevealed(r => {
        const next = r + 1
        if (next === lines.length) setTimeout(() => setShowTable(true), 900)
        return next
      })
    }
  }

  // In Teacher / static view the whole case study is shown at once
  const shownLines = staticView ? lines.length : revealed
  const tableVisible = staticView || showTable

  return (
    <section id="zone-4" style={{
      minHeight: staticView ? 'auto' : '100vh', background:'rgba(2,0,8,0.96)',
      padding: staticView ? 'clamp(2.4rem,5vh,3.6rem) clamp(2rem,6vw,7rem)' : 'clamp(4rem,10vh,7rem) clamp(2rem,6vw,7rem)',
      display:'flex', flexDirection:'column', justifyContent: staticView ? 'flex-start' : 'center',
      position:'relative', borderTop:`1px solid ${accent}18`,
      overflow:'hidden', isolation:'isolate',
    }}>
      {!staticView && <DeepAmbience count={30} accent={accent} />}

      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.8rem' }}>
        <div style={{ width:28, height:1, background:`${accent}80` }} />
        <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.62rem', letterSpacing:'0.28em', textTransform:'uppercase', color:`${accent}cc` }}>
          Abyssopelagic Zone · 4,000 – 6,000m
        </span>
      </div>

      <h2 style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(2rem,5vw,3.6rem)', fontWeight:700, lineHeight:1.12, letterSpacing:'-0.01em', color:'#eef5f9', marginBottom:'0.8rem', maxWidth:720 }}>
        The Rehtaeh Parsons Case
      </h2>
      <div style={{ maxWidth:700, marginBottom:'0.4rem', fontFamily:'"Inter Tight",sans-serif', fontSize:'0.82rem', fontStyle:'italic', color:'rgba(255,190,174,0.85)' }}>
        Content note: this section discusses sexual assault and suicide.
      </div>
      <P>A case study in what happens when every structural factor aligns against one person simultaneously.{staticView ? '' : ' Click to reveal the timeline.'}</P>

      <div style={{ maxWidth:700, marginBottom:'2rem' }}>
        {lines.slice(0, shownLines).map((line, i) => (
          <div key={i} style={{
            marginBottom:'1.2rem', padding:'1rem 1.4rem',
            background:'rgba(30,6,2,0.7)',
            border:`1px solid ${accent}22`,
            borderLeft:`3px solid ${i === 3 ? '#d62828' : accent}88`,
            borderRadius:'0 10px 10px 0',
            animation:'slideUpModal 0.4s cubic-bezier(0.22,1,0.36,1)',
          }}>
            {line.date && (
              <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.60rem', letterSpacing:'0.20em', textTransform:'uppercase', color:`${accent}bb`, marginBottom:'0.4rem' }}>
                {line.date}
              </div>
            )}
            <p style={{ fontFamily:'"Inter Tight",sans-serif', fontSize:'1rem', fontWeight:400, lineHeight:1.8, color: i === 3 ? 'rgba(255,190,174,0.97)' : 'rgba(214,233,242,0.97)', margin:0, textShadow:'0 1px 9px rgba(0,4,10,0.55)' }}>
              {line.text}
            </p>
          </div>
        ))}
        {!staticView && revealed < lines.length && (
          <button onClick={handleReveal} style={{
            marginTop:'0.5rem',
            background:`radial-gradient(circle at 30% 30%,${accent}18,rgba(0,0,20,0.55))`,
            border:`1px solid ${accent}44`, borderRadius:8,
            padding:'0.7rem 1.6rem', cursor:'pointer',
            color:'rgba(205,228,238,0.92)',
            fontFamily:'"JetBrains Mono",monospace', fontSize:'0.70rem', letterSpacing:'0.14em',
            textTransform:'uppercase', transition:'all 0.2s',
          }}>
            {revealed === 0 ? '▸ Begin' : '▸ Continue'}
          </button>
        )}
      </div>

      {tableVisible && (
        <div style={{ maxWidth:760, marginTop:'1.5rem', animation:'fadeInModal 0.6s ease-out' }}>
          <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.60rem', letterSpacing:'0.22em', textTransform:'uppercase', color:`${accent}88`, marginBottom:'1rem' }}>
            Theoretical Connections
          </div>
          {connections.map((row, i) => (
            <div key={i} style={{
              display:'grid', gridTemplateColumns:'1fr 2fr', gap:'1rem',
              padding:'0.9rem 1rem', marginBottom:'0.5rem',
              background:'rgba(20,5,2,0.6)', border:`1px solid ${accent}18`, borderRadius:8,
            }}>
              <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.68rem', letterSpacing:'0.08em', color:`${accent}cc`, lineHeight:1.5 }}>{row.factor}</div>
              <div style={{ fontFamily:'"Inter Tight",sans-serif', fontSize:'0.95rem', fontWeight:400, lineHeight:1.8, color:'rgba(214,233,242,0.95)' }}>{row.connection}</div>
            </div>
          ))}
        </div>
      )}

      <Stats accent={accent} items={[
        { val:'17 mo.', label:'Duration of Harassment' },
        { val:'17',     label:'Age at Death' },
        { val:'2014',   label:'Bill C-13 Passed' },
      ]} />

      {!staticView && (
        <div style={{ position:'absolute', right:'clamp(1rem,4vw,5rem)', top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, opacity:0.30, pointerEvents:'none' }}>
          <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.56rem', letterSpacing:'0.20em', color:accent, writingMode:'vertical-rl' }}>400 – 600 atm</div>
          <div style={{ width:1, height:80, background:`linear-gradient(to bottom,${accent}88,transparent)` }} />
        </div>
      )}
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ZONE 5 — HADAL / GOVERNMENT RESPONSE
// ═══════════════════════════════════════════════════════════════
function Zone5() {
  const accent = '#d62828'
  const staticView = useContext(StaticViewContext)

  const WarningBox = ({ label, borderColor, children }) => (
    <div style={{ maxWidth:720, marginBottom:'1.8rem', padding:'1.4rem 1.6rem', border:`1px solid ${borderColor}`, borderRadius:12, background:'rgba(20,0,0,0.55)' }}>
      <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.60rem', letterSpacing:'0.20em', textTransform:'uppercase', color:borderColor, marginBottom:'0.8rem' }}>{label}</div>
      {children}
    </div>
  )

  return (
    <section id="zone-5" style={{
      minHeight: staticView ? 'auto' : '100vh', background:'rgba(4,0,2,0.98)',
      padding: staticView ? 'clamp(2.4rem,5vh,3.6rem) clamp(2rem,6vw,7rem)' : 'clamp(4rem,10vh,7rem) clamp(2rem,6vw,7rem)',
      display:'flex', flexDirection:'column', justifyContent: staticView ? 'flex-start' : 'center',
      position:'relative', borderTop:`1px solid ${accent}18`,
      overflow:'hidden', isolation:'isolate',
    }}>
      {!staticView && <DeepAmbience count={34} accent={accent} />}

      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:'1.8rem' }}>
        <div style={{ width:28, height:1, background:`${accent}80` }} />
        <span style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.62rem', letterSpacing:'0.28em', textTransform:'uppercase', color:`${accent}cc` }}>
          Hadal Zone · 6,000 – 11,034m
        </span>
      </div>

      <h2 style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(2rem,5vw,3.6rem)', fontWeight:700, lineHeight:1.12, letterSpacing:'-0.01em', color:'#eef5f9', marginBottom:'2.5rem', maxWidth:720 }}>
        Institutional & Government Response
      </h2>

      <WarningBox label="Federal: Bill C-13 (2015)" borderColor="rgba(214,40,40,0.70)">
        <P>The Protecting Canadians from Online Crime Act passed in October 2014 and came into force in March 2015, directly in response to cases like Rehtaeh Parsons. It formally criminalized the non-consensual distribution of intimate images, empowered courts to order the removal of images from the internet, permitted forfeiture of devices used in the offence, and increased penalties for luring children online.</P>
        <P><strong style={{ color:'rgba(225,205,205,0.95)' }}>Evaluation:</strong> Bill C-13 was a necessary but fundamentally incomplete response. It addresses the distribution of images after the harm has already occurred. It does nothing to prevent the digital culture conditions, gender script asymmetries, and normative pressures that produce the harm in the first place. Criminal law treats a structural cultural problem as an individual criminal act. It is reactive, not preventive. It is punishment, not education.</P>
      </WarningBox>

      <WarningBox label="Nova Scotia: Cyber-Safety Act (2013)" borderColor="rgba(230,160,40,0.65)">
        <P>Nova Scotia passed the Cyber-Safety Act in May 2013 (one month after Rehtaeh's death), making it the first anti-cyberbullying legislation in Canada. It authorized courts to grant protection orders limiting what alleged cyberbullies could post online, and created a civil tort of cyberbullying.</P>
        <P>In December 2015, the Supreme Court of Nova Scotia struck down the Act entirely, ruling it a "colossal failure" that violated Charter rights to freedom of expression and liberty. The court found the definition of cyberbullying was unconstitutionally broad.</P>
        <P><strong style={{ color:'rgba(225,205,185,0.95)' }}>Evaluation:</strong> Nova Scotia's experience demonstrates the fundamental difficulty of legislating around digital behaviour and culture. The government moved fast and the law collapsed. This is not an argument against government action; it is an argument that reactive, rushed, criminal and quasi-criminal responses are blunt instruments for what is fundamentally a cultural, educational, and structural problem.</P>
      </WarningBox>

      <div style={{ maxWidth:720, marginBottom:'1.8rem' }}>
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.60rem', letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(120,160,180,0.6)', marginBottom:'1.2rem' }}>
          Ontario Sex Education Curriculum
        </div>
        {[
          { year:'2015', text:"The Liberal government updated Ontario's sex education curriculum for the first time since 1998. The new curriculum included age-appropriate content on gender identity, sexual orientation, consent, online safety, and sexting. It was widely praised by pediatricians, sexual health educators, and child psychologists." },
          { year:'2018', text:"The Ford government scrapped the 2015 curriculum immediately upon taking office, following an organized campaign by socially conservative parent groups. Ontario reverted to a 1998 curriculum, written before smartphones, before social media, before sexting existed as a concept." },
          { year:'2019', text:"After significant public backlash, a new curriculum was released. Research by Oliver & Flicker (2024) documented that Canadian teachers specifically identified the absence of sexting and digital consent content as a critical gap; teachers reported being unprepared and unsupported when students brought these issues to them. The 2019 curriculum partially addressed this but fell short of what educators identified as necessary." },
          { year:'2024', text:"Continued controversy. Catholic school boards in Ontario operate under separately approved curricula that critics argue exclude LGBTQ+ students and omit content on gender identity entirely. No national standard exists." },
        ].map((item,i) => (
          <div key={i} style={{ display:'flex', gap:'1.2rem', marginBottom:'1rem', alignItems:'flex-start' }}>
            <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.72rem', fontWeight:500, color:accent, flexShrink:0, width:42, paddingTop:'0.15rem' }}>{item.year}</div>
            <div style={{ width:1, background:`${accent}30`, flexShrink:0, alignSelf:'stretch', minHeight:40 }} />
            <p style={{ fontFamily:'"Inter Tight",sans-serif', fontSize:'0.96rem', fontWeight:300, lineHeight:1.85, color:'rgba(195,225,238,0.85)', margin:0 }}>{item.text}</p>
          </div>
        ))}
      </div>

      <WarningBox label="What Has NOT Been Done" borderColor="rgba(200,220,240,0.20)">
        <P>No national curriculum standard for sexual health education exists in Canada. No provincial curriculum mandates digital consent education, deepfake awareness, or algorithm literacy. Oliver & Flicker (2024) found that Canadian teachers consistently report being unprepared to address sexting and digital consent in the classroom, not because of unwillingness, but because of absent curriculum support and inadequate training. Mental health resources in schools remain severely underfunded and inequitably distributed. The Hammami et al. (2022) longitudinal data shows these inequalities have widened over 16 years, not narrowed.</P>
      </WarningBox>

      <Stats accent={accent} items={[
        { val:'11,034m', label:'Maximum Depth' },
        { val:'1°C',     label:'Temperature' },
        { val:'1,094 atm',label:'Pressure' },
      ]} />

      {!staticView && (
        <div style={{ position:'absolute', right:'clamp(1rem,4vw,5rem)', top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, opacity:0.30, pointerEvents:'none' }}>
          <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.56rem', letterSpacing:'0.20em', color:accent, writingMode:'vertical-rl' }}>600 – 1,094 atm</div>
          <div style={{ width:1, height:80, background:`linear-gradient(to bottom,${accent}88,transparent)` }} />
        </div>
      )}
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ZONE 6 — ASCENDING / CONCLUSION
// ═══════════════════════════════════════════════════════════════
function Zone6() {
  const accent = '#52b788'
  const [open, setOpen] = useState(null)
  const creatures = [
    {
      label: 'Tier 1: Individual',
      eyebrow: 'Solution Tier 1 · The Ascent',
      title: 'Individual & Family Level',
      body: (
        <div>
          <BulletList accent={accent} items={[
            'Open, ongoing, non-judgmental family communication about sexuality, relationships, and digital culture, not a single "talk" but an ongoing conversation',
            'Teaching media literacy at home: helping teens recognize algorithmic manipulation, distinguish performance from reality, and understand how platforms profit from their attention and insecurity',
            'Normalizing help-seeking behaviour: making it normal to talk to trusted adults, school counsellors, and healthcare providers without shame or consequence',
            "Parents educating themselves about the digital environments their children navigate, not to surveil, but to understand",
          ]} />
          <P><strong style={{ color:'rgba(195,238,218,0.95)' }}>Key evidence:</strong> Data from Statistics Canada and the PHAC HBSC report consistently show that teens who report open communication with parents about sexual health show better outcomes across multiple measures. The evidence runs directly counter to the fear that talking about sex encourages it (Rotermann & McKay, 2020; Craig et al., 2020).</P>
          <P><strong style={{ color:'rgba(195,238,218,0.95)' }}>Why This Tier Alone Is Insufficient:</strong> Individual and family responses depend entirely on the resources, education, time, and cultural context of each family. The 16-year Canadian longitudinal data (Hammami et al., 2022) confirms that socioeconomic status is a persistent predictor of adolescent health outcomes, meaning individual solutions reproduce the stratification they claim to address.</P>
        </div>
      ),
      source: "Rotermann, M., & McKay, A. (2020). | Craig, W., et al. (2020). | Díaz-Rodríguez, M. V., et al. (2024). Children, 11(1), 110. | Hammami, N., et al. (2022).",
    },
    {
      label: 'Tier 2: School',
      eyebrow: 'Solution Tier 2 · The Ascent',
      title: 'School & Community Level',
      body: (
        <div>
          <P>Comprehensive, evidence-based sex education that includes:</P>
          <BulletList accent={accent} items={[
            'Digital consent: what it means, why it matters, and what the legal consequences of non-consensual image sharing are',
            'Healthy relationship skills: recognizing coercion, pressure, and manipulation in digital and in-person contexts',
            'Media literacy and algorithm awareness: understanding how platforms are designed to manipulate attention and shape perceived norms',
            'Inclusive content that addresses the experiences of LGBTQ+ students, not just heterosexual relationships',
          ]} />
          <P>Research by Oliver & Flicker (2024) found that Canadian teachers actively want to include digital consent and sexting content in their teaching; the barrier is not teacher resistance but absent curriculum frameworks and inadequate professional support.</P>
          <BulletList accent={accent} items={[
            'School counsellors with specific training in digital safety, adolescent sexual health, and trauma-informed practice',
            'Youth clinics operating in or near schools with genuinely confidential services',
            'Peer education programs: research consistently shows that education delivered by trained peers is more credible, more accessible, and more effective than top-down adult instruction for adolescents',
          ]} />
          <P><strong style={{ color:'rgba(195,238,218,0.95)' }}>Key evidence:</strong> Comprehensive sex education is the single most well-supported school-based intervention in the research literature. It delays initiation, improves contraceptive use, reduces STI rates, and increases the likelihood that sexual activity, when it occurs, is wanted, consensual, and positive (Oliver & Flicker, 2024; Craig et al., 2020).</P>
        </div>
      ),
      source: 'Oliver, V., & Flicker, S. (2024). Sex Education, 24(3), 369–384. | Craig, W., et al. (2020). PHAC.',
    },
    {
      label: 'Tier 3: Policy',
      eyebrow: 'Solution Tier 3 · The Ascent',
      title: 'Policy & Structural Level',
      body: (
        <div>
          <BulletList accent={accent} items={[
            'A national curriculum standard for sexual health education so that quality does not depend on which province, school board, or individual school a student happens to attend',
            'Mandatory digital literacy and consent education embedded in all provincial curricula, not optional, not dependent on individual teacher initiative',
            'Platform regulation: legally holding social media companies accountable for the algorithmic amplification of harmful, sexualized, or coercive content to minors',
            'Telehealth expansion for youth sexual and mental health services: removing geographic and transportation barriers documented by Shoveller et al. (2004)',
            'Equitable, needs-based funding for mental health resources in schools: the Hammami et al. (2022) longitudinal data shows that inequalities in adolescent mental health outcomes have widened over 16 years, not narrowed',
          ]} />
          <P><strong style={{ color:'rgba(195,238,218,0.95)' }}>Why This Tier Is Not Optional:</strong> Without structural change, individual and school-level solutions will always be unevenly distributed along existing lines of socioeconomic, geographic, and cultural inequality. The problem was produced by structural forces: algorithmic platforms, political decisions about curriculum, inadequate regulation, and unequal resource distribution. Its solution requires structural response at the same level. Durkheim's core insight applies directly: social facts cannot be changed by educating individuals one at a time. The conditions that produce the social fact must change.</P>
        </div>
      ),
      source: 'Oliver, V., & Flicker, S. (2024). | Hammami, N., et al. (2022). | Shoveller, J. A., et al. (2004). Social Science & Medicine, 59(3).',
    },
  ]

  const questions = [
    { code:'Q01', text:"Rehtaeh Parsons' case exposed simultaneous failures at multiple institutional levels: her school, the RCMP, the Nova Scotia legal system, and the platform architecture that made the harassment possible. Which of these failures do you think was most significant, and more importantly, which was most preventable?" },
    { code:'Q02', text:"The normative paradox shows that teens consistently overestimate how sexually active their peers are, even as actual initiation rates decline globally. Given what you now know about Goffman's front stage, Durkheim's social facts, and algorithmic amplification, what would an effective intervention to correct this misperception actually look like?" },
    { code:'Q03', text:"Ontario has revised its sex education curriculum four times in less than a decade, primarily in response to political pressure rather than changes in research evidence. Should sexual health education be treated as a political question or a public health question, and who should have the authority to decide what gets taught to Canadian children?" },
    { code:'Q04', text:"Bill C-13 made the non-consensual distribution of intimate images a criminal offence in Canada. The Nova Scotia Cyber-Safety Act tried to go further and was struck down by the courts. Given the documented limitations of criminal law as a response to this problem, what level of intervention (individual, school, policy, platform regulation) do you believe would have the greatest impact, and why?" },
  ]

  const bibliography = [
    "Aibangbee, M., Micheal, S., Mapedzahama, V., Liamputtong, P., Pithavadian, R., & Hossain, S. Z. (2023). Migrant and refugee youth's sexual and reproductive health and rights: A scoping review to inform policies and programs. International Journal of Public Health.",
    "Avci, G., et al. (2024). A systematic review of social media use and adolescent identity development. Adolescent Research Review. https://doi.org/10.1007/s40894-024-00251-1",
    "Bőthe, B., et al. (2023). Exposure to pornography and adolescent sexual behavior: Systematic review. Journal of Medical Internet Research, 25, e43116. https://doi.org/10.2196/43116",
    "Canada.ca. (2015, March 10). Protecting Canadians from Online Crime Act. Government of Canada.",
    "Craig, W., Pickett, W., & King, M. (2020). The health of Canadian youth: Findings from the Health Behaviour in School-Aged Children study. Public Health Agency of Canada.",
    "Díaz-Rodríguez, M. V., et al. (2024). Insights from a qualitative exploration of adolescents' opinions on sex education. Children, 11(1), 110. https://doi.org/10.3390/children11010110",
    "Flaudias, V., et al. (2025). Social media use and roles of self-objectification, self-compassion and body image concerns: A systematic review. Journal of Eating Disorders, 13(1), 192.",
    "Hammami, N., Azevedo Da Silva, M., & Elgar, F. J. (2022). Trends in gender and socioeconomic inequalities in adolescent health over 16 years (2002–2018). Health Promotion and Chronic Disease Prevention in Canada, 42(2), 68–78.",
    "Holfeld, B., Mishna, F., Craig, W., & Zuberi, S. (2024). A latent profile analysis of the consensual and non-consensual sexting experiences among Canadian adolescents. Youth & Society.",
    "Ji, D., et al. (2025). Sexual health behavior trends in a nationally representative sample of Canadian migrant adolescents from 2014 to 2022. BMC Public Health.",
    "Kim, S., Martin-Storey, A., Drossos, A., Barbosa, S., & Georgiades, K. (2020). Prevalence and correlates of sexting behaviors in a provincially representative sample of adolescents. Canadian Journal of Psychiatry, 65(7).",
    "Költő, A., et al. (2025). Cross-national trends in early sexual initiation among 15-year-old adolescents, 2002–2022. International Journal of Public Health.",
    "Meherali, S., et al. (2022). Understanding the sexual and reproductive health needs of immigrant adolescents in Canada: A qualitative study. Frontiers in Reproductive Health, 4, 940979.",
    "Oliver, V., & Flicker, S. (2024). Declining nudes: Canadian teachers' responses to including sexting in the sexual health and human development curriculum. Sex Education, 24(3), 369–384.",
    "Papageorgiou, A., et al. (2022). \"Why don't I look like her?\" How adolescent girls view social media and its connection to body image. BMC Women's Health, 22, 261.",
    "Rotermann, M., & McKay, A. (2020). Sexual behaviours, condom use and other contraceptive methods among 15- to 24-year-olds in Canada. Health Reports, 31(9), 3–12.",
    "Shoveller, J. A., Johnson, J. L., Langille, D. B., & Mitchell, T. (2004). Socio-cultural influences on young people's sexual development. Social Science & Medicine, 59(3), 473–487.",
    "Statistics Canada. (2024). Canadian Community Health Survey: Sexual health indicators among youth aged 15–24. Catalogue no. 82-003-X.",
    "Tolman, D. L., & McClelland, S. I. (2011). Normative sexuality development in adolescence: A decade in review, 2000–2009. Journal of Research on Adolescence, 21(1), 242–255.",
    "van de Bongardt, D., Reitz, E., Sandfort, T., & Deković, M. (2015). A meta-analysis of the relations between three types of peer norms and adolescent sexual behavior. Personality and Social Psychology Review, 19(3), 203–234.",
  ]

  return (
    <Zone id="zone-6" label="Ascending" depth="Decompression" atm="Normalizing"
      bg="rgba(0,4,18,0.92)" accent={accent} ambient={16}
      title="Conclusion, Solutions & Bibliography"
    >
      {/* Conclusion */}
      <div style={{ maxWidth:720, marginBottom:'2.5rem' }}>
        {[
          "This study set out to defend a single argument: that the normalization of sexual activity among Canadian high school students is not the result of individual moral failure but the product of intersecting technological, psychological, sociological, and cultural forces, and that education, open communication, and structural reform are more effective responses than fear or punishment. The evidence assembled across every layer of this descent supports that position.",
          "The Rehtaeh Parsons case is not an anomaly; it is an extreme, concentrated expression of forces that operate at a lower level of intensity in the daily lives of most Canadian teenagers. The digital transformation of adolescent socialization has not simply given teens new tools for old social processes; it has restructured the fundamental conditions under which identity forms, relationships develop, norms are produced and enforced, and harm occurs.",
          "What the social sciences reveal that a purely moral or statistical approach cannot: behaviour follows structure. Teenagers are not making bad individual choices in a neutral, level environment; they are responding rationally and predictably to the incentives, norms, pressures, and information architecture of the environment they actually inhabit.",
        ].map((para, i) => (
          <p key={i} style={{ fontFamily:'"Inter Tight",sans-serif', fontSize:'clamp(0.96rem,1.4vw,1.05rem)', fontWeight:300, lineHeight:1.95, color:'rgba(195,228,242,0.88)', marginBottom:'1.4rem' }}>{para}</p>
        ))}
        <div style={{ padding:'1.6rem 2rem', background:`${accent}0d`, border:`1px solid ${accent}44`, borderRadius:14 }}>
          <p style={{ fontFamily:'"Playfair Display",serif', fontSize:'clamp(0.95rem,1.5vw,1.06rem)', fontStyle:'italic', fontWeight:400, lineHeight:1.9, color:'rgba(225,248,238,0.92)', margin:0 }}>
            "The research is consistent across decades and jurisdictions: comprehensive education, open communication, and structural policy reform produce measurably better outcomes than shame, restriction, fear-based messaging, and reactive criminal law. The question is not whether we know what works. The question is whether institutions and governments are willing to act on that knowledge, or whether the next Rehtaeh Parsons will have to happen first."
          </p>
        </div>
      </div>

      {/* Three-tier aquarium */}
      <Aquarium creatures={creatures} accent={accent} onSelect={setOpen} />

      {/* Discussion questions */}
      <div style={{ maxWidth:720, marginTop:'3rem', marginBottom:'3rem' }}>
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.60rem', letterSpacing:'0.22em', textTransform:'uppercase', color:`${accent}88`, marginBottom:'1.4rem' }}>
          Discussion Questions
        </div>
        {questions.map(({ code, text }) => (
          <div key={code} style={{ display:'flex', gap:'1.2rem', marginBottom:'1.4rem', alignItems:'flex-start' }}>
            <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.65rem', color:`${accent}99`, flexShrink:0, paddingTop:'0.18rem', width:32 }}>{code}</div>
            <p style={{ fontFamily:'"Inter Tight",sans-serif', fontSize:'0.96rem', fontWeight:300, lineHeight:1.9, color:'rgba(195,225,238,0.85)', margin:0 }}>{text}</p>
          </div>
        ))}
      </div>

      {/* Bibliography */}
      <div style={{ maxWidth:760 }}>
        <div style={{ fontFamily:'"JetBrains Mono",monospace', fontSize:'0.60rem', letterSpacing:'0.22em', textTransform:'uppercase', color:`${accent}88`, marginBottom:'1.4rem' }}>
          Bibliography
        </div>
        {bibliography.map((entry, i) => (
          <p key={i} style={{
            fontFamily:'"Inter Tight",sans-serif', fontSize:'0.85rem', fontWeight:300,
            lineHeight:1.8, color:'rgba(155,200,218,0.70)',
            marginBottom:'0.9rem', paddingLeft:'1.4rem', textIndent:'-1.4rem',
          }}>
            {entry}
          </p>
        ))}
      </div>

      <Stats accent={accent} items={[
        { val:'20', label:'Sources Cited' },
        { val:'3',  label:'Solution Tiers' },
        { val:'4',  label:'Discussion Questions' },
      ]} />

      {open && <OrbModal orb={open} accent={accent} onClose={() => setOpen(null)} />}
    </Zone>
  )
}

// ─── EXPORT ───────────────────────────────────────────────────
export function ContentZones({ staticView = false }) {
  return (
    <StaticViewContext.Provider value={staticView}>
      <style>{ANIM_CSS}</style>
      <Zone1 />
      <Zone1b />
      <Zone2 />
      <Zone3 />
      <Zone4 />
      <Zone5 />
      <Zone6 />
    </StaticViewContext.Provider>
  )
}
