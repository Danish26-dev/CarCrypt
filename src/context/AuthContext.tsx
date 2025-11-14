/**
 * Authentication Context
 * 
 * Provides authentication state and methods throughout the application.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { authService, type User } from '../services/auth'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string, role: 'user' | 'admin') => Promise<void>
  logout: () => void
  refreshUser: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Load user from storage on mount
   */
  useEffect(() => {
    const loadUser = () => {
      try {
        const currentUser = authService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Error loading user:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  /**
   * Login user
   */
  const login = useCallback(async (email: string, password: string, role: 'user' | 'admin') => {
    try {
      const response = await authService.login({ email, password, role })
      setUser(response.user)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }, [])

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
  }, [])

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user && authService.isAuthenticated(),
    isLoading,
    login,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

