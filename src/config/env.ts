/**
 * Environment configuration
 * 
 * This file centralizes all environment variables used in the application.
 * Vite requires the VITE_ prefix for environment variables to be exposed to the client.
 */

interface EnvConfig {
  apiBaseUrl: string
  apiTimeout: number
  appName: string
  appEnv: 'development' | 'production' | 'test'
  enableMockApi: boolean
}

/**
 * Get environment variable with a fallback value
 */
function getEnvVar(key: string, fallback: string = ''): string {
  return import.meta.env[key] || fallback
}

/**
 * Get boolean environment variable
 */
function getBooleanEnvVar(key: string, fallback: boolean = false): boolean {
  const value = import.meta.env[key]
  if (value === undefined) return fallback
  return value === 'true' || value === '1'
}

/**
 * Get number environment variable
 */
function getNumberEnvVar(key: string, fallback: number): number {
  const value = import.meta.env[key]
  if (value === undefined) return fallback
  const parsed = Number(value)
  return isNaN(parsed) ? fallback : parsed
}

/**
 * Application environment configuration
 */
export const env: EnvConfig = {
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'http://localhost:3000/api'),
  apiTimeout: getNumberEnvVar('VITE_API_TIMEOUT', 10000),
  appName: getEnvVar('VITE_APP_NAME', 'Pixel Pirates Identity Network'),
  appEnv: (getEnvVar('VITE_APP_ENV', 'development') as EnvConfig['appEnv']) || 'development',
  enableMockApi: getBooleanEnvVar('VITE_ENABLE_MOCK_API', true),
}

/**
 * Check if we're in development mode
 */
export const isDevelopment = env.appEnv === 'development'

/**
 * Check if we're in production mode
 */
export const isProduction = env.appEnv === 'production'

/**
 * Validate that required environment variables are set
 */
export function validateEnv(): void {
  const required: (keyof EnvConfig)[] = ['apiBaseUrl']
  
  const missing: string[] = []
  
  for (const key of required) {
    if (!env[key]) {
      missing.push(key)
    }
  }
  
  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing.join(', '))
  }
}

// Validate environment on import
validateEnv()

