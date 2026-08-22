const API_BASE_URL = 'http://localhost:8080/api';

// Estado local para recordar la última búsqueda realizada en el frontend
let lastTripRequestData = null;

/**
 * Cliente HTTP REST para los contratos del MVP de TrampoPoints.
 */

// 1. Crear solicitud de viaje (POST /api/trips/requests)
export async function createTripRequest(data) {
  lastTripRequestData = data; // Guardar datos de la solicitud (origen, destino, horario)

  try {
    const response = await fetch(`${API_BASE_URL}/trips/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend indisponible o error en red, utilizando respuesta mock dinámica:', error);
    return {
      requestId: 'req-' + Math.floor(Math.random() * 900 + 100),
      status: 'SEARCHING',
      message: 'Buscando pasajeros compatibles'
    };
  }
}

// 2. Buscar viajes compatibles (GET /api/trips/matches/{requestId})
export async function getTripMatches(requestId) {
  try {
    const response = await fetch(`${API_BASE_URL}/trips/matches/${requestId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend indisponible, retornando coincidencia mock dinámica:', error);
    return {
      requestId: requestId || 'req-123',
      matches: [
        {
          tripId: 'trip-' + Math.floor(Math.random() * 900 + 100),
          passengerCount: 12,
          capacity: 30,
          estimatedPrice: 1800,
          estimatedSavings: 35,
          departureTime: lastTripRequestData?.departureTime || '2026-08-22T08:30:00'
        }
      ]
    };
  }
}

// 3. Obtener un viaje (GET /api/trips/{tripId})
export async function getTripDetails(tripId) {
  try {
    const response = await fetch(`${API_BASE_URL}/trips/${tripId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend indisponible, generando respuesta mock dinámica basada en la búsqueda actual:', error);

    const origin = lastTripRequestData?.origin || { latitude: -34.6037, longitude: -58.3816, address: 'Obelisco' };
    const destination = lastTripRequestData?.destination || { latitude: -34.5895, longitude: -58.3974, address: 'Palermo' };

    const midLat = (origin.latitude + destination.latitude) / 2.0;
    const midLng = (origin.longitude + destination.longitude) / 2.0;

    return {
      tripId: tripId || 'trip-456',
      status: 'CONFIRMED',
      passengerCount: 14,
      capacity: 30,
      estimatedPricePerPassenger: 1800,
      estimatedSavingsPercent: 35,
      departureTime: lastTripRequestData?.departureTime || '2026-08-22T08:30:00',
      route: {
        distanceMeters: 8500,
        durationSeconds: 1800,
        polyline: `MOCK_POLYLINE:${origin.latitude},${origin.longitude};${midLat},${midLng};${destination.latitude},${destination.longitude}`
      },
      stops: [
        {
          stopId: 'stop-1',
          type: 'PICKUP',
          order: 1,
          latitude: origin.latitude,
          longitude: origin.longitude,
          address: origin.address || 'Punto de Origen'
        },
        {
          stopId: 'stop-2',
          type: 'PICKUP',
          order: 2,
          latitude: midLat,
          longitude: midLng,
          address: 'Parada Intermedia de Pasajeros'
        },
        {
          stopId: 'stop-3',
          type: 'DROPOFF',
          order: 3,
          latitude: destination.latitude,
          longitude: destination.longitude,
          address: destination.address || 'Punto de Destino'
        }
      ]
    };
  }
}

// 4. Crear/generar una ruta (POST /api/routes/optimize)
export async function optimizeRoute(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/routes/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Backend indisponible, retornando optimización mock:', error);
    const origin = data?.origin || { latitude: -34.6037, longitude: -58.3816 };
    const destination = data?.destination || { latitude: -34.5895, longitude: -58.3974 };
    const stops = data?.stops || [];

    const orderedStops = stops.map((s, idx) => ({
      order: idx + 1,
      latitude: s.latitude,
      longitude: s.longitude
    }));

    return {
      distanceMeters: 8500,
      durationSeconds: 1800,
      orderedStops,
      polyline: `MOCK_POLYLINE:${origin.latitude},${origin.longitude};${destination.latitude},${destination.longitude}`
    };
  }
}
