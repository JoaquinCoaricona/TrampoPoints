const API_BASE_URL = 'http://localhost:8080/api';

/**
 * Cliente HTTP REST para los contratos del MVP de TrampoPoints.
 */

// 1. Crear solicitud de viaje (POST /api/trips/requests)
export async function createTripRequest(data) {
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
    console.warn('Backend indisponible o error en red, utilizando respuesta mock según contrato:', error);
    // Fallback con respuesta idéntica al contrato
    return {
      requestId: 'req-123',
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
    console.warn('Backend indisponible, retornando coincidencia mock según contrato:', error);
    return {
      requestId: requestId || 'req-123',
      matches: [
        {
          tripId: 'trip-456',
          passengerCount: 12,
          capacity: 30,
          estimatedPrice: 1800,
          estimatedSavings: 35,
          departureTime: '2026-08-22T08:30:00'
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
    console.warn('Backend indisponible, retornando detalles de viaje mock según contrato:', error);
    return {
      tripId: tripId || 'trip-456',
      status: 'CONFIRMED',
      passengerCount: 12,
      capacity: 30,
      estimatedPricePerPassenger: 1800,
      estimatedSavingsPercent: 35,
      departureTime: '2026-08-22T08:30:00',
      route: {
        distanceMeters: 8500,
        durationSeconds: 1800,
        polyline: 'ROUTE_POLYLINE'
      },
      stops: [
        {
          stopId: 'stop-1',
          type: 'PICKUP',
          order: 1,
          latitude: -34.6037,
          longitude: -58.3816,
          address: 'Obelisco'
        },
        {
          stopId: 'stop-2',
          type: 'PICKUP',
          order: 2,
          latitude: -34.6001,
          longitude: -58.3900,
          address: 'Parada 2'
        },
        {
          stopId: 'stop-3',
          type: 'DROPOFF',
          order: 3,
          latitude: -34.5895,
          longitude: -58.3974,
          address: 'Palermo'
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
    console.warn('Backend indisponible, retornando optimización mock según contrato:', error);
    return {
      distanceMeters: 8500,
      durationSeconds: 1800,
      orderedStops: [
        {
          order: 1,
          latitude: -34.6001,
          longitude: -58.3900
        },
        {
          order: 2,
          latitude: -34.5950,
          longitude: -58.3950
        }
      ],
      polyline: 'ROUTE_POLYLINE'
    };
  }
}
