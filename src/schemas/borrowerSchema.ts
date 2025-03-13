import { EmploymentStatus } from '@prisma/client'
import { z } from 'zod'

export const borrowerFormSchema = z
  .object({
    userId: z.string().min(1, 'User ID is required'),
    primaryAddress: z.string().nullable().optional(),
    phoneNumber: z.string().nullable().optional(),
    creditScore: z.coerce.number().min(300).max(850).nullable().optional(),
    monthlyIncome: z.coerce.number().min(0, 'Monthly income must be a positive number').nullable().optional(),
    employmentStatus: z.nativeEnum(EmploymentStatus).default(EmploymentStatus.UNKNOWN).nullable().optional(),
    employer: z.string().nullable().optional(),
    employmentStartDate: z.date().nullable().optional(),
    employmentEndDate: z.date().nullable().optional(),
    taxIdentificationNum: z.string().nullable().optional(),
    dateOfBirth: z.date().nullable().optional()
  })
  .refine(
    data => {
      // If both employment dates are provided, validate end date is after start date
      if (data.employmentStartDate && data.employmentEndDate) {
        return data.employmentEndDate > data.employmentStartDate
      }
      return true
    },
    {
      message: 'Employment end date must be after start date',
      path: ['employmentEndDate']
    }
  )

export type BorrowerFormValues = z.infer<typeof borrowerFormSchema>
