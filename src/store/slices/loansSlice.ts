import { LoanFormValues, LoanTagValues } from '@/schemas/loanSchema'
import { Document, RepaymentItem } from '@prisma/client'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { Loan, LoanEditValues, LoanFilterValues, PaginatedLoans } from '@/types/loan'

// Define the initial state
interface LoansState {
  loans: Loan[]
  loanTags: LoanTagValues[]
  currentLoan: (Loan & { documents?: Document[]; repaymentSchedule?: RepaymentItem[]; notes?: string }) | null
  isLoading: boolean
  error: string | null
  totalLoans: number
  currentPage: number
  totalPages: number
  limit: number
  filters: LoanFilterValues
}

const initialState: LoansState = {
  loans: [],
  currentLoan: null,
  isLoading: false,
  error: null,
  totalLoans: 0,
  currentPage: 1,
  totalPages: 1,
  limit: 10,
  filters: {},
  loanTags: []
}

// Async thunks for API operations
export const fetchLoans = createAsyncThunk(
  'loans/fetchLoans',
  async (
    { page = 1, limit = 10, filters = {} }: { page?: number; limit?: number; filters?: LoanFilterValues },
    { rejectWithValue }
  ) => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })

      // Add filters to query params
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.borrowerId) queryParams.append('borrowerId', filters.borrowerId)
      if (filters.lenderId) queryParams.append('lenderId', filters.lenderId)
      if (filters.minAmount) queryParams.append('minAmount', filters.minAmount.toString())
      if (filters.maxAmount) queryParams.append('maxAmount', filters.maxAmount.toString())
      if (filters.startDateFrom) queryParams.append('startDateFrom', filters.startDateFrom.toISOString())
      if (filters.startDateTo) queryParams.append('startDateTo', filters.startDateTo.toISOString())
      if (filters.loanTagIds?.length) {
        filters.loanTagIds.forEach(tagId => queryParams.append('loanTagIds', tagId))
      }

      const response = await fetch(`/api/loans?${queryParams}`)
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to fetch loans')
      }

      const data: PaginatedLoans = await response.json()
      return data
    } catch (error) {
      return rejectWithValue((error as Error).message || 'An unknown error occurred')
    }
  }
)

export const fetchLoanById = createAsyncThunk('loans/fetchLoanById', async (id: string, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/loans/${id}`)
    if (!response.ok) {
      const errorData = await response.json()
      return rejectWithValue(errorData.message || 'Failed to fetch loan')
    }

    const data: Loan = await response.json()
    return data
  } catch (error) {
    return rejectWithValue((error as Error).message || 'An unknown error occurred')
  }
})

export const createLoan = createAsyncThunk(
  'loans/createLoan',
  async (loanData: LoanFormValues, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loanData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to create loan')
      }

      const data: Loan = await response.json()
      return data
    } catch (error) {
      return rejectWithValue((error as Error).message || 'An unknown error occurred')
    }
  }
)

export const updateLoan = createAsyncThunk(
  'loans/updateLoan',
  async (loanData: LoanEditValues, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/loans/${loanData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loanData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to update loan')
      }

      const data: Loan = await response.json()
      return data
    } catch (error) {
      return rejectWithValue((error as Error).message || 'An unknown error occurred')
    }
  }
)

export const deleteLoan = createAsyncThunk('loans/deleteLoan', async (id: string, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/loans/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const errorData = await response.json()
      return rejectWithValue(errorData.message || 'Failed to delete loan')
    }

    return id
  } catch (error) {
    return rejectWithValue((error as Error).message || 'An unknown error occurred')
  }
})

export const createLoanTag = createAsyncThunk(
  'loans/createLoanTag',
  async (tagData: { name: string; color?: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/loan-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tagData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Failed to create loan tag')
      }

      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue((error as Error).message || 'An unknown error occurred')
    }
  }
)

export const fetchLoanTags = createAsyncThunk('loans/fetchLoanTags', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/loan-tags')
    if (!response.ok) {
      const errorData = await response.json()
      return rejectWithValue(errorData.message || 'Failed to fetch loan tags')
    }

    const data = await response.json()
    return data
  } catch (error) {
    return rejectWithValue((error as Error).message || 'An unknown error occurred')
  }
})

// Create the loans slice
const loansSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<LoanFilterValues>) => {
      state.filters = action.payload
    },
    clearFilters: state => {
      state.filters = {}
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload
    },
    clearCurrentLoan: state => {
      state.currentLoan = null
    }
  },
  extraReducers: builder => {
    builder
      // Handle fetchLoans
      .addCase(fetchLoans.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.isLoading = false
        state.loans = action.payload.loans
        state.totalLoans = action.payload.total
        state.currentPage = action.payload.page
        state.totalPages = action.payload.totalPages
        state.limit = action.payload.limit
      })
      .addCase(fetchLoans.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Handle fetchLoanById
      .addCase(fetchLoanById.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLoanById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentLoan = action.payload
      })
      .addCase(fetchLoanById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Handle createLoan
      .addCase(createLoan.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createLoan.fulfilled, (state, action) => {
        state.isLoading = false
        state.loans = [action.payload, ...state.loans]
        state.currentLoan = action.payload
        state.totalLoans += 1
      })
      .addCase(createLoan.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Handle updateLoan
      .addCase(updateLoan.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateLoan.fulfilled, (state, action) => {
        state.isLoading = false
        state.loans = state.loans.map(loan => (loan.id === action.payload.id ? action.payload : loan))
        state.currentLoan = action.payload
      })
      .addCase(updateLoan.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Handle deleteLoan
      .addCase(deleteLoan.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteLoan.fulfilled, (state, action) => {
        state.isLoading = false
        state.loans = state.loans.filter(loan => loan.id !== action.payload)
        if (state.currentLoan?.id === action.payload) {
          state.currentLoan = null
        }
        state.totalLoans -= 1
      })
      .addCase(deleteLoan.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Handle createLoanTag
      .addCase(createLoanTag.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createLoanTag.fulfilled, (state, action) => {
        state.loanTags = [action.payload, ...state.loanTags]
        state.isLoading = false
      })
      .addCase(createLoanTag.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // Handle fetchLoanTags
      .addCase(fetchLoanTags.pending, state => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLoanTags.fulfilled, (state, action) => {
        state.isLoading = false
        state.loanTags = action.payload
      })
      .addCase(fetchLoanTags.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  }
})

export const { setFilters, clearFilters, setPage, setLimit, clearCurrentLoan } = loansSlice.actions
export default loansSlice.reducer
