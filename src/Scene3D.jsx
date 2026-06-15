import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sky, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { OceanWater } from './OceanWater.jsx'
import { Yacht3D } from './Yacht3D.jsx'
import { DIVE_AT } from './journey.js'

// ─── SCROLL CHOREOGRAPHY ─────────────────────────────────────
// Breakpoint camera path. `at` = page-scroll fraction, tuned to where the
// content zones actually sit in the document. `rel: true` means the point
// is in boat space (rotated by heading, offset by position) so boarding
// still lines up after the user has sailed the yacht around at the hero.
// fog: [color, density] — applied only while the camera is underwater.
//
// The journey: OUTSIDE (hero broadside) → swivel around the stern →
// INSIDE (aft pool deck, thesis is read here) → over the rail →
// OUTSIDE AGAIN (full exterior view off the side) → drop, splash —
// the dive begins → descend through the zones → ascend.
const PATH = [
  { at: 0.000,   p: [-42, 13, 16],     l: [16, 2.5, 0],    rel: true,  fog: [0xb8dce8, 0.0015] }, // OUTSIDE — stern chase, bow to the horizon
  { at: 0.030,   p: [-34, 9.5, 18],    l: [2, 3.5, 0],     rel: true,  fog: [0xb8dce8, 0.0015] }, // easing down toward the boat
  { at: 0.052,   p: [-24, 6.5, 15],    l: [-6, 4.0, 0],    rel: true,  fog: [0xb8dce8, 0.0015] }, // swinging to the aft deck
  { at: 0.070,   p: [-15.5, 4.6, 4],   l: [-7, 3.8, 0],    rel: true,  fog: [0xb8dce8, 0.0015] }, // over the swim platform
  { at: 0.088,   p: [-12.0, 3.95, 0],  l: [-5.9, 3.6, 0],  rel: true,  fog: [0xb8dce8, 0.0015] }, // INSIDE — the pool deck
  { at: 0.116,   p: [-10.6, 3.90, 0],  l: [-5.9, 3.5, 0],  rel: true,  fog: [0xb8dce8, 0.0015] }, // dwell while reading the thesis
  { at: 0.134,   p: [-6, 4.6, 8],      l: [-4, 3.2, 0],    rel: true,  fog: [0xb8dce8, 0.0015] }, // stepping over the rail
  { at: 0.148,   p: [-2, 5.5, 17],     l: [-3, 2.5, 0],    rel: true,  fog: [0xb8dce8, 0.0015] }, // OUTSIDE AGAIN — full exterior view
  { at: DIVE_AT, p: [0, 1.2, 19],      l: [0, -3.5, 20],   rel: true,  fog: [0x1a6a96, 0.0100] }, // the jump — falling toward the water
  { at: 0.172,   p: [0, -3.5, 22],     l: [0, -6.5, 12],   rel: false, fog: [0x1a6a96, 0.0100] }, // splash — underwater
  { at: 0.205,   p: [0, -5.0, 25],     l: [0, -7.0, 2],    rel: false, fog: [0x10507a, 0.0110] }, // epipelagic drift (zone 1b)
  { at: 0.277,   p: [0, -7.0, 26],     l: [0, -9.0, 0],    rel: false, fog: [0x002540, 0.0140] }, // zone 2 — mesopelagic
  { at: 0.361,   p: [0, -14.0, 26],    l: [0, -16.0, 0],   rel: false, fog: [0x000618, 0.0220] }, // zone 3 — bathypelagic
  { at: 0.441,   p: [0, -22.0, 24],    l: [0, -24.0, 0],   rel: false, fog: [0x01000a, 0.0320] }, // zone 4 — abyssal
  { at: 0.587,   p: [0, -30.0, 22],    l: [0, -32.0, 0],   rel: false, fog: [0x030100, 0.0500] }, // zone 5 — hadal
  { at: 0.851,   p: [2, -12.0, 27],    l: [0, -14.0, 0],   rel: false, fog: [0x000b16, 0.0130] }, // zone 6 — ascending
  { at: 1.000,   p: [0, -3.5, 31],     l: [0, -4.5, 0],    rel: false, fog: [0x0a3850, 0.0060] }, // back toward the light
]
const FOG_COLOR_OBJS = PATH.map(n => new THREE.Color(n.fog[0]))

// ─── MARINE ANIMALS ──────────────────────────────────────────

// Simple fish body shape
function Fish({ pos, color = 0x88ccee, scale = 1 }) {
  const ref = useRef()
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])
  const speed  = useMemo(() => 0.3 + Math.random() * 0.4, [])
  const radius = useMemo(() => 4 + Math.random() * 8, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * speed + offset
    ref.current.position.x = pos[0] + Math.sin(t) * radius
    ref.current.position.y = pos[1] + Math.sin(t * 1.3) * 0.8
    ref.current.position.z = pos[2] + Math.cos(t) * radius * 0.6
    ref.current.rotation.y = Math.atan2(
      Math.cos(t) * radius,
      Math.sin(t) * radius
    ) + Math.PI / 2
  })

  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1 }), [color])

  return (
    <group ref={ref} scale={scale}>
      <mesh material={mat}>
        <sphereGeometry args={[0.22, 8, 5]} />
      </mesh>
      <mesh material={mat} position={[-0.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.14, 0.28, 5]} />
      </mesh>
    </group>
  )
}

// Bioluminescent jellyfish
function Jellyfish({ pos, color = 0x0088ff }) {
  const ref = useRef()
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * 0.4 + offset
    ref.current.position.y = pos[1] + Math.sin(t) * 1.5
    ref.current.position.x = pos[0] + Math.sin(t * 0.7) * 2
    ref.current.position.z = pos[2] + Math.cos(t * 0.5) * 2
    // Pulse bell
    const pulse = 0.85 + Math.sin(t * 2.5) * 0.12
    ref.current.scale.setScalar(pulse)
  })

  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color, roughness: 0.1, transparent: true, opacity: 0.65,
    emissive: new THREE.Color(color), emissiveIntensity: 0.35,
  }), [color])
  const tentacleMat = useMemo(() => new THREE.MeshStandardMaterial({
    color, transparent: true, opacity: 0.4,
    emissive: new THREE.Color(color), emissiveIntensity: 0.2,
  }), [color])

  return (
    <group ref={ref} position={pos}>
      {/* Bell */}
      <mesh material={mat} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.6, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      {/* Tentacles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} material={tentacleMat}
            position={[Math.cos(a) * 0.3, -0.4, Math.sin(a) * 0.3]}>
            <cylinderGeometry args={[0.02, 0.01, 2.5 + Math.random(), 4]} />
          </mesh>
        )
      })}
    </group>
  )
}

// Whale — glides slowly through the mid-water
function Whale({ pos }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * 0.06
    ref.current.position.x = pos[0] + Math.sin(t) * 30
    ref.current.position.z = pos[2] + Math.cos(t * 0.7) * 20
    ref.current.rotation.y = t + Math.PI / 2
    ref.current.position.y = pos[1] + Math.sin(t * 0.4) * 1.2
  })
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x2a3a4a, roughness: 0.7 }), [])
  const bellMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xd4c8a8, roughness: 0.9 }), [])

  return (
    <group ref={ref} position={pos} scale={2.2}>
      {/* Body */}
      <mesh material={mat} scale={[2.5, 0.7, 0.9]}>
        <sphereGeometry args={[1, 12, 8]} />
      </mesh>
      {/* Belly */}
      <mesh material={bellMat} scale={[2.2, 0.4, 0.75]} position={[0, -0.3, 0]}>
        <sphereGeometry args={[1, 10, 6]} />
      </mesh>
      {/* Tail flukes */}
      <mesh material={mat} position={[-2.5, 0, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.8, 1.4, 0.12]} />
      </mesh>
      <mesh material={mat} position={[-2.5, 0, 0]} rotation={[0, 0, -Math.PI / 6]}>
        <boxGeometry args={[0.8, 1.4, 0.12]} />
      </mesh>
      {/* Dorsal fin */}
      <mesh material={mat} position={[0.5, 0.85, 0]}>
        <coneGeometry args={[0.3, 0.9, 4]} />
      </mesh>
    </group>
  )
}

// Anglerfish with glowing lure
function Anglerfish({ pos }) {
  const ref = useRef()
  const lureRef = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.position.x = pos[0] + Math.sin(t * 0.18) * 5
    ref.current.position.z = pos[2] + Math.cos(t * 0.14) * 5
    ref.current.position.y = pos[1] + Math.sin(t * 0.22) * 2
    ref.current.rotation.y = t * 0.18
    if (lureRef.current) {
      lureRef.current.material.emissiveIntensity = 1.5 + Math.sin(t * 3.5) * 0.6
    }
  })
  const bodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0x0c0810, roughness: 0.9 }), [])
  const lureMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x88ffcc, emissive: new THREE.Color(0x44ffaa), emissiveIntensity: 1.5,
  }), [])

  return (
    <group ref={ref} position={pos} scale={1.4}>
      {/* Body */}
      <mesh material={bodyMat} scale={[1.6, 1.0, 0.9]}>
        <sphereGeometry args={[0.6, 10, 7]} />
      </mesh>
      {/* Big mouth */}
      <mesh material={bodyMat} position={[0.7, -0.2, 0]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.7, 0.15, 0.7]} />
      </mesh>
      {/* Lure stem */}
      <mesh material={bodyMat} position={[0.3, 0.9, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.9, 5]} />
      </mesh>
      {/* Glowing lure ball */}
      <mesh ref={lureRef} material={lureMat} position={[0.3, 1.45, 0]}>
        <sphereGeometry args={[0.14, 10, 8]} />
      </mesh>
    </group>
  )
}

// Giant squid
function GiantSquid({ pos }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * 0.12
    ref.current.position.x = pos[0] + Math.sin(t) * 12
    ref.current.position.z = pos[2] + Math.cos(t * 0.8) * 10
    ref.current.position.y = pos[1] + Math.sin(t * 0.5) * 3
    ref.current.rotation.y = -t + Math.PI
  })
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x380018, roughness: 0.6,
    emissive: new THREE.Color(0x180008), emissiveIntensity: 0.3,
  }), [])

  return (
    <group ref={ref} position={pos}>
      {/* Mantle */}
      <mesh material={mat} scale={[0.6, 1.8, 0.6]}>
        <sphereGeometry args={[0.9, 10, 8]} />
      </mesh>
      {/* Head */}
      <mesh material={mat} position={[0, -1.6, 0]} scale={[0.8, 0.6, 0.8]}>
        <sphereGeometry args={[0.7, 10, 8]} />
      </mesh>
      {/* Tentacles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2
        return (
          <mesh key={i} material={mat}
            position={[Math.cos(a) * 0.4, -2.2, Math.sin(a) * 0.4]}
            rotation={[0.3, 0, a]}>
            <cylinderGeometry args={[0.05, 0.02, 4 + Math.random() * 2, 5]} />
          </mesh>
        )
      })}
    </group>
  )
}

// Tiny hadal amphipods cluster
function Amphipods({ pos }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() * 0.25
    ref.current.rotation.y = t
    ref.current.position.y = pos[1] + Math.sin(t * 0.6) * 1
  })
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0x88aacc, transparent: true, opacity: 0.55,
    emissive: new THREE.Color(0x1a2a3a), emissiveIntensity: 0.2,
  }), [])

  return (
    <group ref={ref} position={pos}>
      {Array.from({ length: 14 }).map((_, i) => (
        <mesh key={i} material={mat}
          position={[
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 3,
            (Math.random() - 0.5) * 5,
          ]}>
          <sphereGeometry args={[0.12 + Math.random() * 0.10, 6, 4]} />
        </mesh>
      ))}
    </group>
  )
}

// All marine life, visibility driven by scroll
function MarineLife({ scrollRef }) {
  const containerRef = useRef()

  useFrame(() => {
    if (!containerRef.current) return
    const sp = scrollRef.current
    containerRef.current.visible = sp > 0.16
  })

  return (
    <group ref={containerRef} visible={false}>

      {/* Zone 1 — 0-200m : dolphins + fish schools */}
      {Array.from({ length: 12 }).map((_, i) => (
        <Fish key={`z1f${i}`}
          pos={[Math.sin(i) * 18, -4 - Math.random() * 6, Math.cos(i) * 12 + 5]}
          color={i % 3 === 0 ? 0x66aacc : i % 3 === 1 ? 0x88ccee : 0xddaa66}
          scale={0.8 + Math.random() * 0.6}
        />
      ))}
      <Whale pos={[0, -6, 0]} />

      {/* Zone 2 — 200-1000m : jellyfish */}
      {Array.from({ length: 8 }).map((_, i) => (
        <Jellyfish key={`jf${i}`}
          pos={[Math.sin(i * 1.3) * 15, -12 - Math.random() * 5, Math.cos(i * 1.3) * 12 + 4]}
          color={i % 2 === 0 ? 0x0055ff : 0x00aaff}
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <Fish key={`z2f${i}`}
          pos={[Math.sin(i * 0.9) * 14, -10 - Math.random() * 5, Math.cos(i * 0.9) * 10 + 4]}
          color={0x002244}
          scale={0.5}
        />
      ))}

      {/* Zone 3 — 1000-4000m : anglerfish + giant squid */}
      <Anglerfish pos={[8, -20, 14]} />
      <Anglerfish pos={[-10, -18, 18]} />
      <GiantSquid pos={[0, -22, 10]} />
      {Array.from({ length: 6 }).map((_, i) => (
        <Fish key={`z3f${i}`}
          pos={[Math.sin(i * 1.1) * 12, -16 - Math.random() * 6, Math.cos(i * 1.1) * 10 + 4]}
          color={0x001122}
          scale={0.4}
        />
      ))}

      {/* Zone 4 — 4000-6000m : deep creatures */}
      <GiantSquid pos={[-8, -28, 12]} />
      {Array.from({ length: 5 }).map((_, i) => (
        <Jellyfish key={`z4j${i}`}
          pos={[Math.sin(i * 1.7) * 10, -26 - Math.random() * 4, Math.cos(i * 1.7) * 8 + 4]}
          color={0x440088}
        />
      ))}

      {/* Zone 5 — hadal : amphipods */}
      <Amphipods pos={[5, -34, 10]} />
      <Amphipods pos={[-7, -36, 15]} />
      <Amphipods pos={[2, -38, 8]} />
    </group>
  )
}

// ─── WAKE SPRAY ──────────────────────────────────────────────
// Soft round foam sprite (radial gradient on a canvas)
function makeFoamTexture() {
  const s = 64
  const c = document.createElement('canvas'); c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0,    'rgba(255,255,255,1)')
  g.addColorStop(0.45, 'rgba(232,244,250,0.55)')
  g.addColorStop(1,    'rgba(232,244,250,0)')
  ctx.fillStyle = g; ctx.fillRect(0, 0, s, s)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

// Particle wake + bow spray that scales with boat speed — replaces the cone.
function WakeSpray({ boatStateRef }) {
  const COUNT = 600
  const buf = useMemo(() => {
    const o = {
      pos: new Float32Array(COUNT * 3), vel: new Float32Array(COUNT * 3),
      life: new Float32Array(COUNT), max: new Float32Array(COUNT), head: 0,
    }
    for (let i = 0; i < COUNT; i++) o.pos[i * 3 + 1] = -9999
    return o
  }, [])
  const aLife = useMemo(() => new Float32Array(COUNT), [])
  const tex = useMemo(makeFoamTexture, [])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(buf.pos, 3))
    g.setAttribute('aLife', new THREE.BufferAttribute(aLife, 1))
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6)
    return g
  }, [buf, aLife])

  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: { uTex: { value: tex }, uColor: { value: new THREE.Color(0xffffff) }, uSize: { value: 6.0 } },
    vertexShader: `
      attribute float aLife; varying float vLife; uniform float uSize;
      void main(){
        vLife = aLife;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float grow = 1.0 + (1.0 - aLife) * 1.8;          // mist spreads as it ages
        gl_PointSize = clamp(uSize * grow * (200.0 / -mv.z), 1.0, 130.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform sampler2D uTex; uniform vec3 uColor; varying float vLife;
      void main(){
        vec4 t = texture2D(uTex, gl_PointCoord);
        float fade = smoothstep(0.0, 0.14, vLife) * vLife;  // quick fade-in, linear fade-out
        float a = t.a * fade;
        if (a < 0.01) discard;
        gl_FragColor = vec4(uColor, a * 0.92);
      }`,
    transparent: true, depthWrite: false,
  }), [tex])

  useFrame((_, delta) => {
    const b = boatStateRef?.current
    if (!b) return
    const dt = Math.min(delta, 0.05)
    const spd = b.speed
    const c = Math.cos(b.heading), s = Math.sin(b.heading)
    const sternX = b.pos.x - c * 14, sternZ = b.pos.z + s * 14
    const bowX = b.pos.x + c * 15, bowZ = b.pos.z - s * 15

    // emit (rate scales with speed; lateral axis = local +z = (s, c))
    const emit = Math.min(24, Math.floor(spd * 1.6))
    for (let e = 0; e < emit; e++) {
      const i = buf.head; buf.head = (buf.head + 1) % COUNT
      const k = i * 3
      const lat = (Math.random() - 0.5) * 9
      if (spd > 11 && Math.random() < 0.28) {
        // bow spray — kicks up and out ahead
        buf.pos[k] = bowX + s * lat * 0.5; buf.pos[k + 1] = 0.6 + Math.random() * 0.6; buf.pos[k + 2] = bowZ + c * lat * 0.5
        buf.vel[k]     = c * spd * 0.12 + s * Math.sign(lat) * 2.6 + (Math.random() - 0.5)
        buf.vel[k + 1] = 3.0 + Math.random() * 3.2
        buf.vel[k + 2] = -s * spd * 0.12 + c * Math.sign(lat) * 2.6 + (Math.random() - 0.5)
      } else {
        // stern wake — churns up into mist, spreads into a V, and lingers near the boat
        buf.pos[k] = sternX + s * lat; buf.pos[k + 1] = 0.4 + Math.random() * 0.5; buf.pos[k + 2] = sternZ + c * lat
        buf.vel[k]     = -c * spd * 0.05 + s * lat * 0.5 + (Math.random() - 0.5)
        buf.vel[k + 1] = 1.6 + Math.random() * 2.6
        buf.vel[k + 2] = s * spd * 0.05 + c * lat * 0.5 + (Math.random() - 0.5)
      }
      const life = 1.2 + Math.random() * 1.2
      buf.life[i] = life; buf.max[i] = life
    }

    // integrate
    for (let i = 0; i < COUNT; i++) {
      if (buf.life[i] <= 0) { aLife[i] = 0; continue }
      buf.life[i] -= dt
      const k = i * 3
      buf.vel[k + 1] -= 3.4 * dt                 // gravity
      buf.vel[k] *= 0.95; buf.vel[k + 1] *= 0.985; buf.vel[k + 2] *= 0.95 // drag
      buf.pos[k] += buf.vel[k] * dt; buf.pos[k + 1] += buf.vel[k + 1] * dt; buf.pos[k + 2] += buf.vel[k + 2] * dt
      if (buf.pos[k + 1] < 0.06) { buf.pos[k + 1] = 0.06; buf.vel[k + 1] *= -0.18; buf.vel[k] *= 0.7; buf.vel[k + 2] *= 0.7 } // skim the surface
      aLife[i] = buf.life[i] / buf.max[i]
    }
    geo.attributes.position.needsUpdate = true
    geo.attributes.aLife.needsUpdate = true
  })

  return <points geometry={geo} material={mat} frustumCulled={false} />
}

// ─── HELM CHALLENGE — sail through the gates (hero minigame) ──
function Checkpoints({ boatStateRef, scrollRef, gameRef }) {
  const COURSE = useMemo(() => [
    { x: 120, z: 20   }, { x: 250, z: -85  }, { x: 195, z: -240 }, { x: 15,  z: -285 },
    { x: -120,z: -165 }, { x: -100,z: 45   }, { x: 70,  z: 165  }, { x: 200, z: 90 },
  ], [])
  const groupRefs = useRef([])
  const beamRef   = useRef()
  const flashRef  = useRef()
  const S = useRef({ idx: 0, collected: 0, started: false, startT: 0, done: false, finalTime: 0, flashT: -10 })

  const mats = useMemo(() => ({
    ringCur:  new THREE.MeshStandardMaterial({ color: 0x00e0ff, emissive: new THREE.Color(0x00c4f0), emissiveIntensity: 2.4, transparent: true, opacity: 0.92 }),
    ringNext: new THREE.MeshStandardMaterial({ color: 0xc9a84c, emissive: new THREE.Color(0xc9a84c), emissiveIntensity: 0.6, transparent: true, opacity: 0.5 }),
    buoyCur:  new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: new THREE.Color(0x00e0ff), emissiveIntensity: 2.6 }),
    buoyNext: new THREE.MeshStandardMaterial({ color: 0xc9a84c, emissive: new THREE.Color(0xc9a84c), emissiveIntensity: 0.7 }),
    beam:  new THREE.MeshBasicMaterial({ color: 0x66ecff, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false }),
    flash: new THREE.MeshBasicMaterial({ color: 0xbfffff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }),
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const b = boatStateRef.current
    const g = gameRef?.current
    if (!g) return
    const atHero = scrollRef.current < 0.045

    if (g.resetRequested) {
      S.current = { idx: 0, collected: 0, started: false, startT: 0, done: false, finalTime: 0, flashT: -10 }
      g.engaged = false // bring the hero text back when re-racing
      g.resetRequested = false
    }
    const st = S.current

    // ── collision detection against the current gate ──
    if (atHero && !st.done && st.idx < COURSE.length) {
      const c = COURSE[st.idx]
      if (Math.hypot(b.pos.x - c.x, b.pos.z - c.z) < 18) {
        if (st.idx === 0) { st.started = true; st.startT = t } // first gate starts the clock
        st.idx++; st.collected++; st.flashT = t
        if (flashRef.current) flashRef.current.position.set(c.x, 0.5, c.z)
        if (st.idx >= COURSE.length) { st.done = true; st.finalTime = t - st.startT }
      }
    }

    // ── gate visuals ──
    groupRefs.current.forEach((grp, i) => {
      if (!grp) return
      grp.visible = atHero && i >= st.idx
      if (!grp.visible) return
      grp.position.y = Math.sin(t * 1.4 + i) * 0.4
      grp.rotation.y = t * 0.5 + i
      const isCur = i === st.idx
      grp.children.forEach(ch => {
        ch.material = ch.geometry.type === 'TorusGeometry'
          ? (isCur ? mats.ringCur : mats.ringNext)
          : (isCur ? mats.buoyCur : mats.buoyNext)
      })
    })

    // ── guiding light beam at the current gate ──
    if (beamRef.current) {
      const show = atHero && !st.done && st.idx < COURSE.length
      beamRef.current.visible = show
      if (show) { const c = COURSE[st.idx]; beamRef.current.position.set(c.x, 22, c.z) }
    }

    // ── collect flash ──
    if (flashRef.current) {
      const dtf = t - st.flashT
      if (dtf >= 0 && dtf < 0.6) { const p = dtf / 0.6; flashRef.current.visible = true; flashRef.current.scale.setScalar(1 + p * 5); mats.flash.opacity = (1 - p) * 0.85 }
      else flashRef.current.visible = false
    }

    // ── mirror state to the HUD ──
    g.active = atHero
    g.idx = st.idx
    g.collected = st.collected
    g.total = COURSE.length
    g.done = st.done
    g.started = st.started
    g.elapsed = st.done ? st.finalTime : (st.started ? t - st.startT : 0)
    g.speed = b.speed
  })

  return (
    <group>
      {COURSE.map((c, i) => (
        <group key={i} ref={el => (groupRefs.current[i] = el)} position={[c.x, 0, c.z]} visible={false}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.4, 0]} material={mats.ringNext}>
            <torusGeometry args={[15, 0.85, 10, 36]} />
          </mesh>
          <mesh position={[0, 2.6, 0]} material={mats.buoyNext}>
            <coneGeometry args={[1.3, 5.2, 10]} />
          </mesh>
        </group>
      ))}
      <mesh ref={beamRef} material={mats.beam} visible={false}>
        <cylinderGeometry args={[2.4, 2.4, 44, 14, 1, true]} />
      </mesh>
      <mesh ref={flashRef} material={mats.flash} rotation={[Math.PI / 2, 0, 0]} visible={false}>
        <torusGeometry args={[15, 1.6, 8, 32]} />
      </mesh>
    </group>
  )
}

// ─── UNDERWATER PARTICLES ────────────────────────────────────
function UnderwaterParticles({ scrollRef }) {
  const ref = useRef()
  const pos = useMemo(() => {
    const arr = new Float32Array(1200 * 3)
    for (let i = 0; i < 1200; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 80
      arr[i * 3 + 1] = Math.random() * -80
      arr[i * 3 + 2] = (Math.random() - 0.5) * 80
    }
    return arr
  }, [])
  useFrame(({ clock }) => {
    if (!ref.current) return
    const sp = scrollRef.current
    ref.current.visible = sp > 0.16
    ref.current.material.opacity = Math.min(1, (sp - 0.16) * 8) * 0.55
    ref.current.rotation.y = clock.getElapsedTime() * 0.004
  })
  return (
    <points ref={ref} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={pos} count={1200} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color="#00b4d8" transparent opacity={0} sizeAttenuation depthWrite={false} />
    </points>
  )
}

// ─── OCEAN FLOOR ─────────────────────────────────────────────
function OceanFloor({ scrollRef }) {
  const ref = useRef()
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(300, 300, 80, 80)
    g.rotateX(-Math.PI / 2)
    const p = g.attributes.position
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i)
      p.setY(i, -55 + Math.sin(x * 0.18 + z * 0.22) * 1.2 + Math.sin(x * 0.42 + z * 0.31) * 0.6 + Math.random() * 0.4)
    }
    g.computeVertexNormals()
    return g
  }, [])
  useFrame(() => {
    if (!ref.current) return
    const sp = scrollRef.current
    ref.current.visible = sp > 0.30
    ref.current.material.opacity = Math.min(1, (sp - 0.30) * 4)
  })
  return (
    <mesh ref={ref} geometry={geo} visible={false}>
      <meshStandardMaterial
        color={0x0a0510} roughness={0.95} metalness={0.02}
        emissive={new THREE.Color(0x080308)} emissiveIntensity={0.4}
        transparent opacity={0}
      />
    </mesh>
  )
}

// ─── SCENE CONTROLLER (camera + keyboard + boat physics) ─────
function SceneController({ scrollRef, boatStateRef, flightRef, gameRef }) {
  const { camera, scene } = useThree()
  const tPos  = useRef(new THREE.Vector3(-42, 13, 16))
  const tLook = useRef(new THREE.Vector3(16, 2.5, 0))
  const ptA = useRef(new THREE.Vector3())
  const ptB = useRef(new THREE.Vector3())
  const lkA = useRef(new THREE.Vector3())
  const lkB = useRef(new THREE.Vector3())
  const fogColor = useRef(new THREE.Color())
  const keys  = useRef({})
  const spSmooth = useRef(0)
  const inited   = useRef(false)
  // ── sky-flight state machine ──
  const flMode  = useRef('none')
  const flT     = useRef(0)
  const flAng   = useRef(0)
  const flStart = useRef(new THREE.Vector3())

  useEffect(() => {
    const dn = e => { keys.current[e.key] = true;  if (e.key.startsWith('Arrow')) e.preventDefault() }
    const up = e => { keys.current[e.key] = false }
    window.addEventListener('keydown', dn)
    window.addEventListener('keyup',   up)
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up) }
  }, [])

  useFrame((state, delta) => {
    // Clamp delta so a tab-refocus pause can't fling the camera
    const dt = Math.min(delta, 0.05)
    const spRaw = scrollRef.current
    if (!inited.current) { spSmooth.current = spRaw; inited.current = true }
    // Smooth the scroll input so discrete wheel / trackpad steps glide
    // instead of jolting the camera between waypoints.
    spSmooth.current += (spRaw - spSmooth.current) * (1 - Math.exp(-dt / 0.09))
    const sp = spSmooth.current
    const b  = boatStateRef.current

    // ── Sky flight (citations launch) — overrides the scroll camera ──
    const fmode = flightRef?.current?.mode ?? 'none'
    if (fmode !== flMode.current) {
      if (fmode !== 'none') {
        flT.current = 0
        flStart.current.copy(camera.position)
        flAng.current = Math.atan2(camera.position.z - b.pos.z, camera.position.x - b.pos.x)
      } else {
        spSmooth.current = scrollRef.current // snap the scroll-cam back on return to sea
      }
      flMode.current = fmode
    }
    if (fmode !== 'none') {
      flT.current += dt
      const lrp = (a, z, t) => a + (z - a) * t
      const smoothstep = t => t * t * (3 - 2 * t)
      const SKY_Y = 95, SKY_R = 62
      const bx = b.pos.x, bz = b.pos.z
      if (fmode === 'launch') {
        const p = Math.min(flT.current / 3.4, 1)
        const e = smoothstep(p)
        const ang = flAng.current + (1 - Math.pow(1 - p, 2)) * Math.PI * 2.6 // accelerating spin
        const radius = lrp(7, SKY_R, e)
        tPos.current.set(bx + Math.cos(ang) * radius, lrp(flStart.current.y, SKY_Y, e), bz + Math.sin(ang) * radius)
        tLook.current.set(bx, lrp(Math.min(flStart.current.y, 0) * 0.5, 9, e), bz)
        // burn off the deep murk as the whirlpool launches us upward
        if (scene.fog) { scene.fog.density *= Math.max(0, 1 - dt * 3.2); if (scene.fog.density < 0.0006) { scene.fog = null; scene.background = null } }
      } else if (fmode === 'sky') {
        const ang = flAng.current + flT.current * 0.05
        tPos.current.set(bx + Math.cos(ang) * SKY_R, SKY_Y, bz + Math.sin(ang) * SKY_R)
        tLook.current.set(bx, 9, bz)
        scene.fog = null; scene.background = null
      } else { // descend — fall back to the sea
        const p = Math.min(flT.current / 3.0, 1)
        const e = p * p
        const c = Math.cos(b.heading), s = Math.sin(b.heading)
        const ox = -42, oy = 13, oz = 16
        const hx = bx + ox * c + oz * s, hz = bz - ox * s + oz * c
        tPos.current.set(lrp(flStart.current.x, hx, e), lrp(SKY_Y, oy, e), lrp(flStart.current.z, hz, e))
        tLook.current.set(bx, lrp(9, 2.5, e), bz)
        scene.fog = null; scene.background = null
      }
      camera.position.lerp(tPos.current, 1 - Math.exp(-dt / (fmode === 'sky' ? 0.6 : 0.16)))
      camera.lookAt(tLook.current)
      return
    }

    // ── Boat physics (sailable only at the hero) ──
    const CRUISE = 4.0 // baseline headway so the yacht is always making way
    if (sp < 0.03) {
      const k = keys.current
      if (gameRef?.current) {
        const g = gameRef.current
        // first arrow press "engages" the helm → hero text clears for the race
        if (!g.engaged && (k['ArrowUp'] || k['ArrowDown'] || k['ArrowLeft'] || k['ArrowRight'])) g.engaged = true
        // steering hard at speed throws spray against the lens
        g.turn = (k['ArrowLeft'] || k['ArrowRight']) && b.speed > 6 ? Math.min(b.speed / 20, 1) : 0
        if (k['ArrowLeft']) g.turnSide = 'left'
        else if (k['ArrowRight']) g.turnSide = 'right'
      }
      if (keys.current['ArrowLeft'])  b.heading += dt * 1.1
      if (keys.current['ArrowRight']) b.heading -= dt * 1.1
      if (keys.current['ArrowUp'])    b.targetSpeed = Math.min(b.targetSpeed + dt * 5.0, 26)
      if (keys.current['ArrowDown'])  b.targetSpeed = Math.max(b.targetSpeed - dt * 6.0,  0)
      // always cruise unless the helmsman is actively braking
      if (!keys.current['ArrowDown']) b.targetSpeed = Math.max(b.targetSpeed, CRUISE)
    }
    b.targetSpeed *= 0.997
    b.speed += (b.targetSpeed - b.speed) * 0.08
    // Move bow-first: the hull's bow points along local +x
    b.pos.x += Math.cos(b.heading) * b.speed * dt
    b.pos.z -= Math.sin(b.heading) * b.speed * dt

    // Boat-space → world-space (matches the yacht group's transform)
    const setPoint = (node, arr, out) => {
      if (!node.rel) { out.set(arr[0], arr[1], arr[2]); return }
      const c = Math.cos(b.heading), s = Math.sin(b.heading)
      out.set(
        b.pos.x + arr[0] * c + arr[2] * s,
        arr[1],
        b.pos.z - arr[0] * s + arr[2] * c,
      )
    }

    // ── Camera ──
    let segI = 0, segT = 0

    if (sp < 0.02) {
      const c = Math.cos(b.heading), s = Math.sin(b.heading)
      // While racing the helm challenge: a higher, pulled-in chase that keeps
      // the ship centred for navigation. Otherwise the cinematic stern chase
      // with the bow leading to the horizon (and back to it once completed).
      const racing = gameRef?.current?.engaged && !gameRef.current.done
      const ox = racing ? -36 : -42
      const oy = racing ?  20 :  13
      const oz = racing ?  12 :  16
      const lx = racing ?   4 :  16
      const ly = racing ?   3 : 2.5
      tPos.current.set(
        b.pos.x + ox * c + oz * s,
        oy,
        b.pos.z - ox * s + oz * c,
      )
      tLook.current.set(b.pos.x + lx * c, ly, b.pos.z - lx * s)
    } else {
      let i = 0
      while (i < PATH.length - 2 && sp > PATH[i + 1].at) i++
      const a = PATH[i], n = PATH[i + 1]
      let zp = Math.min(Math.max((sp - a.at) / (n.at - a.at), 0), 1)
      zp = zp * zp * (3 - 2 * zp) // smoothstep — settles into each waypoint
      setPoint(a, a.p, ptA.current); setPoint(n, n.p, ptB.current)
      setPoint(a, a.l, lkA.current); setPoint(n, n.l, lkB.current)
      tPos.current.lerpVectors(ptA.current, ptB.current, zp)
      tLook.current.lerpVectors(lkA.current, lkB.current, zp)
      segI = i; segT = zp
    }

    // Frame-rate-independent damping toward the target (TAU ≈ 0.25s)
    camera.position.lerp(tPos.current, 1 - Math.exp(-dt / 0.25))
    camera.lookAt(tLook.current)

    // ── Scene fog / bg ──
    const isAbove = camera.position.y > -0.5
    if (isAbove) {
      scene.fog = null
      scene.background = null
    } else {
      const segJ = Math.min(segI + 1, PATH.length - 1)
      fogColor.current.lerpColors(FOG_COLOR_OBJS[segI], FOG_COLOR_OBJS[segJ], segT)
      const density = PATH[segI].fog[1] + (PATH[segJ].fog[1] - PATH[segI].fog[1]) * segT
      if (!scene.fog) scene.fog = new THREE.FogExp2(fogColor.current.clone(), density)
      scene.fog.color.copy(fogColor.current)
      scene.fog.density = density
      scene.background = fogColor.current.clone()
    }
  })
  return null
}

// ─── MAIN CANVAS ─────────────────────────────────────────────
export function Scene3D({ scrollRef, flightRef, gameRef }) {
  // Boat state shared between Yacht3D, BoatWake, and SceneController
  const boatStateRef = useRef({
    pos: new THREE.Vector3(0, 0, 0),
    heading: 0,
    speed: 0,
    targetSpeed: 0,
  })

  return (
    <Canvas
      camera={{ position: [-42, 13, 16], fov: 54, near: 0.1, far: 2000 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      shadows
      dpr={[1, 1.8]}
    >
      {/* Sunset environment for clearcoat reflections */}
      <Environment preset="sunset" background={false} />

      <Sky
        distance={450000}
        sunPosition={[0.85, 0.12, -0.52]}
        inclination={0.49}
        azimuth={0.25}
        mieCoefficient={0.005}
        mieDirectionalG={0.82}
        rayleigh={0.5}
        turbidity={8}
      />

      <ambientLight intensity={0.38} color="#ffd0a0" />
      <directionalLight
        position={[80, 60, -100]}
        intensity={2.6}
        color="#ffbb66"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
      />
      <hemisphereLight skyColor="#a8d8f0" groundColor="#c4a87a" intensity={0.55} />
      <pointLight position={[0, -10, 0]} intensity={0.14} color="#003860" />

      <Suspense fallback={null}>
        <OceanWater />
        <Yacht3D boatStateRef={boatStateRef} />
        <WakeSpray boatStateRef={boatStateRef} />
        <Checkpoints boatStateRef={boatStateRef} scrollRef={scrollRef} gameRef={gameRef} />
        <UnderwaterParticles scrollRef={scrollRef} />
        <OceanFloor scrollRef={scrollRef} />
        <MarineLife scrollRef={scrollRef} />
      </Suspense>

      <SceneController scrollRef={scrollRef} boatStateRef={boatStateRef} flightRef={flightRef} gameRef={gameRef} />
    </Canvas>
  )
}
