const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Usamos localStorage en lugar de localStorage:
// - Los datos duran solo mientras el tab/browser estÃ¡ abierto
// - No persisten datos entre sesiones
const AUTH_STORAGE_KEY = 'trampopoints_auth_token';
const USER_STORAGE_KEY = 'trampopoints_auth_user';

/**
 * Servicio cliente para interactuar con los endpoints de AutenticaciÃ³n de TrampoPoints.
 * Soporta roles: USER (Pasajero), DRIVER (Chofer) y ADMIN (Administrador).
 */

export function resolveUserRole(rawRole, email) {
  const lowerEmail = (email || '').toLowerCase().trim();
  if (lowerEmail.includes('admin')) return 'ADMIN';

  const r = (rawRole || '').toUpperCase().trim();
  if (r === 'DRIVER' || r === 'CHOFER') return 'DRIVER';
  if (r === 'ADMIN') return 'ADMIN';
  
  if (lowerEmail.includes('chofer') || lowerEmail.includes('driver')) return 'DRIVER';
  return 'USER';
}

// 1. Iniciar SesiÃ³n (POST /api/auth/login)
export async function loginUser(email, password, desiredRole = null) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        data.user.role = resolveUserRole(desiredRole || data.user.role, data.user.email);
      }
      if (data.token) {
        localStorage.setItem(AUTH_STORAGE_KEY, data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      }
      return data;
    }

    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error || 'Credenciales invÃ¡lidas');
  } catch (error) {
    throw error;
  }
}

// 2. Registrar Usuario (POST /api/auth/register)
export async function registerUser(name, email, password, role = 'USER') {
  const resolvedRole = resolveUserRole(role, email);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role: resolvedRole }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.user) {
        data.user.role = resolveUserRole(data.user.role || resolvedRole, data.user.email);
      }
      if (data.token) {
        localStorage.setItem(AUTH_STORAGE_KEY, data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      }
      return data;
    }

    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.error || 'Error al registrar el usuario');
  } catch (error) {
    throw error;
  }
}

// 3. Obtener Usuario Actual (GET /api/auth/me)
export async function getCurrentUser(token) {
  const activeToken = token || localStorage.getItem(AUTH_STORAGE_KEY);
  if (!activeToken) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${activeToken}`,
        'Content-Type': 'application/json'
      },
    });

    if (response.ok) {
      const user = await response.json();
      user.role = resolveUserRole(user.role, user.email);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return user;
    } else if (response.status === 401) {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      return null;
    }
  } catch (error) {
    console.warn('No se pudo verificar token con backend:', error);
  }

  // Fallback (solo si no es un error 401 explÃ­cito de token invÃ¡lido)
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      parsed.role = resolveUserRole(parsed.role, parsed.email);
      return parsed;
    } catch {
      return null;
    }
  }
  return null;
}

// 4. Cerrar SesiÃ³n (POST /api/auth/logout)
export async function logoutUser() {
  const token = localStorage.getItem(AUTH_STORAGE_KEY);
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
    } catch (error) {
      console.warn('Error al notificar logout al backend:', error);
    }
  }

  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
  return { success: true };
}

export function getStoredAuth() {
  const token = localStorage.getItem(AUTH_STORAGE_KEY);
  const userJson = localStorage.getItem(USER_STORAGE_KEY);
  let user = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
      if (user) {
        user.role = resolveUserRole(user.role, user.email);
      }
    } catch {
      user = null;
    }
  }
  return { token, user };
}

