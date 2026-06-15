'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

const bodyColor = '#cfd6db'

/** Procedural stylized fighter jet (nose points +Z, toward the camera). */
export function Jet() {
  const ref = useRef<any>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.z = Math.sin(t * 0.3) * 0.2 // banking roll
    ref.current.rotation.y = 0.5 + Math.sin(t * 0.15) * 0.12
    ref.current.position.y = Math.sin(t * 0.6) * 0.12 // gentle bob
  })

  return (
    <group ref={ref} rotation={[-0.32, 0.5, 0]} scale={1.05}>
      {/* Fuselage */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.34, 3.2, 24]} />
        <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.34} />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0, 0, 2.1]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.3, 1.2, 24]} />
        <meshStandardMaterial color={bodyColor} metalness={0.9} roughness={0.34} />
      </mesh>

      {/* Canopy (glowing cyan glass) */}
      <mesh position={[0, 0.22, 0.7]} scale={[0.5, 0.32, 0.95]}>
        <sphereGeometry args={[0.5, 24, 16]} />
        <meshStandardMaterial color="#06222a" emissive="#22d3ee" emissiveIntensity={1.4} metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Main delta wings (swept) */}
      <mesh position={[-1.0, -0.05, -0.25]} rotation={[0, 0.55, 0.03]}>
        <boxGeometry args={[2.0, 0.05, 1.25]} />
        <meshStandardMaterial color={bodyColor} metalness={0.88} roughness={0.36} />
      </mesh>
      <mesh position={[1.0, -0.05, -0.25]} rotation={[0, -0.55, -0.03]}>
        <boxGeometry args={[2.0, 0.05, 1.25]} />
        <meshStandardMaterial color={bodyColor} metalness={0.88} roughness={0.36} />
      </mesh>

      {/* Rear horizontal stabilizers */}
      <mesh position={[-0.7, 0, -1.45]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[1.0, 0.05, 0.5]} />
        <meshStandardMaterial color={bodyColor} metalness={0.88} roughness={0.36} />
      </mesh>
      <mesh position={[0.7, 0, -1.45]} rotation={[0, -0.5, 0]}>
        <boxGeometry args={[1.0, 0.05, 0.5]} />
        <meshStandardMaterial color={bodyColor} metalness={0.88} roughness={0.36} />
      </mesh>

      {/* Twin canted tail fins */}
      <mesh position={[-0.34, 0.32, -1.35]} rotation={[0.25, 0, 0.28]}>
        <boxGeometry args={[0.05, 0.85, 0.7]} />
        <meshStandardMaterial color={bodyColor} metalness={0.88} roughness={0.36} />
      </mesh>
      <mesh position={[0.34, 0.32, -1.35]} rotation={[0.25, 0, -0.28]}>
        <boxGeometry args={[0.05, 0.85, 0.7]} />
        <meshStandardMaterial color={bodyColor} metalness={0.88} roughness={0.36} />
      </mesh>

      {/* Afterburner nozzles (glowing) */}
      {[-0.18, 0.18].map((x) => (
        <mesh key={x} position={[x, 0, -1.75]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.18, 0.5, 16]} />
          <meshStandardMaterial color="#161f08" emissive="#22d3ee" emissiveIntensity={2.4} />
        </mesh>
      ))}
      <pointLight position={[0, 0, -2.4]} intensity={6} distance={6} color="#22d3ee" />
    </group>
  )
}

/** Drifting dust particles for atmospheric depth. */
export function Dust({ count = 450 }: { count?: number }) {
  const ref = useRef<any>(null)
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.02
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#22d3ee" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  )
}

/** True only if the browser can actually create a WebGL context. */
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

export default function JetScene() {
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
      <Jet />
      <Dust />
    </Canvas>
  )
}
