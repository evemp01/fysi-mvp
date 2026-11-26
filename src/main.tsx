import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import { RouterProvider } from 'react-router'
import { router } from './router'
import { AppProvider } from './state/AppProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Puts .dark on <html> and sets color-scheme, which drives the light-dark() palette. */}
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme disableTransitionOnChange>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </ThemeProvider>
  </StrictMode>,
)
