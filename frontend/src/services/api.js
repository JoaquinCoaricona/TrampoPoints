const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Cliente HTTP REST para los contratos del MVP de TrampoPoints.
 * Conexión exclusiva con el Backend Spring Boot en http://localhost:8080.
 */

// 1. Crear solicitud de viaje (POST /api/trips/requests)
export async function createTripRequest(data) {
  const response = await fetch(`${API_BASE_URL}/trips/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// 1b. Obtener todas las solicitudes del sistema (GET /api/trips/requests/all)
export async function getAllTripRequests() {
  const response = await fetch(`${API_BASE_URL}/trips/requests/all`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// 2. Buscar viajes compatibles (GET /api/trips/matches/{requestId})
export async function getTripMatches(requestId) {
  const response = await fetch(`${API_BASE_URL}/trips/matches/${requestId}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// 3. Obtener un viaje por ID (GET /api/trips/{tripId})
export async function getTripDetails(tripId) {
  const response = await fetch(`${API_BASE_URL}/trips/${tripId}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// 4. Crear/generar una ruta optimizada (POST /api/routes/optimize)
export async function optimizeRoute(data) {
  const response = await fetch(`${API_BASE_URL}/routes/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// 5. Ejecutar algoritmo de agrupamiento y optimización en Backend (POST /api/trips/process-grouping)
export async function processGroupingAlgorithm() {
  const response = await fetch(`${API_BASE_URL}/trips/process-grouping`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}
