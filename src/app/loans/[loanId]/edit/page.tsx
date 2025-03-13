'use client'

import { use, useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { LoanFormValues } from '@/schemas/loanSchema'
import { Loan } from '@prisma/client'
import { toast } from 'sonner'

import LoanFormv2 from '@/components/forms/LoanFormv2'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { useLoan } from '@/hooks/useLoans'

export default function EditLoanPage(props: { params: Promise<{ loanId: string }> }) {
  const { loanId } = use(props.params)
  const router = useRouter()
  const { addLoan, loanTags, addLoanTag, getLoanTags, getLoanById, currentLoan } = useLoan()

  const handleSubmit = async (data: LoanFormValues) => {
    try {
      const result = await addLoan(data)
      if (result) {
        toast.success('Loan edited successfully!')
        router.push('/loans')
      } else {
        toast.error('Failed to edit loan.')
      }
    } catch (error) {
      toast.error('An error occurred while editing the loan.')
      console.error('Error editing loan:', error)
    }
  }

  const handleCancel = () => {
    router.push('/loans')
  }

  useEffect(() => {
    getLoanTags()
    getLoanById(loanId)
  }, [getLoanTags, getLoanById, loanId])

  return (
    <div className='container mx-auto p-4'>
      <Card>
        <CardHeader>
          <CardTitle>Edit Loan</CardTitle>
          <CardDescription>Edit a loan in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <LoanFormv2 onSubmit={handleSubmit} loanTags={loanTags} addLoanTag={addLoanTag} loan={currentLoan as Loan} />
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
