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
]

function page() {
  return (
    <div className='w-full min-h-screen'>
      <HeroSection />
      <section className='container mx-auto mt-6 '>
        <CategoriesSection />
      </section>
      <section className='container mx-auto px-4 mb-16 '>
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
