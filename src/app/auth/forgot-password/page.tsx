'use client'

import { useState } from 'react'

import Link from 'next/link'

import { ForgotPasswordFormValues, forgotPasswordSchema } from '@/schemas/authSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, CheckCircle, Loader, Mail } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSuccess, setIsSuccess] = useState<boolean>(false)

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  async function onSubmit(data: ForgotPasswordFormValues) {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.email
        })
      })

      if (!response.ok) {
        const result = await response.json()
        setError(result.message || 'Failed to send reset link. Please try again.')
        return
      }

      setIsSuccess(true)
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Forgot password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Forgot password</CardTitle>
          <CardDescription>Enter your email address and we&apos;ll send you a reset link</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert className='mb-4'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isSuccess ? (
            <div className='flex flex-col items-center justify-center space-y-4 py-6'>
              <div className='rounded-full bg-green-100 p-3 dark:bg-green-900'>
                <CheckCircle className='h-6 w-6 text-green-600 dark:text-green-400' />
              </div>
              <h3 className='text-xl font-medium'>Check your email</h3>
              <p className='text-muted-foreground text-center'>
                We&apos;ve sent a password reset link to your email address.
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Mail className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
                          <Input placeholder='name@example.com' className='pl-10' {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type='submit' className='w-full' disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader className='mr-2 h-4 w-4 animate-spin' />
                      Sending...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>

        <CardFooter>
          <div className='w-full text-center text-sm'>
            <Link href='/auth/login' className='hover:text-primary underline underline-offset-4'>
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
