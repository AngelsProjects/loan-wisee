/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from 'next/navigation'

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET } from '@/constants/environments'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { User } from '@prisma/client'
import { compare } from 'bcryptjs'
import { getServerSession } from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import db from '@/lib/db'
import { logger } from '@/lib/logger'

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code'
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }

        try {
          const user = await db.user.findUnique({
            where: { email: credentials.email, deletedAt: null }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          logger.error({ error }, 'Error in auth provider')
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      // Refresh user data from the database on each JWT refresh
      const dbUser = await db.user.findUnique({
        where: {
          email: token.email as string,
          deletedAt: null
        }
      })

      if (dbUser) {
        token.role = dbUser.role
      }

      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }
      return session
    }
  },
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  secret: NEXTAUTH_SECRET
}

export const getUserSession = async () => {
  const session = await getServerSession(authConfig)
  return session
}

export const getCurrentUser = async () => {
  const session = await getUserSession()

  if (!session?.user) {
    return null
  }

  return session.user as User
}

export const requireAuth = async () => {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  return user
}

export const requireRole = async (allowedRoles: string[]) => {
  const user = await requireAuth()

  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized')
  }

  return user
}
