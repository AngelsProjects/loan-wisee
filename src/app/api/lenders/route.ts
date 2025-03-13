import { NextRequest, NextResponse } from 'next/server'

import { lenderSchema } from '@/schemas/lenderSchema'
import { BusinessType } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { authConfig } from '@/lib/auth'
import db from '@/lib/db'

// GET - Fetch all lenders with their users
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authConfig)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Optional query parameters
    const url = new URL(req.url)
    const verified = url.searchParams.get('verified')
    const businessType = url.searchParams.get('businessType')

    // Build filter conditions
    const where: {
      isVerified?: boolean
      businessType?: BusinessType
      deletedAt?: Date | null
    } = {}

    if (verified === 'true') {
      where.isVerified = true
    } else if (verified === 'false') {
      where.isVerified = false
    }

    if (businessType) {
      where.businessType = businessType as BusinessType
    }

    // Only add deletedAt filter if we're not explicitly including deleted records
    if (url.searchParams.get('includeDeleted') !== 'true') {
      where.deletedAt = null
    }

    const lenders = await db.lender.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(lenders)
  } catch (error) {
    console.error('Error fetching lenders:', error)
    return NextResponse.json({ error: 'Failed to fetch lenders' }, { status: 500 })
  }
}

// POST - Create a new lender
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authConfig)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    const validatedData = lenderSchema.parse(data)

    // Create the new lender
    const newLender = await db.lender.create({
      data: {
        ...validatedData,
        createdBy: session.user?.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    // Also update the user's role to LENDER if not already
    await db.user.update({
      where: { id: validatedData.userId },
      data: { role: 'LENDER' }
    })

    return NextResponse.json(newLender, { status: 201 })
  } catch (error) {
    console.error('Error creating lender:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create lender' }, { status: 500 })
  }
}
