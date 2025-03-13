'use client'

import { ReactNode } from 'react'
import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { UseFormReturn, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'

interface DynamicFormProps<T extends z.ZodType> {
  schema: T
  defaultValues: z.infer<T>
  onSubmit: (data: z.infer<T>) => void
  children: (form: UseFormReturn<z.infer<T>>) => ReactNode
  initialData?: z.infer<T>
  isSubmitting?: boolean
  submitLabel?: string
}

export default function DynamicForm<T extends z.ZodType>({
  schema,
  defaultValues,
  onSubmit,
  children,
  initialData,
  isSubmitting = false,
  submitLabel = 'Submit'
}: DynamicFormProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues
  })

  // Update form when initial data is provided
  useEffect(() => {
    if (initialData) {
      // Transform date strings to Date objects if needed
      const transformedData = Object.entries(initialData).reduce(
        (acc, [key, value]) => {
          if (value instanceof Date || !value || typeof value !== 'string') {
            acc[key as keyof typeof initialData] = value
          } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
            acc[key as keyof typeof initialData] = new Date(value)
          } else {
            acc[key as keyof typeof initialData] = value
          }
          return acc
        },
        {} as typeof initialData
      )

      form.reset(transformedData)
    }
  }, [initialData, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        {children(form)}

        <div className='flex justify-end'>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}
