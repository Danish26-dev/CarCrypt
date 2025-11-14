import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { userNavItems } from '../../config/navigation'

const userSummary = {
  name: 'Craterus Orion',
  identifier: 'DID:did:ppn:3fa::9z9',
  initials: 'CR',
}

const UserIpfsPage = () => {
  const navigate = useNavigate()

  return (
    <DashboardLayout
    title="IPFS Integration"
    subtitle="Sync decentralized assets, credential bundles, and audit snapshots across the mesh."
    navItems={userNavItems}
    user={userSummary}
      onLogout={() => navigate('/login', { replace: true })}
    statusBanner={
      <>
        <span className="chip">
          <span aria-hidden>🗂️</span> Pin cluster · Stable
        </span>
        4/4 peers online · DAO gateway mirrored · MongoDB watcher ready
      </>
    }
    actions={
      <button
        type="button"
        className="primary-button"
        style={{ width: 'auto', paddingInline: '1.5rem', paddingBlock: '0.8rem' }}
        onClick={() => window.alert('Triggering IPFS sync...')}
      >
        Trigger Sync
      </button>
    }
  >
    <div className="grid-two">
      <article className="surface-card">
        <span className="chip">
          <span aria-hidden>🚀</span> Latest deployments
        </span>
        <div className="timeline" style={{ marginTop: '1.2rem' }}>
          {[
            {
              time: 'Synced · 5 minutes ago',
              title: 'Creative Asset Pack #19',
              description: 'IPFS CID: bafybeidz42sm...t2v · mirrored to Cardano Backpack.',
            },
            {
              time: 'Queued · 12 minutes ago',
              title: 'Identity proof bundle',
              description: 'Awaiting node quorum · 3 of 5 peers pinned.',
            },
            {
              time: 'Failed · 30 minutes ago',
              title: 'Public gallery manifest',
              description: 'Retry scheduled · network throttle detected.',
            },
          ].map((item) => (
            <div className="timeline-card" key={item.title}>
              <time>{item.time}</time>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        <div className="cta-row">
          <button type="button" className="secondary-button">
            View Pin Logs
          </button>
          <a className="subtle-link" href="#">
            Open IPFS Gateway →
          </a>
        </div>
      </article>

      <article className="surface-card">
        <span className="chip badge-soft">
          <span aria-hidden>🧰</span> Node configuration
        </span>
        <div className="horizontal-list">
          <div className="horizontal-item">
            <div>
              <strong>Replication factor</strong>
              <p>Primary pinset mirrored across 4 geographic peers.</p>
            </div>
            <span className="chip badge-soft">Target · 4</span>
          </div>
          <div className="horizontal-item">
            <div>
              <strong>Garbage collection</strong>
              <p>Runs every 12 hours · next sweep in 3h 12m.</p>
            </div>
            <button type="button" className="secondary-button">
              Run now
            </button>
          </div>
          <div className="horizontal-item">
            <div>
              <strong>MongoDB watcher</strong>
              <p>Listening for `ipfsSyncQueue` updates · 7 items queued.</p>
            </div>
            <span className="chip badge-soft">Active</span>
          </div>
        </div>
      </article>
    </div>

    <article className="surface-card">
      <span className="chip badge-soft">
        <span aria-hidden>🧬</span> Credential storage
      </span>
      <p>
        Every VC is stored as encrypted JSON, pinned to IPFS, and referenced by MongoDB. Use the hash registry to
        validate on-chain.
      </p>
      <table className="data-table">
        <thead>
          <tr>
            <th>Credential</th>
            <th>CID</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {[
            { credential: 'DAO Contributor VC', cid: 'bafybeif64...0kq', status: 'Pinned' },
            { credential: 'Creator Passport VC', cid: 'bafybeiaz1...wp5', status: 'Re-pinning' },
            { credential: 'Identity Snapshot', cid: 'bafybeid91...b0f', status: 'Queued' },
          ].map((row) => (
            <tr key={row.cid}>
              <td>{row.credential}</td>
              <td>{row.cid}</td>
              <td>
                <span className="chip badge-soft">{row.status}</span>
              </td>
              <td>
                <button type="button" className="secondary-button">
                  Copy CID
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
    </DashboardLayout>
  )
}

export default UserIpfsPage

