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
    <Link href={category.href}>
      <div className="group relative bg-background border border-border rounded-lg p-6 cursor-pointer overflow-hidden shadow-sm transition-colors hover:border-primary/50">
        {category.count != null && (
          <div className="absolute -right-4 -bottom-6 text-8xl font-display text-primary/10 select-none">
            {category.count}
          </div>
        )}

        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/40" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/40" />

        <div className="relative z-10">
          <div className="text-4xl mb-3">{category.icon}</div>
          <div className="text-[10px] font-body tracking-[0.3em] text-primary uppercase mb-1">
            {category.subtitle}
          </div>
          <h3 className="font-display text-xl text-foreground mb-2">{category.name}</h3>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            {category.description}
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs text-primary font-body font-semibold tracking-wider uppercase">
            Explore
            <span className="transition-transform group-hover:translate-x-1">-&gt;</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryLinkCard;
