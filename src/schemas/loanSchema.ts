import { LoanStatus, LoanTermUnit, PaymentFrequency, RepaymentStatus } from '@prisma/client'
import { z } from 'zod'

export const tagSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  color: z.string().optional()
})
export const loanSchema = z.object({
  id: z.string().optional(),
  apr: z.coerce.number().min(0).optional(),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  amount: z.number().positive('Amount must be a positive number'),
  interestRate: z.number().min(0, 'Interest rate must be a positive number'),
  term: z.number().positive('Loan term must be a positive number'),
  termUnit: z.nativeEnum(LoanTermUnit),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Start date must be a valid date'
  }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: 'Start date must be a valid date'
  }),
  borrowerId: z.string(),
  lenderId: z.string().optional(),
  isCollateralized: z.boolean().default(false),
  borrowerPhone: z.string().optional(),
  purpose: z.string().optional(),
  status: z.nativeEnum(LoanStatus).default(LoanStatus.PENDING),
  description: z.string().optional(),
  collateral: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional(),
  createdById: z.string().optional(),
  lastUpdatedById: z.string().optional(),
  lateFeePercentage: z.coerce.number().min(0).default(0),
  lateFeeFixedAmount: z.coerce.number().min(0).default(0),
  disbursementDate: z.date().optional(),
  paymentFrequency: z.nativeEnum(PaymentFrequency).default('MONTHLY'),
  loanTags: z.array(tagSchema).optional().default([]),
  riskRating: z.coerce.number().min(1).max(100).optional(),
})

export const loanUpdateSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').optional(),
  amount: z.number().positive('Amount must be a positive number').optional(),
  interestRate: z.number().min(0, 'Interest rate must be a positive number').optional(),
  term: z.number().positive('Loan term must be a positive number').optional(),
  termUnit: z.nativeEnum(LoanTermUnit).optional(),
  startDate: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Start date must be a valid date'
    })
    .optional(),
  endDate: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'End date must be a valid date'
    })
    .optional(),
  status: z.nativeEnum(LoanStatus).optional(),
  borrowerId: z.string().uuid('Invalid borrower ID format').optional(),
  description: z.string().optional(),
  collateral: z.string().optional()
})

export const loanFormSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    amount: z.coerce.number().positive('Amount must be a positive number'),
    interestRate: z.coerce.number().min(0, 'Interest rate must be a positive number'),
    term: z.coerce.number().positive('Loan term must be a positive number'),
    termUnit: z.nativeEnum(LoanTermUnit).default(LoanTermUnit.MONTHS),
    collateral: z.string().optional(),
    startDate: z.date({
      required_error: 'Start date is required'
    }),
    endDate: z.date({
      required_error: 'End date is required'
    }),
    status: z.nativeEnum(LoanStatus),
    purpose: z.string().optional(),
    description: z.string().optional(),
    lenderId: z.string().optional(),
    borrowerId: z.string(),
    isCollateralized: z.boolean().default(false),
    riskRating: z.coerce.number().min(1).max(100).optional(),
    apr: z.coerce.number().min(0).optional(),
    lateFeePercentage: z.coerce.number().min(0).default(0),
    lateFeeFixedAmount: z.coerce.number().min(0).default(0),
    disbursementDate: z.date().optional(),
    paymentFrequency: z.nativeEnum(PaymentFrequency).default('MONTHLY'),
    loanTags: z.array(tagSchema).optional().default([])
  })
  .refine(data => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate']
  })

export const paymentSchema = z.object({
  id: z.string(),
  loanId: z.string(),
  amount: z.number().positive(),
  paymentDate: z.date(),
  dueDate: z.date(),
  paymentNumber: z.number().int().positive(),
  status: z.nativeEnum(RepaymentStatus),
  paymentMethod: z.string().optional(),
  transactionId: z.string().optional(),
  notes: z.string().optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().optional()
})

// Document schema
export const documentSchema = z.object({
  id: z.string(),
  loanId: z.string(),
  fileName: z.string(),
  fileKey: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
  uploadedBy: z.string(),
  uploadedAt: z.date().default(() => new Date()),
  description: z.string().optional(),
  category: z.enum(['LOAN_AGREEMENT', 'COLLATERAL', 'ID_PROOF', 'INCOME_PROOF', 'OTHER'])
})

export type LoanTagValues = z.infer<typeof tagSchema>
export type Payment = z.infer<typeof paymentSchema>
export type Document = z.infer<typeof documentSchema>
export type LoanFormValues = z.infer<typeof loanFormSchema>
