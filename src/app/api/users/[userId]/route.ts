import { NextRequest, NextResponse } from 'next/server'

import { userUpdateSchema } from '@/schemas/userSchema'
import { Role } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'

import { authConfig } from '@/lib/auth'
import db from '@/lib/db'

// GET /api/users/[id] - Get a user by ID
export async function GET(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  try {
    const params = await props.params
    const session = await getServerSession(authConfig)

    // Check if user is authenticated and has admin role or is requesting their own data
    if (!session || (session.user.role !== 'ADMIN' && session.user.id !== params.userId)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const user = await db.user.findUnique({
      where: {
        id: params.userId,
        deletedAt: null
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

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  try {
    const params = await props.params
    const session = await getServerSession(authConfig)

    // Check if user is authenticated and has admin role or is updating their own data
    if (!session || (session.user.role !== Role.ADMIN && session.user.id !== params.userId)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()

    // Validate the request body
    const validation = userUpdateSchema.safeParse({ ...body, id: params.userId })
    if (!validation.success) {
      return NextResponse.json({ message: 'Validation error', errors: validation.error.format() }, { status: 400 })
    }

    const { name, email, password, role, image } = validation.data

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: params.userId, deletedAt: null }
    })

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Check if email is already taken by another user
    if (email !== existingUser.email) {
      const emailExists = await db.user.findUnique({
        where: { email }
      })

      if (emailExists) {
        return NextResponse.json({ message: 'Email is already taken' }, { status: 400 })
      }
    }

    // Prepare update data
    const updateData: {
      name: string
      email: string
      role: Role
      image?: string | null
      updatedBy: string
      password?: string
    } = {
      name,
      email,
      role,
      image,
      updatedBy: session.user.id
    }

    // Hash the password if it's provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    // Update the user
    const updatedUser = await db.user.update({
      where: { id: params.userId },
      data: updateData,
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

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Delete a user (soft delete)
export async function DELETE(req: NextRequest, props: { params: Promise<{ userId: string }> }) {
  try {
    const params = await props.params
    const session = await getServerSession(authConfig)

    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: params.userId, deletedAt: null }
    })

    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // Prevent deleting own account
    if (params.userId === session.user.id) {
      return NextResponse.json({ message: 'Cannot delete your own account' }, { status: 400 })
    }

    // Soft delete the user
    await db.user.update({
      where: { id: params.userId },
      data: {
        deletedAt: new Date(),
        updatedBy: session.user.id
      }
    })

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}
