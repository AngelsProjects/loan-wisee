'use client'

import { useState } from 'react'

import Link from 'next/link'

import { format } from 'date-fns'
import { Edit, Eye, Trash2 } from 'lucide-react'

import Pagination from '@/components/shared/Pagination'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

import { Loan } from '@/types/loan'

import DeleteLoanDialog from './DeleteLoanDialog'
import LoanStatusBadge from './LoanStatusBadge'

interface LoansTableProps {
  loans: Loan[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function LoansTable({ loans, isLoading, currentPage, totalPages, onPageChange }: LoansTableProps) {
  const [loanToDelete, setLoanToDelete] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900' />
      </div>
    )
  }

  if (loans.length === 0) {
    return (
      <div className='flex h-64 flex-col items-center justify-center space-y-4'>
        <p className='text-muted-foreground'>No loans found</p>
        <Link href='/loans/create'>
          <Button>Create a Loan</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Borrower</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Interest Rate</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map(loan => (
              <TableRow key={loan.id}>
                <TableCell className='font-medium'>{loan.title}</TableCell>
                <TableCell>{loan.borrower?.user?.name || 'Unknown'}</TableCell>
                <TableCell>{formatCurrency(loan.amount)}</TableCell>
                <TableCell>{loan.interestRate}%</TableCell>
                <TableCell>{format(new Date(loan.startDate), 'PP')}</TableCell>
                <TableCell>{format(new Date(loan.endDate), 'PP')}</TableCell>
                <TableCell>
                  <LoanStatusBadge status={loan.status} />
                </TableCell>
                <TableCell className='text-right'>
                  <div className='flex justify-end gap-2'>
                    <Link href={`/loans/${loan.id}`}>
                      <Button size='icon' variant='ghost'>
                        <Eye className='h-4 w-4' />
                      </Button>
                    </Link>
                    <Link href={`/loans/${loan.id}/edit`}>
                      <Button size='icon' variant='ghost'>
                        <Edit className='h-4 w-4' />
                      </Button>
                    </Link>
                    <Button
                      size='icon'
                      variant='ghost'
                      className='text-destructive'
                      onClick={() => setLoanToDelete(loan.id)}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />

      <DeleteLoanDialog loanId={loanToDelete} isOpen={!!loanToDelete} onClose={() => setLoanToDelete(null)} />
    </div>
  )
}
