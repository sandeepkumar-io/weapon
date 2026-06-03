import Link from "next/link";
import { notFound } from "next/navigation";
import { weapons } from "@/lib/weapons";
import FeaturedWeapons from "@/components/featuredWeapone";

type WeaponPageProps = {
  params: Promise<{ id: string }>;
};

export default async function WeaponPage({ params }: WeaponPageProps) {
  const { id } = await params;
  const weapon = weapons.find((item) => item.id === id);

  if (!weapon) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0b0c0f] relative text-white py-20">
      
        <Link href="/" className="inline-flex absolute left-8 px-3 py-1 rounded-xl cursor-pointer bg-gray-500 items-center text-2xl text-[#eca20e] hover:bg-gray-500 duration-150">
          {"< back"}
        </Link>
      <section className="container mx-auto px-4 max-w-4xl">
      
        <div className="border border-[#eca20e]/30 rounded-xl bg-[#15171c] p-6 md:p-10">
        
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-[#eca20e]/10 text-[#eca20e] uppercase tracking-wider">
              {weapon.category}
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 uppercase tracking-wider">
              {weapon.origin}
            </span>
            {weapon.caliber && (
              <span className="text-xs px-3 py-1 rounded-full bg-white/5 text-gray-300 uppercase tracking-wider">
                {weapon.caliber}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-[#eca20e]">{weapon.name}</h1>
          <p className="text-gray-300 leading-relaxed mb-8">{weapon.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-[#0f1115] border border-white/10 rounded-lg p-3">
              <div className="text-[11px] text-gray-500 uppercase">Weight</div>
              <div className="text-sm font-semibold">{weapon.weight}</div>
            </div>
            {weapon.range && (
              <div className="bg-[#0f1115] border border-white/10 rounded-lg p-3">
                <div className="text-[11px] text-gray-500 uppercase">Range</div>
                <div className="text-sm font-semibold">{weapon.range}</div>
              </div>
            )}
            {weapon.speed && (
              <div className="bg-[#0f1115] border border-white/10 rounded-lg p-3">
                <div className="text-[11px] text-gray-500 uppercase">Speed</div>
                <div className="text-sm font-semibold">{weapon.speed}</div>
              </div>
            )}
          </div>

          <h2 className="text-xl font-semibold mb-3">Specs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {weapon.specs.map((spec) => (
              <div key={spec.label} className="bg-[#0f1115] border border-white/10 rounded-lg p-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{spec.label}</div>
                <div className="text-sm text-white">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <FeaturedWeapons hideHeader />
      </section>
    </main>
  );
}
