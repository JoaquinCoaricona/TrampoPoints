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
      <header className="app-header" style={{ background: '#09090b', borderBottom: '1px solid #1f1f23', padding: '12px 0', marginBottom: '28px' }}>
        <div className="header-container">
          <Link to={isDriver ? '/driver' : '/'} className="brand-link flex-center gap-12" style={{ textDecoration: 'none' }}>
            <div className="brand-logo-only" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bus size={24} style={{ color: '#ffffff' }} />
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.3px' }}>TP</span>
            </div>
          </Link>

          <div className="header-actions flex-center gap-12">
            {/* User Auth Section */}
            {isAuthenticated ? (
              <div className="user-profile-header flex-center gap-16" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    border: '1px solid #27272a',
                    background: '#09090b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#ffffff'
                  }}>
                    {getUserInitials(user.name)}
                  </div>
                  <div className="hide-mobile" style={{ display: 'flex', flexDirection: 'column', gap: '1px', textAlign: 'left' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#e4e4e7' }}>{user.name}</span>
                    <span style={{ fontSize: '11px', color: '#71717a' }}>{user.email}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-header-logout"
                  onClick={() => setShowLogoutModal(true)}
                  title="Cerrar sesión"
                  style={{
                    background: 'transparent',
                    border: '1px solid #1f1f23',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    color: '#a1a1aa',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <LogOut size={13} />
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
