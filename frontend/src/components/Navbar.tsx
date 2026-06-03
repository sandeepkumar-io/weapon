"use client"
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { categories } from '@/lib/weapons'

type Props = {}
function Navbar({ }: Props) {
    const [togglemenu, setTogglemenu] = React.useState(false)
    const pathname = usePathname()
    return (
        <nav className=' fixed top-0 right-0 left-0 z-50 border-border border-b bg-black/80  backdrop-blur-md'>
            <div className='container mx-auto px-4'>
                <div className='flex items-center justify-between h-16'>
                    <Link href={"/"} className='flex items-center gap-2'>
                        <div className='w-8 h-8 bg-yellow-300 rounded-sm flex items-center justify-center'>
                            <span className='text-primary-forground font-display font-bold text-sm'>A</span>
                        </div>
                        <span className='font-display text-xl tracking-wider text-foreground'>ARSENAL<span className='text-primary text-amber-300'>X</span>
                        </span>
                    </Link>

                    <div className='hidden md:flex items-center gap-1 flex-wrap'>
                        <Link href={"/"} className={`px-2 py-2 text-xs lg:text-sm font-body font-semibold tracking-wider uppercase transition-colors whitespace-nowrap ${pathname === "/"
                            ? 'text-yellow-300'
                            : 'text-foreground'
                            }`}>
                            Home
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat.id} href={`/category/${cat.id}.href`} className={`px-2 py-2 text-xs lg:text-sm font-body font-semibold tracking-wider uppercase transition-colors whitespace-nowrap ${pathname === `/category/${cat.id}`
                                ? 'text-yellow-300'
                                : 'text-foreground'
                                }`}>
                                {cat.name}
                            </Link>
                        ))}

                    </div>
                    <button
                    className="md:hidden text-foreground p-2"
                    onClick={() => setTogglemenu(!togglemenu)}
                >
                    <div className='space-y-1.5'>
                        <div className={`w-6 h-0.5 bg-foreground transition-transform ${togglemenu ? 'rotate-45 translate-y-2' : ''}`}/>
                        <div className={`w-6 h-0.5 bg-foreground transition-opacity ${togglemenu ? 'opacity-0' : ''}`}></div>
                        <div className={`w-6 h-0.5 bg-foreground transition-transform ${togglemenu ? '-rotate-45 -translate-y-2' : ''}`}/>
                    </div>
                </button>
                </div >
                {togglemenu && (
                    <div className='md:hidden absolute top-16 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-border'>
                        <Link href={"/"} className={`block px-4 py-3 text-sm font-body font-semibold tracking-wider uppercase transition-colors ${pathname === "/"
                            ? 'text-yellow-300'
                            : 'text-foreground'
                            }`}>
                            Home
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat.id} href={`/category/${cat.id}`} className={`block px-4 py-3 text-sm font-body font-semibold tracking-wider uppercase transition-colors ${pathname === `/category/${cat.id}`
                                ? 'text-yellow-300'
                                : 'text-foreground'
                                }`}>
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar
