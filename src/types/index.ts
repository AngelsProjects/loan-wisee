import { Loan, RepaymentItem, User } from '@prisma/client'

// Extended types for frontend use
export type LoanWithRelations = Loan & {
  lender: User
  borrower: User
  repaymentSchedule?: RepaymentItem[]
}

export interface LoanFormData {
  amount: number
  interestRate: number
  term: number
  startDate: Date
  purpose?: string
  description?: string
  borrowerId: string
}

export interface RepaymentFormData {
  paidAmount: number
  paidDate: Date
}

export type UserRole = 'USER' | 'ADMIN' | 'LENDER'

export type SessionUser = {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: UserRole
}

// These match the Prisma enums but are used in the frontend
export const LOAN_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  DEFAULTED: 'DEFAULTED',
  REJECTED: 'REJECTED'
} as const

export const REPAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  LATE: 'LATE',
  DEFAULTED: 'DEFAULTED'
} as const

export type LoanStatusKeys = keyof typeof LOAN_STATUS
export type RepaymentStatusKeys = keyof typeof REPAYMENT_STATUS

// API response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Redux state types
export interface LoansState {
  loans: LoanWithRelations[]
  currentLoan: LoanWithRelations | null
  isLoading: boolean
  error: string | null
}
