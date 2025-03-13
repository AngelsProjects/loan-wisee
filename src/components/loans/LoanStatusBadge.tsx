import { LoanStatus } from '@prisma/client'

import { Badge } from '@/components/ui/badge'

interface LoanStatusBadgeProps {
  status: LoanStatus
}

export default function LoanStatusBadge({ status }: LoanStatusBadgeProps) {
  const getStatusVariant = () => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
      case 'DEFAULTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
      case 'REJECTED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
      case 'RESTRUCTURED':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
      case 'IN_REVIEW':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
    }
  }

  const formatStatus = (status: LoanStatus) => {
    return status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')
  }

  return <Badge className={getStatusVariant()}>{formatStatus(status)}</Badge>
}
