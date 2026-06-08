import React from 'react'

type Props = {
  index?: number
  name?: string
  description?: string
}

export default function Paragraphheader({ name = '', description = '' }: Props) {
  return (
    <div className='absolute top-2 right-2 md:top-0 md:right-0 lg:top-1 lg:right-0 p-1 md:p-4 lg:p-2 max-w-[200px] md:max-w-sm lg:max-w-md text-right'>
      <h1 className="text-white text-wrap text-sm md:text-sm lg:text-xl font-bold  md:mb-3 lg:mb-4">
        {name}
      </h1>
      <p className='text-white text-xs md:text-xs leading-relaxed hidden md:block'>
        {description}
      </p>
    </div>
  )
}