// src/app/api/loan-tags/route.ts
import { NextRequest, NextResponse } from 'next/server'

import { getServerSession } from 'next-auth'
import { z } from 'zod'

import { authConfig } from '@/lib/auth'
import db from '@/lib/db'

// GET: Fetch all loan tags
export async function GET() {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const tags = await db.loanTag.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error('Error fetching loan tags:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// POST: Create a new loan tag
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig)
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    // Basic validation
    const schema = z.object({
      name: z.string().min(1, 'Name is required'),
      color: z.string().optional()
    })

    const validationResult = schema.safeParse(data)
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Validation error', errors: validationResult.error.format() },
        { status: 400 }
      )
    }

    // Check if tag with same name already exists
    const existingTag = await db.loanTag.findFirst({
      where: {
        name: validationResult.data.name,
        deletedAt: null
      }
    })

    if (existingTag) {
      return NextResponse.json(existingTag)
    }

    // Generate a random color if not provided
    const color = validationResult.data.color || generateRandomPastelColor()

    // Create the tag
    const tag = await db.loanTag.create({
      data: {
        name: validationResult.data.name,
        color,
        createdBy: session.user.id,
        updatedBy: session.user.id
      }
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('Error creating loan tag:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to generate random pastel colors
function generateRandomPastelColor() {
  // Generate a pastel color (lighter, less saturated)
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 80%)`
}
