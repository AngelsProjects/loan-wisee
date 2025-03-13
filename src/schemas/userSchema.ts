import { Role } from '@prisma/client'
import { z } from 'zod'

export const userCreateSchema = z.object({
  name: z.string().min(2, 'Name is required').max(50, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z
    .nativeEnum(Role, {
      errorMap: () => ({ message: 'Please select a valid role' })
    })
    .default(Role.USER),
  image: z.string().optional().nullable()
})

export const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name is required').max(50, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  password: z.union([z.string().min(8, 'Password must be at least 8 characters'), z.string().optional()]),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: 'Please select a valid role' })
  }),
  image: z.string().optional().nullable()
})

export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: z.nativeEnum(Role).optional().nullable(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).default(10)
})

export type UserCreateInput = z.infer<typeof userCreateSchema>
export type UserUpdateInput = z.infer<typeof userUpdateSchema>
export type UserFilterValues = z.infer<typeof userFilterSchema>
