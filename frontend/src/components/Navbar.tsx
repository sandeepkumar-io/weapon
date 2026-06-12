"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type Props = {}
function Navbar({ }: Props) {
    const [togglemenu, setTogglemenu] = React.useState(false)
    const pathname = usePathname()
    return (
        <nav className='fixed top-0 right-0 left-0 z-50 border-b bg-background backdrop-blur-md'>
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
                            : 'text-primary'
                            }`}>
                            Home
                        </Link>
                        <Link href={"/fighter-jets"} className={`px-2 py-2 text-xs lg:text-sm font-body font-semibold tracking-wider uppercase whitespace-nowrap ${pathname === "/fighter-jets"
                            ? 'text-primary'
                            : 'text-primary'
                            }`}>
                            Jets
                        </Link>
                        <Link href={"/jet-engines"} className={`px-2 py-2 text-xs lg:text-sm font-body font-semibold tracking-wider uppercase whitespace-nowrap ${pathname === "/jet-engines"
                            ? 'text-primary'
                            : 'text-primary'
                            }`}>
                            Engines
                        </Link>
                        <Link href={"/rifles"} className={`px-2 py-2 text-xs lg:text-sm font-body font-semibold tracking-wider uppercase whitespace-nowrap ${pathname === "/rifles"
                            ? 'text-primary'
                            : 'text-primary'
                            }`}>
                            Rifles
                        </Link>
                        <Link href={"/sniper-rifles"} className={`px-2 py-2 text-xs lg:text-sm font-body font-semibold tracking-wider uppercase whitespace-nowrap ${pathname === "/sniper-rifles"
                            ? 'text-primary'
                            : 'text-primary'
                            }`}>
                            Snipers
                        </Link>
                        <Link href={"/pistol-bullets"} className={`px-2 py-2 text-xs lg:text-sm font-body font-semibold tracking-wider uppercase whitespace-nowrap ${pathname === "/pistol-bullets"
                            ? 'text-primary'
                            : 'text-primary'
                            }`}>
                            Ammo
                        </Link>
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
                    <div className='md:hidden absolute top-16 left-0 right-0 bg-[#0a0505] border-t border-border shadow-lg'>
                        <Link href={"/"} className={`block px-4 py-3 text-sm font-body font-semibold tracking-wider uppercase ${pathname === "/"
                            ? 'text-primary'
                            : 'text-foreground'
                            }`}>
                            Home
                        </Link>
                        <Link href={"/fighter-jets"} className={`block px-4 py-3 text-sm font-body font-semibold tracking-wider uppercase ${pathname === "/fighter-jets"
                            ? 'text-primary'
                            : 'text-foreground'
                            }`}>
                            Fighter Jets
                        </Link>
                        <Link href={"/jet-engines"} className={`block px-4 py-3 text-sm font-body font-semibold tracking-wider uppercase ${pathname === "/jet-engines"
                            ? 'text-primary'
                            : 'text-foreground'
                            }`}>
                            Jet Engines
                        </Link>
                        <Link href={"/rifles"} className={`block px-4 py-3 text-sm font-body font-semibold tracking-wider uppercase ${pathname === "/rifles"
                            ? 'text-primary'
                            : 'text-foreground'
                            }`}>
                            Rifles
                        </Link>
                        <Link href={"/sniper-rifles"} className={`block px-4 py-3 text-sm font-body font-semibold tracking-wider uppercase ${pathname === "/sniper-rifles"
                            ? 'text-primary'
                            : 'text-foreground'
                            }`}>
                            Sniper Rifles
                        </Link>
                        <Link href={"/pistol-bullets"} className={`block px-4 py-3 text-sm font-body font-semibold tracking-wider uppercase ${pathname === "/pistol-bullets"
                            ? 'text-primary'
                            : 'text-foreground'
                            }`}>
                            Pistol Bullets
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar
