'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { UserCreateInput, userCreateSchema } from '@/schemas/userSchema'
import { Role } from '@prisma/client'
import { toast } from 'sonner'

import DynamicForm from '@/components/shared/DynamicForm'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import useUsers from '@/hooks/useUsers'

const defaultValues: UserCreateInput = {
  name: '',
  email: '',
  password: '',
  role: Role.USER,
  image: null
}

export default function CreateUserPage() {
  const router = useRouter()
  const { createUser } = useUsers()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateUser = async (data: UserCreateInput) => {
    setIsSubmitting(true)
    try {
      const result = await createUser(data)
      if (result) {
        router.push('/users')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Failed to create user')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Create New User</h1>
        <p className='text-muted-foreground mt-2'>Fill in the details to create a new user account</p>
      </div>

      <div className='bg-card max-w-2xl rounded-lg border p-6'>
        <DynamicForm
          schema={userCreateSchema}
          defaultValues={defaultValues}
          onSubmit={handleCreateUser}
          isSubmitting={isSubmitting}
          submitLabel='Create User'
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
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type='password'
                        placeholder='Create a secure password'
                        {...field}
                        value={field.value || ''}
                      />
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
                        <SelectItem value='USER'>User</SelectItem>
                        <SelectItem value='ADMIN'>Admin</SelectItem>
                        <SelectItem value='LENDER'>Lender</SelectItem>
                        <SelectItem value='BORROWER'>Borrower</SelectItem>
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
            </>
          )}
        </DynamicForm>
      </div>
    </div>
  )
}
