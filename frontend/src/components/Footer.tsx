'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiMapPin, FiAlertTriangle, FiMail, FiSend, FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiChevronRight, FiRadio } from "react-icons/fi";
import { categories } from "@/lib/weapons";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

// Drive the arsenal columns straight from the project's category data
const half = Math.ceil(categories.length / 2);
const cols = [
  {
    code: "01",
    title: "Arsenal",
    links: categories.slice(0, half).map((c) => ({ label: c.name, href: `/category/${c.id}` })),
  },
  {
    code: "02",
    title: "Systems",
    links: [
      ...categories.slice(half).map((c) => ({ label: c.name, href: `/category/${c.id}` })),
      { label: "All Weapons", href: "/" },
    ],
  },
  {
    code: "03",
    title: "Intel",
    links: [
      { label: "About", href: "/" },
      { label: "Methodology", href: "/" },
      { label: "Sources", href: "/" },
      { label: "Disclaimer", href: "/" },
    ],
  },
];

const socials = [
  { icon: FiFacebook, label: "Facebook" },
  { icon: FiTwitter, label: "Twitter" },
  { icon: FiInstagram, label: "Instagram" },
  { icon: FiYoutube, label: "Youtube" },
];

const oswald = { fontFamily: "'Oswald', sans-serif" };
const inter = { fontFamily: "'Inter', sans-serif" };
const mono = { fontFamily: "'JetBrains Mono', monospace" };

export default function Footer() {
  const [email, setEmail] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        `${d.getUTCHours().toString().padStart(2, "0")}:${d.getUTCMinutes().toString().padStart(2, "0")}:${d.getUTCSeconds().toString().padStart(2, "0")} UTC`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer
      className="relative isolate overflow-hidden bg-[#050505] text-zinc-300"
      style={inter}
    >
      {/* Animated collision beams background */}
      <BackgroundBeamsWithCollision className="pointer-events-none absolute inset-0 z-0 h-full bg-none md:h-full" />

      {/* Scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(34,211,238,0.6) 0px, rgba(34,211,238,0.6) 1px, transparent 1px, transparent 3px)",
        }}
      />
      {/* Crosshatch grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(163,230,53,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at 50% 100%, black 30%, transparent 80%)",
        }}
      />
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-32 left-[15%] h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 right-[10%] h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />

      {/* HUD top bar */}
      <div className="relative border-y border-zinc-900 bg-[#0a0a0a]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-2.5 text-[11px] uppercase tracking-[0.25em] text-zinc-500 sm:px-8" style={mono}>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-lime-400" />
            </span>
            <span className="text-lime-400">DATABASE::ONLINE</span>
            <span className="hidden text-zinc-700 sm:inline">/</span>
            <span className="hidden sm:inline">GLOBAL DEFENSE</span>
          </div>
          <div className="flex items-center gap-3">
            <FiRadio className="h-3 w-3 text-cyan-400" />
            <span className="text-cyan-400">{time || "--:--:-- UTC"}</span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8 sm:px-8 lg:pt-24">
        {/* Section label */}
        <div className="mb-8 flex items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-cyan-400" style={mono}>
            // FOOTER · TERMINAL_OUT
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-cyan-400/40 to-transparent" />
        </div>

        {/* MAGAZINE LAYOUT: featured CTA dominant + supporting grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Featured: oversized CTA — spans 7 cols */}
          <div className="relative lg:col-span-7">
            <div className="group relative h-full overflow-hidden rounded-sm border border-zinc-800 bg-gradient-to-br from-[#0f0f0f] via-[#0a0a0a] to-black p-8 sm:p-12">
              {/* Corner brackets */}
              {["top-0 left-0", "top-0 right-0 rotate-90", "bottom-0 left-0 -rotate-90", "bottom-0 right-0 rotate-180"].map((pos) => (
                <span
                  key={pos}
                  className={`pointer-events-none absolute ${pos} h-5 w-5`}
                  style={{
                    borderTop: "2px solid #22d3ee",
                    borderLeft: "2px solid #22d3ee",
                  }}
                />
              ))}

              {/* Scan sweep */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[scan_4s_linear_infinite]" />

              <div className="relative flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-lime-400" style={mono}>
                <span className="inline-block h-1.5 w-1.5 animate-pulse bg-lime-400" />
                Intel Feed · Channel 22.3
              </div>

              <h2
                className="mt-6 text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl"
                style={oswald}
              >
                Decode The{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-lime-400 bg-clip-text text-transparent">
                    Arsenal
                  </span>
                  <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-gradient-to-r from-cyan-400 to-lime-400" />
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-zinc-400 sm:text-base">
                New platform breakdowns, specification deep-dives, and database updates across rifles, snipers, missiles, and fighter jets. Delivered weekly.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setEmail("");
                }}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-stretch"
              >
                <label className="group/input relative flex flex-1 items-center gap-3 border border-zinc-800 bg-black/60 px-4 transition-colors focus-within:border-cyan-400">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600" style={mono}>
                    EMAIL//
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="analyst@domain.com"
                    className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-white placeholder:text-zinc-700 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  className="group/btn relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden border border-cyan-400 bg-cyan-400/10 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-cyan-300 transition-all hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
                  style={oswald}
                >
                  <span className="relative z-10">Subscribe</span>
                  <FiSend className="relative z-10 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </form>

              {/* Readout strip — real database stats */}
              <div className="mt-10 grid grid-cols-3 gap-px border border-zinc-900 bg-zinc-900" style={mono}>
                {[
                  { k: "WEAPONS", v: "37+", c: "text-cyan-400" },
                  { k: "CATEGORIES", v: String(categories.length), c: "text-lime-400" },
                  { k: "COUNTRIES", v: "20+", c: "text-cyan-400" },
                ].map((s) => (
                  <div key={s.k} className="bg-black px-4 py-3">
                    <div className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">{s.k}</div>
                    <div className={`mt-1 text-lg font-bold ${s.c}`}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Supporting: brand + contact — 5 cols */}
          <div className="lg:col-span-5">
            <div className="flex h-full flex-col gap-6">
              {/* Brand block */}
              <div className="relative border border-zinc-900 bg-[#0a0a0a] p-6">
                <div className="flex items-center gap-3">
                  <div className="relative grid h-12 w-12 shrink-0 place-items-center border border-cyan-400/40 bg-black">
                    <span className="absolute inset-0 border border-lime-400/30 translate-x-1 translate-y-1" />
                    <span className="relative font-bold text-cyan-400" style={oswald}>AX</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-2xl font-bold uppercase leading-none tracking-tight text-white" style={oswald}>
                      Arsenal<span className="text-cyan-400">X</span>
                    </div>
                    <div className="mt-1.5 text-[10px] uppercase tracking-[0.3em] text-zinc-500" style={mono}>
                      Global · Defense · Encyclopedia
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-zinc-400">
                  The world&apos;s most comprehensive military weapons database. Every weapon, every specification — sourced from publicly available information.
                </p>

                <ul className="mt-5 space-y-2.5 text-sm" style={mono}>
                  <li className="flex items-center gap-2.5 text-zinc-400">
                    <FiMapPin className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                    <span className="truncate">Open Source Intelligence Archive</span>
                  </li>
                  <li className="flex items-center gap-2.5 text-zinc-400">
                    <FiAlertTriangle className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                    Educational &amp; Informational Use Only
                  </li>
                  <li className="flex items-center gap-2.5 text-zinc-400">
                    <FiMail className="h-3.5 w-3.5 shrink-0 text-cyan-400" />
                    contact@arsenalx.dev
                  </li>
                </ul>
              </div>

              {/* Nav columns — compact */}
              <div className="grid flex-1 grid-cols-1 gap-px border border-zinc-900 bg-zinc-900 sm:grid-cols-3">
                {cols.map((col) => (
                  <div key={col.title} className="bg-[#0a0a0a] p-5">
                    <div className="mb-4 flex items-baseline justify-between">
                      <h4
                        className="text-sm font-bold uppercase tracking-[0.15em] text-white"
                        style={oswald}
                      >
                        {col.title}
                      </h4>
                      <span className="text-[10px] text-lime-400" style={mono}>
                        /{col.code}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            className="group/link flex items-center gap-1 text-[13px] text-zinc-400 transition-colors hover:text-cyan-300"
                          >
                            <FiChevronRight className="h-3 w-3 -translate-x-1 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100 group-hover/link:text-lime-400" />
                            <span className="-ml-3 group-hover/link:ml-0 transition-all">{link.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-zinc-900 pt-6">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:flex-wrap sm:justify-between">
            <div className="min-w-0">
              <p className="truncate text-[11px] uppercase tracking-[0.2em] text-zinc-600" style={mono}>
                © {new Date().getFullYear()} ARSENALX //{" "}
                <span className="text-cyan-400">REFERENCE_DATABASE</span> ·{" "}
                <span className="text-lime-400">SPECS_APPROXIMATE</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {socials.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="group grid h-9 w-9 place-items-center border border-zinc-800 bg-[#0a0a0a] text-zinc-500 transition-all hover:-translate-y-0.5 hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.35em] text-zinc-700" style={mono}>
            <span>Verified Specs</span>
            <span className="text-cyan-400/60">+</span>
            <span>Open Intelligence</span>
            <span className="text-lime-400/60">+</span>
            <span>Stay Informed</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(800px); opacity: 0; }
        }
      `}</style>
    </footer>
  );
}
