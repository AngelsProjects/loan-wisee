'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'

import { LenderFormValues } from '@/schemas/lenderSchema'
import { toast } from 'sonner'

import LenderForm from '@/components/forms/LenderForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import UserSelect from '@/components/users/UserSelect'

export default function NewLenderPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState('')

  const handleSubmit = async (data: LenderFormValues) => {
    try {
      setIsSubmitting(true)

      // Include the selected user ID
      const lenderData = {
        ...data,
        userId: selectedUserId || data.userId
      }

      const response = await fetch('/api/lenders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(lenderData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create lender')
      }

      toast.success('Lender created successfully')
      router.push('/lenders')
    } catch (error) {
      console.error('Error creating lender:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create lender')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/lenders')
  }

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId)
  }

  return (
    <div className='container mx-auto p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Create New Lender</CardTitle>
          <CardDescription>Create a new lender profile in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='mb-6'>
            <h3 className='mb-2 text-lg font-medium'>Select User</h3>
            <p className='text-muted-foreground mb-4 text-sm'>
              First, select the user to associate with this lender profile
            </p>
            <UserSelect onUserSelect={handleUserSelect} />
          </div>

          <LenderForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel='Create Lender'
            lender={{ userId: selectedUserId }}
          />

          <div className='mt-6 flex justify-end'>
            <Button variant='outline' onClick={handleCancel} className='mr-2'>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
