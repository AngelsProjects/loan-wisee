import { NextResponse } from 'next/server'

import { userRegisterSchema } from '@/schemas/authSchema'
import { Role } from '@prisma/client'
import { hash } from 'bcryptjs'

import db from '@/lib/db'
import { logger } from '@/lib/logger'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate request body
    const validationResult = userRegisterSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid input data', errors: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { name, email, password } = validationResult.data

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.ADMIN
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({ user: userWithoutPassword, message: 'User registered successfully' }, { status: 201 })
  } catch (error) {
    logger.error({ error }, 'Error registering user')
    return NextResponse.json({ message: 'Error registering user' }, { status: 500 })
  }
}
