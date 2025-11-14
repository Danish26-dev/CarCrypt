/**
 * API Service Layer
 * 
 * This file provides a centralized HTTP client for making API requests.
 * It handles authentication, error handling, and request/response interception.
 */

import { env } from '../config/env'

/**
 * API Error class for handling API-specific errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

/**
 * Request options interface
 */
export interface RequestOptions extends RequestInit {
  timeout?: number
  skipAuth?: boolean
}

/**
 * HTTP Client class
 */
class ApiClient {
  private baseUrl: string
  private timeout: number

  constructor() {
    this.baseUrl = env.apiBaseUrl
    this.timeout = env.apiTimeout
  }

  /**
   * Get authentication token from storage
   */
  private getAuthToken(): string | null {
    // TODO: Implement token retrieval from localStorage or cookie
    return localStorage.getItem('auth_token') || null
  }

  /**
   * Set authentication token in storage
   */
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token)
  }

  /**
   * Remove authentication token from storage
   */
  clearAuthToken(): void {
    localStorage.removeItem('auth_token')
  }

  /**
   * Build headers for API request
   */
  private buildHeaders(options: RequestOptions = {}): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add authorization token if available and not skipped
    if (!options.skipAuth) {
      const token = this.getAuthToken()
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    let data: T
    try {
      data = isJson ? await response.json() : ((await response.text()) as unknown as T)
    } catch (error) {
      throw new ApiError(
        'Failed to parse response',
        response.status,
        response.statusText,
        error
      )
    }

    if (!response.ok) {
      throw new ApiError(
        (data as { message?: string })?.message || response.statusText,
        response.status,
        response.statusText,
        data
      )
    }

    return {
      data,
      status: response.status,
    }
  }

  /**
   * Make HTTP request with timeout
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const timeout = options.timeout || this.timeout

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers: this.buildHeaders(options),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)
      return await this.handleResponse<T>(response)
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'Request Timeout')
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0,
        'Network Error',
        error
      )
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// Export default for convenience
export default apiClient

