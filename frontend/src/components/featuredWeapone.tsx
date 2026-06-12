"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {!hideHeader && (
          <div className="text-center mb-12">
            <span className="text-xs tracking-[0.3em] text-primary uppercase">Handpicked</span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mt-2">
              FEATURED <span className="text-primary">WEAPONS</span>
            </h2>
            <div className="w-20 h-0.5 bg-primary/50 mx-auto mt-4" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-72 rounded-lg border border-border bg-white/5 animate-pulse" />
              ))
            : items.map((item) => (
                <Link key={`${item.tag}-${item.id}`} href={item.href}>
                  <div className="group relative overflow-hidden rounded-lg border border-border bg-background cursor-pointer transition-colors hover:border-primary/50">
                    <div className="relative h-56 overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                      <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.92), transparent 70%)" }}
                      />
                      <span className="absolute top-3 left-3 text-[10px] uppercase tracking-widest bg-primary/20 border border-primary/40 text-primary px-2 py-1 rounded">
                        {item.tag}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg text-foreground line-clamp-1">{item.name}</h3>
                      <div className="mt-2 flex items-center gap-1 text-xs text-primary font-semibold uppercase tracking-wider">
                        View details
                        <span className="transition-transform group-hover:translate-x-1">-&gt;</span>
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
