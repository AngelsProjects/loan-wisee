'use client'

import { use, useEffect, useState } from 'react'

import { notFound, useRouter } from 'next/navigation'

import { BorrowerFormValues } from '@/schemas/borrowerSchema'
import { toast } from 'sonner'

import BorrowerForm from '@/components/forms/BorrowerForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function BorrowerPage(props: { params: Promise<{ borrowerId: string }> }) {
  const { borrowerId } = use(props.params)
  const router = useRouter()
  const [borrower, setBorrower] = useState<BorrowerFormValues | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchBorrower = async () => {
      try {
        const response = await fetch(`/api/borrowers/${borrowerId}`)

        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error('Failed to fetch borrower profile')
        }

        const data = await response.json()
        // Convert date strings to Date objects for the form
        const processedData = {
          ...data,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          employmentStartDate: data.employmentStartDate ? new Date(data.employmentStartDate) : null,
          employmentEndDate: data.employmentEndDate ? new Date(data.employmentEndDate) : null
        }

        setBorrower(processedData)
      } catch (error) {
        console.error('Error fetching borrower:', error)
        toast.error('Failed to load borrower profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBorrower()
  }, [borrowerId])

  const handleSubmit = async (data: BorrowerFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/borrowers/${borrowerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update borrower profile')
      }

      toast.success('Borrower profile updated successfully')
      // Refresh the data
      router.refresh()
    } catch (error) {
      console.error('Error updating borrower profile:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update borrower profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className='container mx-auto py-8'>
        <Card>
          <CardHeader>
            <Skeleton className='h-8 w-1/3' />
            <Skeleton className='mt-2 h-4 w-2/3' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className='h-12 w-full' />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='container mx-auto py-8'>
      <Card>
        <CardHeader>
          <CardTitle>Edit Borrower Profile</CardTitle>
          <CardDescription>Update the borrower&apos;s personal and financial information.</CardDescription>
        </CardHeader>
        <CardContent>
          {borrower && (
            <BorrowerForm
              borrower={borrower}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              submitLabel='Update Profile'
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
