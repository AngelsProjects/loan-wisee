'use client'

import { use, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { UserUpdateInput, userUpdateSchema } from '@/schemas/userSchema'
import { Role } from '@prisma/client'
import { Loader2 } from 'lucide-react'

import DynamicForm from '@/components/shared/DynamicForm'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import useUsers from '@/hooks/useUsers'

// Default values structure similar to create page, but we'll populate from API
const defaultValues: UserUpdateInput = {
  name: '',
  email: '',
  role: Role.USER,
  image: ''
}

export default function EditUserPage(props: { params: Promise<{ userId: string }> }) {
  const params = use(props.params)
  const router = useRouter()
  const { user, updateUser, isLoading: isSubmitting } = useUsers(params.userId)
  const [userData, setUserData] = useState<UserUpdateInput>(defaultValues)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user data on component mount
  useEffect(() => {
    if (!params.userId) return

    try {
      setIsLoading(true)

      if (!user) {
        setError('User not found')
        return
      }

      setUserData({
        name: user.name || '',
        email: user.email,
        role: user.role,
        image: user.image || '',
        password: user.password || ''
      })
    } catch (err) {
      console.error('Error fetching user:', err)
      setError('Failed to load user data')
    } finally {
      setIsLoading(false)
    }
  }, [params.userId, user])

  const handleUpdateUser = async (data: UserUpdateInput) => {
    const result = await updateUser(params.userId, data)
    if (result) {
      router.push('/users')
    }
  }

  if (isLoading) {
    return (
      <div className='container mx-auto flex min-h-[400px] items-center justify-center py-6'>
        <Loader2 className='text-primary h-8 w-8 animate-spin' />
      </div>
    )
  }

  if (error) {
    return (
      <div className='container mx-auto py-6'>
        <div className='bg-destructive/10 mx-auto max-w-2xl rounded-lg p-6 text-center'>
          <h2 className='mb-2 text-xl font-semibold'>Error</h2>
          <p className='text-muted-foreground'>{error}</p>
          <Button className='mt-4' variant='outline' onClick={() => router.push('/users')}>
            Return to Users
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Edit User</h1>
        <p className='text-muted-foreground mt-2'>Update user account details</p>
      </div>

      <div className='bg-card max-w-2xl rounded-lg border p-6'>
        <DynamicForm
          schema={userUpdateSchema}
          defaultValues={userData}
          onSubmit={handleUpdateUser}
          isSubmitting={isSubmitting}
          submitLabel='Update User'
        >
          {form => (
            <>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter user's name" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='user@example.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='role'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a role' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={Role.USER}>User</SelectItem>
                        <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                        <SelectItem value={Role.LENDER}>Lender</SelectItem>
                        <SelectItem value={Role.BORROWER}>Borrower</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='image'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder='https://example.com/image.jpg' {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password field as optional */}
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password (leave blank to keep current)</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='Enter new password' {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </DynamicForm>
      </div>
    </div>
  )
}
