'use client'

import { use, useEffect, useState } from 'react'

import Link from 'next/link'

import { format } from 'date-fns'
import { Calendar, ChevronLeft, Clock, DollarSign, Edit, FileText, Percent, Tag, Trash2, User } from 'lucide-react'

import DeleteLoanDialog from '@/components/loans/DeleteLoanDialog'
import LoanStatusBadge from '@/components/loans/LoanStatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useLoan } from '@/hooks/useLoans'

export default function LoanDetailsPage(props: { params: Promise<{ loanId: string }> }) {
  const { loanId } = use(props.params)
  const { getLoanById, currentLoan, isLoading, calculateRemainingBalance } = useLoan()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (loanId) {
      getLoanById(loanId)
    }
  }, [loanId, getLoanById])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className='container mx-auto flex items-center justify-center py-10'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900' />
      </div>
    )
  }

  if (!currentLoan) {
    return (
      <div className='container mx-auto py-10'>
        <div className='flex flex-col items-center justify-center p-8 text-center'>
          <h2 className='mb-4 text-2xl font-bold'>Loan not found</h2>
          <p className='text-muted-foreground mb-6'>The loan you are looking for does not exist or has been deleted.</p>
          <Link href='/loans'>
            <Button>Back to Loans</Button>
          </Link>
        </div>
      </div>
    )
  }

  const remainingBalance = calculateRemainingBalance(currentLoan)

  return (
    <div className='container mx-auto space-y-6 py-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <Link href='/loans'>
            <Button variant='outline' size='icon'>
              <ChevronLeft className='h-4 w-4' />
            </Button>
          </Link>
          <h1 className='text-3xl font-bold'>{currentLoan.title}</h1>
          <LoanStatusBadge status={currentLoan.status} />
        </div>
        <div className='flex gap-2'>
          <Link href={`/loans/${loanId}/edit`}>
            <Button variant='outline'>
              <Edit className='mr-2 h-4 w-4' />
              Edit
            </Button>
          </Link>
          <Button variant='destructive' onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <Card>
          <CardHeader>
            <CardTitle>Loan Summary</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-start gap-3'>
              <DollarSign className='text-muted-foreground mt-0.5 h-5 w-5' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Amount</p>
                <p className='text-xl font-bold'>{formatCurrency(currentLoan.amount)}</p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <Percent className='text-muted-foreground mt-0.5 h-5 w-5' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Interest Rate</p>
                <p className='text-xl font-bold'>{currentLoan.interestRate}%</p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <Clock className='text-muted-foreground mt-0.5 h-5 w-5' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Term</p>
                <p className='text-xl font-bold'>
                  {currentLoan.term} {currentLoan.termUnit.toLowerCase()}
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <User className='text-muted-foreground mt-0.5 h-5 w-5' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Borrower</p>
                <p className='text-xl font-bold'>{currentLoan.borrower?.user?.name || 'Unknown'}</p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <User className='text-muted-foreground mt-0.5 h-5 w-5' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Lender</p>
                <p className='text-xl font-bold'>{currentLoan.lender?.user?.name || 'Unknown'}</p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <Calendar className='text-muted-foreground mt-0.5 h-5 w-5' />
              <div className='space-y-1'>
                <p className='text-sm font-medium'>Timeline</p>
                <div>
                  <p className='text-sm'>Start: {format(new Date(currentLoan.startDate), 'PPP')}</p>
                  <p className='text-sm'>End: {format(new Date(currentLoan.endDate), 'PPP')}</p>
                </div>
              </div>
            </div>

            {currentLoan.loanTags && currentLoan.loanTags.length > 0 && (
              <div className='flex items-start gap-3'>
                <Tag className='text-muted-foreground mt-0.5 h-5 w-5' />
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>Tags</p>
                  <div className='flex flex-wrap gap-2'>
                    {currentLoan.loanTags.map(tag => (
                      <div
                        key={tag.id}
                        className='rounded-md px-2 py-1 text-xs font-medium'
                        style={{ backgroundColor: tag.color || '#e5e7eb', color: '#1f2937' }}
                      >
                        {tag.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='md:col-span-2'>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <div className='bg-primary/10 rounded-lg p-4'>
                <p className='text-muted-foreground text-sm font-medium'>Total Amount</p>
                <p className='text-2xl font-bold'>
                  {formatCurrency(currentLoan.amount + (currentLoan.totalInterestAmount || 0))}
                </p>
              </div>
              <div className='bg-primary/10 rounded-lg p-4'>
                <p className='text-muted-foreground text-sm font-medium'>Paid</p>
                <p className='text-2xl font-bold text-green-600'>{formatCurrency(currentLoan.totalAmountPaid || 0)}</p>
              </div>
              <div className='bg-primary/10 rounded-lg p-4'>
                <p className='text-muted-foreground text-sm font-medium'>Remaining</p>
                <p className='text-2xl font-bold text-red-600'>{formatCurrency(remainingBalance || 0)}</p>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='bg-muted rounded-lg p-4'>
                <p className='text-muted-foreground text-sm font-medium'>Next Payment Due</p>
                <p className='text-xl font-bold'>
                  {currentLoan.nextPaymentDueDate ? format(new Date(currentLoan.nextPaymentDueDate), 'PPP') : 'N/A'}
                </p>
              </div>
              <div className='bg-muted rounded-lg p-4'>
                <p className='text-muted-foreground text-sm font-medium'>Last Payment Date</p>
                <p className='text-xl font-bold'>
                  {currentLoan.lastPaymentDate ? format(new Date(currentLoan.lastPaymentDate), 'PPP') : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue='details' className='w-full'>
        <TabsList>
          <TabsTrigger value='details'>Details</TabsTrigger>
          <TabsTrigger value='documents'>Documents</TabsTrigger>
          <TabsTrigger value='repayments'>Repayment Schedule</TabsTrigger>
          <TabsTrigger value='notes'>Notes</TabsTrigger>
        </TabsList>

        <TabsContent value='details'>
          <Card>
            <CardHeader>
              <CardTitle>Loan Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-start gap-3'>
                  <FileText className='text-muted-foreground mt-0.5 h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm font-medium'>Description</p>
                    <p className='text-sm'>{currentLoan.description || 'No description provided'}</p>
                  </div>
                </div>

                <div className='flex items-start gap-3'>
                  <Tag className='text-muted-foreground mt-0.5 h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm font-medium'>Purpose</p>
                    <p className='text-sm'>{currentLoan.purpose || 'No purpose specified'}</p>
                  </div>
                </div>

                {currentLoan.collateral && (
                  <div className='flex items-start gap-3'>
                    <FileText className='text-muted-foreground mt-0.5 h-5 w-5' />
                    <div className='space-y-1'>
                      <p className='text-sm font-medium'>Collateral</p>
                      <p className='text-sm'>{currentLoan.collateral}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='documents'>
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Files and documents related to this loan</CardDescription>
            </CardHeader>
            <CardContent>
              {currentLoan.documents && currentLoan.documents.length > 0 ? (
                <div className='space-y-4'>
                  {currentLoan.documents.map(document => (
                    <div key={document.id} className='flex items-center justify-between rounded-lg border p-4'>
                      <div className='flex items-center gap-3'>
                        <FileText className='h-5 w-5' />
                        <div>
                          <p className='font-medium'>{document.name}</p>
                          <p className='text-muted-foreground text-sm'>{document.description}</p>
                        </div>
                      </div>
                      <Button variant='outline' asChild>
                        <a href={document.fileUrl} target='_blank' rel='noopener noreferrer'>
                          View
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-muted-foreground'>No documents uploaded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='repayments'>
          <Card>
            <CardHeader>
              <CardTitle>Repayment Schedule</CardTitle>
              <CardDescription>Upcoming and past payments</CardDescription>
            </CardHeader>
            <CardContent>
              {currentLoan.repaymentSchedule && currentLoan.repaymentSchedule.length > 0 ? (
                <div className='space-y-4'>
                  {currentLoan.repaymentSchedule.map(repayment => (
                    <div key={repayment.id} className='flex items-center justify-between rounded-lg border p-4'>
                      <div>
                        <p className='font-medium'>{format(new Date(repayment.dueDate), 'PPP')}</p>
                        <p className='text-muted-foreground text-sm'>
                          {formatCurrency(repayment.amount)} - {repayment.status}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-medium'>{formatCurrency(repayment.paidAmount || 0)} paid</p>
                        {repayment.paidDate && (
                          <p className='text-muted-foreground text-sm'>{format(new Date(repayment.paidDate), 'PPP')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-muted-foreground'>No repayment schedule available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value='notes'>
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Additional information and comments</CardDescription>
            </CardHeader>
            <CardContent>
              {currentLoan.notes && currentLoan.notes.length > 0 ? (
                <div className='space-y-4'>
                  <div className='rounded-lg border p-4'>
                    <p className='text-sm'>{currentLoan.notes}</p>
                  </div>
                </div>
              ) : (
                <p className='text-muted-foreground'>No notes available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DeleteLoanDialog loanId={currentLoan.id} isOpen={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} />
    </div>
  )
}
