import { LoanStatus, LoanTermUnit, PaymentFrequency } from '@prisma/client'
import { z } from 'zod'

// Loan validation schema with Zod
export const loanSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  interestRate: z.coerce.number().min(0, 'Interest rate cannot be negative'),
  term: z.coerce.number().int().positive('Term must be a positive integer'),
  termUnit: z.nativeEnum(LoanTermUnit),
  collateral: z.string().optional().nullable(),
  startDate: z.date(),
  endDate: z.date(),
  status: z.nativeEnum(LoanStatus).default(LoanStatus.PENDING),
  purpose: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  borrowerId: z.string().min(1, 'Borrower is required'),
  lenderId: z.string().optional().nullable(),
  isCollateralized: z.boolean().default(false),
  riskRating: z.number().int().min(1).max(100).optional().nullable(),
  apr: z.number().min(0).optional().nullable(),
  lateFeePercentage: z.number().min(0).default(0).optional().nullable(),
  lateFeeFixedAmount: z.number().min(0).default(0).optional().nullable(),
  paymentFrequency: z.nativeEnum(PaymentFrequency).default(PaymentFrequency.MONTHLY),
  loanTagIds: z.array(z.string()).optional().default([])
})

export const loanEditSchema = loanSchema.extend({
  id: z.string()
})

// Create a subset schema for search and filtering
export const loanFilterSchema = z.object({
  status: z.nativeEnum(LoanStatus).optional(),
  borrowerId: z.string().optional(),
  lenderId: z.string().optional(),
  minAmount: z.coerce.number().optional(),
  maxAmount: z.coerce.number().optional(),
  startDateFrom: z.date().optional(),
  startDateTo: z.date().optional(),
  loanTagIds: z.array(z.string()).optional()
})

// Type definitions derived from the schema
export type LoanFormValues = z.infer<typeof loanSchema>
export type LoanEditValues = z.infer<typeof loanEditSchema>
export type LoanFilterValues = z.infer<typeof loanFilterSchema>

// Response types for API
export interface Loan {
  id: string
  title: string
  amount: number
  interestRate: number
  term: number
  termUnit: LoanTermUnit
  collateral?: string | null
  startDate: Date
  endDate: Date
  status: LoanStatus
  purpose?: string | null
  description?: string | null
  lenderId?: string | null
  borrowerId: string
  isCollateralized: boolean
  riskRating?: number | null
  apr?: number | null
  lateFeePercentage?: number | null
  lateFeeFixedAmount?: number | null
  disbursementDate?: Date | null
  lastPaymentDate?: Date | null
  totalAmountPaid?: number | null
  nextPaymentDueDate?: Date | null
  remainingBalance?: number | null
  paymentFrequency: PaymentFrequency
  totalInterestAmount?: number | null
  createdAt: Date
  updatedAt: Date
  borrower?: {
    id: string
    userId: string
    user: {
      id: string
      name: string | null
      email: string
    }
  }
  lender?: {
    id: string
    userId: string
    user: {
      id: string
      name: string | null
      email: string
    }
  } | null
  loanTags?: LoanTag[]
}

export interface LoanTag {
  id: string
  name: string
  color?: string | null
}

export interface PaginatedLoans {
  loans: Loan[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Type for calculating payment schedule
export interface RepaymentScheduleItem {
  dueDate: Date
  amount: number
  interestAmount: number
  principalAmount: number
}
