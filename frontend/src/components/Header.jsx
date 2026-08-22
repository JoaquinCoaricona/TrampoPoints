import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, LogIn, LogOut, ShieldCheck, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoutConfirmModal from './LogoutConfirmModal';
import { resolveUserRole } from '../services/authService';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getUserInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const userRole = resolveUserRole(user?.role, user?.email);
  const isAdmin = userRole === 'ADMIN';
  const isDriver = userRole === 'DRIVER';

  const handleConfirmLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <>
      <header className="app-header">
        <div className="header-container">
          <Link to={isDriver ? '/driver' : '/'} className="brand-link flex-center gap-12">
            <div className="logo-badge">
              <Bus className="icon-bus" size={24} />
            </div>
            <div className="brand-text">
              <h1>
                Trampo<span className="text-neon-green">Points</span>
              </h1>
              <span className="subtitle">Plataforma de Viajes Compartidos</span>
            </div>
          </Link>

          <div className="header-actions flex-center gap-12">
            <div className="header-status hide-mobile">
              <div className="status-badge">
                <span className="dot pulse"></span>
                <span>Sistema Activo</span>
              </div>
            </div>

            {/* User Auth Section */}
            {isAuthenticated ? (
              <div className="user-profile-header flex-center gap-10">
                {/* Redesigned User Capsule with Role Badge */}
                <div className={`user-role-capsule ${isAdmin ? 'capsule-admin' : isDriver ? 'capsule-driver' : 'capsule-user'}`}>
                  <div className="capsule-avatar-wrap">
                    <div className="capsule-avatar">
                      {getUserInitials(user.name)}
                    </div>
                    <span className="capsule-online-dot"></span>
                  </div>

                  <div className="capsule-details hide-mobile">
                    <div className="capsule-name-row flex-center gap-6">
                      <span className="capsule-user-name">{user.name}</span>
                      {isDriver && (
                        <span className="badge-role-tag badge-role-driver">
                          <Bus size={11} /> CHOFER VERIFICADO
                        </span>
                      )}
                      {isAdmin && (
                        <span className="badge-role-tag badge-role-admin">
                          <ShieldCheck size={11} /> ADMINISTRADOR
                        </span>
                      )}
                      {!isAdmin && !isDriver && (
                        <span className="badge-role-tag badge-role-passenger">
                          <User size={11} /> PASAJERO
                        </span>
                      )}
                    </div>
                    <span className="capsule-user-email">{user.email}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-header-logout"
                  onClick={() => setShowLogoutModal(true)}
                  title="Cerrar sesión"
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={15} />
                  <span className="hide-mobile">Salir</span>
                </button>
              </div>
            ) : (
              <div className="auth-actions">
                <button
                  type="button"
                  className="btn-login-header"
                  onClick={() => navigate('/login')}
                >
                  <LogIn size={16} />
                  <span>Ingresar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        user={user}
      />
    </>
  );
}
