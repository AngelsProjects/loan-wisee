'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { LoanFormValues } from '@/schemas/loanSchema'
import { toast } from 'sonner'

import LoanFormv2 from '@/components/forms/LoanFormv2'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { useLoan } from '@/hooks/useLoans'

export default function CreateLoanPage() {
  const router = useRouter()
  const { addLoan, loanTags, addLoanTag, getLoanTags } = useLoan()

  const handleSubmit = async (data: LoanFormValues) => {
    try {
      const result = await addLoan(data)
      if (result) {
        toast.success('Loan created successfully!')
        router.push('/loans')
      } else {
        toast.error('Failed to create loan.')
      }
    } catch (error) {
      toast.error('An error occurred while creating the loan.')
      console.error('Error creating loan:', error)
    }
  }

  const handleCancel = () => {
    router.push('/loans')
  }

  useEffect(() => {
    getLoanTags()
  }, [getLoanTags])

  return (
    <div className='container mx-auto p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Create New Loan</CardTitle>
          <CardDescription>Create a new lender profile in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <LoanFormv2 onSubmit={handleSubmit} loanTags={loanTags} addLoanTag={addLoanTag} />
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
