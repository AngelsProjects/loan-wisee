'use client'

import { Suspense, useState } from 'react'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { LoginFormValues, loginSchema } from '@/schemas/authSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Loader, Lock, Mail } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import { AlertDialog as Alert, AlertDialogDescription as AlertDescription } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

// Component that uses useSearchParams, wrapped in Suspense
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true)
      setError(null)

      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password
      })

      if (!result?.ok) {
        setError('Invalid email or password. Please try again.')
        return
      }

      router.push(callbackUrl)
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true)
      await signIn('google', { callbackUrl })
    } catch (error) {
      console.error('Google sign-in error:', error)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold'>Sign in</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className='mb-4'>
            <Button
              variant='outline'
              type='button'
              disabled={isGoogleLoading}
              className='w-full'
              onClick={handleGoogleSignIn}
            >
              {isGoogleLoading ? <Loader className='mr-2 h-4 w-4 animate-spin' /> : <Mail className='mr-2 h-4 w-4' />}
              Sign in with Google
            </Button>
          </div>

          <div className='relative my-6'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='bg-background text-muted-foreground px-2'>Or continue with</span>
            </div>
          </div>

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

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Lock className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
                        <Input type='password' placeholder='••••••••' className='pl-10' {...field} />
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
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className='flex flex-col space-y-2'>
          <div className='text-center text-sm'>
            <Link href='/auth/register' className='hover:text-primary underline underline-offset-4'>
              Don&apos;t have an account? Sign up
            </Link>
          </div>
          <div className='text-center text-sm'>
            <Link href='/auth/forgot-password' className='hover:text-primary underline underline-offset-4'>
              Forgot your password?
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

// Loading fallback component
function LoginLoading() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Loader className='h-8 w-8 animate-spin' />
    </div>
  )
}

// Main page component that wraps the form in Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}
