'use client'

import { use, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { LenderEditInput, lenderUpdateSchema } from '@/schemas/lenderSchema'
import { BusinessType } from '@prisma/client'
import { toast } from 'sonner'

import DynamicForm from '@/components/shared/DynamicForm'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { useLenders } from '@/hooks/useLenders'

export default function EditLenderPage(props: { params: Promise<{ lenderId: string }> }) {
  const params = use(props.params)
  const router = useRouter()
  const { lender, updateLender } = useLenders(params.lenderId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [initialData, setInitialData] = useState<LenderEditInput | null>(null)

  // Fetch lender data on component mount
  useEffect(() => {
    const fetchLenderData = async () => {
      try {
        if (lender) {
          setInitialData({
            companyName: lender.companyName || '',
            businessType: lender.businessType || BusinessType.INDIVIDUAL,
            registrationNumber: lender.registrationNumber || '',
            taxIdentificationNum: lender.taxIdentificationNum || '',
            primaryAddress: lender.primaryAddress || '',
            phoneNumber: lender.phoneNumber || '',
            websiteUrl: lender.websiteUrl || '',
            lendingPreferences: lender.lendingPreferences || {},
            isVerified: lender.isVerified || false
          })
        }
      } catch (error) {
        console.error('Error fetching lender data:', error)
        toast.error('Failed to fetch lender details')
      }
    }

    fetchLenderData()
  }, [params.lenderId, lender])

  const handleUpdateLender = async (data: LenderEditInput) => {
    setIsSubmitting(true)
    try {
      const result = await updateLender(params.lenderId, data)
      if (result) {
        router.push('/lenders')
        toast.success('Lender updated successfully')
      }
    } catch (error) {
      console.error('Error updating lender:', error)
      toast.error('Failed to update lender')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!initialData) {
    return <div>Loading...</div>
  }

  return (
    <div className='container mx-auto py-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold'>Edit Lender</h1>
        <p className='text-muted-foreground mt-2'>Update the details of the lender</p>
      </div>

      <div className='bg-card max-w-2xl rounded-lg border p-6'>
        <DynamicForm
          schema={lenderUpdateSchema}
          defaultValues={initialData}
          onSubmit={handleUpdateLender}
          isSubmitting={isSubmitting}
          submitLabel='Update Lender'
        >
          {form => (
            <>
              <FormField
                control={form.control}
                name='companyName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter company name' {...field} value={field.value || ''} />
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
                        {Object.values(BusinessType).map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
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
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter registration number' {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='taxIdentificationNum'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Identification Number</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter tax identification number' {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='primaryAddress'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Address</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter primary address' {...field} value={field.value || ''} />
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
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter phone number' {...field} value={field.value || ''} />
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
                    <FormLabel>Website URL</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter website URL' {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='isVerified'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verified</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value ? 'true' : 'false'}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select verification status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='true'>Verified</SelectItem>
                        <SelectItem value='false'>Not Verified</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </DynamicForm>
      </div>
    </div>
  )
}
