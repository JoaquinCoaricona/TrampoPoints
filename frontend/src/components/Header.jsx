import React from 'react';
import { Bus, LogIn, LogOut, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onToggleDriverMode, isDriverModeActive }) {
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

  const isAdmin = user?.role === 'ADMIN';

  return (
    <header className="app-header">
      <div className="header-container">
        <div
          className="brand"
          onClick={() => isDriverModeActive && onToggleDriverMode && onToggleDriverMode()}
          style={{ cursor: isDriverModeActive ? 'pointer' : 'default' }}
        >
          <div className="logo-badge">
            <Bus className="icon-bus" size={26} />
          </div>
          <div className="brand-text">
            <h1>TrampoPoints</h1>
            <span className="subtitle">Plataforma de Viajes Compartidos</span>
          </div>
        </div>

        <div className="header-actions flex-center gap-12">
          {/* Driver Mode Button */}
          <button
            className={`btn-driver-mode ${isDriverModeActive ? 'driver-mode-active' : ''}`}
            onClick={onToggleDriverMode}
            title={isDriverModeActive ? 'Salir del Modo Chofer' : 'Ingresar al Módulo del Chofer'}
          >
            <Bus size={16} />
            <span>{isDriverModeActive ? 'Modo Chofer (Activo)' : 'MODO CHOFER'}</span>
          </button>

          <div className="header-status hide-mobile">
            <div className="status-badge">
              <span className="dot pulse"></span>
              <span>Sistema Activo</span>
            </div>
          </div>

          {/* User Auth Section */}
          {isAuthenticated ? (
            <div className="user-profile-header flex-center gap-8">
              <div className="user-info-pill flex-center gap-8">
                <div className={`user-avatar ${isAdmin ? 'avatar-admin' : ''}`} title={user.email}>
                  {getUserInitials(user.name)}
                </div>
                <div className="user-text-details hide-mobile flex-column">
                  <div className="flex-center gap-6">
                    <span className="user-name">{user.name}</span>
                    {isAdmin ? (
                      <span className="badge badge-amber text-xs flex-center gap-2">
                        <ShieldCheck size={12} /> ADMIN
                      </span>
                    ) : (
                      <span className="badge badge-subtle text-xs flex-center gap-2">
                        <User size={12} /> PASAJERO
                      </span>
                    )}
                  </div>
                  <span className="user-email text-xs text-muted">{user.email}</span>
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
