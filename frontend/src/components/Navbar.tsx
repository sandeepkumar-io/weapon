"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { categories } from '@/lib/weapons'

type Props = {}
function Navbar({ }: Props) {
    const [togglemenu, setTogglemenu] = React.useState(false)
    const pathname = usePathname()
    return (
        <nav className='fixed top-0 right-0 left-0 z-50 border-border border-b bg-white/95 backdrop-blur-md'>
            <div className='container mx-auto px-4'>
                <div className='flex items-center justify-between h-16'>
                    <Link href={"/"} className='flex items-center gap-2'>
                        <div className='w-8 h-8 bg-primary rounded-sm flex items-center justify-center'>
                            <span className='text-white font-display font-bold text-sm'>A</span>
                        </div>
                        <span className='font-display text-xl tracking-wider text-foreground'>ARSENAL<span className='text-primary'>X</span>
                        </span>
                    </Link>

                    <div className='hidden md:flex items-center gap-1 flex-wrap'>
                        <Link href={"/"} className={`px-2 py-2 text-xs lg:text-sm font-body font-semibold tracking-wider uppercase whitespace-nowrap ${pathname === "/"
                            ? 'text-primary'
                            : 'text-foreground'
                            }`}>
                            Home
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat.id} href={`/category/${cat.id}`} className={`px-2 py-2 text-xs lg:text-sm font-body font-semibold tracking-wider uppercase whitespace-nowrap ${pathname === `/category/${cat.id}`
                                ? 'text-primary'
                                : 'text-foreground'
                                }`}>
                                {cat.name}
                            </Link>
                        ))}

                    </div>
                    <button
                    className="md:hidden text-foreground p-2"
                    onClick={() => setTogglemenu(!togglemenu)}
                    aria-label="Toggle navigation"
                >
                    <div className='space-y-1.5'>
                        <div className={`w-6 h-0.5 bg-foreground ${togglemenu ? 'rotate-45 translate-y-2' : ''}`}/>
                        <div className={`w-6 h-0.5 bg-foreground ${togglemenu ? 'opacity-0' : ''}`}></div>
                        <div className={`w-6 h-0.5 bg-foreground ${togglemenu ? '-rotate-45 -translate-y-2' : ''}`}/>
                    </div>
                </button>
                </div >
                {togglemenu && (
                    <div className='md:hidden absolute top-16 left-0 right-0 bg-white border-t border-border shadow-sm'>
                        <Link href={"/"} className={`block px-4 py-3 text-sm font-body font-semibold tracking-wider uppercase ${pathname === "/"
                            ? 'text-primary'
                            : 'text-foreground'
                            }`}>
                            Home
                        </Link>
                        {categories.map((cat) => (
                            <Link key={cat.id} href={`/category/${cat.id}`} className={`block px-4 py-3 text-sm font-body font-semibold tracking-wider uppercase ${pathname === `/category/${cat.id}`
                                ? 'text-primary'
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
