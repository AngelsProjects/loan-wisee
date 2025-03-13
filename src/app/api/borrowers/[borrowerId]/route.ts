import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth/next'

import { authConfig } from '@/lib/auth'
import db from '@/lib/db'

// GET handler to fetch a specific borrower
export async function GET(req: NextRequest, props: { params: Promise<{ borrowerId: string }> }) {
  try {
    const params = await props.params
    const session = await getServerSession(authConfig)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const borrowerId = params.borrowerId

    // Find the borrower
    const borrower = await db.borrower.findUnique({
      where: {
        id: borrowerId,
        deletedAt: null
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      }
    })

    if (!borrower) {
      return NextResponse.json({ message: 'Borrower not found' }, { status: 404 })
    }

    // Check permissions - only admins or the owner can view a borrower profile
    const isAdmin = session.user?.role === 'ADMIN'
    const isOwner = borrower.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(borrower)
  } catch (error) {
    console.error('Error fetching borrower:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// PATCH handler to update a borrower
export async function PATCH(req: NextRequest, props: { params: Promise<{ borrowerId: string }> }) {
  try {
    const params = await props.params
    const session = await getServerSession(authConfig)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const borrowerId = params.borrowerId
    const data = await req.json()

    // Find the borrower to check permissions
    const borrower = await db.borrower.findUnique({
      where: {
        id: borrowerId,
        deletedAt: null
      }
    })

    if (!borrower) {
      return NextResponse.json({ message: 'Borrower not found' }, { status: 404 })
    }

    // Check permissions - only admins or the owner can update a borrower profile
    const isAdmin = session.user?.role === 'ADMIN'
    const isOwner = borrower.userId === session.user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    // Regular users can't change the userId
    if (!isAdmin && data.userId && data.userId !== borrower.userId) {
      return NextResponse.json(
        { message: 'You cannot change the user associated with this borrower profile' },
        { status: 403 }
      )
    }

    // Update the borrower
    const updatedBorrower = await db.borrower.update({
      where: {
        id: borrowerId
      },
      data: {
        primaryAddress: data.primaryAddress,
        phoneNumber: data.phoneNumber,
        creditScore: data.creditScore,
        monthlyIncome: data.monthlyIncome,
        employmentStatus: data.employmentStatus,
        employer: data.employer,
        employmentStartDate: data.employmentStartDate,
        employmentEndDate: data.employmentEndDate,
        taxIdentificationNum: data.taxIdentificationNum,
        dateOfBirth: data.dateOfBirth,
        updatedBy: session.user.id,
        ...(isAdmin && data.userId ? { userId: data.userId } : {})
      }
    })

    return NextResponse.json(updatedBorrower)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error updating borrower:', error)

    // Handle unique constraint violations
    if (error.code === 'P2002') {
      const field = error.meta?.target[0]
      return NextResponse.json({ message: `${field} is already in use` }, { status: 400 })
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// DELETE handler to soft delete a borrower
export async function DELETE(req: NextRequest, props: { params: Promise<{ borrowerId: string }> }) {
  try {
    const params = await props.params
    const session = await getServerSession(authConfig)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can delete borrower profiles
    if (session.user?.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
    }

    const borrowerId = params.borrowerId

    // Find the borrower
    const borrower = await db.borrower.findUnique({
      where: {
        id: borrowerId,
        deletedAt: null
      }
    })

    if (!borrower) {
      return NextResponse.json({ message: 'Borrower not found' }, { status: 404 })
    }

    // Soft delete by setting deletedAt
    await db.borrower.update({
      where: {
        id: borrowerId
      },
      data: {
        deletedAt: new Date(),
        updatedBy: session.user.id
      }
    })

    return NextResponse.json({ message: 'Borrower profile deleted successfully' })
  } catch (error) {
    console.error('Error deleting borrower:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
