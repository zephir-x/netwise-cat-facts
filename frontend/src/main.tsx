import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'

// 1. React Query Client
// Initializes the TanStack Query client with global defaults.
// Disabling 'refetchOnWindowFocus' prevents unnecessary API calls when the user switches browser tabs.
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

// 2. Application Bootstrap
// Renders the root React component tree, injecting our global providers.
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            {/* 3. Toast Notifications */}
            {/* Globally registers the Sonner toaster component for beautiful, non-blocking alerts. */}
            <Toaster position="top-center" richColors />
        </QueryClientProvider>
    </StrictMode>,
)