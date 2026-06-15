const CategoriesSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-cyan-400">
            // Browse By Type
          </span>
          <h2 className="mt-3 font-display text-4xl uppercase tracking-tight text-foreground md:text-5xl">
            Weapon{" "}
            <span className="bg-linear-to-r from-cyan-300 to-lime-400 bg-clip-text text-transparent">
              Categories
            </span>
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-linear-to-r from-transparent to-cyan-400" />
            <span className="h-1.5 w-1.5 rotate-45 bg-lime-400" />
            <span className="h-px w-12 bg-linear-to-l from-transparent to-cyan-400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
