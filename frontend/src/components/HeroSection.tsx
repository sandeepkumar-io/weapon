import React from 'react'
import heroBg from '../assest/hero-bg.jpg'
import Link from "next/link"

type Props = {}

function HeroSection({}: Props) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg.src})` }}
      />
      <div className="absolute inset-0 hero-overlay" />

      {/* Scan lines effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="inline-block mb-4">
            <span className="text-xs font-body tracking-[0.4em] text-primary uppercase border border-primary/30 px-4 py-1.5 rounded-sm">
              Global Defense Encyclopedia
            </span>
          </div>
        </div>

        <h1 className="animate-fade-in font-display text-5xl md:text-7xl lg:text-8xl text-foreground mb-6 text-glow leading-tight" style={{ animationDelay: "0.4s" }}>
          THE WORLD'S<br />
          <span className="text-primary">ARSENAL</span>
        </h1>

        <p className="animate-fade-in text-lg md:text-xl text-muted-foreground font-body max-w-2xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: "0.6s" }}>
          Explore the most comprehensive database of military weapons, from sidearms to stealth fighters. Every caliber, every specification, every detail.
        </p>

        <div className="animate-fade-in flex flex-wrap gap-4 justify-center" style={{ animationDelay: "0.8s" }}>
          <Link
            href="/category/rifles"
            className="px-8 py-3 bg-primary text-primary-foreground font-display text-sm tracking-widest uppercase hover:bg-primary/90 transition-colors rounded-sm"
          >
            Explore Arsenal
          </Link>
          <Link
            href="/category/fighter-jets"
            className="px-8 py-3 border border-primary/40 text-primary font-display text-sm tracking-widest uppercase hover:bg-primary/10 transition-colors rounded-sm"
          >
            Fighter Jets
          </Link>
        </div>

        {/* Stats bar */}
        <div className="animate-fade-in mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto" style={{ animationDelay: "1s" }}>
          {[
            { value: "37+", label: "Weapons" },
            { value: "7", label: "Categories" },
            { value: "20+", label: "Countries" },
            { value: "100+", label: "Specifications" },
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