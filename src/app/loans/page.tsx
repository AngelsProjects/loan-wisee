'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'

import { Filter, PlusCircle, RefreshCw } from 'lucide-react'

import LoansFilter from '@/components/loans/LoansFilter'
import LoansTable from '@/components/loans/LoansTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useLoan } from '@/hooks/useLoans'

export default function LoansPage() {
  const {
    loans,
    isLoading,
    totalLoans,
    currentPage,
    totalPages,
    limit,
    getLoans,
    changePage,
    changeLimit,
    resetFilters
  } = useLoan()

  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    getLoans()
  }, [getLoans, currentPage, limit])

  return (
    <div className='container mx-auto space-y-6 py-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Loans</h1>
        <div className='flex gap-2'>
          <Button variant='outline' size='sm' onClick={() => setShowFilters(!showFilters)}>
            <Filter className='mr-2 h-4 w-4' />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => {
              resetFilters()
              getLoans()
            }}
          >
            <RefreshCw className='mr-2 h-4 w-4' />
            Reset
          </Button>
          <Link href='/loans/create'>
            <Button size='sm'>
              <PlusCircle className='mr-2 h-4 w-4' />
              Create Loan
            </Button>
          </Link>
        </div>
      </div>

      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filter Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <LoansFilter onFilter={() => changePage(1)} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>All Loans {totalLoans > 0 && `(${totalLoans})`}</CardTitle>
            <div className='flex items-center gap-2'>
              <span className='text-muted-foreground text-sm'>Show</span>
              <Select value={limit.toString()} onValueChange={value => changeLimit(parseInt(value))}>
                <SelectTrigger className='w-[80px]'>
                  <SelectValue placeholder={limit.toString()} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='5'>5</SelectItem>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='25'>25</SelectItem>
                  <SelectItem value='50'>50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <LoansTable
            loans={loans}
            isLoading={isLoading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </CardContent>
      </Card>
    </div>
  )
}
