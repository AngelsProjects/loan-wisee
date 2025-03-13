import { NextResponse } from 'next/server'

import { NODE_ENV } from '@/constants/environments'
import { forgotPasswordSchema } from '@/schemas/authSchema'
import crypto from 'crypto'

import db from '@/lib/db'
import { logger } from '@/lib/logger'
import { sendEmail } from '@/lib/ses'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate request body
    const validationResult = forgotPasswordSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { message: 'Invalid email address', errors: validationResult.error.errors },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email }
    })

    // We don't want to reveal if a user exists for security reasons
    // So we return success regardless of whether we found the user
    if (!user) {
      logger.info(`Password reset requested for non-existent email: ${email}`)
      return NextResponse.json(
        { message: 'If your email is registered, you will receive a reset link shortly' },
        { status: 200 }
      )
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store the reset token in the database
    await db.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry
      }
    })

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`
    if (NODE_ENV === 'development') {
      logger.info(`Reset link for ${email}: ${resetLink}`)
    } else {
      // use aws ses to send email
      await sendEmail(email, 'Password Reset', `Click this link to reset your password: ${resetLink}`)
    }

    return NextResponse.json(
      { message: 'If your email is registered, you will receive a reset link shortly' },
      { status: 200 }
    )
  } catch (error) {
    logger.error({ error }, 'Error processing forgot password request')
    return NextResponse.json({ message: 'Error processing request' }, { status: 500 })
  }
}
