const CategoriesSection = () => {
  return (
    <section id="categories" className="py-16 lg:py-20">
      <div className="container mx-auto px-5 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
              Browse by type
            </span>
            <h2 className="mt-3 font-display text-4xl font-bold uppercase tracking-tight text-foreground md:text-5xl">
              Category command deck
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-7 text-muted-foreground">
            Jump straight into the live catalog that matches the platform class you want to compare.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
