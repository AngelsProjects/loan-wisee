import { BusinessType } from '@prisma/client'
import { z } from 'zod'

export const lenderSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  companyName: z.string().nullable().optional(),
  businessType: z.nativeEnum(BusinessType).default(BusinessType.INDIVIDUAL),
  registrationNumber: z.string().nullable().optional(),
  taxIdentificationNum: z.string().nullable().optional(),
  primaryAddress: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  websiteUrl: z.union([z.string().url('Must be a valid URL'), z.literal(''), z.null()]).optional(),
  lendingPreferences: z.any().optional(),
  isVerified: z.boolean().default(false),
  verificationDate: z.date().nullable().optional()
})

export const lenderUpdateSchema = z.object({
  companyName: z.string().nullable().optional(),
  businessType: z.nativeEnum(BusinessType).optional(),
  registrationNumber: z.string().nullable().optional(),
  taxIdentificationNum: z.string().nullable().optional(),
  primaryAddress: z.string().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  websiteUrl: z.union([z.string().url('Must be a valid URL'), z.literal(''), z.null()]).optional(),
  lendingPreferences: z.any().optional(),
  isVerified: z.boolean().optional(),
  verificationDate: z.date().nullable().optional()
})

export type LenderFormValues = z.infer<typeof lenderSchema>
export type LenderEditInput = z.infer<typeof lenderUpdateSchema>
