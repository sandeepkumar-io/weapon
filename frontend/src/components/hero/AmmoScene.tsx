'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import ModelHero from './ModelHero'

// Drop a real ammo/cartridge model here: frontend/public/models/ammo.glb
const MODEL_URL = '/models/ammo.glb'

const brass = { color: '#c89b3c', metalness: 0.95, roughness: 0.3 }
const copper = { color: '#b5651d', metalness: 0.9, roughness: 0.35 }

/** Procedural cartridge — fallback only, used until a real GLB is added. */
function Cartridge() {
  const ref = useRef<any>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = -0.5 + Math.sin(t * 0.2) * 0.3
    ref.current.rotation.z = 0.1 + Math.sin(t * 0.4) * 0.05
    ref.current.position.y = Math.sin(t * 0.6) * 0.1
  })

  return (
    <group ref={ref} rotation={[0.2, -0.5, 0.1]} scale={1.4}>
      {/* Brass case */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.34, 0.36, 1.5, 32]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      {/* Bullet (copper ogive) */}
      <mesh position={[1.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.33, 0.7, 32]} />
        <meshStandardMaterial {...copper} />
      </mesh>
      {/* Rim base */}
      <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.12, 32]} />
        <meshStandardMaterial {...brass} />
      </mesh>
      {/* Primer (glowing) */}
      <mesh position={[-0.87, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.14, 0.14, 0.06, 24]} />
        <meshStandardMaterial color="#06222a" emissive="#22d3ee" emissiveIntensity={2.2} />
      </mesh>
      <pointLight position={[-1.1, 0, 0]} intensity={3} distance={4} color="#22d3ee" />
    </group>
  )
}

export default function AmmoScene() {
  return <ModelHero url={MODEL_URL} fallback={<Cartridge />} />
}
