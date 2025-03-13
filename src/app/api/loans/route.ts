import { NextRequest, NextResponse } from 'next/server'

import { loanSchema } from '@/schemas/loanSchema'
import { LoanStatus } from '@prisma/client'
import { getServerSession } from 'next-auth'

import { authConfig } from '@/lib/auth'
import db from '@/lib/db'

// GET: Fetch all loans with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Extract filter parameters
    const status = searchParams.get('status')
    const borrowerId = searchParams.get('borrowerId')
    const lenderId = searchParams.get('lenderId')
    const minAmount = searchParams.get('minAmount') ? parseFloat(searchParams.get('minAmount')!) : undefined
    const maxAmount = searchParams.get('maxAmount') ? parseFloat(searchParams.get('maxAmount')!) : undefined
    const startDateFrom = searchParams.get('startDateFrom') ? new Date(searchParams.get('startDateFrom')!) : undefined
    const startDateTo = searchParams.get('startDateTo') ? new Date(searchParams.get('startDateTo')!) : undefined
    const loanTagIds = searchParams.getAll('loanTagIds')

    // Build filter object
    const where: {
      deletedAt: Date | null
      status?: LoanStatus
      borrowerId?: string
      lenderId?: string
      amount?: { gte?: number; lte?: number }
      startDate?: { gte?: Date; lte?: Date }
      loanTags?: { some: { id: { in: string[] } } }
    } = {
      deletedAt: null
    }

    // Apply filters if provided
    if (status) where.status = status as LoanStatus
    if (borrowerId) where.borrowerId = borrowerId
    if (lenderId) where.lenderId = lenderId

    if (minAmount !== undefined || maxAmount !== undefined) {
      where.amount = {}
      if (minAmount !== undefined) where.amount.gte = minAmount
      if (maxAmount !== undefined) where.amount.lte = maxAmount
    }

    if (startDateFrom || startDateTo) {
      where.startDate = {}
      if (startDateFrom) where.startDate.gte = startDateFrom
      if (startDateTo) where.startDate.lte = startDateTo
    }

    if (loanTagIds.length > 0) {
      where.loanTags = {
        some: {
          id: {
            in: loanTagIds
          }
        }
      }
    }

    // Fetch loans with count
    const [loans, total] = await Promise.all([
      db.loan.findMany({
        where,
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
            include: { user: true }
          },
          loanTags: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.loan.count({ where })
    ])

    return NextResponse.json({
      loans,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching loans:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create a new loan
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Validate the data
    const validationResult = loanSchema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Validation error', errors: validationResult.error.format() },
        { status: 400 }
      )
    }

    const { loanTags, ...loanData } = validationResult.data

    // Create the loan
    const loan = await db.loan.create({
      data: {
        ...loanData,
        createdBy: session.user.id,
        updatedBy: session.user.id,
        // Connect loan tags if provided
        loanTags: loanTags?.length
          ? {
              connect: loanTags.map(({ id }) => ({ id }))
            }
          : undefined
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
        loanTags: true
      }
    })

    return NextResponse.json(loan, { status: 201 })
  } catch (error) {
    console.error('Error creating loan:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
