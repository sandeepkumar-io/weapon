import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

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
      <div className="technical-panel relative min-h-[260px] overflow-hidden rounded-lg border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/60 hover:shadow-[0_24px_70px_-36px_rgba(34,211,238,0.7)]">
        <span className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-cyan-200 to-accent opacity-70 transition-opacity group-hover:opacity-100" />

        {category.count != null && (
          <div className="pointer-events-none absolute -bottom-6 -right-2 select-none font-display text-8xl font-bold text-primary/5 transition-all duration-300 group-hover:text-primary/12">
            {category.count}
          </div>
        )}

        <div className="relative z-10 flex h-full flex-col">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-md border border-border bg-black/40 text-3xl transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/10">
              {category.icon}
            </div>
            <span className="rounded-md border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              {category.subtitle}
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
            {category.name}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {category.description}
          </p>

          <div className="mt-auto flex items-center justify-between border-t border-border pt-5 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            <span>Open catalog</span>
            <LuArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryLinkCard;
