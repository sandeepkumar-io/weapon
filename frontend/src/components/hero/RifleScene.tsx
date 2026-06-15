'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import ModelHero from './ModelHero'

// Drop a real rifle/sniper model here: frontend/public/models/rifle.glb
const MODEL_URL = '/models/rifle.glb'

const metal = { color: '#2a2d31', metalness: 0.85, roughness: 0.45 }
const polymer = { color: '#141414', metalness: 0.3, roughness: 0.75 }

/** Procedural stylized rifle — fallback only, used until a real GLB is added. */
export function Rifle() {
  const ref = useRef<any>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = -0.6 + Math.sin(t * 0.2) * 0.28
    ref.current.rotation.z = 0.12 + Math.sin(t * 0.4) * 0.05
    ref.current.position.y = Math.sin(t * 0.6) * 0.1
  })

  return (
    <group ref={ref} rotation={[0.15, -0.6, 0.12]} scale={1.25}>
      <mesh>
        <boxGeometry args={[1.7, 0.32, 0.3]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[1.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.14, 0.14, 0.95, 20]} />
        <meshStandardMaterial {...polymer} />
      </mesh>
      <mesh position={[1.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.06, 0.06, 1.4, 16]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[2.45, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.09, 0.09, 0.2, 16]} />
        <meshStandardMaterial color="#06222a" emissive="#22d3ee" emissiveIntensity={2.4} />
      </mesh>
      <pointLight position={[2.7, 0, 0]} intensity={4} distance={4} color="#22d3ee" />
      <mesh position={[-0.1, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.55, 20]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[-0.4, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.04, 20]} />
        <meshStandardMaterial color="#06222a" emissive="#a3e635" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.1, 0.18, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.2]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[-0.3, 0.18, 0]}>
        <boxGeometry args={[0.08, 0.12, 0.2]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[0.15, -0.5, 0]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[0.24, 0.55, 0.3]} />
        <meshStandardMaterial {...polymer} />
      </mesh>
      <mesh position={[0.32, -0.85, 0]} rotation={[0, 0, -0.4]}>
        <boxGeometry args={[0.24, 0.4, 0.3]} />
        <meshStandardMaterial {...polymer} />
      </mesh>
      <mesh position={[-0.5, -0.4, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.2, 0.6, 0.24]} />
        <meshStandardMaterial {...polymer} />
      </mesh>
      <mesh position={[-0.28, -0.26, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.13, 0.02, 12, 24, Math.PI]} />
        <meshStandardMaterial {...metal} />
      </mesh>
      <mesh position={[-1.2, -0.02, 0]}>
        <boxGeometry args={[0.95, 0.3, 0.18]} />
        <meshStandardMaterial {...polymer} />
      </mesh>
      <mesh position={[-1.72, -0.04, 0]}>
        <boxGeometry args={[0.12, 0.5, 0.2]} />
        <meshStandardMaterial {...polymer} />
      </mesh>
    </group>
  )
}

export default function RifleScene() {
  return <ModelHero url={MODEL_URL} fallback={<Rifle />} />
}
