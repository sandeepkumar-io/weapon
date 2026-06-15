import Link from "next/link";

export interface NavCategory {
  name: string;
  href: string;
  icon: string;
  subtitle: string;
  description: string;
  count?: number | string;
}

/** Home-page card that links to one of the real header sections. */
const CategoryLinkCard = ({ category }: { category: NavCategory }) => {
  return (
    <Link href={category.href} className="group block">
      <div className="technical-panel relative overflow-hidden rounded-2xl border border-border p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/60 hover:shadow-[0_0_45px_-10px_rgba(34,211,238,0.4)]">
        {/* top accent bar grows on hover */}
        <span className="absolute inset-x-0 top-0 h-px w-0 bg-linear-to-r from-cyan-400 to-lime-400 transition-all duration-500 group-hover:w-full" />

        {/* diagonal light sweep on hover */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

        {/* oversized count watermark */}
        {category.count != null && (
          <div className="pointer-events-none absolute -bottom-5 -right-3 select-none font-display text-8xl font-bold text-primary/5 transition-all duration-300 group-hover:text-primary/15">
            {category.count}
          </div>
        )}

        {/* animated corner brackets */}
        <span className="absolute left-3 top-3 h-4 w-4 border-l-2 border-t-2 border-primary/40 transition-all duration-300 group-hover:left-2 group-hover:top-2 group-hover:border-primary" />
        <span className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-primary/40 transition-all duration-300 group-hover:bottom-2 group-hover:right-2 group-hover:border-primary" />

        <div className="relative z-10">
          {/* framed icon + subtitle */}
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-border bg-black/40 text-3xl transition-all duration-300 group-hover:scale-105 group-hover:border-primary/50 group-hover:bg-primary/10">
              {category.icon}
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
              {category.subtitle}
            </span>
          </div>

          <h3 className="font-display text-2xl uppercase tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
            {category.name}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {category.description}
          </p>

          <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            <span className="relative">
              Explore
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-linear-to-r from-cyan-400 to-lime-400 transition-all duration-300 group-hover:w-full" />
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryLinkCard;
