import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

type NavItem = {
  label: string
  to: string
  icon?: ReactNode
}

type DashboardLayoutProps = {
  title: string
  subtitle: string
  navItems: NavItem[]
  user: {
    name: string
    identifier: string
    initials: string
  }
  brand?: {
    initials: string
    name: string
    tagline: string
  }
  networkStatus?: string
  heroAccessory?: ReactNode
  statusBanner?: ReactNode
  actions?: ReactNode
  children: ReactNode
  onLogout?: () => void
}

const DashboardLayout = ({
  title,
  subtitle,
  navItems,
  user,
  brand = { initials: 'PP', name: 'Pixel Pirates', tagline: 'Identity Network' },
  networkStatus = 'Cardano Backpack · Synced',
  heroAccessory,
  statusBanner,
  actions,
  children,
  onLogout,
}: DashboardLayoutProps) => (
  <div className="dashboard-shell">
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand">
        <div className="brand-avatar">
          <span>{brand.initials}</span>
        </div>
        <div>
          <strong>{brand.name}</strong>
          <p>{brand.tagline}</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            {item.icon ? (
              <span className="nav-icon" aria-hidden>
                {item.icon}
              </span>
            ) : null}
            {item.label}
          </NavLink>
        ))}
      </nav>
      <footer className="sidebar-footer">
        <div>
          <p>Network status</p>
          <strong>{networkStatus}</strong>
        </div>
        <button type="button" className="secondary-button" onClick={onLogout}>
          Logout
        </button>
      </footer>
    </aside>

    <main className="dashboard-main">
      <header className="dashboard-header">
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        <div className="header-right">
          {actions}
          <div className="user-chip">
            <div className="user-avatar">{user.initials}</div>
            <div>
              <strong>{user.name}</strong>
              <p>{user.identifier}</p>
            </div>
          </div>
        </div>
      </header>

      {heroAccessory}

      {statusBanner && <div className="dashboard-status">{statusBanner}</div>}

      <section className="dashboard-content">{children}</section>
    </main>
  </div>
)

export default DashboardLayout

