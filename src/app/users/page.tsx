import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Role } from '@prisma/client'
import { getServerSession } from 'next-auth'

import { UsersClient } from '@/components/users/UsersClient'

import { authConfig } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Users Management | Loan Wisee',
  description: 'Manage users in the Loan Wisee platform'
}

export default async function UsersPage() {
  const session = await getServerSession(authConfig)

  // Redirect if not logged in or not an admin
  if (!session) {
    redirect('/auth/login')
  }

  if (session.user?.role !== Role.ADMIN) {
    // redirect('/')
  }

  return (
    <div className='container mx-auto py-6'>
      <h1 className='mb-6 text-3xl font-bold'>Users Management</h1>
      <UsersClient />
    </div>
  )
}
