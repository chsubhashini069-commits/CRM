import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LuLayoutDashboard, LuUsers, LuUserPlus, LuCheck, LuTrendingUp, LuUser, LuLogOut 
} from "react-icons/lu";

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <LuLayoutDashboard /> },
    { name: 'Customers', path: '/customers', icon: <LuUsers /> },
    { name: 'Leads', path: '/leads', icon: <LuUserPlus /> },
    { name: 'Tasks', path: '/tasks', icon: <LuCheck /> },
    { name: 'Sales', path: '/sales', icon: <LuTrendingUp /> },
    { name: 'Profile', path: '/profile', icon: <LuUser /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>CRM <span>Pro</span></h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => 
              isActive ? 'sidebar-link active' : 'sidebar-link'
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar" style={{ background: user?.role === 'admin' ? 'var(--secondary)' : 'var(--primary)' }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-info">
            <p className="name">{user?.name || 'User'}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <p className="role">{user?.role || 'Sales Rep'}</p>
              {user?.role === 'admin' && (
                <span style={{ 
                  fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', 
                  background: 'var(--secondary)20', color: 'var(--secondary)', 
                  fontWeight: '700', textTransform: 'uppercase' 
                }}>
                  Admin
                </span>
              )}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LuLogOut />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
