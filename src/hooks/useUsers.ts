import { UserCreateInput, UserUpdateInput } from '@/schemas/userSchema'
import { User } from '@prisma/client'
import { toast } from 'sonner'
import useSWR from 'swr'

const API_URL = '/api/users'

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch lenders')
  }
  return response.json()
}

const useUsers = (
  id?: string
): {
  users: User[] | undefined
  user: User | undefined
  isLoading: boolean
  error: Error
  createUser: (userData: UserCreateInput) => Promise<User | null>
  updateUser: (id: string, userData: UserUpdateInput) => Promise<User | null>
  deleteUser: (id: string) => Promise<boolean>
  mutate: (data?: User[]) => void
} => {
  const url = id ? `${API_URL}/${id}` : API_URL

  // Fetch all users
  const { data, error, mutate, isLoading } = useSWR(url, fetcher)

  // Create a new user
  const createUser = async (userData: UserCreateInput): Promise<User | null> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create user')
      }

      const newUser = await response.json()
      mutate([...(data || []), newUser])
      toast.success('User created successfully')
      return newUser
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error creating user:', error)
      toast.error(error.message || 'Failed to create user')
      return null
    }
  }

  // Update an existing user
  const updateUser = async (id: string, userData: UserUpdateInput): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to update user')
      }

      const updatedUser = await response.json()
      toast.success('User updated successfully')
      return updatedUser
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error updating user:', error)
      toast.error(error.message || 'Failed to update user')
      return null
    }
  }

  // Delete a user
  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to delete user')
      }

      toast.success('User deleted successfully')
      return true
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error deleting user:', error)
      toast.error(error.message || 'Failed to delete user')
      return false
    }
  }

  return {
    users: id ? undefined : data,
    user: id ? data : undefined,
    isLoading,
    error,
    createUser,
    updateUser,
    deleteUser,
    mutate
  }
}

export default useUsers
