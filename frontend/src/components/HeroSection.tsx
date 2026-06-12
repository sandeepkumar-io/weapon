'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'

declare global {
  interface Window {
    VANTA?: {
      DOTS?: (config: Record<string, unknown>) => { destroy: () => void }
    }
  }
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

/** CSS/SVG fighter jet — used when WebGL is disabled (no 3D context needed). */
function JetFallback() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-0 top-[24%] z-20 will-change-transform"
      style={{ transformPerspective: 900 }}
      initial={{ x: '-28vw', opacity: 0, scale: 0.6, rotateZ: 8 }}
      animate={{
        x: '122vw',
        y: [0, -34, 16, -22, 0],
        opacity: [0, 1, 1, 1, 0],
        scale: [0.6, 1, 1.1, 0.9, 0.75],
        rotateZ: [8, -5, 5, -8, 4],
      }}
      transition={{ duration: 5.2, ease: 'easeInOut', repeat: Infinity, repeatDelay: 4 }}
    >
      <div className="relative">
        <div
          className="absolute right-full top-1/2 h-2.5 -translate-y-1/2 rounded-full"
          style={{
            width: '220px',
            background: 'linear-gradient(to left, rgba(125,211,252,0.95), rgba(59,130,246,0.4), transparent)',
            filter: 'blur(5px)',
          }}
        />
        <svg
          width="132"
          height="132"
          viewBox="0 0 100 100"
          style={{ transform: 'rotate(90deg)', filter: 'drop-shadow(0 14px 34px rgba(56,130,246,0.65))' }}
        >
          <defs>
            <linearGradient id="jetGradFallback" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0f9ff" />
              <stop offset="55%" stopColor="#7dd3fc" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
          <path
            d="M50 3 L55 36 L95 66 L57 60 L55 80 L73 92 L52 85 L50 97 L48 85 L27 92 L45 80 L43 60 L5 66 L45 36 Z"
            fill="url(#jetGradFallback)"
            stroke="#bae6fd"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="30" r="3.2" fill="#1e3a8a" opacity="0.85" />
        </svg>
      </div>
    </motion.div>
  )
}

function HeroSection() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<{ destroy: () => void } | null>(null)
  // null = still detecting, true = WebGL ok, false = no WebGL
  useEffect(() => {
    if (typeof window === 'undefined' || !vantaRef.current) return
    // Skip the WebGL dots entirely when WebGL is unavailable.
    if (!isWebGLAvailable()) return

    const loadScript = (src: string) =>
      new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${src}"]`)

        if (existingScript) {
          if ((existingScript as HTMLScriptElement).dataset.loaded === 'true') {
            resolve()
            return
          }

          existingScript.addEventListener('load', () => resolve(), { once: true })
          existingScript.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true })
          return
        }

        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.addEventListener('load', () => {
          script.dataset.loaded = 'true'
          resolve()
        }, { once: true })
        script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true })
        document.body.appendChild(script)
      })

    const initVanta = async () => {
      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js')
        await loadScript('https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.dots.min.js')

        if (!window.VANTA?.DOTS || !vantaRef.current) return

        effectRef.current?.destroy()
        effectRef.current = window.VANTA.DOTS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: true,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          size: 1.7,
          backgroundColor: 'transparent',
          color: '#60a5fa',
          color2: '#3b82f6',
          spacing: 18,
          showLines: true,
          showDots: true,
        })
      } catch (error) {
        console.error('Vanta background failed to load:', error)
      }
    }

    void initVanta()

    return () => {
      effectRef.current?.destroy()
    }
  }, [])

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 0%, #133a78 0%, #0b2a5c 45%, #061831 100%)',
        perspective: '1000px',
      }}
    >
      {/* Vanta dots (blue) — only initialised when WebGL is available */}
      <div ref={vantaRef} className="absolute inset-0 z-0" />

      {/* Drifting parallax clouds for depth (pure CSS, always on) */}
      <motion.div
        aria-hidden
        className="absolute left-[10%] top-[18%] z-0 h-40 w-72 rounded-full bg-sky-300/10 blur-3xl"
        animate={{ x: [0, 50, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute right-[8%] top-[30%] z-0 h-48 w-96 rounded-full bg-blue-400/10 blur-3xl"
        animate={{ x: [0, -60, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-[12%] left-1/3 z-0 h-32 w-80 rounded-full bg-cyan-300/10 blur-3xl"
        animate={{ x: [0, 40, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Simple plane flying across the hero */}
      <JetFallback />

      {/* Foreground content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div>
          <div className="inline-block mb-4">
            <span className="text-xs font-body tracking-[0.4em] text-sky-300 uppercase border border-sky-400/30 bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-sm">
              Global Defense Encyclopedia
            </span>
          </div>
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight">
          THE WORLD'S<br />
          <span className="bg-linear-to-r from-sky-300 to-blue-500 bg-clip-text text-transparent">ARSENAL</span>
        </h1>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/category/rifles"
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-display text-sm tracking-widest uppercase rounded-sm transition-colors"
          >
            Explore Arsenal
          </Link>
          <Link
            href="/category/fighter-jets"
            className="px-8 py-3 border border-sky-400/40 bg-transparent text-sky-200 font-display text-sm tracking-widest uppercase rounded-sm hover:bg-sky-400/10 transition-colors"
          >
            Fighter Jets
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {[
            { value: '37+', label: 'Weapons' },
            { value: '7', label: 'Categories' },
            { value: '20+', label: 'Countries' },
            { value: '100+', label: 'Specifications' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl text-sky-300">{stat.value}</div>
              <div className="text-xs font-body tracking-widest text-blue-200/70 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
