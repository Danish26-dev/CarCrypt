import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { adminNavItems } from '../../config/navigation'

const adminSummary = {
  name: 'Adminis Astra',
  identifier: 'admin@pixelpirates.dev',
  initials: 'AD',
}

const AdminAuditLogsPage = () => {
  const navigate = useNavigate()

  return (
    <DashboardLayout
    title="Transparent Audit Logs"
    subtitle="Trace every credential lifecycle event across MongoDB and Cardano ledgers."
    navItems={adminNavItems}
    user={adminSummary}
    brand={{ initials: 'PP', name: 'Pixel Pirates Admin', tagline: 'Trust Authority' }}
    networkStatus="MongoDB Oplog · Streaming"
      onLogout={() => navigate('/login', { replace: true })}
    statusBanner={
      <>
        <span className="chip">
          <span aria-hidden>📜</span> Immutable ledger
        </span>
        128 events recorded in last 24h · 0 tampering attempts
      </>
    }
    actions={
      <button
        type="button"
        className="secondary-button"
        style={{ width: 'auto', paddingInline: '1.3rem', paddingBlock: '0.75rem' }}
      >
        Export JSON
      </button>
    }
  >
    <div className="grid-two">
      <article className="surface-card">
        <span className="chip badge-soft">
          <span aria-hidden>🧭</span> Live feed
        </span>
        <div className="timeline" style={{ marginTop: '1.1rem', maxHeight: '320px', overflowY: 'auto' }}>
          {[
            {
              time: 'Now',
              title: 'VC issuance signed',
              description: 'Creator Passport · DID did:ppn:craterus:493 issued by Adminis Astra.',
            },
            {
              time: '2 mins ago',
              title: 'MongoDB sync',
              description: 'ipfsSyncQueue processed 4 items · audit hash stored.',
            },
            {
              time: '9 mins ago',
              title: 'Guardian approval',
              description: 'Multi-sig guardians confirmed DID rotation.',
            },
            {
              time: '15 mins ago',
              title: 'Revocation event',
              description: 'Orion Guild VC revoked · reason: policy violation.',
            },
          ].map((entry) => (
            <div className="timeline-card" key={entry.title}>
              <time>{entry.time}</time>
              <strong>{entry.title}</strong>
              <p>{entry.description}</p>
            </div>
          ))}
        </div>
      </article>

      <article className="surface-card">
        <span className="chip badge-soft">
          <span aria-hidden>🛡️</span> Integrity checks
        </span>
        <div className="horizontal-list">
          <div className="horizontal-item">
            <div>
              <strong>Chain anchoring</strong>
              <p>Latest Merkle root anchored 8 minutes ago.</p>
            </div>
            <span className="chip badge-soft">Verified</span>
          </div>
          <div className="horizontal-item">
            <div>
              <strong>Hash divergence</strong>
              <p>No mismatches detected between MongoDB snapshots and IPFS pins.</p>
            </div>
            <span className="chip badge-soft">Clean</span>
          </div>
          <div className="horizontal-item">
            <div>
              <strong>Access control</strong>
              <p>3 admin logins · 0 failed attempts today.</p>
            </div>
            <button type="button" className="secondary-button">
              View sessions
            </button>
          </div>
        </div>
      </article>
    </div>

    <article className="surface-card">
      <span className="chip badge-soft">
        <span aria-hidden>📊</span> Analytics snapshot
      </span>
      <div className="horizontal-list">
        <div className="horizontal-item">
          <div>
            <strong>Event volume</strong>
            <p>128 events (24h) · 17 issuance · 6 revocations · 42 IPFS syncs.</p>
          </div>
          <button type="button" className="secondary-button">
            View chart
          </button>
        </div>
        <div className="horizontal-item">
          <div>
            <strong>Audit API</strong>
            <p>Webhook subscribers: 5 · Last delivery latency: 320ms.</p>
          </div>
          <span className="chip badge-soft">Operational</span>
        </div>
      </div>
    </article>
    </DashboardLayout>
  )
}

export default AdminAuditLogsPage

