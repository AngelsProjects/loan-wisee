'use client'

import { use, useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { format } from 'date-fns'
import { Edit, Trash, UserCircle } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import useUsers from '@/hooks/useUsers'

interface UserDetails {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  createdAt: string
  emailVerified: Date | null
  borrowerProfile: { id: string } | null
  lenderProfile: { id: string } | null
}

export default function UserDetailPage(props: { params: Promise<{ userId: string }> }) {
  const params = use(props.params)
  const router = useRouter()
  const { user: hookUser, deleteUser, isLoading: loadingFetch } = useUsers(params.userId)
  const [user, setUser] = useState<UserDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    try {
      if (!hookUser && !loadingFetch) {
        toast.error('User not found')
        router.push('/users')
        return
      }
      setUser(hookUser as unknown as UserDetails)
    } catch (error) {
      console.error('Error fetching user:', error)
      toast.error('Failed to load user details')
    } finally {
      setIsLoading(false)
    }
  }, [hookUser, router, loadingFetch])

  const handleDeleteUser = async () => {
    setIsDeleting(true)
    try {
      const success = await deleteUser(params.userId)
      if (success) {
        router.push('/users')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className='container mx-auto py-6'>
        <div className='flex h-64 items-center justify-center'>
          <p>Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className='container mx-auto py-6'>
        <div className='flex h-64 items-center justify-center'>
          <p>User not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>User Details</h1>
        <div className='flex gap-2'>
          <Button asChild variant='outline'>
            <Link href='/users'>Back to Users</Link>
          </Button>
          <Button asChild>
            <Link href={`/users/${user.id}/edit`}>
              <Edit className='mr-2 h-4 w-4' />
              Edit User
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <Trash className='mr-2 h-4 w-4' />
                Delete User
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will soft-delete the user account. The user will no longer be able to log in, but their
                  data will be preserved in the system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                  className='bg-destructive text-destructive-foreground'
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Basic user account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mb-6 flex flex-col items-center'>
              {user.image ? (
                <div className='relative h-24 w-24 overflow-hidden rounded-full'>
                  <Image src={user.image} alt={user.name || 'User'} fill className='object-cover' />
                </div>
              ) : (
                <UserCircle className='text-muted-foreground h-24 w-24' />
              )}
              <h2 className='mt-4 text-xl font-semibold'>{user.name || 'Unnamed User'}</h2>
              <p className='text-muted-foreground'>{user.email}</p>
            </div>

            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Role</span>
                <Badge>{user.role}</Badge>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Account Status</span>
                <Badge variant={user.emailVerified ? 'outline' : 'secondary'}>
                  {user.emailVerified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Created On</span>
                <span>{format(new Date(user.createdAt), 'PPP')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Related Profiles</CardTitle>
            <CardDescription>Associated borrower or lender profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-6'>
              <div>
                <h3 className='mb-2 font-medium'>Borrower Profile</h3>
                {user.borrowerProfile ? (
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/borrowers/${user.borrowerProfile.id}`}>View Borrower Profile</Link>
                  </Button>
                ) : (
                  <p className='text-muted-foreground'>No borrower profile</p>
                )}
              </div>

              <div>
                <h3 className='mb-2 font-medium'>Lender Profile</h3>
                {user.lenderProfile ? (
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/lenders/${user.lenderProfile.id}`}>View Lender Profile</Link>
                  </Button>
                ) : (
                  <p className='text-muted-foreground'>No lender profile</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
