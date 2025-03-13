import { NextRequest, NextResponse } from 'next/server'

import { userCreateSchema } from '@/schemas/userSchema'
import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'

import { authConfig } from '@/lib/auth'
import db from '@/lib/db'

// GET /api/users - Get all users
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authConfig)

    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const url = new URL(req.url)
    const excludeRole = url.searchParams.get('excludeRole')
    const includeRole = url.searchParams.get('includeRole')

    // Get query parameters for filtering
    const searchParams = req.nextUrl.searchParams
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    // Build where clause for filtering
    const whereClause: {
      deletedAt: null
      OR?: {
        name?: { contains: string; mode: 'insensitive' }
        email?: { contains: string; mode: 'insensitive' }
      }[]
      role?: Role | { not: Role }
    } = {
      deletedAt: null
    }

    if (role) {
      whereClause.role = role as Role
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (excludeRole) {
      whereClause.role = {
        not: excludeRole as Role
      }
    }

    if (includeRole) {
      whereClause.role = includeRole as Role
    }

    const users = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        role: true,
        createdBy: true,
        updatedBy: true,
        borrowerProfile: true,
        lenderProfile: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/users - Create a new user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authConfig)

    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()

    // Validate the request body
    const validation = userCreateSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ message: 'Validation error', errors: validation.error.format() }, { status: 400 })
    }

    const { name, email, password, role, image } = validation.data

    // Check if user with the same email already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 400 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        image,
        createdBy: session.user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        role: true,
        createdBy: true,
        updatedBy: true
      }
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
