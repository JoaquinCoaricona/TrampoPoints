import React from 'react';
import { Bus, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


export default function Header() {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand">
          <div className="logo-badge">
            <Bus className="icon-bus" size={26} />
          </div>
          <div className="brand-text">
            <h1>TrampoPoints</h1>
            <span className="subtitle">Viajes Compartidos en Combi</span>
          </div>
        </div>

        <div className="header-actions">
          <div className="header-status">
            <div className="status-badge hide-mobile">
              <span className="dot pulse"></span>
              <span>Sistema Activo</span>
            </div>
          </div>

          {/* User Auth Section */}
          {isAuthenticated ? (
            <div className="user-profile-header">
              <div className="user-info-pill">
                <div className="user-avatar" title={user.email}>
                  {getUserInitials(user.name)}
                </div>
                <div className="user-text-details hide-mobile">
                  <span className="user-name">{user.name}</span>
                  <span className="user-email">{user.email}</span>
                </div>
              </div>
              <button
                className="btn-logout"
                onClick={logout}
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <LogOut size={16} />
                <span className="hide-mobile">Salir</span>
              </button>
            </div>
          ) : (
            <div className="auth-actions">
              <button
                className="btn-login-header"
                onClick={() => openAuthModal('LOGIN')}
              >
                <LogIn size={16} />
                <span>Ingresar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

