'use client'

import { Suspense, useEffect, useState } from 'react'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { AlertTriangle, Loader } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const errorMessages: Record<string, string> = {
  default: 'An error occurred during authentication.',
  configuration: 'There is a problem with the server configuration.',
  accessdenied: 'You do not have permission to sign in.',
  verification: 'The verification link may have been used or is invalid.',
  signin: 'The sign in attempt failed. Please try again.',
  oauthsignin: 'Error in the OAuth sign in process.',
  oauthcallback: 'Error in the OAuth callback process.',
  oauthcreateaccount: 'Unable to create an OAuth account.',
  emailcreateaccount: 'Unable to create an email account.',
  callback: 'Error in the authentication callback.',
  oauthaccountnotlinked: 'This account is linked to another provider.',
  sessionrequired: 'Please sign in to access this page.'
}

// Component that uses useSearchParams, wrapped in Suspense
function AuthErrorContent() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string>(errorMessages.default)

  useEffect(() => {
    const error = searchParams.get('error')
    if (error && errorMessages[error]) {
      setErrorMessage(errorMessages[error])
    }
  }, [searchParams])

  return (
    <div className='flex min-h-screen items-center justify-center px-4 py-12'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <div className='flex items-center justify-center'>
            <AlertTriangle className='text-destructive h-10 w-10' />
          </div>
          <CardTitle className='text-center text-2xl'>Authentication Error</CardTitle>
          <CardDescription className='text-center'>
            We encountered a problem during the authentication process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-center'>
            <p className='text-muted-foreground'>{errorMessage}</p>
          </div>
        </CardContent>
        <CardFooter className='flex justify-center space-x-4'>
          <Button asChild variant='secondary'>
            <Link href='/auth/login'>Try Again</Link>
          </Button>
          <Button asChild>
            <Link href='/'>Go Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Loading fallback component
function AuthErrorLoading() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Loader className='h-8 w-8 animate-spin' />
    </div>
  )
}

// Main page component that wraps the content in Suspense
export default function AuthErrorPage() {
  return (
    <Suspense fallback={<AuthErrorLoading />}>
      <AuthErrorContent />
    </Suspense>
  )
}
