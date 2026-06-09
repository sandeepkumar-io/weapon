'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'

declare global {
  interface Window {
    VANTA?: {
      DOTS?: (config: Record<string, unknown>) => { destroy: () => void }
    }
  }
}

function HeroSection() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const effectRef = useRef<{ destroy: () => void } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !vantaRef.current) return

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
          color: '#f97316',
          color2: '#f97316',
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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div ref={vantaRef} className="absolute inset-0 z-0" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div>
          <div className="inline-block mb-4">
            <span className="text-xs font-body tracking-[0.4em] text-primary uppercase border border-primary/30 bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-sm">
              Global Defense Encyclopedia
            </span>
          </div>
        </div>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 leading-tight">
          THE WORLD'S<br />
          <span className="text-primary">ARSENAL</span>
        </h1>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/category/rifles"
            className="px-8 py-3 bg-primary text-primary-foreground font-display text-sm tracking-widest uppercase rounded-sm"
          >
            Explore Arsenal
          </Link>
          <Link
            href="/category/fighter-jets"
            className="px-8 py-3 border border-primary/40 bg-transparent text-primary font-display text-sm tracking-widest uppercase rounded-sm"
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
              <div className="font-display text-3xl text-primary">{stat.value}</div>
              <div className="text-xs font-body tracking-widest text-muted-foreground uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
