import { useRef, useState, useMemo } from 'react'
import type { FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { userNavItems } from '../../config/navigation'
import { useUserData } from '../../context/UserDataContext'
import { useAuth } from '../../context/AuthContext'
import type { DidHistoryEntry } from '../../context/UserDataContext'

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
})

const UserWalletPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const historySectionRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { didHistory, addDidEntry, addDocument } = useUserData()
  const [nickname, setNickname] = useState('')
  const [controller, setController] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null)

  // Get user summary from auth context or use defaults
  const userSummary = useMemo(() => {
    if (user) {
      const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
      return {
        name: user.name,
        identifier: user.identifier || user.email,
        initials: initials || 'U',
      }
    }
    return {
      name: 'Craterus Orion',
      identifier: 'DID:did:ppn:3fa::9z9',
      initials: 'CR',
    }
  }, [user])

  // Handle logout
  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleAddDid = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedController = controller.trim()
    if (!trimmedController) {
      setFeedback('Controller DID is required before we can register it.')
      return
    }

    const normalisedController = trimmedController.startsWith('did:')
      ? trimmedController
      : `did:ppn:${trimmedController}`
    const nicknameLabel = nickname.trim() || 'Unnamed DID'
    const timestamp = new Date()

    const newEntry: DidHistoryEntry = {
      id: `did-${timestamp.getTime()}`,
      time: `Just now · ${timeFormatter.format(timestamp)}`,
      title: `Added ${normalisedController}`,
      description: `${nicknameLabel} anchored · awaiting MongoDB replication and IPFS pinning.`,
    }

    addDidEntry(newEntry)
    setFeedback(`DID ${normalisedController} queued for registration.`)
    setNickname('')
    setController('')

    window.setTimeout(() => {
      historySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 150)
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (file.type !== 'application/pdf') {
      setUploadFeedback('Only PDF files are supported at this time.')
      event.target.value = ''
      return
    }

    addDocument(file)
    setUploadFeedback(`Uploaded ${file.name} (${Math.round(file.size / 1024)} KB) successfully.`)
    event.target.value = ''
  }

  return (
    <DashboardLayout
      title="Decentralized Identity Wallet"
      subtitle="Manage your DID connections, credential backups, and storage sync with Cardano Backpack."
      navItems={userNavItems}
      user={userSummary}
      onLogout={handleLogout}
      statusBanner={
        <>
          <span className="chip">
            <span aria-hidden>🛰️</span> Live Pairing
          </span>
          Backpack vault synchronized 3 minutes ago · MongoDB state replicated
        </>
      }
      actions={
        <button
          type="button"
          className="primary-button"
          style={{ width: 'auto', paddingInline: '1.5rem', paddingBlock: '0.8rem' }}
          onClick={() => window.alert('Backup synced!')}
        >
          Sync Backup Now
        </button>
      }
    >
      <div className="grid-two">
        <article className="surface-card">
          <span className="chip">
            <span aria-hidden>🔐</span> Active Wallet
          </span>
          <h3>Cardano Backpack · Creator Vault</h3>
          <p>Your wallet is bonded to Pixel Pirates identity services. You can add or revoke DIDs instantly.</p>
          <div className="horizontal-item" style={{ background: 'rgba(57, 198, 255, 0.08)' }}>
            <strong>Wallet Status</strong>
            <span className="chip badge-soft">Connected · 2 minutes ago</span>
          </div>
          <div className="cta-row">
            <button
              type="button"
              className="primary-button"
              style={{ width: 'auto', paddingInline: '1.4rem', paddingBlock: '0.75rem' }}
            >
              Open Wallet
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => historySectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              View DID History
            </button>
          </div>
        </article>

        <article className="surface-card">
          <span className="chip badge-soft">
            <span aria-hidden>➕</span> Add new DID
          </span>
          <h3>Register decentralized identifier</h3>
          <p>Create a new DID and publish it to the network. We’ll pin it in IPFS and persist to MongoDB.</p>
          <form className="input-stack" style={{ marginTop: '1rem' }} onSubmit={handleAddDid}>
            <div className="input-group">
              <label htmlFor="did-nickname">Nickname</label>
              <input
                id="did-nickname"
                className="input-field"
                placeholder="Creator wallet · studio"
                value={nickname}
                onChange={(event) => setNickname(event.target.value)}
              />
            </div>
            <div className="input-group">
              <label htmlFor="did-controller">Controller</label>
              <input
                id="did-controller"
                className="input-field"
                placeholder="did:ppn:controller:alice"
                value={controller}
                onChange={(event) => setController(event.target.value)}
                required
              />
            </div>
            {feedback ? (
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.92rem', color: 'var(--color-muted)' }}>{feedback}</p>
            ) : null}
            <button type="submit" className="primary-button">
              Add DID
            </button>
          </form>
          <p className="form-helper" style={{ marginTop: '1rem' }}>
            DIDs are anchored on Cardano and mirrored to MongoDB Atlas for quick audit queries.
          </p>
          <div className="cta-row" style={{ marginTop: '1rem' }}>
            <button
              type="button"
              className="secondary-button"
              onClick={handleFileClick}
              style={{ width: 'auto', paddingInline: '1.2rem', paddingBlock: '0.75rem' }}
            >
              Upload Credential PDF
            </button>
            {uploadFeedback ? (
              <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>{uploadFeedback}</span>
            ) : null}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </article>
      </div>

      <article className="surface-card" ref={historySectionRef}>
        <span className="chip badge-soft">
          <span aria-hidden>📜</span> Recent DID activity
        </span>
        <div className="timeline" style={{ marginTop: '1.2rem' }}>
          {didHistory.map((item) => (
            <div className="timeline-card" key={item.id}>
              <time>{item.time}</time>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </article>
    </DashboardLayout>
  )
}

export default UserWalletPage

