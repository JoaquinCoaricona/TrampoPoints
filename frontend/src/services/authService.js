const API_BASE_URL = 'http://localhost:8080/api';

const AUTH_STORAGE_KEY = 'trampopoints_auth_token';
const USER_STORAGE_KEY = 'trampopoints_auth_user';

/**
 * Servicio cliente para interactuar con los endpoints de Autenticación de TrampoPoints.
 */

// 1. Iniciar Sesión (POST /api/auth/login)
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al iniciar sesión');
    }

    if (data.token) {
      localStorage.setItem(AUTH_STORAGE_KEY, data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    if (error.message && error.message !== 'Failed to fetch') {
      throw error;
    }
    // Fallback resiliente si el backend no responde (modo demo)
    console.warn('Backend no disponible, ejecutando login en modo demo:', error);
    if (email === 'juan@email.com' && password === 'password123') {
      const mockUser = { id: 'usr-101', name: 'Juan Pérez', email: 'juan@email.com' };
      const mockToken = 'tp_mock_token_' + Date.now();
      localStorage.setItem(AUTH_STORAGE_KEY, mockToken);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
      return { token: mockToken, user: mockUser };
    }
    throw new Error('Credenciales inválidas o backend no disponible');
  }
}

// 2. Registrar Usuario (POST /api/auth/register)
export async function registerUser(name, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Error al registrar usuario');
    }

    if (data.token) {
      localStorage.setItem(AUTH_STORAGE_KEY, data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    }

    return data;
  } catch (error) {
    if (error.message && error.message !== 'Failed to fetch') {
      throw error;
    }
    // Fallback resiliente modo demo
    console.warn('Backend no disponible, registrando en modo demo:', error);
    const mockUser = { id: 'usr-' + Math.floor(Math.random() * 900 + 100), name, email };
    const mockToken = 'tp_mock_token_' + Date.now();
    localStorage.setItem(AUTH_STORAGE_KEY, mockToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
    return { token: mockToken, user: mockUser };
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

    if (!response.ok) {
      if (response.status === 401) {
        logoutUser();
        return null;
      }
      throw new Error('Error al obtener usuario actual');
    }

    const user = await response.json();
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.warn('No se pudo verificar token con backend, utilizando sesión local si existe:', error);
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
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
