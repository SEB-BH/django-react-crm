import { NavLink } from 'react-router-dom'

const NavBar = ({ username, handleLogout }) => {
  return (
    <aside className="sidebar">
      <div>
        <p className="eyebrow">Premium Goods</p>
        <h1>Atelier CRM</h1>
      </div>

      <nav>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/contacts">Contacts</NavLink>
        <NavLink to="/opportunities">Pipeline</NavLink>
      </nav>

      <div className="sidebar-footer">
        <p>Signed in as <strong>{username}</strong></p>
        <button className="secondary" onClick={handleLogout}>Log out</button>
      </div>
    </aside>
  )
}

export default NavBar
