import React from 'react'
import HeroSection from '@/components/HeroSection'
import CategoriesSection from '@/components/CategoriesSection'
import CategoryLinkCard, { NavCategory } from '@/components/CategoryLinkCard'
import FeaturedWeapons from '@/components/featuredWeapone'

// Cards that mirror the header navigation — each links to a real data page.
const navCategories: NavCategory[] = [
  { name: 'Fighter Jets', href: '/fighter-jets', icon: '✈️', subtitle: 'Aviation', count: 382, description: 'Advanced aerial superiority and multirole combat aircraft.' },
  { name: 'Jet Engines', href: '/jet-engines', icon: '🔥', subtitle: 'Propulsion', count: 99, description: 'High-thrust turbofan, turbojet and afterburning powerplants.' },
  { name: 'Rifles', href: '/rifles', icon: '🎯', subtitle: 'Firearms', count: 163, description: 'Assault, battle and service rifles from around the world.' },
  { name: 'Sniper Rifles', href: '/sniper-rifles', icon: '🔭', subtitle: 'Precision', count: 353, description: 'Long-range precision and anti-materiel marksman systems.' },
  { name: 'Pistol Bullets', href: '/pistol-bullets', icon: '🔫', subtitle: 'Ammunition', count: 80, description: 'Handgun cartridges and ammunition specifications.' },
  { name: 'Air-to-Air Missiles', href: '/air-to-air-missiles', icon: '🚀', subtitle: 'Guided', count: 131, description: 'Beyond-visual-range and short-range air-to-air guided missiles.' },
  { name: 'Bombers', href: '/bombers', icon: '💣', subtitle: 'Strategic', count: 708, description: 'Strategic, stealth and supersonic bombers from across the world.' },
]

function page() {
  return (
    <div className='w-full min-h-screen'>
      <HeroSection />
      <CategoriesSection />
      <section className='container mx-auto px-5 pb-16 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {navCategories.map((category) => (
            <CategoryLinkCard key={category.href} category={category} />
          ))}
        </div>
      </section>
      <section>
        <FeaturedWeapons />
      </section>
    </div>
  )
}

export default page
