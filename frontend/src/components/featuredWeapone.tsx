"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

interface FeaturedItem {
  id: string;
  name: string;
  image?: string;
  href: string;
  tag: string;
}

const SOURCES = [
  { api: "/api/fighter-jets", base: "/fighter-jets", tag: "Fighter Jet", n: 2 },
  { api: "/api/sniper-rifles", base: "/sniper-rifles", tag: "Sniper", n: 2 },
  { api: "/api/rifles", base: "/rifles", tag: "Rifle", n: 2 },
];

const FeaturedWeapons = ({ hideHeader }: { hideHeader?: boolean }) => {
  const [items, setItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const results = await Promise.all(
        SOURCES.map(async (s) => {
          try {
            const res = await fetch(s.api);
            const json = await res.json();
            const data: any[] = json?.data || [];
            return data
              .filter((d) => d?.generatedImages?.length)
              .slice(0, s.n)
              .map((d) => ({
                id: d.id,
                name: d.name,
                image: d.generatedImages?.[0],
                href: `${s.base}/${encodeURIComponent(d.id)}`,
                tag: s.tag,
              }));
          } catch {
            return [];
          }
        })
      );
      if (active) {
        setItems(results.flat());
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="featured" className="border-t border-border bg-background py-16 lg:py-20">
      <div className="container mx-auto px-5 lg:px-8">
        {!hideHeader && (
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">Handpicked</span>
              <h2 className="mt-3 font-display text-4xl font-bold uppercase text-foreground md:text-5xl">
                Reference cards
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-7 text-muted-foreground">
              A fast sample of image-led entries with the same visual treatment used across the catalog pages.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-80 rounded-lg border border-border bg-white/5 animate-pulse" />
              ))
            : items.map((item) => (
                <Link key={`${item.tag}-${item.id}`} href={item.href} className="group block">
                  <div className="technical-panel relative min-h-full overflow-hidden rounded-lg border border-border transition duration-300 hover:-translate-y-1 hover:border-primary/60">
                    <div className="relative aspect-16/10 overflow-hidden bg-[#0a0a0a]">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="image-shade absolute inset-0" />
                      <span className="absolute left-4 top-4 rounded-md border border-primary/40 bg-black/65 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-primary backdrop-blur">
                        {item.tag}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="line-clamp-1 font-display text-xl font-bold uppercase text-foreground">{item.name}</h3>
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                        <span>Show more</span>
                        <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWeapons;
