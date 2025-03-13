'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Borrower {
  id: string
  userId: string
  primaryAddress?: string | null
  phoneNumber?: string | null
  creditScore?: number | null
  monthlyIncome?: number | null
  employmentStatus?: string | null
  employer?: string | null
  user?: {
    name?: string | null
    email: string
  }
}

export default function BorrowersPage() {
  const router = useRouter()
  const [borrowers, setBorrowers] = useState<Borrower[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        const response = await fetch('/api/borrowers')

        if (!response.ok) {
          throw new Error('Failed to fetch borrowers')
        }

        const data = await response.json()
        setBorrowers(data)
      } catch (error) {
        console.error('Error fetching borrowers:', error)
        toast.error('Failed to load borrowers')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBorrowers()
  }, [])

  return (
    <div className='container mx-auto py-8'>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between'>
          <div>
            <CardTitle>Borrowers</CardTitle>
            <CardDescription>Manage borrower profiles and their information.</CardDescription>
          </div>
          <Button onClick={() => router.push('/borrowers/new')}>Create New Borrower</Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className='space-y-4'>
              <Skeleton className='h-10 w-full' />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-16 w-full' />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name/Email</TableHead>
                  <TableHead>Credit Score</TableHead>
                  <TableHead>Monthly Income</TableHead>
                  <TableHead>Employment Status</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className='text-center'>
                      No borrowers found. Create a new borrower to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  borrowers.map(borrower => (
                    <TableRow key={borrower.id}>
                      <TableCell>
                        <div>
                          <div className='font-medium'>{borrower.user?.name || 'N/A'}</div>
                          <div className='text-muted-foreground text-sm'>{borrower.user?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{borrower.creditScore || 'N/A'}</TableCell>
                      <TableCell>
                        {borrower.monthlyIncome
                          ? new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            }).format(borrower.monthlyIncome)
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {borrower.employmentStatus ? borrower.employmentStatus.replace('_', ' ') : 'Unknown'}
                      </TableCell>
                      <TableCell>{borrower.phoneNumber || 'N/A'}</TableCell>
                      <TableCell>
                        <Button variant='outline' size='sm' asChild>
                          <Link href={`/borrowers/${borrower.id}`}>View/Edit</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
