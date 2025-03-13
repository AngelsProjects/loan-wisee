'use client'

import { BorrowerFormValues, borrowerFormSchema } from '@/schemas/borrowerSchema'
import { Borrower } from '@prisma/client'
import { format } from 'date-fns'
import { Calendar as LuCalendar } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import DynamicForm from '../shared/DynamicForm'

interface BorrowerFormProps {
  borrower?: Partial<Borrower>
  onSubmit: (data: BorrowerFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export default function BorrowerForm({
  borrower,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Submit'
}: BorrowerFormProps) {
  const defaultValues: BorrowerFormValues = {
    userId: '',
    primaryAddress: '',
    phoneNumber: '',
    creditScore: null,
    monthlyIncome: null,
    employmentStatus: 'UNKNOWN',
    employer: '',
    employmentStartDate: null,
    employmentEndDate: null,
    taxIdentificationNum: '',
    dateOfBirth: null
  }

  return (
    <DynamicForm
      schema={borrowerFormSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      initialData={borrower as BorrowerFormValues}
      isSubmitting={isSubmitting}
      submitLabel={submitLabel}
    >
      {form => (
        <>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='userId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User ID</FormLabel>
                  <FormControl>
                    <Input placeholder='User ID' {...field} />
                  </FormControl>
                  <FormDescription>Enter the ID of the user this borrower profile belongs to</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='+1 (555) 123-4567' {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='creditScore'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credit Score (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={300}
                      max={850}
                      placeholder='720'
                      {...field}
                      value={field.value === null ? '' : field.value}
                      onChange={e => field.onChange(e.target.value === '' ? null : parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Score between 300-850</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='monthlyIncome'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Income (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.01'
                      placeholder='5000.00'
                      {...field}
                      value={field.value === null ? '' : field.value}
                      onChange={e => field.onChange(e.target.value === '' ? null : parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='employmentStatus'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employment Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value || 'UNKNOWN'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='EMPLOYED'>Employed</SelectItem>
                      <SelectItem value='SELF_EMPLOYED'>Self-Employed</SelectItem>
                      <SelectItem value='UNEMPLOYED'>Unemployed</SelectItem>
                      <SelectItem value='RETIRED'>Retired</SelectItem>
                      <SelectItem value='STUDENT'>Student</SelectItem>
                      <SelectItem value='UNKNOWN'>Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='employer'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employer (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='Acme Corporation' {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='employmentStartDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Employment Start Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value ? 'text-muted-foreground' : ''
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <LuCalendar className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='employmentEndDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Employment End Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value ? 'text-muted-foreground' : ''
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <LuCalendar className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        disabled={(date: Date) => {
                          const startDate = form.getValues('employmentStartDate')
                          return startDate ? date < startDate : false
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='taxIdentificationNum'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax ID Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='123-45-6789' {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='dateOfBirth'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Date of Birth (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value ? 'text-muted-foreground' : ''
                          )}
                        >
                          {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                          <LuCalendar className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value || undefined}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={(date: Date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='primaryAddress'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Address (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='123 Main St, Apt 4B, City, State, ZIP'
                    className='min-h-[80px] resize-y'
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </DynamicForm>
  )
}
