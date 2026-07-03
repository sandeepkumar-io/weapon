import Link from "next/link";

interface Weapon {
  id: string;
  name: string;
  origin: string;
  description: string;
  caliber?: string;
  range?: string;
  speed?: string;
  specs: { label: string; value: string }[];
}

interface WeaponCard3DProps {
  weapon: Weapon;
}

const WeaponCard3D = ({ weapon }: WeaponCard3DProps) => {
  return (
    <Link href={`/weapone/${weapon.id}`}>
    <div
      className="relative bg-background border rounded-lg overflow-hidden cursor-pointer shadow-sm"
    >
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary/60" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary/60" />

      <div className="p-5 relative z-20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            {weapon.origin}
          </span>
          {weapon.caliber && (
            <span className="text-xs px-2 py-0.5 bg-background text-primary rounded">
              {weapon.caliber}
            </span>
          )}
          {weapon.speed && (
            <span className="text-xs px-2 py-0.5 bg-background text-primary rounded">
              {weapon.speed}
            </span>
          )}
        </div>

        <h3 className="text-xl text-foreground mb-2">
          {weapon.name}
        </h3>

        <p className="text-sm text-white leading-relaxed mb-4 line-clamp-2">
          {weapon.description}
        </p>

        <div className="grid grid-cols-2 gap-2">
          {weapon.specs.slice(0, 4).map((spec) => (
            <div key={spec.label} className="bg-background border border-border rounded px-2 py-1.5">
              <div className="text-[10px] text-primary uppercase tracking-wider">
                {spec.label}
              </div>
              <div className="text-xs text-foreground font-semibold">
                {spec.value}
              </div>
            </div>
          ))}
        </div>

        {weapon.range && (
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            Range: <span className="text-foreground">{weapon.range}</span>
          </div>
        )}
      </div>
    </div>
    </Link>
  );
};

export default WeaponCard3D;
