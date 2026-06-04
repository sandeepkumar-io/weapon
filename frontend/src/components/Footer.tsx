import React from 'react'
import Link from 'next/link'
import { categories } from '@/lib/weapons'

type Props = {}

function Footer({}: Props) {
  return (
    <div>
        <footer className="border-t border-border bg-tactical-dark py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <span className="font-display text-xl tracking-wider text-foreground">
            ARSENAL<span className="text-primary">X</span>
          </span>
          <p className="text-sm text-muted-foreground font-body mt-3 leading-relaxed">
            The world's most comprehensive military weapons database. Every weapon, every specification.
          </p>
        </div>
        <div>
          <h4 className="font-display text-sm tracking-wider text-foreground mb-3">CATEGORIES</h4>
          <div className="grid grid-cols-2 gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="text-sm text-muted-foreground font-body hover:text-primary"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm tracking-wider text-foreground mb-3">DISCLAIMER</h4>
          <p className="text-xs text-muted-foreground font-body leading-relaxed">
            This website is for educational and informational purposes only. All data is sourced from publicly available information.
          </p>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center">
        <p className="text-xs text-muted-foreground font-body">
          Copyright 2026 ArsenalX. All specifications are approximate.
        </p>
      </div>
    </div>
  </footer>
    </div>
  )
}

export default Footer
