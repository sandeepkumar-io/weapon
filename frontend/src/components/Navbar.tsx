'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { FiMenu, FiX } from 'react-icons/fi';

const links = [
  { href: '/', label: 'Home' },
  { href: '/fighter-jets', label: 'Jets' },
  { href: '/airlines', label: 'Airlines' },
  { href: '/airplanes', label: 'Planes' },
  { href: '/jet-engines', label: 'Engines' },
  { href: '/rifles', label: 'Rifles' },
  { href: '/sniper-rifles', label: 'Snipers' },
  { href: '/pistol-bullets', label: 'Ammo' },
  { href: '/air-to-air-missiles', label: 'Missiles' },
  { href: '/bombers', label: 'Bombers' },
];

const isActive = (pathname: string, href: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      {/* animated scan line along the bottom edge */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-cyan-400 to-transparent"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo with animated gradient border */}
          <Link href="/" onClick={() => setOpen(false)} className="group relative shrink-0">
            <span className="relative inline-flex items-center overflow-hidden rounded-lg p-[1.5px] shadow-[0_0_18px_rgba(34,211,238,0.12)] transition-shadow duration-300 group-hover:shadow-[0_0_26px_rgba(34,211,238,0.28)]">
              {/* rotating conic-gradient ring */}
              <motion.span
                aria-hidden
                className="absolute left-1/2 top-1/2 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, #22d3ee 55deg, transparent 130deg, #a3e635 210deg, transparent 300deg)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              />
              {/* inner content (masks the center, leaving a thin animated border) */}
              <span className="relative z-10 flex items-center gap-2.5 rounded-[7px] bg-[#070707] px-3 py-1.5">
                <span className="relative grid h-7 w-7 shrink-0 place-items-center border border-cyan-400/50 bg-black">
                  <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 border border-lime-400/40 transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0" />
                  <span className="relative font-display text-xs font-bold text-cyan-400">A</span>
                </span>
                <span className="font-display text-lg tracking-wider text-foreground">
                  ARSENAL<span className="text-primary">X</span>
                </span>
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative px-3.5 py-2 text-xs font-body font-semibold uppercase tracking-wider lg:text-sm"
                >
                  {/* sliding active pill */}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-md border border-primary/40 bg-primary/10"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative z-10 transition-colors duration-200 ${
                      active ? 'text-primary' : 'text-foreground/70 group-hover:text-primary'
                    }`}
                  >
                    {link.label}
                  </span>
                  {/* hover underline */}
                  <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-linear-to-r from-cyan-400 to-lime-400 transition-all duration-300 group-hover:w-2/3" />
                </Link>
              );
            })}

            {/* HUD status chip */}
            <span className="ml-3 hidden items-center gap-2 border border-border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500 lg:flex">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime-400" />
              </span>
              <span className="text-lime-400">Online</span>
            </span>
          </div>

          {/* Mobile toggle */}
          <button
            className="grid h-10 w-10 place-items-center text-foreground transition-colors hover:text-primary lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <AnimatePresence mode="wait" initial={false}>
              {open ? (
                <motion.span
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiX className="h-6 w-6" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiMenu className="h-6 w-6" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-border bg-[#0a0a0a]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="container mx-auto px-4 py-3">
              {links.map((link, i) => {
                const active = isActive(pathname, link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.04 * i, duration: 0.25 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between border-l-2 px-4 py-3 text-sm font-body font-semibold uppercase tracking-wider transition-colors ${
                        active
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-transparent text-foreground/70 hover:border-primary/40 hover:text-primary'
                      }`}
                    >
                      {link.label}
                      <span className="font-mono text-[10px] text-lime-400/70">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
