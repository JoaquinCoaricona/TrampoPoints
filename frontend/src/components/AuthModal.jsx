import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  X,
  AlertCircle,
  Sparkles,
  Loader2,
  Bus,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    error,
    setError
  } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // 'USER' | 'DRIVER'
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'LOGIN';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Por favor, ingresá un correo electrónico válido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe contener al menos 6 caracteres');
      return;
    }

    if (!isLogin && (!name || name.trim().length === 0)) {
      setError('Por favor, ingresá tu nombre completo');
      return;
    }

    setSubmitting(true);
    try {
      if (isLogin) {
        await login(email, password, role);
      } else {
        await register(name, email, password, role);
      }
      setName('');
      setEmail('');
      setPassword('');
      setRole('USER');
    } catch {
      // El error queda establecido en el context
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseDemoUser = () => {
    setError(null);
    setAuthModalMode('LOGIN');
    setRole('USER');
    setEmail('juan@email.com');
    setPassword('password123');
  };

  const handleUseDemoDriver = () => {
    setError(null);
    setAuthModalMode('LOGIN');
    setRole('DRIVER');
    setEmail('juan.chofer@trampopoints.com');
    setPassword('password123');
  };

  const handleUseDemoAdmin = () => {
    setError(null);
    setAuthModalMode('LOGIN');
    setRole('ADMIN');
    setEmail('admin@trampopoints.com');
    setPassword('admin123');
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal}>
      <div
        className="modal-container glass-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={closeAuthModal}
          aria-label="Cerrar modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="auth-header">
          <div className="auth-logo-badge">
            <Bus size={28} />
          </div>
          <h2 className="auth-title">
            {isLogin ? 'Bienvenido a TrampoPoints' : 'Crea tu Cuenta'}
          </h2>
          <p className="auth-subtitle">
            {isLogin
              ? 'Iniciá sesión para acceder a tu vista de Chofer o de Pasajero/Cliente'
              : 'Registrate para viajar o para registrarte como chofer de combi'}
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setError(null);
              setAuthModalMode('LOGIN');
            }}
          >
            <LogIn size={16} /> Iniciar Sesión
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setError(null);
              setAuthModalMode('REGISTER');
            }}
          >
            <UserPlus size={16} /> Registrarse
          </button>
        </div>

        {/* Demo Fast Access Buttons */}
        {isLogin && (
          <div className="demo-credentials-box flex-column gap-8 margin-bottom-16">
            <button
              type="button"
              className={`btn-demo-quick flex-between align-center border-indigo ${role === 'DRIVER' ? 'active-demo-btn' : ''}`}
              onClick={handleUseDemoDriver}
            >
              <span className="flex-center gap-6">
                <Bus size={16} className="text-indigo" />
                <span>Demo Chofer: <strong>juan.chofer@trampopoints.com</strong></span>
              </span>
              <span className="badge badge-indigo text-xs font-bold">ACCEDER COMO CHOFER 🚐</span>
            </button>

            <button
              type="button"
              className={`btn-demo-quick flex-between align-center ${role === 'USER' ? 'active-demo-btn' : ''}`}
              onClick={handleUseDemoUser}
            >
              <span className="flex-center gap-6">
                <Sparkles size={15} className="demo-icon text-indigo" />
                <span>Demo Pasajero: <strong>juan@email.com</strong></span>
              </span>
              <span className="badge badge-subtle text-xs">ACCEDER COMO PASAJERO 👥</span>
            </button>

            <button
              type="button"
              className={`btn-demo-quick flex-between align-center border-amber ${role === 'ADMIN' ? 'active-demo-btn' : ''}`}
              onClick={handleUseDemoAdmin}
            >
              <span className="flex-center gap-6">
                <ShieldCheck size={15} className="text-amber" />
                <span>Demo Admin: <strong>admin@trampopoints.com</strong></span>
              </span>
              <span className="badge badge-amber text-xs font-bold">ROL: ADMIN</span>
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="banner banner-error margin-bottom-16">
            <AlertCircle size={18} className="banner-icon text-rose" />
            <div className="error-text">{error}</div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role selector in BOTH Login and Register mode */}
          <div className="form-group margin-bottom-16">
            <label className="form-label">
              <Sparkles size={15} className="text-indigo" /> {isLogin ? 'Ingresar como:' : 'Tipo de Cuenta (Rol):'}
            </label>
            <div className="role-selection-grid">
              <button
                type="button"
                className={`role-option-card ${role === 'DRIVER' ? 'selected' : ''}`}
                onClick={() => setRole('DRIVER')}
              >
                <div className="flex-center gap-6">
                  <Bus size={18} className={role === 'DRIVER' ? 'text-indigo' : 'text-muted'} />
                  <strong>🚐 Chofer</strong>
                </div>
                <span className="role-card-desc">Ver panel, vehículo 3D y viajes</span>
              </button>

              <button
                type="button"
                className={`role-option-card ${role === 'USER' ? 'selected' : ''}`}
                onClick={() => setRole('USER')}
              >
                <div className="flex-center gap-6">
                  <UserCheck size={18} className={role === 'USER' ? 'text-indigo' : 'text-muted'} />
                  <strong>👥 Pasajero / Cliente</strong>
                </div>
                <span className="role-card-desc">Buscar y reservar combis</span>
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="form-group margin-bottom-16">
              <label className="form-label">
                <UserIcon size={16} className="text-indigo" /> Nombre Completo
              </label>
              <input
                type="text"
                className="form-input"
                placeholder={role === 'DRIVER' ? 'Ej. Juan Pérez (Chofer)' : 'Ej. Juan Pérez'}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                autoFocus={!isLogin}
              />
            </div>
          )}

          <div className="form-group margin-bottom-16">
            <label className="form-label">
              <Mail size={16} className="text-emerald" /> Correo Electrónico
            </label>
            <input
              type="email"
              className="form-input"
              placeholder={role === 'DRIVER' ? 'chofer@email.com' : 'pasajero@email.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus={isLogin}
            />
          </div>

          <div className="form-group margin-bottom-24">
            <label className="form-label">
              <Lock size={16} className="text-amber" /> Contraseña
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input password-input"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={submitting}
          >
            {submitting ? (
              <span className="flex-center">
                <Loader2 className="spinner" size={18} />
                {isLogin ? 'Iniciando Sesión...' : 'Registrando Cuenta...'}
              </span>
            ) : (
              <span className="flex-center">
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                {isLogin
                  ? (role === 'DRIVER' ? 'Ingresar como Chofer 🚐' : 'Ingresar como Pasajero / Cliente 👥')
                  : (role === 'DRIVER' ? 'Crear Cuenta de Chofer 🚐' : 'Crear Cuenta de Pasajero 👥')}
              </span>
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="auth-footer-switch">
          {isLogin ? (
            <p>
              ¿No tenés una cuenta?{' '}
              <button
                type="button"
                className="btn-text-link"
                onClick={() => {
                  setError(null);
                  setAuthModalMode('REGISTER');
                }}
              >
                Registrate acá
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tenés una cuenta?{' '}
              <button
                type="button"
                className="btn-text-link"
                onClick={() => {
                  setError(null);
                  setAuthModalMode('LOGIN');
                }}
              >
                Iniciá sesión acá
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
