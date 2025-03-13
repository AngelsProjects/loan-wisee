import { Role } from '@prisma/client'
import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface User extends DefaultUser {
    role?: Role
  }

  interface Session extends DefaultSession {
    user: User
  }
}
