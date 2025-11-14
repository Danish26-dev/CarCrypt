import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { userNavItems } from '../../config/navigation'
import { useUserData } from '../../context/UserDataContext'

const userSummary = {
  name: 'Craterus Orion',
  identifier: 'DID:did:ppn:3fa::9z9',
  initials: 'CR',
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

const UserIdentityHealthPage = () => {
  const navigate = useNavigate()
  const { documents } = useUserData()

  const score = useMemo(() => {
    const baseScore = 80
    const documentBonus = Math.min(20, documents.length * 4)
    return baseScore + documentBonus
  }, [documents])

  return (
    <DashboardLayout
      title="Identity Health Score"
      subtitle="Assess the trust posture across verifiable credentials, sybil resistance, and DID lifecycle."
      navItems={userNavItems}
      user={userSummary}
      onLogout={() => navigate('/login', { replace: true })}
      statusBanner={
        <>
          <span className="chip">
            <span aria-hidden>🧭</span> Trusted Tier
          </span>
          Zero unresolved alerts · {documents.length + 12} verified proofs · 4 multi-sig guardians
        </>
      }
    >
      <div className="grid-two">
        <article className="surface-card" style={{ alignItems: 'center', textAlign: 'center' }}>
          <span className="chip">
            <span aria-hidden>📈</span> Current score
          </span>
          <div className="score-ring">
            <svg width="140" height="140">
              <circle cx="70" cy="70" r="62" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="transparent" />
              <circle
                cx="70"
                cy="70"
                r="62"
                stroke="url(#identityScoreGradient)"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${score * 3.89} ${390 - score * 3.89}`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="identityScoreGradient" gradientTransform="rotate(90)">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#39c6ff" />
                </linearGradient>
              </defs>
            </svg>
            <strong>{score}</strong>
            <span>{score >= 90 ? 'Prime' : 'Trusted'}</span>
          </div>
          <p>
            Maintain regular credential refreshes and DID rotations to keep your score above {Math.max(80, score - 4)}.
          </p>
          <div className="cta-row">
            <button type="button" className="primary-button" style={{ width: 'auto', paddingInline: '1.35rem' }}>
              Export Scorecard
            </button>
            <button type="button" className="secondary-button">
              Send to Partner
            </button>
          </div>
        </article>

        <article className="surface-card">
          <span className="chip badge-soft">
            <span aria-hidden>🧷</span> Risk indicators
          </span>
          <div className="horizontal-list">
            <div className="horizontal-item">
              <div>
                <strong>Credential freshness</strong>
                <p>
                  {documents.length + 11} of {documents.length + 12} VCs refreshed in last 60 days.
                </p>
              </div>
              <span className="chip badge-soft">{documents.length > 0 ? 'Improving' : 'Healthy'}</span>
            </div>
            <div className="horizontal-item">
              <div>
                <strong>Sybil resistance</strong>
                <p>Multi-sig guardians active · 0 flagged anomalies.</p>
              </div>
              <span className="chip badge-soft">Low risk</span>
            </div>
            <div className="horizontal-item">
              <div>
                <strong>Credential proofs</strong>
                <p>{documents.length} newly submitted documents awaiting review.</p>
              </div>
              <button type="button" className="secondary-button">
                Review
              </button>
            </div>
          </div>
        </article>
      </div>

      <article className="surface-card">
        <span className="chip badge-soft">
          <span aria-hidden>📁</span> Uploaded credential bundles
        </span>
        {documents.length === 0 ? (
          <p style={{ color: 'var(--color-muted)' }}>
            Upload credential PDFs from the Decentralized Identity Wallet to boost your identity health score.
          </p>
        ) : (
          <table className="data-table" style={{ marginTop: '1.25rem' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Uploaded</th>
                <th>Open</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.name}</td>
                  <td>{Math.round(doc.size / 1024)} KB</td>
                  <td>{formatDate(doc.uploadedAt)}</td>
                  <td>
                    <a className="subtle-link" href={doc.objectUrl} target="_blank" rel="noopener noreferrer">
                      View PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </article>

      <article className="surface-card">
        <span className="chip badge-soft">
          <span aria-hidden>🧪</span> Improvements
        </span>
        <div className="timeline" style={{ marginTop: '1.2rem' }}>
          <div className="timeline-card">
            <time>Suggested · Today</time>
            <strong>Link legacy creator account</strong>
            <p>Import credential proofs from legacy platform to increase reputation weight.</p>
            <button type="button" className="secondary-button">
              Begin Import
            </button>
          </div>
          <div className="timeline-card">
            <time>Scheduled · Tomorrow</time>
            <strong>Guardian confirmation ceremony</strong>
            <p>Ensure three guardians acknowledge the new DID binding.</p>
            <button
              type="button"
              className="primary-button"
              style={{ width: 'auto', paddingInline: '1.25rem', paddingBlock: '0.7rem' }}
            >
              Start Ceremony
            </button>
          </div>
        </div>
      </article>
    </DashboardLayout>
  )
}

export default UserIdentityHealthPage

