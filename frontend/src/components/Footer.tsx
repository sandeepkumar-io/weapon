'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import {
  LuArrowRight,
  LuDatabase,
  LuGithub,
  LuMail,
  LuMapPin,
  LuRadioTower,
  LuShieldAlert,
} from 'react-icons/lu';

const catalogLinks = [
  { label: 'Fighter Jets', href: '/fighter-jets' },
  { label: 'Airplanes', href: '/airplanes' },
  { label: 'Jet Engines', href: '/jet-engines' },
  { label: 'Rifles', href: '/rifles' },
  { label: 'Sniper Rifles', href: '/sniper-rifles' },
  { label: 'Pistol Bullets', href: '/pistol-bullets' },
  { label: 'Air-to-Air Missiles', href: '/air-to-air-missiles' },
  { label: 'Bombers', href: '/bombers' },
];

const footerGroups = [
  { title: 'Catalogs', links: catalogLinks.slice(0, 4) },
  { title: 'Reference', links: catalogLinks.slice(4) },
  {
    title: 'Platform',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Featured', href: '/#featured' },
      { label: 'Categories', href: '/#categories' },
    ],
  },
];

export default function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="relative overflow-hidden border-t border-border bg-[#050505] text-zinc-300">
      <div aria-hidden className="absolute inset-0 hero-grid opacity-30" />
      <div className="relative mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-md border border-primary/40 bg-primary/10 font-display text-lg font-bold text-primary">
                AX
              </span>
              <span>
                <span className="block font-display text-2xl font-bold uppercase tracking-wide text-white">
                  Arsenal<span className="text-primary">X</span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-zinc-500">
                  Public reference database
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-xl text-sm leading-7 text-zinc-400">
              A focused encyclopedia for comparing public military reference data across aircraft,
              propulsion, firearms, ammunition, missiles, and strategic platforms.
            </p>

            <div className="mt-8 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
              {[
                { icon: LuDatabase, label: 'Catalogs', value: String(catalogLinks.length) },
                { icon: LuRadioTower, label: 'Status', value: 'Online' },
                { icon: LuShieldAlert, label: 'Use', value: 'Educational' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-[#0a0a0a] p-4">
                  <Icon className="mb-3 h-4 w-4 text-primary" />
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{label}</div>
                  <div className="mt-1 font-display text-xl uppercase text-white">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-white">
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-primary"
                      >
                        <LuArrowRight className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                        <span className="group-hover:translate-x-0.5 transition">{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
            <span className="inline-flex items-center gap-2">
              <LuMapPin className="h-3.5 w-3.5 text-primary" />
              Open-source intelligence archive
            </span>
            <span className="inline-flex items-center gap-2">
              <LuMail className="h-3.5 w-3.5 text-primary" />
              contact@arsenalx.dev
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="mailto:contact@arsenalx.dev"
              aria-label="Email ArsenalX"
              className="grid h-9 w-9 place-items-center rounded-md border border-border text-zinc-400 transition hover:border-primary hover:text-primary"
            >
              <LuMail className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Project repository"
              className="grid h-9 w-9 place-items-center rounded-md border border-border text-zinc-400 transition hover:border-primary hover:text-primary"
            >
              <LuGithub className="h-4 w-4" />
            </a>
          </div>
        </div>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600">
          © {year} ArsenalX. Specifications are reference estimates from public information.
        </p>
      </div>
    </footer>
  );
}
