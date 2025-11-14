import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { adminNavItems } from '../../config/navigation'

const adminSummary = {
  name: 'Adminis Astra',
  identifier: 'admin@pixelpirates.dev',
  initials: 'AD',
}

type IssuedCredential = {
  application: string
  clientId: string
  clientSecret: string
  webhookSecret: string
  baseUrl: string
}

const generateToken = (prefix: string) =>
  `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-6)}`

const AdminDidApprovalPage = () => {
  const navigate = useNavigate()
  const [appName, setAppName] = useState('')
  const [issuedCredential, setIssuedCredential] = useState<IssuedCredential | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAuthenticate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = appName.trim()
    if (!trimmed) {
      setError('Please provide an application name before authenticating.')
      return
    }

    setError(null)
    setIssuedCredential({
      application: trimmed,
      clientId: generateToken('client'),
      clientSecret: generateToken('secret'),
      webhookSecret: generateToken('webhook'),
      baseUrl: 'https://api.pixelpirates.dev/v1',
    })
  }

  return (
    <DashboardLayout
      title="Third-Party API · DID Approval"
      subtitle="Review partner integrations requesting automated DID issuance and revocation."
      navItems={adminNavItems}
      user={adminSummary}
      brand={{ initials: 'PP', name: 'Pixel Pirates Admin', tagline: 'Trust Authority' }}
      networkStatus="API Gateway · 99.99% uptime"
      onLogout={() => navigate('/login', { replace: true })}
      statusBanner={
        <>
          <span className="chip">
            <span aria-hidden>🔗</span> Partner APIs
          </span>
          4 active integrations · 1 pending sandbox
        </>
      }
      actions={
        <button
          type="button"
          className="primary-button"
          style={{ width: 'auto', paddingInline: '1.5rem', paddingBlock: '0.8rem' }}
        >
          Approve Sandbox
        </button>
      }
    >
      <article className="surface-card">
        <span className="chip badge-soft">
          <span aria-hidden>🔐</span> Authenticate new integration
        </span>
        <p>Generate credentials for a partner application. Share the keys securely after authentication.</p>
        <form className="input-stack" style={{ marginTop: '1.2rem' }} onSubmit={handleAuthenticate}>
          <div className="input-group">
            <label htmlFor="app-name">Application name</label>
            <input
              id="app-name"
              className="input-field"
              placeholder="e.g. Vega Labs Sandbox"
              value={appName}
              onChange={(event) => setAppName(event.target.value)}
              required
            />
          </div>
          {error ? (
            <p role="alert" style={{ color: '#ff8370', margin: '0.25rem 0 0 0', fontSize: '0.92rem' }}>
              {error}
            </p>
          ) : null}
          <button type="submit" className="primary-button" style={{ width: 'auto', paddingInline: '1.4rem' }}>
            Authenticate
          </button>
        </form>
      </article>

      {issuedCredential ? (
        <article className="surface-card">
          <span className="chip badge-soft">
            <span aria-hidden>📦</span> API credential bundle
          </span>
          <p>
            Provide these credentials to <strong>{issuedCredential.application}</strong>. Credentials are encrypted in
            transit and expire in 24 hours if unused.
          </p>
          <div className="credential-grid">
            <div>
              <h4>Client ID</h4>
              <code>{issuedCredential.clientId}</code>
            </div>
            <div>
              <h4>Client Secret</h4>
              <code>{issuedCredential.clientSecret}</code>
            </div>
            <div>
              <h4>Webhook Secret</h4>
              <code>{issuedCredential.webhookSecret}</code>
            </div>
            <div>
              <h4>Base URL</h4>
              <code>{issuedCredential.baseUrl}</code>
            </div>
          </div>
          <div className="cta-row" style={{ marginTop: '1.5rem' }}>
            <button type="button" className="secondary-button" onClick={() => window.alert('Credentials copied!')}>
              Copy bundle
            </button>
            <button
              type="button"
              className="primary-button"
              style={{ width: 'auto', paddingInline: '1.4rem' }}
              onClick={() => window.alert('Rotation scheduled')}
            >
              Rotate keys
            </button>
          </div>
        </article>
      ) : null}

      <article className="surface-card">
        <span className="chip badge-soft">
          <span aria-hidden>🛰️</span> Connected services
        </span>
        <table className="data-table">
          <thead>
            <tr>
              <th>Partner</th>
              <th>Environment</th>
              <th>Scope</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {[
              { partner: 'Orion Guild DAO', env: 'Production', scope: 'Issue + Revoke', status: 'Active' },
              { partner: 'Vega Labs', env: 'Sandbox', scope: 'Issue only', status: 'Pending approval' },
              { partner: 'Nova Talent', env: 'Production', scope: 'Verify', status: 'Active' },
            ].map((row) => (
              <tr key={`${row.partner}-${row.env}`}>
                <td>{row.partner}</td>
                <td>{row.env}</td>
                <td>{row.scope}</td>
                <td>
                  <span className="chip badge-soft">{row.status}</span>
                </td>
                <td>
                  <div className="cta-row">
                    <button type="button" className="secondary-button">
                      View keys
                    </button>
                    <button type="button" className="secondary-button">
                      Suspend
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <div className="grid-two">
        <article className="surface-card">
          <span className="chip badge-soft">
            <span aria-hidden>📡</span> API usage monitor
          </span>
          <div className="horizontal-list">
            <div className="horizontal-item">
              <div>
                <strong>Requests (24h)</strong>
                <p>2,340 total · 1,890 successes · 12 rate limits.</p>
              </div>
              <span className="chip badge-soft">Stable</span>
            </div>
            <div className="horizontal-item">
              <div>
                <strong>Error rate</strong>
                <p>0.4% · Mostly sandbox credential schema mismatch.</p>
              </div>
              <button type="button" className="secondary-button">
                View logs
              </button>
            </div>
          </div>
        </article>

        <article className="surface-card">
          <span className="chip badge-soft">
            <span aria-hidden>🧪</span> Approval workflow
          </span>
          <div className="timeline" style={{ marginTop: '1.1rem' }}>
            <div className="timeline-card">
              <time>Step 1</time>
              <strong>Policy validation</strong>
              <p>Check DID schema, revocation fallback, and audit compliance.</p>
            </div>
            <div className="timeline-card">
              <time>Step 2</time>
              <strong>Sandbox credential issuance</strong>
              <p>Issue short-lived credential to partner and monitor behaviour.</p>
            </div>
            <div className="timeline-card">
              <time>Step 3</time>
              <strong>Production go-live</strong>
              <p>Promote API keys, enable monitoring hooks, and notify guardians.</p>
            </div>
          </div>
        </article>
      </div>
    </DashboardLayout>
  )
}

export default AdminDidApprovalPage

