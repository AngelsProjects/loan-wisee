import { NextRequest, NextResponse } from 'next/server'

import { lenderUpdateSchema } from '@/schemas/lenderSchema'
import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { authConfig } from '@/lib/auth'
import db from '@/lib/db'

// GET - Fetch a single lender by ID
export async function GET(req: NextRequest, props: { params: Promise<{ lenderId: string }> }) {
  try {
    const params = await props.params
    const session = await getServerSession(authConfig)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lenderId: id } = params

    const lender = await db.lender.findUnique({
      where: { id },
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

    if (!lender) {
      return NextResponse.json({ error: 'Lender not found' }, { status: 404 })
    }

    return NextResponse.json(lender)
  } catch (error) {
    console.error('Error fetching lender:', error)
    return NextResponse.json({ error: 'Failed to fetch lender' }, { status: 500 })
  }
}

// PATCH - Update a lender by ID
export async function PATCH(req: NextRequest, props: { params: Promise<{ lenderId: string }> }) {
  try {
    const params = await props.params
    const session = await getServerSession(authConfig)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lenderId: id } = params
    const data = await req.json()

    const validatedData = lenderUpdateSchema.parse(data)

    // Check if lender exists
    const existingLender = await db.lender.findUnique({
      where: { id }
    })

    if (!existingLender) {
      return NextResponse.json({ error: 'Lender not found' }, { status: 404 })
    }

    // Update the lender
    const updatedLender = await db.lender.update({
      where: { id },
      data: {
        ...validatedData,
        updatedBy: session.user?.id,
        updatedAt: new Date()
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

    return NextResponse.json(updatedLender)
  } catch (error) {
    console.error('Error updating lender:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to update lender' }, { status: 500 })
  }
}

// DELETE - Soft delete a lender by ID
export async function DELETE(req: NextRequest, props: { params: Promise<{ lenderId: string }> }) {
  try {
    const params = await props.params
    const session = await getServerSession(authConfig)

    // Check if user is authenticated
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { lenderId: id } = params

    // Check if lender exists
    const existingLender = await db.lender.findUnique({
      where: { id }
    })

    if (!existingLender) {
      return NextResponse.json({ error: 'Lender not found' }, { status: 404 })
    }

    // Soft delete the lender (set deletedAt)
    await db.lender.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: session.user?.id
      }
    })

    // Record this action in the audit log
    await db.auditLog.create({
      data: {
        entityId: id,
        entityType: 'LENDER',
        action: 'DELETE',
        oldValue: existingLender,
        userId: session.user?.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting lender:', error)
    return NextResponse.json({ error: 'Failed to delete lender' }, { status: 500 })
  }
}
