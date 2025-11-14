import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEmailValid = useMemo(() => {
    if (!email) return false
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase())
  }, [email])

  const isFormValid = isEmailValid && password.length >= 6

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!isFormValid) {
      setError('Enter a valid email, choose a role, and provide a password with at least 6 characters.')
      return
    }

    setError(null)
    setIsSubmitting(true)

    try {
      // Use the auth context to login
      await login(email.trim().toLowerCase(), password, role)

      // Navigate based on role
      if (role === 'admin') {
        navigate('/admin/vc-wallet', { replace: true })
      } else {
        navigate('/user/wallet', { replace: true })
      }
    } catch (err) {
      // Handle errors from the API
      if (err instanceof Error) {
        setError(err.message || 'Failed to login. Please check your credentials and try again.')
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        setError(String(err.message))
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
      console.error('Login error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = () => {
    window.alert('Password recovery flow coming soon. Please contact support@example.com in the meantime.')
  }

  return (
    <div className="page-shell">
      <div className="card">
        <div className="status-banner" role="status">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2.5L3 7.5V16.5L12 21.5L21 16.5V7.5L12 2.5Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.75"
            />
            <path
              d="M9.5 12L11.3 13.8L14.5 10.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Pixel Pirates Identity Network is online · Status: Healthy
        </div>
        <header>
          <h1>Welcome back</h1>
          <p>Sign in to access your decentralized identity dashboards.</p>
        </header>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-stack">
            <div className="input-group">
              <label htmlFor="email">Email or username</label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="input-field"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            <div className="input-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                className="input-field"
                value={role}
                onChange={(event) => setRole(event.target.value as 'user' | 'admin')}
              >
                <option value="user">Creator / User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="action-row">
            <button type="button" className="link-button" onClick={handleForgotPassword}>
              Forgot password?
            </button>
            <Link className="link-button" to="/register">
              Create account
            </Link>
          </div>

          {error ? (
            <p role="alert" style={{ color: '#ff8370', marginTop: '1.25rem', fontSize: '0.92rem' }}>
              {error}
            </p>
          ) : (
            <p style={{ marginTop: '1.25rem', fontSize: '0.92rem', color: 'var(--color-muted)' }}>
              Password must be at least 6 characters long. Choose a role to continue.
            </p>
          )}

          <button type="submit" className="primary-button" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? 'Signing you in…' : 'Login'}
          </button>
        </form>

        <div className="form-helper">
          Need enterprise access?
          <a href="mailto:admin@pixelpirates.dev"> Contact admin</a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

