import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AuthContext } from './authContext'
import { decodeToken } from '../utils/jwt'

function readStoredToken() {
  const token = localStorage.getItem('token')

  if (token && !decodeToken(token)) {
    localStorage.removeItem('token')
    return null
  }

  return token
}

export function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState(readStoredToken)

  const user = useMemo(() => decodeToken(token), [token])

  const login = useCallback((newToken) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    queryClient.clear()
  }, [queryClient])

  useEffect(() => {
    window.addEventListener('auth:expired', logout)
    return () => window.removeEventListener('auth:expired', logout)
  }, [logout])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      login,
      logout,
      hasRole: (...roles) => roles.includes(user?.role),
    }),
    [user, token, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
