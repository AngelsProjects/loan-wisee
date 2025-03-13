import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth/next'

import { authConfig } from '@/lib/auth'
import db from '@/lib/db'

// GET handler to fetch all borrowers
export async function GET() {
  try {
    const session = await getServerSession(authConfig)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if the user is an admin (admins can see all borrowers)
    const isAdmin = session.user?.role === 'ADMIN'

    let borrowers

    if (isAdmin) {
      // Admins can see all borrowers
      borrowers = await db.borrower.findMany({
        where: {
          deletedAt: null
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      // Regular users can only see their own borrower profile if they have one
      borrowers = await db.borrower.findMany({
        where: {
          deletedAt: null,
          userId: session.user.id
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      })
    }

    return NextResponse.json(borrowers)
  } catch (error) {
    console.error('Error fetching borrowers:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// POST handler to create a new borrower
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authConfig)

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if this user already has a borrower profile
    const existingBorrower = await db.borrower.findUnique({
      where: {
        userId: session?.user?.id || ''
      }
    })

    if (existingBorrower) {
      return NextResponse.json({ message: 'User already has a borrower profile' }, { status: 400 })
    }

    const data = await req.json()

    // If no userId is provided, use the current user's ID
    if (!data.userId) {
      data.userId = session.user.id
    } else if (session.user.role !== 'ADMIN' && data.userId !== session.user.id) {
      // Only admins can create borrower profiles for other users
      return NextResponse.json({ message: 'You can only create a borrower profile for yourself' }, { status: 403 })
    }

    // Validate that the user exists
    const userExists = await db.user.findUnique({
      where: {
        id: data.userId
      }
    })

    if (!userExists) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Create the borrower profile
    const borrower = await db.borrower.create({
      data: {
        userId: data.userId,
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
        createdBy: session.user.id
      }
    })

    // Update the user's role to BORROWER if not already set
    await db.user.update({
      where: {
        id: data.userId
      },
      data: {
        role: 'BORROWER'
      }
    })

    return NextResponse.json(borrower, { status: 201 })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error creating borrower:', error)

    // Handle unique constraint violations
    if (error.code === 'P2002') {
      const field = error.meta?.target[0]
      return NextResponse.json({ message: `${field} is already in use` }, { status: 400 })
    }

    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
