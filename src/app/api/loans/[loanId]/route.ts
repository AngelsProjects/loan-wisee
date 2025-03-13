import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'

import { authConfig } from '@/lib/auth'
import db from '@/lib/db'

import { loanEditSchema } from '@/types/loan'

// GET: Fetch a single loan by ID
export async function GET(request: NextRequest, props: { params: Promise<{ loanId: string }> }) {
  try {
    const params = await props.params
    const session = await getServerSession(authConfig)
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { loanId: id } = params

    const loan = await db.loan.findUnique({
      where: { id, deletedAt: null },
      include: {
        borrower: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        lender: {
          include: {
            user: true
          }
        },
        documents: true,
        repaymentSchedule: {
          orderBy: { dueDate: 'asc' }
        },
        loanTags: true
      }
    })

    if (!loan) {
      return NextResponse.json({ message: 'Loan not found' }, { status: 404 })
    }

    return NextResponse.json(loan)
  } catch (error) {
    console.error('Error fetching loan:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// PUT: Update a loan
export async function PUT(request: NextRequest, props: { params: Promise<{ loanId: string }> }) {
  try {
    const params = await props.params
    const session = await getServerSession(authConfig)
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { loanId: id } = params
    const data = await request.json()

    // Validate the data
    const validationResult = loanEditSchema.safeParse({ ...data, id })
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Validation error', errors: validationResult.error.format() },
        { status: 400 }
      )
    }

    // Check if loan exists
    const existingLoan = await db.loan.findUnique({
      where: { id, deletedAt: null }
    })

    if (!existingLoan) {
      return NextResponse.json({ message: 'Loan not found' }, { status: 404 })
    }

    const { loanTagIds, ...loanData } = validationResult.data

    // Update the loan
    const updatedLoan = await db.loan.update({
      where: { id },
      data: {
        ...loanData,
        updatedBy: session.user.id,
        // Update loan tags
        loanTags: {
          set: [], // Disconnect all existing tags
          connect: loanTagIds?.map(tagId => ({ id: tagId })) || [] // Connect new tags
        }
      },
      include: {
        borrower: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        lender: {
          include: {
            user: true
          }
        },
        loanTags: true
      }
    })

    return NextResponse.json(updatedLoan)
  } catch (error) {
    console.error('Error updating loan:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Soft delete a loan
export async function DELETE(request: NextRequest, props: { params: Promise<{ loanId: string }> }) {
  try {
    const params = await props.params
    const session = await getServerSession(authConfig)
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const { loanId: id } = params

    // Check if loan exists
    const existingLoan = await db.loan.findUnique({
      where: { id, deletedAt: null }
    })

    if (!existingLoan) {
      return NextResponse.json({ message: 'Loan not found' }, { status: 404 })
    }

    // Soft delete the loan by setting deletedAt
    await db.loan.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: session.user.id
      }
    })

    return NextResponse.json({ message: 'Loan deleted successfully' })
  } catch (error) {
    console.error('Error deleting loan:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
