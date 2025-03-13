'use client'

import Link from 'next/link'

import { Loan, LoanStatus } from '@prisma/client'
import { format } from 'date-fns'
import { Activity, ArrowRight, Calendar, DollarSign } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { formatCurrency } from '@/utils/formatters'

interface LoanCardProps {
  loan: Loan & { borrower: { name: string } }
}

export function LoanCard({ loan }: LoanCardProps) {
  // Function to determine the status badge color
  const getStatusColor = (status: LoanStatus) => {
    switch (status) {
      case LoanStatus.ACTIVE:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case LoanStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case LoanStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case LoanStatus.DEFAULTED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case LoanStatus.CANCELLED:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      case LoanStatus.APPROVED:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case LoanStatus.REJECTED:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'

      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  return (
    <Card className='flex h-full flex-col transition-all hover:shadow-md'>
      <CardHeader className='flex flex-row items-start justify-between pb-2'>
        <div>
          <CardTitle className='text-xl font-bold'>{loan.title}</CardTitle>
          <p className='text-muted-foreground text-sm'>{loan.borrower?.name || 'Unknown Borrower'}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
            loan.status
          )}`}
        >
          {loan.status}
        </span>
      </CardHeader>
      <CardContent className='flex-grow py-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='flex items-center space-x-2'>
            <DollarSign className='text-muted-foreground h-4 w-4' />
            <div>
              <p className='text-sm font-medium'>{formatCurrency(loan.amount)}</p>
              <p className='text-muted-foreground text-xs'>Amount</p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <Activity className='text-muted-foreground h-4 w-4' />
            <div>
              <p className='text-sm font-medium'>{loan.interestRate}%</p>
              <p className='text-muted-foreground text-xs'>Interest Rate</p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <Calendar className='text-muted-foreground h-4 w-4' />
            <div>
              <p className='text-sm font-medium'>{format(new Date(loan.startDate), 'MMM d, yyyy')}</p>
              <p className='text-muted-foreground text-xs'>Start Date</p>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            <Calendar className='text-muted-foreground h-4 w-4' />
            <div>
              <p className='text-sm font-medium'>{format(new Date(loan.endDate), 'MMM d, yyyy')}</p>
              <p className='text-muted-foreground text-xs'>End Date</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant='ghost' className='w-full'>
          <Link href={`/loans/${loan.id}`}>
            View Details <ArrowRight className='ml-2 h-4 w-4' />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
