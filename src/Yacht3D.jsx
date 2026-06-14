// Superyacht — smooth hemisphere bow, pool deck, clearcoat hull

import { useRef, useMemo, useEffect, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const YACHT_GLB = null // Set to '/yacht.glb' or CDN URL to use a real model

// ─── GLTF version (used when YACHT_GLB is set) ───────────────
function YachtGLTF({ gltf, boatStateRef }) {
  const ref = useRef()

  useEffect(() => {
    gltf.scene.traverse(o => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true }
    })
  }, [gltf])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!ref.current) return
    if (boatStateRef?.current) {
      const b = boatStateRef.current
      ref.current.position.x = b.pos.x
      ref.current.position.z = b.pos.z
      ref.current.rotation.y = b.heading
    }
    ref.current.position.y = Math.cos(t * 0.6) * 0.03
    ref.current.rotation.z = Math.sin(t * 0.4) * 0.008
    ref.current.rotation.x = Math.cos(t * 0.3) * 0.006
    if (boatStateRef?.current?.speed > 0.5) {
      ref.current.rotation.x -= boatStateRef.current.speed * 0.006
    }
  })

  return <primitive ref={ref} object={gltf.scene} scale={[0.05, 0.05, 0.05]} />
}

// ─── PROCEDURAL fallback (always used when YACHT_GLB is null) ─
export function Yacht3D({ boatStateRef }) {
  const groupRef = useRef()

  const m = useMemo(() => ({
    hull: new THREE.MeshPhysicalMaterial({
      color: 0xf2f0eb, roughness: 0.10, metalness: 0.02,
      clearcoat: 1.0, clearcoatRoughness: 0.04, envMapIntensity: 1.8,
    }),
    super: new THREE.MeshPhysicalMaterial({
      color: 0xedebe4, roughness: 0.08, metalness: 0.01,
      clearcoat: 0.88, clearcoatRoughness: 0.07,
    }),
    dark:     new THREE.MeshStandardMaterial({ color: 0x101010, roughness: 0.30, metalness: 0.18 }),
    darkGrey: new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.48, metalness: 0.12 }),
    chrom:    new THREE.MeshStandardMaterial({ color: 0xc6cacc, roughness: 0.05, metalness: 0.98 }),
    deck:     new THREE.MeshStandardMaterial({ color: 0xd4cec0, roughness: 0.85 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x6a9ab0, roughness: 0.0, metalness: 0.02,
      transparent: true, opacity: 0.38, transmission: 0.80,
    }),
    window: new THREE.MeshStandardMaterial({
      color: 0x0d1b26, roughness: 0.10, metalness: 0.35,
      emissive: new THREE.Color(0x0e2434), emissiveIntensity: 0.30,
    }),
    strip:    new THREE.MeshStandardMaterial({ color: 0x18222e, roughness: 0.65 }),
    porthole: new THREE.MeshStandardMaterial({ color: 0x060606, roughness: 0.18, metalness: 0.55 }),
    navRed:   new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: new THREE.Color(0xff0000), emissiveIntensity: 3.0 }),
    navGrn:   new THREE.MeshStandardMaterial({ color: 0x00ff44, emissive: new THREE.Color(0x00ff44), emissiveIntensity: 3.0 }),
    navWht:   new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: new THREE.Color(0xffffff), emissiveIntensity: 2.8 }),
    wake: new THREE.MeshStandardMaterial({
      color: 0xaad4e8, roughness: 0.95, transparent: true, opacity: 0.55,
    }),
    pool: new THREE.MeshPhysicalMaterial({
      color: 0x35c8e0, roughness: 0.05, metalness: 0.0,
      transparent: true, opacity: 0.9, transmission: 0.3,
      emissive: new THREE.Color(0x0aa8cc), emissiveIntensity: 0.7,
    }),
    teak: new THREE.MeshStandardMaterial({ color: 0x8a5a2a, roughness: 0.88 }),
    // Pool-terrace set (the "inside the boat" area)
    glow:      new THREE.MeshStandardMaterial({ color: 0xffc070, emissive: new THREE.Color(0xff9830), emissiveIntensity: 1.4 }),
    salon:     new THREE.MeshStandardMaterial({ color: 0x1a0d04, roughness: 0.10, emissive: new THREE.Color(0xff9540), emissiveIntensity: 0.6 }),
    warmLight: new THREE.MeshStandardMaterial({ color: 0xfff0d8, emissive: new THREE.Color(0xffc080), emissiveIntensity: 2.2 }),
    cream:     new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.85 }),
    navy:      new THREE.MeshStandardMaterial({ color: 0x1c2c44, roughness: 0.9 }),
  }), [])

  // Smooth extruded forms — rounded stern, straight sides, swept bow.
  // Shapes are drawn in plan view (x = length, shape-y = beam) and
  // extruded upward with a bevel so every edge is softly rounded.
  const geo = useMemo(() => {
    const plan = (x0, x1, w, nose, sternR = 1.0) => {
      const s = new THREE.Shape()
      s.moveTo(x0 + sternR, -w)
      s.lineTo(x1 - nose, -w)
      s.quadraticCurveTo(x1 - nose * 0.25, -w, x1, 0)
      s.quadraticCurveTo(x1 - nose * 0.25, w, x1 - nose, w)
      s.lineTo(x0 + sternR, w)
      s.quadraticCurveTo(x0, w, x0, w - sternR)
      s.lineTo(x0, -w + sternR)
      s.quadraticCurveTo(x0, -w, x0 + sternR, -w)
      return s
    }
    const make = (shape, depth, bevel) => {
      const g = new THREE.ExtrudeGeometry(shape, {
        depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel,
        bevelSegments: 4, curveSegments: 20,
      })
      g.rotateX(-Math.PI / 2)
      g.computeVertexNormals()
      return g
    }
    return {
      hull: make(plan(-13.5, 15.5, 3.4, 6.5, 1.6), 2.4, 0.5),
      deck: make(plan(-13.7, 15.7, 3.45, 6.5, 1.7), 0.30, 0.12),
      l1g:  make(plan(-6.0, 9.5, 2.75, 2.4), 2.10, 0.10),
      l1r:  make(plan(-6.3, 9.9, 3.00, 2.6), 0.22, 0.10),
      l2g:  make(plan(-9.6, 8.0, 2.55, 2.2), 1.75, 0.10),
      l2r:  make(plan(-9.9, 8.4, 2.80, 2.4), 0.22, 0.10),
      l3g:  make(plan(-4.0, 6.6, 2.30, 2.0), 1.60, 0.10),
      l3r:  make(plan(-4.3, 7.0, 2.55, 2.2), 0.20, 0.10),
      l4g:  make(plan(-1.0, 4.6, 1.90, 1.6), 1.10, 0.08),
      l4r:  make(plan(-1.3, 5.0, 2.15, 1.8), 0.18, 0.08),
    }
  }, [])

  useEffect(() => {
    groupRef.current?.traverse(o => {
      if (o.isMesh) { o.castShadow = true; o.receiveShadow = true }
    })
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (!groupRef.current) return

    if (boatStateRef?.current) {
      const b = boatStateRef.current
      groupRef.current.position.x = b.pos.x
      groupRef.current.position.z = b.pos.z
      groupRef.current.rotation.y = b.heading
    }

    // Heavy-tonnage buoyancy (hull long axis = local x: roll = rot.x, pitch = rot.z)
    const spd = boatStateRef?.current?.speed ?? 0
    const heave = Math.cos(t * 0.6) * 0.04 + Math.sin(t * 0.38) * 0.05
    groupRef.current.position.y = heave + Math.min(spd, 6) * 0.012   // rides a touch higher underway
    groupRef.current.rotation.x = Math.sin(t * 0.45) * 0.010         // gentle roll
    // pitch: idle sway + a slight bow-rise as it makes way through the swell
    groupRef.current.rotation.z = Math.cos(t * 0.33) * 0.008 + Math.min(spd, 6) * 0.004
  })

  const hull   = m.hull
  const sup    = m.super
  const dk     = m.deck
  const cr     = m.chrom
  const dr     = m.dark
  const dg     = m.darkGrey
  const gl     = m.glass
  const wn     = m.window
  const st     = m.strip
  const ph     = m.porthole

  return (
    <group ref={groupRef}>

      {/* ── HULL — one smooth extruded form ── */}
      <mesh geometry={geo.hull} material={hull} position={[0, -1.6, 0]} />
      {/* Main deck slab */}
      <mesh geometry={geo.deck} material={hull} position={[0, 1.38, 0]} />
      {/* Hull glazing band above the waterline */}
      {[3.43, -3.43].map(z => (
        <mesh key={`hullwin${z}`} material={wn} position={[-3, 0.35, z]}>
          <boxGeometry args={[14, 0.55, 0.06]} />
        </mesh>
      ))}
      {/* Swim platform */}
      <mesh material={dk} position={[-14.2, 0.12, 0]}>
        <boxGeometry args={[1.5, 0.12, 5.0]} />
      </mesh>

      {/* ── DECK LEVELS — dark glass bands between white slabs ── */}
      <mesh geometry={geo.l1g} material={wn}   position={[0, 2.00, 0]} />
      <mesh geometry={geo.l1r} material={hull} position={[0, 4.30, 0]} />
      <mesh geometry={geo.l2g} material={wn}   position={[0, 4.72, 0]} />
      <mesh geometry={geo.l2r} material={hull} position={[0, 6.67, 0]} />
      <mesh geometry={geo.l3g} material={wn}   position={[0, 7.09, 0]} />
      <mesh geometry={geo.l3r} material={hull} position={[0, 8.89, 0]} />
      <mesh geometry={geo.l4g} material={wn}   position={[0, 9.27, 0]} />
      <mesh geometry={geo.l4r} material={hull} position={[0, 10.53, 0]} />

      {/* ── AFT POOL TERRACE — the "inside the boat" set (deck photo) ── */}
      {/* Teak floor */}
      <mesh material={m.teak} position={[-9.3, 1.80, 0]}>
        <boxGeometry args={[6.6, 0.08, 6.2]} />
      </mesh>
      {/* Glowing pool */}
      <mesh material={m.pool} position={[-9.5, 1.87, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 2.8]} />
      </mesh>
      {/* Pool coaming */}
      {[1.55, -1.55].map(z => (
        <mesh key={`tc${z}`} material={m.teak} position={[-9.5, 1.91, z]}>
          <boxGeometry args={[3.4, 0.14, 0.30]} />
        </mesh>
      ))}
      {[-11.05, -7.95].map(x => (
        <mesh key={`tce${x}`} material={m.teak} position={[x, 1.91, 0]}>
          <boxGeometry args={[0.30, 0.14, 2.8]} />
        </mesh>
      ))}
      {/* Gold underglow strips along the pool edges */}
      {[1.74, -1.74].map(z => (
        <mesh key={`pg${z}`} material={m.glow} position={[-9.5, 1.85, z]}>
          <boxGeometry args={[3.4, 0.04, 0.05]} />
        </mesh>
      ))}
      {/* Salon doors on the superstructure's aft face — warm lit glass */}
      {[-1.1, 0, 1.1].map(z => (
        <mesh key={`sd${z}`} material={m.salon} position={[-6.18, 3.05, z]}>
          <boxGeometry args={[0.12, 2.3, 1.0]} />
        </mesh>
      ))}
      {[-1.66, -0.55, 0.55, 1.66].map(z => (
        <mesh key={`sm${z}`} material={cr} position={[-6.28, 3.05, z]}>
          <boxGeometry args={[0.06, 2.4, 0.07]} />
        </mesh>
      ))}
      {/* Lounge sofas facing each other across the walkway */}
      {[1.95, -1.95].map(zs => (
        <group key={`sofa${zs}`} position={[-7.1, 0, zs]}>
          <mesh material={m.cream} position={[0, 2.02, 0]}>
            <boxGeometry args={[1.7, 0.34, 0.75]} />
          </mesh>
          <mesh material={m.cream} position={[0, 2.40, zs > 0 ? 0.30 : -0.30]}>
            <boxGeometry args={[1.7, 0.55, 0.16]} />
          </mesh>
          <mesh material={m.navy} position={[-0.45, 2.32, zs > 0 ? 0.18 : -0.18]} rotation={[0, 0, 0.10]}>
            <boxGeometry args={[0.42, 0.30, 0.12]} />
          </mesh>
          <mesh material={m.navy} position={[0.45, 2.32, zs > 0 ? 0.18 : -0.18]} rotation={[0, 0, -0.08]}>
            <boxGeometry args={[0.42, 0.30, 0.12]} />
          </mesh>
        </group>
      ))}
      {/* Coffee table */}
      <mesh material={m.teak} position={[-7.1, 1.98, 0]}>
        <boxGeometry args={[1.1, 0.30, 0.65]} />
      </mesh>
      {/* Chrome pillars holding the upper-deck overhang */}
      {[2.45, -2.45].map(z => (
        <mesh key={`post${z}`} material={cr} position={[-9.5, 3.22, z]}>
          <cylinderGeometry args={[0.07, 0.07, 2.85, 10]} />
        </mesh>
      ))}
      {/* Overhang soffit + warm downlights */}
      <mesh material={sup} position={[-7.8, 4.56, 0]}>
        <boxGeometry args={[3.8, 0.07, 5.0]} />
      </mesh>
      {[-9.4, -8.4, -7.4].map(x => (
        [1.3, -1.3].map(z => (
          <mesh key={`dl${x}${z}`} material={m.warmLight} position={[x, 4.51, z]}>
            <cylinderGeometry args={[0.10, 0.10, 0.04, 10]} />
          </mesh>
        ))
      ))}
      {/* Terrace lighting — warm ambience + pool glow */}
      <pointLight position={[-8.5, 4.2, 0]} color={0xffb070} intensity={1.1} distance={9} decay={2} />
      <pointLight position={[-9.5, 2.9, 0]} color={0x35d0e8} intensity={0.9} distance={5.5} decay={2} />

      {/* ── MAST ARCH — raked supports, white domes, antenna ── */}
      <group position={[1.6, 10.75, 0]}>
        {[1.35, -1.35].map(z => (
          <mesh key={`arch${z}`} material={sup} position={[0, 0.7, z]} rotation={[0, 0, -0.42]}>
            <boxGeometry args={[0.22, 1.6, 0.45]} />
          </mesh>
        ))}
        <mesh material={sup} position={[-0.33, 1.52, 0]}>
          <boxGeometry args={[1.7, 0.18, 3.1]} />
        </mesh>
        <mesh material={hull} position={[-0.3, 1.95, 0.75]}>
          <sphereGeometry args={[0.42, 18, 14]} />
        </mesh>
        <mesh material={hull} position={[-0.3, 1.88, -0.7]}>
          <sphereGeometry args={[0.30, 16, 12]} />
        </mesh>
        <mesh material={cr} position={[-0.9, 2.15, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 1.3, 6]} />
        </mesh>
        <mesh material={m.navWht} position={[-0.9, 2.85, 0]}>
          <sphereGeometry args={[0.05, 7, 5]} />
        </mesh>
      </group>

      {/* ── RAILINGS ── */}
      {[3.30, -3.30].map(z => (
        <mesh key={`mdr${z}`} material={cr} position={[-1.5, 2.45, z]}>
          <boxGeometry args={[21.0, 0.026, 0.026]} />
        </mesh>
      ))}
      {[2.62, -2.62].map(z => (
        <mesh key={`l2rail${z}`} material={cr} position={[-1.15, 7.24, z]}>
          <boxGeometry args={[18.2, 0.026, 0.026]} />
        </mesh>
      ))}
      {[2.38, -2.38].map(z => (
        <mesh key={`l3rail${z}`} material={cr} position={[1.3, 9.44, z]}>
          <boxGeometry args={[10.6, 0.026, 0.026]} />
        </mesh>
      ))}

      {/* ── NAV LIGHTS ── */}
      <mesh material={m.navRed} position={[-12.5, 2.6, 3.30]}>
        <sphereGeometry args={[0.065, 7, 5]} />
      </mesh>
      <mesh material={m.navGrn} position={[15.0, 1.8, 0]}>
        <sphereGeometry args={[0.065, 7, 5]} />
      </mesh>

      {/* Stern flag pole + flag — offset so the boarding camera path stays clear */}
      <mesh material={cr} position={[-13.1, 3.2, 2.3]}>
        <cylinderGeometry args={[0.030, 0.030, 2.8, 6]} />
      </mesh>
      <mesh
        material={new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.9, side: THREE.DoubleSide })}
        position={[-13.1, 4.35, 2.85]}>
        <planeGeometry args={[0.95, 0.58]} />
      </mesh>

    </group>
  )
}
