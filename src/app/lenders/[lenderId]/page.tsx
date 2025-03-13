'use client'

import { use } from 'react'

import { useRouter } from 'next/navigation'

import { BusinessType } from '@prisma/client'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { useLenders } from '@/hooks/useLenders'

import { formatDate } from '@/utils/formatters'

export default function LenderDetailsPage(props: { params: Promise<{ lenderId: string }> }) {
  const params = use(props.params)
  const router = useRouter()
  const { lender, isLoading, error } = useLenders(params.lenderId)

  const businessTypeLabels: Record<BusinessType, string> = {
    INDIVIDUAL: 'Individual',
    SOLE_PROPRIETORSHIP: 'Sole Proprietorship',
    PARTNERSHIP: 'Partnership',
    LLC: 'LLC',
    CORPORATION: 'Corporation',
    NONPROFIT: 'Nonprofit',
    OTHER: 'Other'
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/lenders/${params.lenderId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete lender')
      }

      toast.success('Lender deleted successfully')
      router.push('/lenders')
    } catch (error) {
      toast.error('Error deleting lender')
      console.error(error)
    }
  }

  if (error) {
    return (
      <div className='container mx-auto p-4'>
        <Button variant='ghost' onClick={() => router.back()} className='mb-4'>
          <ArrowLeft className='mr-2 h-4 w-4' /> Back
        </Button>
        <p className='text-red-500'>Error loading lender: {error.message}</p>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-4'>
      <Button variant='ghost' onClick={() => router.back()} className='mb-4'>
        <ArrowLeft className='mr-2 h-4 w-4' /> Back
      </Button>

      <Card>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div>
              <CardTitle>
                {isLoading ? (
                  <Skeleton className='h-8 w-48' />
                ) : (
                  lender?.companyName || lender?.user?.name || 'Unnamed Lender'
                )}
              </CardTitle>
              <CardDescription>
                {isLoading ? <Skeleton className='mt-2 h-4 w-32' /> : lender?.user?.email}
              </CardDescription>
            </div>
            {!isLoading && lender && (
              <Badge variant={lender.isVerified ? 'default' : 'outline'}>
                {lender.isVerified ? 'Verified' : 'Unverified'}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className='space-y-4'>
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className='h-6 w-full' />
              ))}
            </div>
          ) : (
            lender && (
              <div className='grid gap-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <h3 className='text-muted-foreground text-sm font-medium'>Business Type</h3>
                    <p>{lender.businessType ? businessTypeLabels[lender.businessType] : 'N/A'}</p>
                  </div>

                  <div>
                    <h3 className='text-muted-foreground text-sm font-medium'>Phone Number</h3>
                    <p>{lender.phoneNumber || 'Not provided'}</p>
                  </div>

                  <div>
                    <h3 className='text-muted-foreground text-sm font-medium'>Registration Number</h3>
                    <p>{lender.registrationNumber || 'Not provided'}</p>
                  </div>

                  <div>
                    <h3 className='text-muted-foreground text-sm font-medium'>Tax ID Number</h3>
                    <p>{lender.taxIdentificationNum || 'Not provided'}</p>
                  </div>

                  <div>
                    <h3 className='text-muted-foreground text-sm font-medium'>Website</h3>
                    <p>
                      {lender.websiteUrl ? (
                        <a
                          href={lender.websiteUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 hover:underline'
                        >
                          {lender.websiteUrl}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </p>
                  </div>

                  <div>
                    <h3 className='text-muted-foreground text-sm font-medium'>Member Since</h3>
                    <p>{formatDate(new Date(lender.createdAt))}</p>
                  </div>
                </div>

                <div className='mt-4'>
                  <h3 className='text-muted-foreground text-sm font-medium'>Primary Address</h3>
                  <p className='whitespace-pre-wrap'>{lender.primaryAddress || 'Not provided'}</p>
                </div>

                {lender.lendingPreferences && (
                  <div className='mt-4'>
                    <h3 className='text-muted-foreground text-sm font-medium'>Lending Preferences</h3>
                    <pre className='bg-muted mt-1 overflow-auto rounded-md p-4 text-sm'>
                      {JSON.stringify(lender.lendingPreferences, null, 2)}
                    </pre>
                  </div>
                )}

                {lender.isVerified && lender.verificationDate && (
                  <div className='mt-4'>
                    <h3 className='text-muted-foreground text-sm font-medium'>Verified On</h3>
                    <p>{formatDate(new Date(lender.verificationDate))}</p>
                  </div>
                )}
              </div>
            )
          )}
        </CardContent>

        <CardFooter className='flex justify-between'>
          <Button
            variant='outline'
            onClick={() => router.push(`/lenders/${params.lenderId}/edit`)}
            disabled={isLoading}
          >
            <Edit className='mr-2 h-4 w-4' /> Edit
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive' disabled={isLoading}>
                <Trash2 className='mr-2 h-4 w-4' /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete this lender profile and remove their data
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  )
}
