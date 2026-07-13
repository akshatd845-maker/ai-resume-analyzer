import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'sonner'

import { queryClient } from '@/app/providers/query-client'
import { router } from '@/app/router'
import { QueryProvider } from '@/app/providers/query-provider'

import { TooltipProvider } from '@/components/ui/tooltip'
import '@/services/api-client'
import '@/styles/globals.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryProvider client={queryClient}>

        <TooltipProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </QueryProvider>

  </StrictMode>,
)
