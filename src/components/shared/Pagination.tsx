'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='text-muted-foreground flex-1 text-sm'>
        Page {currentPage} of {totalPages}
      </div>
      <div className='flex items-center space-x-2'>
        <Button variant='outline' size='sm' onClick={handlePrevious} disabled={currentPage === 1}>
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <Button variant='outline' size='sm' onClick={handleNext} disabled={currentPage === totalPages}>
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
