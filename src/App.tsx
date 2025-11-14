import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import UserWalletPage from './pages/user/UserWalletPage'
import UserIdentityHealthPage from './pages/user/UserIdentityHealthPage'
import UserIpfsPage from './pages/user/UserIpfsPage'
import AdminVcWalletPage from './pages/admin/AdminVcWalletPage'
import AdminAuditLogsPage from './pages/admin/AdminAuditLogsPage'
import AdminDidApprovalPage from './pages/admin/AdminDidApprovalPage'

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginPage />} />

    <Route path="/user">
      <Route index element={<Navigate to="/user/wallet" replace />} />
      <Route path="wallet" element={<UserWalletPage />} />
      <Route path="health" element={<UserIdentityHealthPage />} />
      <Route path="ipfs" element={<UserIpfsPage />} />
    </Route>

    <Route path="/admin">
      <Route index element={<Navigate to="/admin/vc-wallet" replace />} />
      <Route path="vc-wallet" element={<AdminVcWalletPage />} />
      <Route path="audit-logs" element={<AdminAuditLogsPage />} />
      <Route path="did-approval" element={<AdminDidApprovalPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
)

export default App

