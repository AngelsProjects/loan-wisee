'use client'

import { useEffect, useState } from 'react'

import { Borrower, Lender } from '@prisma/client'
import { Check, ChevronsUpDown, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
}

interface UserSelectProps {
  onUserSelect: (userId: string) => void
  initialUserId?: string
  excludeRole?: string
  includeRole?: string
  disabled?: boolean
}

export default function UserSelect({
  onUserSelect,
  initialUserId,
  excludeRole,
  includeRole,
  disabled = false
}: UserSelectProps) {
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        setError(null)

        let url = '/api/users?'
        if (excludeRole) url += `excludeRole=${excludeRole}&`
        if (includeRole) url += `includeRole=${includeRole}&`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }

        const data = await response.json()
        setUsers(data)

        // If initialUserId is provided, set the selected user
        if (initialUserId) {
          const initialUser = data.find((user: User) => user.id === initialUserId)
          if (initialUser) {
            setSelectedUser(initialUser)
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [initialUserId, excludeRole, includeRole])

  const handleSelect = (user: User & { lenderProfile?: Lender; borrowerProfile?: Borrower }) => {
    setSelectedUser(user)
    if (includeRole === 'BORROWER') {
      onUserSelect(user.borrowerProfile?.id || user.id)
    } else if (includeRole === 'LENDER') {
      onUserSelect(user.lenderProfile?.id || user.id)
    } else {
      onUserSelect(user.id)
    }
    setOpen(false)
  }

  // Function to get initials from name
  const getInitials = (name: string | null): string => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div>
      {loading ? (
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-10 w-10 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-40' />
            <Skeleton className='h-4 w-20' />
          </div>
        </div>
      ) : error ? (
        <div className='text-sm text-red-500'>{error}</div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={open}
              className='w-full justify-between'
              disabled={disabled}
            >
              {selectedUser ? (
                <div className='flex items-center'>
                  <Avatar className='mr-2 h-6 w-6'>
                    <AvatarImage src={selectedUser.image || undefined} alt={selectedUser.name || ''} />
                    <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                  </Avatar>
                  <span>{selectedUser.name || selectedUser.email}</span>
                </div>
              ) : (
                <span>Select user...</span>
              )}
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-[300px] p-0'>
            <Command shouldFilter={false}>
              <CommandInput placeholder='Search users...' />
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup className='max-h-[300px] overflow-y-auto'>
                {users && users.length > 0
                  ? users?.map(user => (
                      <CommandItem key={user.id} value={`${user.id}-${user.email}`} onSelect={() => handleSelect(user)}>
                        <div className='flex items-center'>
                          <Avatar className='mr-2 h-6 w-6'>
                            <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          <div className='flex flex-col'>
                            <span>{user.name || 'Unnamed User'}</span>
                            <span className='text-muted-foreground text-xs'>{user.email}</span>
                          </div>
                        </div>
                        <Check
                          className={cn('ml-auto h-4 w-4', selectedUser?.id === user.id ? 'opacity-100' : 'opacity-0')}
                        />
                      </CommandItem>
                    ))
                  : null}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}
