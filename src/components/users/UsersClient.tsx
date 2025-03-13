'use client'

import { useState } from 'react'

import Link from 'next/link'

import { PlusCircle, Search } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

import useUsers from '@/hooks/useUsers'

import { UsersTable } from './UsersTable'

export function UsersClient() {
  const { users, isLoading, error, mutate } = useUsers()
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearchTerm(value)
  }, 300)

  // Filter users based on search term
  const filteredUsers = users?.filter(
    user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='relative w-full max-w-sm'>
          <Search className='text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4' />
          <Input placeholder='Search users...' className='pl-8' onChange={e => handleSearch(e.target.value)} />
        </div>
        <Link href='/users/create'>
          <Button>
            <PlusCircle className='mr-2 h-4 w-4' />
            Add User
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className='space-y-3'>
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
          <Skeleton className='h-20 w-full' />
        </div>
      ) : error ? (
        <div className='p-4 text-center'>
          <p className='text-red-500'>Error loading users. Please try again.</p>
          <Button variant='outline' className='mt-2' onClick={() => mutate()}>
            Retry
          </Button>
        </div>
      ) : (
        <UsersTable users={filteredUsers || []} />
      )}
    </div>
  )
}
