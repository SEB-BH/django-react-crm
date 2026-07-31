import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

const AppLayout = ({ username, handleLogout }) => {
  return (
    <div className="app-shell">
      <NavBar username={username} handleLogout={handleLogout} />
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
