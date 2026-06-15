'use client'

import { Component, Suspense, useEffect, useRef, useState, type ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Center, Bounds } from '@react-three/drei'
import { Dust } from './JetScene'

/** Loads a GLB and gives it a slow cinematic rotation. */
function Model({ url }: { url: string }) {
  const ref = useRef<any>(null)
  const { scene } = useGLTF(url) as any

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = 0.4 + Math.sin(t * 0.15) * 0.35
    ref.current.rotation.z = Math.sin(t * 0.3) * 0.08
    ref.current.position.y = Math.sin(t * 0.6) * 0.1
  })

  return (
    <group ref={ref}>
      <primitive object={scene} />
    </group>
  )
}

/** If a present model fails to parse, fall back to the procedural mesh. */
class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
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

/**
 * Renders a real GLB model on the right of a hero when the file exists,
 * otherwise the provided procedural `fallback`. Probes the URL first so a
 * missing model never throws a 404.
 */
export default function ModelHero({ url, fallback }: { url: string; fallback: ReactNode }) {
  const [hasModel, setHasModel] = useState(false)

  useEffect(() => {
    let active = true
    fetch(url, { method: 'HEAD' })
      .then((res) => {
        if (active) setHasModel(res.ok)
      })
      .catch(() => {
        if (active) setHasModel(false)
      })
    return () => {
      active = false
    }
  }, [url])

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

      {hasModel ? (
        <ModelBoundary fallback={fallback}>
          <Suspense fallback={fallback}>
            <Bounds fit clip margin={1.05}>
              <Center>
                <Model url={url} />
              </Center>
            </Bounds>
          </Suspense>
        </ModelBoundary>
      ) : (
        fallback
      )}

      <Dust />
    </Canvas>
  )
}
