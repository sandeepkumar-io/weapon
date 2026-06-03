"use client"
import { useState, useRef } from "react";
import Link from "next/link";
import { Category } from "@/lib/weapons";

const CategoryCard = ({ category }: { category: Category }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 25;
    const rotateY = (x - 0.5) * 25;
    setTransform(`perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
  };

  const handleMouseLeave = () => {
    setTransform("perspective(600px) rotateX(0) rotateY(0) scale3d(1, 1, 1)");
  };

  return (
    <Link href={`/category/${category.id}`}>
      <div
        ref={cardRef}
        className="group relative bg-card-gradient border border-border rounded-lg p-6 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:border-glow overflow-hidden"
        style={{ transform, transition: "transform 0.15s ease-out" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background number */}
        <div className="absolute -right-4 -bottom-6 text-8xl font-display text-muted/30 select-none group-hover:text-primary/10 transition-colors">
          {category.count}
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/40 group-hover:border-primary transition-colors" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/40 group-hover:border-primary transition-colors" />

        <div className="relative z-10">
          <div className="text-4xl mb-3">{category.icon}</div>
          <div className="text-[10px] font-body tracking-[0.3em] text-primary uppercase mb-1">
            {category.subtitle}
          </div>
          <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors mb-2">
            {category.name}
          </h3>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            {category.description}
          </p>
          <div className="mt-4 flex items-center text-xs text-primary font-body font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
            Explore Arsenal â†’
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
