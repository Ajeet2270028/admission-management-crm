import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const NAV = [
  { section: 'Overview', items: [{ label: '📊 Dashboard', to: '/dashboard' }] },
  {
    section: 'Admissions',
    roles: ['ADMIN', 'ADMISSION_OFFICER'],
    items: [
      { label: '👤 Applicants', to: '/applicants' },
    ]
  },
  {
    section: 'Configuration',
    roles: ['ADMIN'],
    items: [
      { label: '🏛️ Master Setup', to: '/master' },
      { label: '📚 Programs & Seats', to: '/programs' },
    ]
  }
];

export default function Layout() {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>🎓 Admission CRM</h2>
          <span>Edumerge Institute of Technology</span>
        </div>
        <nav className="sidebar-nav">
          {NAV.map(group => {
            if (group.roles && !group.roles.some(r => hasRole(r))) return null;
            return (
              <div key={group.section}>
                <div className="nav-section">{group.section}</div>
                {group.items.map(item => (
                  <NavLink key={item.to} to={item.to}
                    className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                    {item.label}
                  </NavLink>
                ))}
              </div>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <strong>{user?.fullName}</strong>
            {user?.role?.replace('_', ' ')}
          </div>
          <button className="btn-logout" onClick={handleLogout}>Sign Out</button>
        </div>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
