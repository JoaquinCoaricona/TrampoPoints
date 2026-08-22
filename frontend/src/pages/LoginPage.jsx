import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bus,
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  AlertCircle,
  Loader2,
  UserCheck,
  ArrowLeft
} from 'lucide-react';
import { resolveUserRole } from '../services/authService';

export default function LoginPage() {
  const { login, register, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState('LOGIN'); // 'LOGIN' | 'REGISTER'
  const [role, setRole] = useState('DRIVER'); // 'DRIVER' | 'USER'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === 'LOGIN';
  const from = location.state?.from?.pathname || (role === 'DRIVER' ? '/driver' : '/app');

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
      let result;
      if (isLogin) {
        result = await login(email, password, role);
      } else {
        result = await register(name, email, password, role);
      }

      const resolved = resolveUserRole(result?.user?.role || role, result?.user?.email || email);
      if (resolved === 'DRIVER') {
        navigate('/driver', { replace: true });
      } else {
        navigate(from === '/login' || from.startsWith('/driver') ? '/app' : from, { replace: true });
      }
    } catch {
      // El error queda en context
    } finally {
      setSubmitting(false);
    }
  };

  const handleUseDemoDriver = () => {
    setError(null);
    setMode('LOGIN');
    setRole('DRIVER');
    setEmail('juan.chofer@trampopoints.com');
    setPassword('password123');
  };

  const handleUseDemoPassenger = () => {
    setError(null);
    setMode('LOGIN');
    setRole('USER');
    setEmail('juan@email.com');
    setPassword('password123');
  };

  return (
    <div className="login-page-root">
      {/* Background subtle ambient lighting */}
      <div className="login-ambient-violet" />
      <div className="login-ambient-green" />

      {/* Top back button */}
      <div className="login-top-bar">
        <Link to="/" className="btn-back-landing">
          <ArrowLeft size={15} /> Volver al Inicio
        </Link>
      </div>

      <div className="login-container">
        {/* Clean Header (Logo icon removed as requested) */}
        <div className="login-header text-center">
          <h1 className="login-title">
            Trampo<span className="text-neon-green">Points</span>
          </h1>
          <p className="login-subtitle">
            {isLogin
              ? 'Accedé a tu portal de Chofer o a tu cuenta de Pasajero'
              : 'Unite a la red de transporte compartido'}
          </p>
        </div>

        {/* Card Frame */}
        <div className="login-card">
          {/* Mode Switcher Tabs */}
          <div className="login-mode-tabs">
            <button
              type="button"
              className={`login-mode-tab ${isLogin ? 'active' : ''}`}
              onClick={() => { setError(null); setMode('LOGIN'); }}
            >
              <LogIn size={15} /> Iniciar Sesión
            </button>
            <button
              type="button"
              className={`login-mode-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => { setError(null); setMode('REGISTER'); }}
            >
              <UserPlus size={15} /> Registrarse
            </button>
          </div>

          {/* Quick Demo Credentials */}
          {isLogin && (
            <div className="login-demo-bar">
              <span className="demo-bar-title">Acceso rápido con un clic:</span>
              <div className="demo-buttons-grid margin-top-8">
                <button
                  type="button"
                  className={`btn-demo-card ${role === 'DRIVER' ? 'selected' : ''}`}
                  onClick={handleUseDemoDriver}
                >
                  <div className="flex-center gap-6">
                    <Bus size={14} className="text-neon-green" />
                    <strong>Chofer Demo</strong>
                  </div>
                  <span className="demo-email">juan.chofer@trampopoints.com</span>
                </button>

                <button
                  type="button"
                  className={`btn-demo-card ${role === 'USER' ? 'selected' : ''}`}
                  onClick={handleUseDemoPassenger}
                >
                  <div className="flex-center gap-6">
                    <UserCheck size={14} className="text-electric-violet" />
                    <strong>Pasajero Demo</strong>
                  </div>
                  <span className="demo-email">juan@email.com</span>
                </button>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="login-error-banner">
              <AlertCircle size={16} className="text-rose flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Clean Role selector (CHOFER / PASAJERO without extra descriptions) */}
            <div className="form-group margin-bottom-20">
              <label className="form-label">
                {isLogin ? 'Tipo de Acceso' : 'Tipo de Cuenta'}
              </label>
              <div className="role-selection-grid">
                <button
                  type="button"
                  className={`role-option-card ${role === 'DRIVER' ? 'selected' : ''}`}
                  onClick={() => setRole('DRIVER')}
                >
                  <div className="flex-center gap-8">
                    <Bus size={16} className={role === 'DRIVER' ? 'text-neon-green' : 'text-muted'} />
                    <strong>Chofer</strong>
                  </div>
                </button>

                <button
                  type="button"
                  className={`role-option-card ${role === 'USER' ? 'selected' : ''}`}
                  onClick={() => setRole('USER')}
                >
                  <div className="flex-center gap-8">
                    <UserCheck size={16} className={role === 'USER' ? 'text-electric-violet' : 'text-muted'} />
                    <strong>Pasajero</strong>
                  </div>
                </button>
              </div>
            </div>

            {/* Name input (only for register) */}
            {!isLogin && (
              <div className="form-group margin-bottom-16">
                <label className="form-label">
                  <UserIcon size={14} className="text-electric-violet" /> Nombre Completo
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={role === 'DRIVER' ? 'Ej. Juan Pérez' : 'Ej. Juan Pérez'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  autoFocus={!isLogin}
                />
              </div>
            )}

            {/* Email input */}
            <div className="form-group margin-bottom-16">
              <label className="form-label">
                <Mail size={14} className="text-neon-green" /> Correo Electrónico
              </label>
              <input
                type="email"
                className="form-input"
                placeholder={role === 'DRIVER' ? 'chofer@email.com' : 'tu@email.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus={isLogin}
              />
            </div>

            {/* Password input */}
            <div className="form-group margin-bottom-24">
              <label className="form-label">
                <Lock size={14} className="text-electric-violet" /> Contraseña
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
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button (No hardcoded emojis) */}
            <button
              type="submit"
              className="btn-primary-neon login-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex-center gap-8">
                  <Loader2 className="spinner" size={16} />
                  {isLogin ? 'Iniciando Sesión...' : 'Registrando Cuenta...'}
                </span>
              ) : (
                <span className="flex-center gap-8">
                  {isLogin ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {isLogin
                    ? (role === 'DRIVER' ? 'Ingresar al Portal del Chofer' : 'Ingresar como Pasajero')
                    : (role === 'DRIVER' ? 'Crear Cuenta de Chofer' : 'Crear Cuenta de Pasajero')}
                </span>
              )}
            </button>
          </form>

          {/* Footer switch */}
          <div className="login-footer-switch text-center">
            {isLogin ? (
              <p>
                ¿No tenés cuenta aún?{' '}
                <button
                  type="button"
                  className="btn-text-link-violet"
                  onClick={() => { setError(null); setMode('REGISTER'); }}
                >
                  Registrate gratis
                </button>
              </p>
            ) : (
              <p>
                ¿Ya tenés una cuenta?{' '}
                <button
                  type="button"
                  className="btn-text-link-violet"
                  onClick={() => { setError(null); setMode('LOGIN'); }}
                >
                  Iniciá sesión
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
