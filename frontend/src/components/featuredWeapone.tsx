"use client"
import { weapons } from "@/lib/weapons";
import WeaponCard3D from "./WeaponeCard3D";

const featured = ["f22", "barrett-m82", "ak-47", "javelin", "desert-eagle", "benelli-m4"];

const FeaturedWeapons = ({ hideHeader }: { hideHeader?: boolean }) => {
  const featuredWeapons = weapons.filter((w) => featured.includes(w.id));

  return (
    <section className="py-20 bg-[#0b0c0f]">
      <div className="container mx-auto px-4">
        {!hideHeader && (
          <div className="text-center mb-12">
            <span className="text-xs tracking-[0.3em] text-[#eca20e] uppercase">Handpicked</span>
            <h2 className="text-4xl md:text-5xl text-white mt-2">
              FEATURED <span className="text-[#eca20e]">WEAPONS</span>
            </h2>
            <div className="w-20 h-0.5 bg-[#eca20e]/50 mx-auto mt-4" />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWeapons.map((weapon, i) => (
            <div
              key={weapon.id}
              className="animate-slide-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <WeaponCard3D weapon={weapon} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedWeapons;
