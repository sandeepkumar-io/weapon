'use client'

import Link from 'next/link'
import { LuArrowRight, LuDatabase, LuRadar, LuShieldCheck } from 'react-icons/lu'

function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden border-b border-border pt-16"
      style={{ perspective: '1000px' }}
    >
      <img
        src="/jet2.jpg"
        alt=""
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[125vw] min-h-full w-[125vh] min-w-full -translate-x-1/2 -translate-y-1/2 -rotate-90 object-cover "
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.72) 45%, rgba(5,5,5,0.35) 100%)',
        }}
      />

      <div className="relative z-10 container mx-auto grid items-center gap-10 px-5 py-20 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:px-8">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-primary/25  px-3 py-2 font-mono text-[11px] uppercase tracking-[0.24em] text-primary backdrop-blur">
            <LuRadar className="h-4 w-4" />
            Global Defense Encyclopedia
          </div>

          <h1 className="max-w-4xl font-display text-6xl font-bold uppercase leading-[0.86] tracking-tight text-white sm:text-7xl lg:text-8xl">
            Explore the
            <br />
            <span className="bg-linear-to-r from-cyan-300 via-white to-lime-300 bg-clip-text text-transparent">
              Arsenal Index
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
            Browse aircraft, propulsion, missiles, rifles, precision systems, bombers, and
            ammunition with clean specs, image-led cards, and focused technical summaries.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#categories"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-primary px-6 font-display text-sm font-bold uppercase tracking-widest text-primary-foreground transition hover:bg-cyan-300"
            >
              Explore Arsenal
              <LuArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/fighter-jets"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-black/35 px-6 font-display text-sm font-bold uppercase tracking-widest text-cyan-100 transition hover:border-primary hover:text-primary"
            >
              Fighter Jets
            </Link>
          </div>

          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {[
              { value: '1,900+', label: 'Records' },
              { value: '7', label: 'Live Catalogs' },
              { value: '100+', label: 'Specs' },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0a0a0a]/90 p-4">
                <div className="font-display text-2xl text-primary">{stat.value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
