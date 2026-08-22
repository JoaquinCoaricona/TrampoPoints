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
  Sparkles,
  Loader2,
  ShieldCheck,
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

  const handleUseDemoAdmin = () => {
    setError(null);
    setMode('LOGIN');
    setRole('ADMIN');
    setEmail('admin@trampopoints.com');
    setPassword('admin123');
  };

  return (
    <div className="login-page-root">
      {/* Background ambient lighting */}
      <div className="login-ambient-violet" />
      <div className="login-ambient-green" />

      {/* Top back button */}
      <div className="login-top-bar">
        <Link to="/" className="btn-back-landing">
          <ArrowLeft size={16} /> Volver al Inicio
        </Link>
      </div>

      <div className="login-container">
        {/* Brand Header */}
        <div className="login-header text-center">
          <div className="login-logo-glow">
            <Bus size={32} className="text-neon-green" />
          </div>
          <h1 className="login-title">
            Trampo<span className="text-neon-green">Points</span>
          </h1>
          <p className="login-subtitle">
            {isLogin
              ? 'Accedé a tu portal de Chofer o a tu cuenta de Pasajero'
              : 'Unite a la red de transporte compartido en combis y minibuses'}
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
              <LogIn size={16} /> Iniciar Sesión
            </button>
            <button
              type="button"
              className={`login-mode-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => { setError(null); setMode('REGISTER'); }}
            >
              <UserPlus size={16} /> Registrarse
            </button>
          </div>

          {/* Quick Demo Credentials */}
          {isLogin && (
            <div className="login-demo-bar flex-column gap-8">
              <span className="demo-bar-title">Acceso rápido con un clic:</span>
              <div className="demo-buttons-grid">
                <button
                  type="button"
                  className={`btn-demo-card ${role === 'DRIVER' ? 'selected' : ''}`}
                  onClick={handleUseDemoDriver}
                >
                  <div className="flex-center gap-6">
                    <Bus size={15} className="text-neon-green" />
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
                    <Sparkles size={15} className="text-electric-violet" />
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
              <AlertCircle size={18} className="text-rose flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Role selection */}
            <div className="form-group margin-bottom-16">
              <label className="form-label">
                <Sparkles size={14} className="text-electric-violet" /> {isLogin ? 'Ingresar como:' : 'Tipo de Cuenta:'}
              </label>
              <div className="role-selection-grid">
                <button
                  type="button"
                  className={`role-option-card ${role === 'DRIVER' ? 'selected' : ''}`}
                  onClick={() => setRole('DRIVER')}
                >
                  <div className="flex-center gap-6">
                    <Bus size={18} className={role === 'DRIVER' ? 'text-neon-green' : 'text-muted'} />
                    <strong>Chofer</strong>
                  </div>
                  <span className="role-card-desc">Panel, combi 3D y viajes</span>
                </button>

                <button
                  type="button"
                  className={`role-option-card ${role === 'USER' ? 'selected' : ''}`}
                  onClick={() => setRole('USER')}
                >
                  <div className="flex-center gap-6">
                    <UserCheck size={18} className={role === 'USER' ? 'text-electric-violet' : 'text-muted'} />
                    <strong>Pasajero</strong>
                  </div>
                  <span className="role-card-desc">Buscar y reservar combis</span>
                </button>
              </div>
            </div>

            {/* Name input (only for register) */}
            {!isLogin && (
              <div className="form-group margin-bottom-16">
                <label className="form-label">
                  <UserIcon size={15} className="text-electric-violet" /> Nombre Completo
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

            {/* Email input */}
            <div className="form-group margin-bottom-16">
              <label className="form-label">
                <Mail size={15} className="text-neon-green" /> Correo Electrónico
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
                <Lock size={15} className="text-electric-violet" /> Contraseña
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

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary-neon login-submit-btn"
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex-center gap-8">
                  <Loader2 className="spinner" size={18} />
                  {isLogin ? 'Iniciando Sesión...' : 'Registrando Cuenta...'}
                </span>
              ) : (
                <span className="flex-center gap-8">
                  {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                  {isLogin
                    ? (role === 'DRIVER' ? 'Ingresar al Portal del Chofer 🚐' : 'Ingresar como Pasajero 👥')
                    : (role === 'DRIVER' ? 'Crear Cuenta de Chofer 🚐' : 'Crear Cuenta de Pasajero 👥')}
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
