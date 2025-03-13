'use client'

import { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ChartBar, FileText, Home, Menu, Settings } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true
    if (path !== '/' && pathname?.startsWith(path)) return true
    return false
  }

  const routes = [
    {
      href: '/',
      label: 'Dashboard',
      icon: Home
    },
    {
      href: '/loans',
      label: 'Loans',
      icon: FileText
    },
    {
      href: '/reports',
      label: 'Reports',
      icon: ChartBar
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings
    }
  ]

  const NavLinks = () => (
    <>
      {routes.map(route => (
        <Link
          key={route.href}
          href={route.href}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-2 rounded-md px-3 py-2 transition-colors ${
            isActive(route.href)
              ? 'bg-primary text-primary-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent'
          }`}
        >
          <route.icon className='h-5 w-5' />
          <span>{route.label}</span>
        </Link>
      ))}
    </>
  )

  return (
    <div>
      {/* Mobile Navigation */}
      <div className='flex items-center justify-between border-b p-4 md:hidden'>
        <Link href='/' className='text-xl font-bold'>
          Loan Manager
        </Link>
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant='outline' size='icon'>
                <Menu className='h-5 w-5' />
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='w-64'>
              <div className='flex flex-col gap-6 py-4'>
                <div className='mb-4 text-xl font-bold'>Loan Manager</div>
                <nav className='flex flex-col gap-1'>
                  <NavLinks />
                </nav>
                {session && (
                  <div className='mt-auto border-t pt-4'>
                    <div className='flex items-center gap-2'>
                      <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-medium'>
                        {session.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-sm font-medium'>{session.user?.name || 'User'}</span>
                        <span className='text-muted-foreground text-xs'>{session.user?.email}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Navigation */}
      <aside className='bg-card hidden h-screen w-64 flex-col border-r md:flex'>
        <div className='p-6'>
          <Link href='/' className='text-2xl font-bold'>
            Loan Wise
          </Link>
        </div>
        <nav className='flex flex-col gap-1 p-3'>
          <NavLinks />
        </nav>
        <div className='mt-auto flex items-center justify-between border-t p-3'>
          <ThemeToggle />
          {session && (
            <div className='flex items-center gap-2'>
              <div className='bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full font-medium'>
                {session.user?.name?.charAt(0) || 'U'}
              </div>
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>{session.user?.name || 'User'}</span>
                <span className='text-muted-foreground max-w-24 truncate text-xs'>{session.user?.email}</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
