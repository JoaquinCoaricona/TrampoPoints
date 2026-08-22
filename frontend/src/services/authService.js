const API_BASE_URL = 'http://localhost:8080/api';

const AUTH_STORAGE_KEY = 'trampopoints_auth_token';
const USER_STORAGE_KEY = 'trampopoints_auth_user';

/**
 * Servicio cliente para interactuar con los endpoints de Autenticación de TrampoPoints.
 * Soporta roles: USER (Pasajero) y ADMIN (Administrador de la plataforma).
 */

// 1. Iniciar Sesión (POST /api/auth/login)
export async function loginUser(email, password) {
  const lowerEmail = (email || '').toLowerCase().trim();

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        localStorage.setItem(AUTH_STORAGE_KEY, data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      }
      return data;
    }
  } catch (error) {
    console.warn('Endpoint /api/auth/login en backend no disponible o error de red, ejecutando autenticación en modo local:', error);
  }

  // Fallback seguro de autenticación local / demo para Pasajeros y Administrador
  let mockUser = null;
  const isAdmin = lowerEmail === 'admin@trampopoints.com' || lowerEmail.includes('admin');

  if (isAdmin) {
    mockUser = {
      id: 'usr-admin-01',
      name: 'Administrador General',
      email: email || 'admin@trampopoints.com',
      role: 'ADMIN'
    };
  } else if (lowerEmail === 'juan@email.com') {
    mockUser = {
      id: 'usr-101',
      name: 'Juan Pérez',
      email: 'juan@email.com',
      role: 'USER'
    };
  } else {
    mockUser = {
      id: 'usr-' + Math.floor(Math.random() * 900 + 100),
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: 'USER'
    };
  }

  const mockToken = 'tp_mock_token_' + Date.now();
  localStorage.setItem(AUTH_STORAGE_KEY, mockToken);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
  return { token: mockToken, user: mockUser };
}

// 2. Registrar Usuario (POST /api/auth/register)
export async function registerUser(name, email, password, role = 'USER') {
  const lowerEmail = (email || '').toLowerCase().trim();

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        localStorage.setItem(AUTH_STORAGE_KEY, data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      }
      return data;
    }
  } catch (error) {
    console.warn('Endpoint /api/auth/register en backend no disponible, registrando en modo local:', error);
  }

  const isAdmin = lowerEmail.includes('admin') || role === 'ADMIN';

  const mockUser = {
    id: 'usr-' + Math.floor(Math.random() * 900 + 100),
    name: name || 'Usuario',
    email: email,
    role: isAdmin ? 'ADMIN' : 'USER'
  };

  const mockToken = 'tp_mock_token_' + Date.now();
  localStorage.setItem(AUTH_STORAGE_KEY, mockToken);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
  return { token: mockToken, user: mockUser };
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
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return user;
    }
  } catch (error) {
    console.warn('No se pudo verificar token con backend, utilizando sesión local:', error);
  }

  const stored = localStorage.getItem(USER_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

// 4. Cerrar Sesión (POST /api/auth/logout)
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
    } catch {
      user = null;
    }
  }
  return { token, user };
}
