"use client"
import { weapons } from "@/lib/weapons";
import WeaponCard3D from "./WeaponeCard3D";

const featured = ["f22", "barrett-m82", "ak-47", "javelin", "desert-eagle", "benelli-m4"];

const FeaturedWeapons = ({ hideHeader }: { hideHeader?: boolean }) => {
  const featuredWeapons = weapons.filter((w) => featured.includes(w.id));

  return (
    <section className="py-20 bg-orange-50">
      <div className="container mx-auto px-4">
        {!hideHeader && (
          <div className="text-center mb-12">
            <span className="text-xs tracking-[0.3em] text-primary uppercase">Handpicked</span>
            <h2 className="text-4xl md:text-5xl text-foreground mt-2">
              FEATURED <span className="text-primary">WEAPONS</span>
            </h2>
            <div className="w-20 h-0.5 bg-primary/50 mx-auto mt-4" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWeapons.map((weapon) => (
            <div key={weapon.id}>
              <WeaponCard3D weapon={weapon} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWeapons;
