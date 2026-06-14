// Imperative Three.js Water shader — more reliable than extend({Water})
// because Water has internal render targets that need scene access.

import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Water } from 'three/examples/jsm/objects/Water.js'
import * as THREE from 'three'

export function OceanWater() {
  const { scene } = useThree()
  const waterRef = useRef(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    const waterNormals = loader.load(
      'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg',
      (tex) => { tex.wrapS = tex.wrapT = THREE.RepeatWrapping }
    )

    const geom = new THREE.PlaneGeometry(12000, 12000)
    const water = new Water(geom, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection: new THREE.Vector3(0.85, 0.12, -0.52).normalize(),
      sunColor: 0xffbb66,
      waterColor: 0x001830,
      distortionScale: 3.5,
      fog: false,
    })
    water.rotation.x = -Math.PI / 2
    water.position.y = 0
    waterRef.current = water
    scene.add(water)

    return () => {
      scene.remove(water)
      geom.dispose()
      waterNormals.dispose()
      water.material.dispose()
    }
  }, [scene])

  useFrame(() => {
    if (waterRef.current) {
      waterRef.current.material.uniforms.time.value += 0.5 / 60.0
    }
  })

  return null
}
