"use client"
import { useState, useRef } from "react";
import { Weapon } from "@/lib/weapons";
import { motion } from "framer-motion";
import Link from "next/link";

interface WeaponCard3DProps {
  weapon: Weapon;
}

const WeaponCard3D = ({ weapon }: WeaponCard3DProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - y) * 20;
    const rotateY = (x - 0.5) * 20;
    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`);
    setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
  };

  const handleMouseLeave = () => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <Link href={`/weapone/${weapon.id}`}>
    <div
      ref={cardRef}
      className="group relative bg-[#181a1f] border border-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#eca20e]/50"
      style={{ transform, transition: "transform 0.15s ease-out" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glare effect */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,200,50,${glare.opacity}), transparent 60%)`,
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#eca20e]/60" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#eca20e]/60" />

      <div className="p-5 relative z-20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold tracking-widest text-[#eca20e] uppercase">
            {weapon.origin}
          </span>
          {weapon.caliber && (
            <span className="text-xs px-2 py-0.5 bg-[#eca20e]/10 text-[#eca20e] rounded">
              {weapon.caliber}
            </span>
          )}
          {weapon.speed && (
            <span className="text-xs px-2 py-0.5 bg-[#eca20e]/10 text-[#eca20e] rounded">
              {weapon.speed}
            </span>
          )}
        </div>

        <h3 className="text-xl text-white group-hover:text-[#eca20e] transition-colors mb-2">
          {weapon.name}
        </h3>

        <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {weapon.description}
        </p>

        <div className="grid grid-cols-2 gap-2">
          {weapon.specs.slice(0, 4).map((spec) => (
            <div key={spec.label} className="bg-gray-800/50 rounded px-2 py-1.5">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                {spec.label}
              </div>
              <div className="text-xs text-white font-semibold">
                {spec.value}
              </div>
            </div>
          ))}
        </div>

        {weapon.range && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
            <span className="text-[#eca20e]">â—</span>
            Effective Range: <span className="text-white">{weapon.range}</span>
          </div>
        )}
      </div>
    </div>
    </Link>
  );
};

export default WeaponCard3D;
