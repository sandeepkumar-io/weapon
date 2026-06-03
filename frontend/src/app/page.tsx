import React from 'react'
import HeroSection from '@/components/HeroSection'
import CategoryCard from '@/components/CategoryCard'
import { categories } from '@/lib/weapons'
import CategoriesSection from '@/components/CategoriesSection'
import WeaponCard3D from '@/components/WeaponeCard3D'
import FeaturedWeapons from '@/components/featuredWeapone'

type Props = {}

function page({}: Props) {
  return (
    <div className='w-full min-h-screen'>
      <HeroSection />
      <section className='container mx-auto mt-6 '>

          <CategoriesSection />
      </section>
      <section className='container mx-auto px-4 mb-16 '>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>
      <section>
        <FeaturedWeapons/>
      </section>
    </div>
  )
}

export default page
