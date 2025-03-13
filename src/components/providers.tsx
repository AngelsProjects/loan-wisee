'use client'
import { store } from '@/store'
import { SessionProvider } from 'next-auth/react'
import { Provider as ReduxProvider } from 'react-redux'

import { ThemeProvider } from '@/components/ThemeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </ReduxProvider>
    </SessionProvider>
  )
}
