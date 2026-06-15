'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Dust } from './JetScene'

const body = { color: '#d8dde2', metalness: 0.8, roughness: 0.35 }
const fin = { color: '#2a2d31', metalness: 0.7, roughness: 0.5 }

/** Procedural air-to-air missile (nose points +X). Slow cinematic spin. */
function Missile() {
  const ref = useRef<any>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = -0.4 + Math.sin(t * 0.2) * 0.3
    ref.current.rotation.z = 0.22 + Math.sin(t * 0.4) * 0.05
    ref.current.position.y = Math.sin(t * 0.6) * 0.12
  })

  return (
    <group ref={ref} rotation={[0.12, -0.45, 0.22]} scale={1.2}>
      {/* Body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.22, 3.2, 32]} />
        <meshStandardMaterial {...body} />
      </mesh>

      {/* Nose cone */}
      <mesh position={[1.95, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.22, 0.75, 32]} />
        <meshStandardMaterial {...body} />
      </mesh>

      {/* Tail fins (4, around the body axis) */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[(i * Math.PI) / 2, 0, 0]}>
          <mesh position={[-1.2, 0.34, 0]}>
            <boxGeometry args={[0.7, 0.5, 0.04]} />
            <meshStandardMaterial {...fin} />
          </mesh>
        </group>
      ))}

      {/* Mid-body steering fins */}
      {[0, 1, 2, 3].map((i) => (
        <group key={`m${i}`} rotation={[(i * Math.PI) / 2 + Math.PI / 4, 0, 0]}>
          <mesh position={[0.5, 0.28, 0]}>
            <boxGeometry args={[0.45, 0.34, 0.03]} />
            <meshStandardMaterial {...fin} />
          </mesh>
        </group>
      ))}

      {/* Exhaust glow */}
      <mesh position={[-1.65, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.12, 0.25, 24]} />
        <meshStandardMaterial color="#06222a" emissive="#22d3ee" emissiveIntensity={2.6} />
      </mesh>
      <pointLight position={[-2.1, 0, 0]} intensity={5} distance={5} color="#22d3ee" />
    </group>
  )
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export default function MissileScene() {
  if (typeof window !== 'undefined' && !isWebGLAvailable()) return null

  return (
    <Canvas
      className="absolute! inset-0"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 6.5], fov: 42 }}
    >
      <fog attach="fog" args={['#050505', 6, 17]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 4, 5]} intensity={2.4} color="#22d3ee" />
      <directionalLight position={[-6, -3, 2]} intensity={1.7} color="#a3e635" />
      <directionalLight position={[0, 2, 8]} intensity={1.4} color="#bde0ff" />
      <Missile />
      <Dust />
    </Canvas>
  )
}
