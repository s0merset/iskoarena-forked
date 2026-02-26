'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { ThemeToggleButton } from './ui/ThemeToggleButton'

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Solution', href: '#solution' },
    { name: 'FAQ', href: '#pricing' },
    { name: 'Team', href: '#about' },
]

interface HeroHeaderProps {
    onLoginClick: () => void;
    onSignupClick: () => void;
}

export const HeroHeader = ({ onLoginClick, onSignupClick }: HeroHeaderProps) => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Helper to trigger action and close mobile menu
    const handleAuthAction = (action: () => void) => {
        action();
        setMenuState(false);
    }

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-50 w-full px-2">
                <div className={cn(
                    'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', 
                    isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5'
                )}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-foreground">
                                <Menu className={cn("m-auto size-6 duration-200", menuState && "rotate-180 scale-0 opacity-0")} />
                                <X className={cn("absolute inset-0 m-auto size-6 duration-200", !menuState ? "-rotate-180 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")} />
                            </button>
                        </div>

                        {/* Desktop Menu */}
                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm font-medium">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Side Actions */}
                        <div className={cn(
                            "bg-background lg:bg-transparent hidden w-full lg:flex lg:w-fit items-center justify-end gap-6",
                            menuState && "block absolute top-full left-0 mt-2 p-6 rounded-3xl border shadow-2xl"
                        )}>
                            <div className="lg:hidden mb-6">
                                <ul className="space-y-6 text-base font-medium">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit items-center">
                                {/* Login Button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleAuthAction(onLoginClick)}
                                    className={cn("w-full sm:w-auto", isScrolled && 'lg:hidden')}>
                                    <span>Login</span>
                                </Button>

                                {/* Sign Up Button */}
                                <Button
                                    size="sm"
                                    onClick={() => handleAuthAction(onSignupClick)}
                                    className={cn("w-full sm:w-auto", isScrolled && 'lg:hidden')}>
                                    <span>Sign Up</span>
                                </Button>

                                {/* Scrolled State Primary Button */}
                                <Button
                                    size="sm"
                                    onClick={() => handleAuthAction(onSignupClick)}
                                    className={cn(
                                        "w-full sm:w-auto",
                                        isScrolled ? 'lg:inline-flex' : 'hidden'
                                    )}>
                                    <span>Get Started</span>
                                </Button>

                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
