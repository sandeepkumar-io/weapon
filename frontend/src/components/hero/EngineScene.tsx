'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

// THREE.DoubleSide === 2 (avoids importing `three`, which ships no types here).
const DOUBLE_SIDE = 2

/** Spinning fan: a hub spinner cone + radially arranged twisted blades. */
function Fan({ count = 22 }: { count?: number }) {
  const ref = useRef<any>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 2.4
  })

  const blades = useMemo(
    () => Array.from({ length: count }, (_, i) => (i / count) * Math.PI * 2),
    [count],
  )

  return (
    <group ref={ref} position={[0, 0, 1.25]}>
      {/* Hub spinner cone (points toward the camera, +z) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.42, 0.95, 28]} />
        <meshStandardMaterial color="#1a1d21" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Fan blades */}
      {blades.map((angle, i) => (
        <group key={i} rotation={[0, 0, angle]}>
          <mesh position={[0.95, 0, 0]} rotation={[0.55, 0, 0]}>
            <boxGeometry args={[1.5, 0.16, 0.46]} />
            <meshStandardMaterial color="#c7d0d6" metalness={0.92} roughness={0.28} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/** Static engine housing, glowing rings and core. */
function Engine() {
  const ref = useRef<any>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = -0.55 + Math.sin(t * 0.15) * 0.16
    ref.current.rotation.x = 0.14 + Math.cos(t * 0.12) * 0.06
  })

  return (
    <group ref={ref} position={[0, 0, 0]} scale={1.1}>
      {/* Outer nacelle cowling */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.78, 1.92, 3.3, 56, 1, true]} />
        <meshStandardMaterial color="#15171a" metalness={0.9} roughness={0.36} side={DOUBLE_SIDE} />
      </mesh>

      {/* Inner liner for depth */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.6, 1.7, 3.2, 56, 1, true]} />
        <meshStandardMaterial color="#070708" metalness={0.6} roughness={0.7} side={DOUBLE_SIDE} />
      </mesh>

      {/* Glowing inlet lip (cyan) */}
      <mesh position={[0, 0, 1.62]}>
        <torusGeometry args={[1.82, 0.07, 20, 72]} />
        <meshStandardMaterial color="#06222a" emissive="#22d3ee" emissiveIntensity={2.6} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Mid HUD ring (dim cyan) */}
      <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.86, 0.025, 12, 72]} />
        <meshStandardMaterial color="#06222a" emissive="#22d3ee" emissiveIntensity={1.2} />
      </mesh>

      {/* Exhaust ring (lime) */}
      <mesh position={[0, 0, -1.62]}>
        <torusGeometry args={[1.45, 0.12, 20, 72]} />
        <meshStandardMaterial color="#161f08" emissive="#a3e635" emissiveIntensity={2.2} metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Core / combustion glow at the back */}
      <mesh position={[0, 0, -1.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.9, 1.2, 0.8, 32]} />
        <meshStandardMaterial color="#0a0a0a" emissive="#84cc16" emissiveIntensity={0.9} metalness={0.5} roughness={0.6} />
      </mesh>

      <Fan />
    </group>
  )
}

/** Drifting dust particles for atmospheric depth. */
function Dust({ count = 450 }: { count?: number }) {
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

export default function EngineScene() {
  // Gracefully fall back to the gradient background when WebGL is unavailable.
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
      <Engine />
      <Dust />
    </Canvas>
  )
}
