import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '../App'
import { AuthProvider } from '../context/AuthContext'
import { ToastProvider } from '../context/ToastContext'

// builds an unsigned token that looks like the ones the backend issues
export function fakeToken(payload) {
  const encode = (value) => btoa(JSON.stringify(value)).replace(/=/g, '')
  const body = { exp: Math.floor(Date.now() / 1000) + 3600, ...payload }
  return `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode(body)}.signature`
}

export function renderApp(route = '/') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}
