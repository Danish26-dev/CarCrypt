/**
 * Authentication Service
 * 
 * Handles user authentication, registration, and session management.
 */

import apiClient from './api'
import type { ApiResponse } from './api'

/**
 * User role types
 */
export type UserRole = 'user' | 'admin'

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string
  password: string
  role: UserRole
}

/**
 * Registration data
 */
export interface RegisterData {
  email: string
  password: string
  name: string
  role: UserRole
}

/**
 * Auth response
 */
export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: UserRole
    identifier?: string
  }
}

/**
 * User data stored in context
 */
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  identifier?: string
}

/**
 * Authentication service class
 */
class AuthService {
  private readonly TOKEN_KEY = 'auth_token'
  private readonly USER_KEY = 'user_data'

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // If mock API is enabled, simulate login
      if (import.meta.env.VITE_ENABLE_MOCK_API === 'true') {
        return this.mockLogin(credentials)
      }

      const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
      this.setAuthData(response.data)
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // If mock API is enabled, simulate registration
      if (import.meta.env.VITE_ENABLE_MOCK_API === 'true') {
        return this.mockRegister(data)
      }

      const response = await apiClient.post<AuthResponse>('/auth/register', data)
      this.setAuthData(response.data)
      return response.data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    apiClient.clearAuthToken()
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
  }

  /**
   * Get current user from storage
   */
  getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem(this.USER_KEY)
      return userData ? JSON.parse(userData) : null
    } catch {
      return null
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken()
    const user = this.getCurrentUser()
    return !!token && !!user
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || apiClient.getAuthToken()
  }

  /**
   * Set authentication data
   */
  private setAuthData(authData: AuthResponse): void {
    apiClient.setAuthToken(authData.token)
    localStorage.setItem(this.TOKEN_KEY, authData.token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user))
  }

  /**
   * Mock login for development
   */
  private async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 900))

    // Mock validation
    if (credentials.email && credentials.password.length >= 6) {
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: credentials.role === 'admin' ? 'Adminis Astra' : 'Craterus Orion',
        role: credentials.role,
        identifier:
          credentials.role === 'admin'
            ? 'admin@pixelpirates.dev'
            : 'DID:did:ppn:3fa::9z9',
      }

      const mockToken = `mock_token_${Date.now()}`

      const response: AuthResponse = {
        token: mockToken,
        user: mockUser,
      }

      this.setAuthData(response)
      return response
    }

    throw new Error('Invalid credentials')
  }

  /**
   * Mock registration for development
   */
  private async mockRegister(data: RegisterData): Promise<AuthResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock validation
    if (data.email && data.password.length >= 6 && data.name) {
      const mockUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: data.role,
        identifier: data.role === 'admin' ? data.email : `DID:did:ppn:${Date.now()}`,
      }

      const mockToken = `mock_token_${Date.now()}`

      const response: AuthResponse = {
        token: mockToken,
        user: mockUser,
      }

      this.setAuthData(response)
      return response
    }

    throw new Error('Invalid registration data')
  }
}

// Export singleton instance
export const authService = new AuthService()

// Export default for convenience
export default authService

