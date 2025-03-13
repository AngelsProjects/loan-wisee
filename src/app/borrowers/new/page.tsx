'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { BorrowerFormValues } from '@/schemas/borrowerSchema'
import { toast } from 'sonner'

import BorrowerForm from '@/components/forms/BorrowerForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import UserSelect from '@/components/users/UserSelect'

export default function NewBorrowerPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')

  const handleSubmit = async (data: BorrowerFormValues) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/borrowers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create borrower profile')
      }

      const result = await response.json()
      toast.success('Borrower profile created successfully')
      router.push(`/borrowers/${result.id}`)
    } catch (error) {
      console.error('Error creating borrower profile:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create borrower profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId)
  }

  return (
    <div className='container mx-auto py-8'>
      <Card>
        <CardHeader>
          <CardTitle>Create Borrower Profile</CardTitle>
          <CardDescription>
            Create a new borrower profile with their personal and financial information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-6'>
            <h3 className='mb-2 text-lg font-medium'>Select User</h3>
            <p className='text-muted-foreground mb-4 text-sm'>
              First, select the user to associate with this lender profile
            </p>
            <UserSelect onUserSelect={handleUserSelect} />
          </div>
          <BorrowerForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel='Create Profile'
            borrower={{ userId: selectedUserId }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
