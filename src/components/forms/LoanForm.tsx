'use client'

import { LoanFormValues, loanFormSchema } from '@/schemas/loanSchema'
import { Loan } from '@prisma/client'
import { format } from 'date-fns'
import { Calendar as LuCalendar } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import DynamicForm from '../shared/DynamicForm'

interface LoanFormProps {
  loan?: Partial<Loan>
  onSubmit: (data: LoanFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export default function LoanForm({ loan, onSubmit, isSubmitting = false, submitLabel = 'Submit' }: LoanFormProps) {
  const defaultValues: LoanFormValues = {
    title: '',
    amount: 0,
    interestRate: 0,
    term: 1,
    termUnit: 'MONTHS',
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    status: 'PENDING',
    borrowerId: '',
    lenderId: '',
    description: '',
    collateral: '',
    purpose: '',
    isCollateralized: false,
    riskRating: 50,
    apr: undefined,
    lateFeePercentage: 0,
    lateFeeFixedAmount: 0,
    disbursementDate: undefined,
    paymentFrequency: 'MONTHLY',
    loanTags: []
  }

  return (
    <DynamicForm
      schema={loanFormSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      initialData={loan as LoanFormValues}
      isSubmitting={isSubmitting}
      submitLabel={submitLabel}
    >
      {form => (
        <>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Business Expansion Loan' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='borrowerId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Borrower</FormLabel>
                  <FormControl>
                    <Input placeholder='Borrower ID' {...field} />
                  </FormControl>
                  <FormDescription>Enter the unique ID of the borrower.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='lenderId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lender (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='Lender ID' {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>Enter the unique ID of the lender if assigned.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount</FormLabel>
                  <FormControl>
                    <Input type='number' step='0.01' placeholder='10000' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='interestRate'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interest Rate (%)</FormLabel>
                  <FormControl>
                    <Input type='number' step='0.01' placeholder='5.5' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='apr'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>APR (%) (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      step='0.01'
                      placeholder='6.25'
                      {...field}
                      value={field.value === undefined ? '' : field.value}
                      onChange={e => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Annual Percentage Rate if different from interest rate</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex gap-4'>
              <FormField
                control={form.control}
                name='term'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Term</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='12' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='termUnit'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Term Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select term unit' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='DAYS'>Days</SelectItem>
                        <SelectItem value='WEEKS'>Weeks</SelectItem>
                        <SelectItem value='MONTHS'>Months</SelectItem>
                        <SelectItem value='YEARS'>Years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='paymentFrequency'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select payment frequency' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='DAILY'>Daily</SelectItem>
                      <SelectItem value='WEEKLY'>Weekly</SelectItem>
                      <SelectItem value='BI_WEEKLY'>Bi-Weekly</SelectItem>
                      <SelectItem value='MONTHLY'>Monthly</SelectItem>
                      <SelectItem value='QUARTERLY'>Quarterly</SelectItem>
                      <SelectItem value='SEMI_ANNUALLY'>Semi-Annually</SelectItem>
                      <SelectItem value='ANNUALLY'>Annually</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='PENDING'>Pending</SelectItem>
                      <SelectItem value='APPROVED'>Approved</SelectItem>
                      <SelectItem value='ACTIVE'>Active</SelectItem>
                      <SelectItem value='COMPLETED'>Completed</SelectItem>
                      <SelectItem value='DEFAULTED'>Defaulted</SelectItem>
                      <SelectItem value='REJECTED'>Rejected</SelectItem>
                      <SelectItem value='CANCELLED'>Cancelled</SelectItem>
                      <SelectItem value='RESTRUCTURED'>Restructured</SelectItem>
                      <SelectItem value='IN_REVIEW'>In Review</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='startDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Start Date</FormLabel>
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
                      <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='endDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>End Date</FormLabel>
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
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date: Date) => date < form.getValues('startDate')}
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
              name='disbursementDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Disbursement Date (Optional)</FormLabel>
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
              name='riskRating'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Rating (1-100)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min='1'
                      max='100'
                      placeholder='50'
                      {...field}
                      value={field.value === undefined ? '' : field.value}
                      onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>1 = lowest risk, 100 = highest risk</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormField
              control={form.control}
              name='lateFeePercentage'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Late Fee Percentage (%)</FormLabel>
                  <FormControl>
                    <Input type='number' step='0.01' placeholder='2.0' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='lateFeeFixedAmount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Late Fee Fixed Amount</FormLabel>
                  <FormControl>
                    <Input type='number' step='0.01' placeholder='25.00' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='purpose'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Purpose</FormLabel>
                  <FormControl>
                    <Input placeholder='Business expansion, home purchase, etc.' {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isCollateralized'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Collateralized Loan</FormLabel>
                    <FormDescription>Indicate if this loan requires collateral</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='collateral'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Collateral</FormLabel>
                <FormControl>
                  <Input placeholder='Property, Vehicle, etc.' {...field} value={field.value || ''} />
                </FormControl>
                <FormDescription>Enter any assets used as collateral for this loan</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Details about the loan purpose and terms...'
                    className='min-h-[100px] resize-y'
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
