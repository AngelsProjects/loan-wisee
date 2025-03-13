import { z } from 'zod'

// Loan form schema
export const loanFormSchema = z.object({
  amount: z
    .number({ required_error: 'Amount is required' })
    .positive('Amount must be positive')
    .min(100, 'Amount must be at least 100'),
  interestRate: z
    .number({ required_error: 'Interest rate is required' })
    .positive('Interest rate must be positive')
    .max(100, 'Interest rate cannot exceed 100%'),
  term: z
    .number({ required_error: 'Loan term is required' })
    .int('Term must be a whole number')
    .positive('Term must be positive')
    .min(1, 'Minimum term is 1 month')
    .max(360, 'Maximum term is 360 months (30 years)'),
  startDate: z.date({ required_error: 'Start date is required' }).min(new Date(), 'Start date cannot be in the past'),
  purpose: z.string().max(100, 'Purpose must be 100 characters or less').optional(),
  description: z.string().max(1000, 'Description must be 1000 characters or less').optional(),
  borrowerId: z.string({ required_error: 'Borrower is required' }).min(1, 'Borrower is required')
})

// Repayment form schema
export const repaymentFormSchema = z.object({
  paidAmount: z.number({ required_error: 'Paid amount is required' }).positive('Paid amount must be positive'),
  paidDate: z
    .date({ required_error: 'Payment date is required' })
    .max(new Date(), 'Payment date cannot be in the future')
})

// Document upload schema
export const documentUploadSchema = z.object({
  name: z
    .string({ required_error: 'Document name is required' })
    .min(1, 'Document name is required')
    .max(100, 'Document name must be 100 characters or less'),
  file: z.instanceof(File, { message: 'File is required' })
})

export type LoanFormSchema = z.infer<typeof loanFormSchema>
export type RepaymentFormSchema = z.infer<typeof repaymentFormSchema>
export type DocumentUploadSchema = z.infer<typeof documentUploadSchema>
