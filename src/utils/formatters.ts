import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

// Extend dayjs with plugins
dayjs.extend(relativeTime)

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// Format percentage
export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100)
}

// Format date
export const formatDate = (date: Date | string): string => {
  return dayjs(date).format('MMM D, YYYY')
}

// Format date with time
export const formatDateTime = (date: Date | string): string => {
  return dayjs(date).format('MMM D, YYYY h:mm A')
}

// Format relative time (e.g., "2 days ago")
export const formatRelativeTime = (date: Date | string): string => {
  return dayjs(date).fromNow()
}

// Calculate loan monthly payment
export const calculateMonthlyPayment = (principal: number, annualInterestRate: number, termMonths: number): number => {
  // Convert annual interest rate to monthly (and from percentage to decimal)
  const monthlyRate = annualInterestRate / 100 / 12

  // Special case: if interest rate is 0, just divide principal by term
  if (monthlyRate === 0) return principal / termMonths

  // Standard loan payment formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1)

  return payment
}

// Generate repayment schedule
export const generateRepaymentSchedule = (
  principal: number,
  annualInterestRate: number,
  termMonths: number,
  startDate: Date
): Array<{
  paymentNumber: number
  paymentDate: Date
  paymentAmount: number
  principalPaid: number
  interestPaid: number
  remainingBalance: number
}> => {
  const monthlyRate = annualInterestRate / 100 / 12
  const monthlyPayment = calculateMonthlyPayment(principal, annualInterestRate, termMonths)
  let balance = principal
  const schedule = []

  for (let i = 1; i <= termMonths; i++) {
    const interestPaid = balance * monthlyRate
    const principalPaid = monthlyPayment - interestPaid
    balance -= principalPaid

    // Handle potential floating point errors for final payment
    if (i === termMonths) {
      balance = 0
    }

    // Calculate payment date by adding months to start date
    const paymentDate = dayjs(startDate).add(i, 'month').toDate()

    schedule.push({
      paymentNumber: i,
      paymentDate,
      paymentAmount: monthlyPayment,
      principalPaid,
      interestPaid,
      remainingBalance: balance >= 0 ? balance : 0
    })
  }

  return schedule
}
