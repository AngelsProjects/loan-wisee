'use client'

import { useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { BusinessType } from '@prisma/client'
import { Pencil, Plus, Trash2 } from 'lucide-react'
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
import { Input } from '@/components/ui/input'

import { useLenders } from '@/hooks/useLenders'

import { formatDate } from '@/utils/formatters'

export default function LendersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const { lenders, isLoading, error, mutate } = useLenders()

  const businessTypeLabels: Record<BusinessType, string> = {
    INDIVIDUAL: 'Individual',
    SOLE_PROPRIETORSHIP: 'Sole Proprietorship',
    PARTNERSHIP: 'Partnership',
    LLC: 'LLC',
    CORPORATION: 'Corporation',
    NONPROFIT: 'Nonprofit',
    OTHER: 'Other'
  }

  const filteredLenders = lenders?.filter(lender => {
    const searchLower = searchQuery.toLowerCase()
    return (
      lender.companyName?.toLowerCase().includes(searchLower) ||
      lender.user?.name?.toLowerCase().includes(searchLower) ||
      lender.user?.email.toLowerCase().includes(searchLower) ||
      (lender.businessType && businessTypeLabels[lender.businessType].toLowerCase().includes(searchLower))
    )
  })

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/lenders/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete lender')
      }

      toast.success('Lender deleted successfully')
      mutate() // Refresh the data
    } catch (error) {
      toast.error('Error deleting lender')
      console.error(error)
    }
  }

  if (error) {
    return (
      <div className='container mx-auto p-4'>
        <h1 className='mb-4 text-2xl font-bold'>Lenders</h1>
        <p className='text-red-500'>Error loading lenders: {error.message}</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-4'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Lenders</h1>
        <Button asChild>
          <Link href='/lenders/new'>
            <Plus className='mr-2 h-4 w-4' /> Add Lender
          </Link>
        </Button>
      </div>

      <div className='mb-6'>
        <Input
          placeholder='Search lenders...'
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className='max-w-md'
        />
      </div>

      {isLoading ? (
        <p>Loading lenders...</p>
      ) : (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredLenders?.length === 0 ? (
            <p>No lenders found.</p>
          ) : (
            filteredLenders?.map(lender => (
              <Card key={lender.id} className='h-full'>
                <CardHeader className='pb-2'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <CardTitle>{lender.companyName || lender.user?.name || 'Unnamed Lender'}</CardTitle>
                      <CardDescription>{lender.user?.email}</CardDescription>
                    </div>
                    <Badge variant={lender.isVerified ? 'default' : 'outline'}>
                      {lender.isVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='mb-4 space-y-2'>
                    <p className='text-sm'>
                      <span className='font-medium'>Business Type:</span>{' '}
                      {lender.businessType && businessTypeLabels[lender.businessType]}
                    </p>
                    {lender.phoneNumber && (
                      <p className='text-sm'>
                        <span className='font-medium'>Phone:</span> {lender.phoneNumber}
                      </p>
                    )}
                    {lender.createdAt && (
                      <p className='text-sm'>
                        <span className='font-medium'>Member Since:</span> {formatDate(new Date(lender.createdAt))}
                      </p>
                    )}
                  </div>
                  <div className='flex space-x-2'>
                    <Button variant='outline' size='sm' onClick={() => router.push(`/lenders/${lender.id}`)}>
                      View
                    </Button>
                    <Button variant='outline' size='sm' onClick={() => router.push(`/lenders/${lender.id}/edit`)}>
                      <Pencil className='mr-1 h-4 w-4' /> Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant='destructive' size='sm'>
                          <Trash2 className='mr-1 h-4 w-4' /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this lender profile and remove
                            their data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(lender.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
