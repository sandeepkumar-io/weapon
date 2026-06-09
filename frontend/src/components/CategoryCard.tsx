import Link from "next/link";
import { Category } from "@/lib/weapons";

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <Link href={`/category/${category.id}`}>
      <div
        className="relative bg-background border rounded-lg p-6 cursor-pointer overflow-hidden shadow-sm"
      >
        <div className="absolute -right-4 -bottom-6 text-8xl font-display text-orange-100 select-none">
          {category.count}
        </div>

        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/40" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/40" />

        <div className="relative z-10">
          <div className="text-4xl mb-3">{category.icon}</div>
          <div className="text-[10px] font-body tracking-[0.3em] text-primary uppercase mb-1">
            {category.subtitle}
          </div>
          <h3 className="font-display text-xl text-foreground mb-2">
            {category.name}
          </h3>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            {category.description}
          </p>
          <div className="mt-4 flex items-center text-xs text-primary font-body font-semibold tracking-wider uppercase">
            Explore Arsenal -&gt;
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
