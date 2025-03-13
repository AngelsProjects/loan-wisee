import { useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { LoanFormValues, LoanTagValues } from '@/schemas/loanSchema'
import { AppDispatch, RootState } from '@/store'
import {
  clearCurrentLoan,
  clearFilters,
  createLoan,
  createLoanTag,
  deleteLoan,
  fetchLoanById,
  fetchLoanTags,
  fetchLoans,
  setFilters,
  setLimit,
  setPage,
  updateLoan
} from '@/store/slices/loansSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import { Loan, LoanEditValues, LoanFilterValues } from '@/types/loan'

export const useLoan = () => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const { loans, currentLoan, isLoading, error, totalLoans, currentPage, totalPages, limit, filters, loanTags } =
    useSelector((state: RootState) => state.loans)

  // Fetch loans with pagination and filters
  const getLoans = useCallback(
    (page?: number, pageLimit?: number, filterValues?: LoanFilterValues) => {
      dispatch(
        fetchLoans({
          page: page || currentPage,
          limit: pageLimit || limit,
          filters: filterValues || filters
        })
      )
    },
    [dispatch, currentPage, limit, filters]
  )

  // Fetch a single loan by ID
  const getLoanById = useCallback(
    (id: string) => {
      return dispatch(fetchLoanById(id))
    },
    [dispatch]
  )

  // Create a new loan
  const addLoan = useCallback(
    async (loanData: LoanFormValues) => {
      try {
        const resultAction = await dispatch(createLoan(loanData))
        if (createLoan.fulfilled.match(resultAction)) {
          toast.success('Loan created successfully')
          router.push(`/loans/${resultAction.payload.id}`)
          return resultAction.payload
        } else {
          throw new Error('Failed to create loan')
        }
      } catch (error) {
        toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to create loan'}`)
        return null
      }
    },
    [dispatch, router]
  )

  // Update an existing loan
  const editLoan = useCallback(
    async (loanData: LoanEditValues) => {
      try {
        const resultAction = await dispatch(updateLoan(loanData))
        if (updateLoan.fulfilled.match(resultAction)) {
          toast.success('Loan updated successfully')
          return resultAction.payload
        } else {
          throw new Error('Failed to update loan')
        }
      } catch (error) {
        toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to update loan'}`)
        return null
      }
    },
    [dispatch]
  )

  // Delete a loan
  const removeLoan = useCallback(
    async (id: string) => {
      try {
        const resultAction = await dispatch(deleteLoan(id))
        if (deleteLoan.fulfilled.match(resultAction)) {
          toast.success('Loan deleted successfully')
          router.push('/loans')
          return true
        } else {
          throw new Error('Failed to delete loan')
        }
      } catch (error) {
        toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to delete loan'}`)
        return false
      }
    },
    [dispatch, router]
  )

  const getLoanTags = useCallback(() => {
    dispatch(fetchLoanTags())
  }, [dispatch])

  const addLoanTag = useCallback(
    async (tagData: LoanTagValues) => {
      try {
        const resultAction = await dispatch(createLoanTag(tagData))
        if (createLoanTag.fulfilled.match(resultAction)) {
          toast.success('Tag created successfully')
          return resultAction.payload
        } else {
          throw new Error('Failed to create tag')
        }
      } catch (error) {
        toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to create tag'}`)
        return null
      }
    },
    [dispatch]
  )

  // Update filters
  const updateFilters = useCallback(
    (newFilters: LoanFilterValues) => {
      dispatch(setFilters(newFilters))
      dispatch(setPage(1)) // Reset to first page when filters change
    },
    [dispatch]
  )

  // Reset filters
  const resetFilters = useCallback(() => {
    dispatch(clearFilters())
    dispatch(setPage(1))
  }, [dispatch])

  // Update pagination
  const changePage = useCallback(
    (page: number) => {
      dispatch(setPage(page))
    },
    [dispatch]
  )

  const changeLimit = useCallback(
    (newLimit: number) => {
      dispatch(setLimit(newLimit))
      dispatch(setPage(1)) // Reset to first page when limit changes
    },
    [dispatch]
  )

  // Clear current loan
  const clearLoan = useCallback(() => {
    dispatch(clearCurrentLoan())
  }, [dispatch])

  // Calculate remaining balance
  const calculateRemainingBalance = useCallback((loan: Loan): number => {
    const totalAmount = loan.amount + (loan.totalInterestAmount || 0)
    return totalAmount - (loan.totalAmountPaid || 0)
  }, [])

  return {
    // State
    loans,
    loanTags,
    currentLoan,
    isLoading,
    error,
    totalLoans,
    currentPage,
    totalPages,
    limit,
    filters,

    // Actions
    getLoans,
    getLoanById,
    addLoan,
    editLoan,
    removeLoan,
    updateFilters,
    resetFilters,
    changePage,
    changeLimit,
    clearLoan,
    calculateRemainingBalance,
    getLoanTags,
    addLoanTag
  }
}
