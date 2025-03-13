import { LenderEditInput } from '@/schemas/lenderSchema'
import { Lender } from '@prisma/client'
import useSWR from 'swr'

// Define the response type with expanded user data
type LenderWithUser = Lender & {
  user: {
    id: string
    name: string | null
    email: string
    image: string | null
  }
}

type LenderResponse = {
  lenders?: LenderWithUser[]
  lender?: LenderWithUser
  isLoading: boolean
  error: Error
  mutate: () => Promise<LenderWithUser[] | LenderWithUser>
  updateLender: (id: string, data: LenderEditInput) => Promise<LenderWithUser>
}

// Define the fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch lenders')
  }
  return response.json()
}

export function useLenders(id?: string): LenderResponse {
  const url = id ? `/api/lenders/${id}` : '/api/lenders'
  const { data, error, isLoading, mutate } = useSWR(url, fetcher)

  const updateLender = async (id: string, data: LenderEditInput) => {
    const response = await fetch(`/api/lenders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      throw new Error('Failed to update lender')
    }
    return response.json()
  }

  return {
    lenders: id ? undefined : data,
    lender: id ? data : undefined,
    isLoading,
    error,
    mutate,
    updateLender
  }
}
