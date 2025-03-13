'use client'

import { LenderFormValues, lenderSchema } from '@/schemas/lenderSchema'
import { BusinessType, Lender } from '@prisma/client'

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import DynamicForm from '../shared/DynamicForm'

interface LenderFormProps {
  lender?: Partial<Lender>
  onSubmit: (data: LenderFormValues) => void
  isSubmitting?: boolean
  submitLabel?: string
}

export default function LenderForm({
  lender,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Submit'
}: LenderFormProps) {
  const defaultValues: LenderFormValues = {
    userId: '',
    companyName: '',
    businessType: BusinessType.INDIVIDUAL,
    registrationNumber: '',
    taxIdentificationNum: '',
    primaryAddress: '',
    phoneNumber: '',
    websiteUrl: '',
    lendingPreferences: {},
    isVerified: false,
    verificationDate: null
  }

  return (
    <DynamicForm
      schema={lenderSchema}
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      initialData={lender as LenderFormValues}
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
                  <FormDescription>Enter the ID of the user this lender profile belongs to</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='companyName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='ABC Lending Inc.' {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='businessType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select business type' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='INDIVIDUAL'>Individual</SelectItem>
                      <SelectItem value='SOLE_PROPRIETORSHIP'>Sole Proprietorship</SelectItem>
                      <SelectItem value='PARTNERSHIP'>Partnership</SelectItem>
                      <SelectItem value='LLC'>LLC</SelectItem>
                      <SelectItem value='CORPORATION'>Corporation</SelectItem>
                      <SelectItem value='NONPROFIT'>Nonprofit</SelectItem>
                      <SelectItem value='OTHER'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='registrationNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='12345-AB' {...field} value={field.value || ''} />
                  </FormControl>
                  <FormDescription>Business registration/license number</FormDescription>
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
              name='websiteUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder='https://www.example.com' {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isVerified'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Verification Status</FormLabel>
                    <FormDescription>Indicates if this lender has been verified</FormDescription>
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
            name='primaryAddress'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Address (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='123 Business St, Suite 101, City, State, ZIP'
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
