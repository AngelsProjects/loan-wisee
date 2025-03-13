'use client'

import { UserCreateInput, userCreateSchema } from '@/schemas/userSchema'
import { User } from '@prisma/client'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import DynamicForm from '../shared/DynamicForm'

interface UserFormProps {
  user?: Partial<User>
  onSubmit: (data: UserCreateInput) => void
  isSubmitting?: boolean
  submitLabel?: string
  isPasswordRequired?: boolean
}

export default function UserForm({
  user,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Submit',
  isPasswordRequired = false
}: UserFormProps) {
  const defaultValues: UserCreateInput = {
    name: '',
    email: '',
    password: '',
    image: '',
    role: 'USER'
  }

  // Modify schema if password is required
  const formSchema = isPasswordRequired
    ? userCreateSchema.refine(data => !!data.password, {
        message: 'Password is required',
        path: ['password']
      })
    : userCreateSchema

  return (
    <DynamicForm
      schema={formSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      initialData={user as UserCreateInput}
      isSubmitting={isSubmitting}
      submitLabel={submitLabel}
    >
      {form => (
        <>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='John Doe' {...field} value={field.value || ''} />
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
                    <Input placeholder='john.doe@example.com' {...field} />
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
                  <FormLabel>{isPasswordRequired ? 'Password (Required)' : 'Password (Optional)'}</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='••••••••' {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>
                    {user?.id ? 'Leave blank to keep current password' : 'Min 8 characters'}
                  </FormDescription>
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
                        <SelectValue placeholder='Select role' />
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
                  <FormLabel>Profile Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='https://example.com/image.jpg' {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
    </DynamicForm>
  )
}
