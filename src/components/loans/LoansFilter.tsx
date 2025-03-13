'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { LoanStatus } from '@prisma/client'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { cn } from '@/lib/utils'

import { useLoan } from '@/hooks/useLoans'

const filterSchema = z.object({
  status: z.nativeEnum(LoanStatus).optional(),
  borrowerId: z.string().optional(),
  lenderId: z.string().optional(),
  minAmount: z.string().optional(),
  maxAmount: z.string().optional(),
  startDateFrom: z.date().optional(),
  startDateTo: z.date().optional(),
  loanTagIds: z.array(z.string()).optional()
})

type FilterFormValues = z.infer<typeof filterSchema>

interface LoansFilterProps {
  onFilter: () => void
}

export default function LoansFilter({ onFilter }: LoansFilterProps) {
  const { filters, updateFilters } = useLoan()

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      status: filters.status || LoanStatus.PENDING,
      borrowerId: filters.borrowerId || '',
      lenderId: filters.lenderId || '',
      minAmount: filters.minAmount?.toString() || '',
      maxAmount: filters.maxAmount?.toString() || '',
      startDateFrom: filters.startDateFrom,
      startDateTo: filters.startDateTo,
      loanTagIds: filters.loanTagIds || []
    }
  })

  useEffect(() => {
    form.reset({
      status: filters.status || LoanStatus.PENDING,
      borrowerId: filters.borrowerId || '',
      lenderId: filters.lenderId || '',
      minAmount: filters.minAmount?.toString() || '',
      maxAmount: filters.maxAmount?.toString() || '',
      startDateFrom: filters.startDateFrom,
      startDateTo: filters.startDateTo,
      loanTagIds: filters.loanTagIds || []
    })
  }, [filters, form])

  function onSubmit(values: FilterFormValues) {
    updateFilters({
      status: values.status && values.status !== LoanStatus.PENDING ? values.status : undefined,
      borrowerId: values.borrowerId || undefined,
      lenderId: values.lenderId || undefined,
      minAmount: values.minAmount ? parseFloat(values.minAmount) : undefined,
      maxAmount: values.maxAmount ? parseFloat(values.maxAmount) : undefined,
      startDateFrom: values.startDateFrom,
      startDateTo: values.startDateTo,
      loanTagIds: values.loanTagIds?.length ? values.loanTagIds : undefined
    })
    onFilter()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='All statuses' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='ALL'>All statuses</SelectItem>
                  {Object.values(LoanStatus).map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='minAmount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Min Amount</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='Min amount'
                  {...field}
                  onChange={e => field.onChange(e.target.value)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='maxAmount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Max Amount</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='Max amount'
                  {...field}
                  onChange={e => field.onChange(e.target.value)}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='startDateFrom'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Start Date From</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='startDateTo'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Start Date To</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      className={cn('pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                    >
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <div className='col-span-full flex justify-end gap-2'>
          <Button
            type='button'
            variant='outline'
            onClick={() => {
              form.reset({
                status: LoanStatus.PENDING,
                borrowerId: '',
                lenderId: '',
                minAmount: '',
                maxAmount: '',
                startDateFrom: undefined,
                startDateTo: undefined,
                loanTagIds: []
              })
            }}
          >
            Reset
          </Button>
          <Button type='submit'>Apply Filters</Button>
        </div>
      </form>
    </Form>
  )
}
