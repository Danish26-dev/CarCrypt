import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { adminNavItems } from '../../config/navigation'

const adminSummary = {
  name: 'Adminis Astra',
  identifier: 'admin@pixelpirates.dev',
  initials: 'AD',
}

const AdminVcWalletPage = () => {
  const navigate = useNavigate()

  return (
    <DashboardLayout
    title="Verifiable Credentials Wallet"
    subtitle="Review, issue, and revoke credentials held in the decentralized identity registry."
    navItems={adminNavItems}
    user={adminSummary}
    brand={{ initials: 'PP', name: 'Pixel Pirates Admin', tagline: 'Trust Authority' }}
    networkStatus="MongoDB Atlas Primary · Healthy"
      onLogout={() => navigate('/login', { replace: true })}
    statusBanner={
      <>
        <span className="chip">
          <span aria-hidden>🪙</span> VC Authority
        </span>
        Custodian key loaded · 2 pending issuance requests
      </>
    }
    actions={
      <button
        type="button"
        className="primary-button"
        style={{ width: 'auto', paddingInline: '1.5rem', paddingBlock: '0.8rem' }}
      >
        Issue Credential
      </button>
    }
  >
    <article className="surface-card">
      <span className="chip badge-soft">
        <span aria-hidden>📚</span> Credential ledger
      </span>
      <table className="data-table">
        <thead>
          <tr>
            <th>Holder</th>
            <th>Credential</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[
            { holder: 'Craterus Orion', credential: 'Creator Passport', status: 'Active' },
            { holder: 'Lyra Nova', credential: 'DAO Contributor', status: 'Expiring' },
            { holder: 'Orion Guild', credential: 'Verified Partnership', status: 'Revoked' },
          ].map((row) => (
            <tr key={`${row.holder}-${row.credential}`}>
              <td>{row.holder}</td>
              <td>{row.credential}</td>
              <td>
                <span className="chip badge-soft">{row.status}</span>
              </td>
              <td>
                <div className="cta-row">
                  <button type="button" className="secondary-button">
                    View
                  </button>
                  <button type="button" className="secondary-button">
                    Revoke
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
          <span aria-hidden>📝</span> Issuance queue
        </span>
        <div className="timeline" style={{ marginTop: '1.1rem' }}>
          <div className="timeline-card">
            <time>Awaiting approval</time>
            <strong>Creator Passport · Lyra Nova</strong>
            <p>Proofs validated · Requires admin signature.</p>
            <div className="cta-row">
              <button type="button" className="primary-button" style={{ width: 'auto', paddingInline: '1.3rem' }}>
                Approve
              </button>
              <button type="button" className="secondary-button">
                Request edit
              </button>
            </div>
          </div>
          <div className="timeline-card">
            <time>Pending · 2 hours</time>
            <strong>DAO Contributor · Vega Labs</strong>
            <p>Awaiting audit log sign-off before issuance.</p>
            <button type="button" className="secondary-button">
              View details
            </button>
          </div>
        </div>
      </article>

      <article className="surface-card">
        <span className="chip badge-soft">
          <span aria-hidden>🧾</span> Revocation register
        </span>
        <div className="horizontal-list">
          <div className="horizontal-item">
            <div>
              <strong>Revoked credential</strong>
              <p>Orion Guild · Revoked for terms breach.</p>
            </div>
            <button type="button" className="secondary-button">
              View reason
            </button>
          </div>
          <div className="horizontal-item">
            <div>
              <strong>Scheduled revocation</strong>
              <p>Creator Passport · Craterus Orion (pending replacement).</p>
            </div>
            <button type="button" className="secondary-button">
              Finalize
            </button>
          </div>
        </div>
      </article>
    </div>
    </DashboardLayout>
  )
}

export default AdminVcWalletPage

