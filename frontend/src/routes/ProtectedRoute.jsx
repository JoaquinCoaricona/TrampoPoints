import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resolveUserRole } from '../services/authService';

export default function ProtectedRoute({ allowedRoles = null }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh' }}>
        <div className="status-badge">
          <span className="dot pulse"></span>
          <span>Verificando sesión...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = resolveUserRole(user?.role, user?.email);
    if (!allowedRoles.includes(userRole)) {
      // Redirigir según el rol del usuario si intenta entrar a una ruta no permitida
      return userRole === 'DRIVER' 
        ? <Navigate to="/driver" replace />
        : <Navigate to="/app" replace />;
    }
  }

  return <Outlet />;
}
