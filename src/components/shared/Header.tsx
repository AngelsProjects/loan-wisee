'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ChevronDown, Menu, X } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'

import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

const Header = () => {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { label: 'Loans', href: '/loans' },
    { label: 'Users', href: '/users' },
    { label: 'Lenders', href: '/lenders' },
    { label: 'Borrowers', href: '/borrowers' }
  ]

  return (
    <header className='bg-background border-b'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center'>
            <Link href='/' className='flex items-center gap-2 text-2xl font-bold'>
              <Image src='/android-chrome-512x512.png' alt='Loan Wise' width={40} height={40} />
              Loan Wise
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden items-center space-x-4 md:flex'>
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className='hidden items-center space-x-4 md:flex'>
            <ThemeToggle />
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='flex items-center gap-2'>
                    {session.user?.name || session.user?.email}
                    <ChevronDown className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href='/profile'>Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href='/auth/login'>
                <Button variant='outline'>Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className='flex md:hidden'>
            <ThemeToggle />
            <Button variant='ghost' onClick={toggleMenu} size='icon'>
              {isMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='py-2 pb-4 md:hidden'>
            <div className='space-y-1'>
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              ))}
              {session ? (
                <>
                  <Link
                    href='/profile'
                    className='text-foreground hover:bg-accent hover:text-accent-foreground block rounded-md px-3 py-2 text-base font-medium'
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      toggleMenu()
                    }}
                    className='text-foreground hover:bg-accent hover:text-accent-foreground block w-full rounded-md px-3 py-2 text-left text-base font-medium'
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href='/auth/login'
                  className='text-foreground hover:bg-accent hover:text-accent-foreground block rounded-md px-3 py-2 text-base font-medium'
                  onClick={toggleMenu}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
