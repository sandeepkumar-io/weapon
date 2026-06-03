import { categories } from "@/lib/weapons";
import CategoryCard from "./CategoryCard";

const CategoriesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-body tracking-[0.3em] text-primary uppercase">Browse By Type</span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-2">
            WEAPON <span className="text-primary">CATEGORIES</span>
          </h2>
          <div className="w-20 h-0.5 bg-primary/50 mx-auto mt-4" />
        </div>

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
            >
              <CategoryCard category={cat} />
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default CategoriesSection;
