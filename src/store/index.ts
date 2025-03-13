import { NODE_ENV } from '@/constants/environments'
import { configureStore } from '@reduxjs/toolkit'

import loansReducer from './slices/loansSlice'

export const store = configureStore({
  reducer: {
    loans: loansReducer
  },
  devTools: NODE_ENV !== 'production'
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
