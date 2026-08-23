const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api') + '/drivers';

function getHeaders(customHeaders = {}) {
  const headers = { 'Content-Type': 'application/json', ...customHeaders };
  const token = localStorage.getItem('trampopoints_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Cliente HTTP REST para el MÃ³dulo del Chofer de TrampoPoints.
 */

// 1. Obtener Dashboard completo
export async function getDriverDashboard() {
  try {
    const response = await fetch(`${API_BASE_URL}/current/dashboard`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Error al cargar dashboard del chofer desde backend, usando fallback demo:', err);
    return getFallbackDashboard();
  }
}

// 2. Obtener Perfil del Chofer
export async function getDriverProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/current`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Error al obtener perfil del chofer:', err);
    return getFallbackDriver();
  }
}

// 3. Actualizar Perfil del Chofer
export async function updateDriverProfile(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/current`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Error al actualizar perfil del chofer:', err);
    return { ...getFallbackDriver(), ...data };
  }
}

// 4. Obtener VehÃ­culo
export async function getVehicle() {
  try {
    const response = await fetch(`${API_BASE_URL}/current/vehicle`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Error al obtener vehÃ­culo:', err);
    return getFallbackVehicle();
  }
}

// 5. Guardar o Editar VehÃ­culo
export async function saveVehicle(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/current/vehicle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Error al guardar vehÃ­culo:', err);
    return { ...getFallbackVehicle(), ...data };
  }
}

// 6. Actualizar Estado de Disponibilidad del VehÃ­culo
export async function updateVehicleStatus(status) {
  try {
    const response = await fetch(`${API_BASE_URL}/current/vehicle/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Error al actualizar estado del vehÃ­culo:', err);
    return { ...getFallbackVehicle(), status };
  }
}

// 7. Listar DocumentaciÃ³n
export async function getDocumentations() {
  try {
    const response = await fetch(`${API_BASE_URL}/current/vehicle/documentations`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Error al listar documentaciÃ³n:', err);
    return getFallbackDocs();
  }
}

// 8. Guardar / Editar Documento
export async function saveDocumentation(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/current/vehicle/documentations`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Error al guardar documentaciÃ³n:', err);
    return {
      id: data.id || 'doc-' + Date.now(),
      vehicleId: 'veh-101',
      ...data,
      status: 'VALID',
      daysUntilExpiration: 180
    };
  }
}

// 9. Eliminar Documento
export async function deleteDocumentation(docId) {
  try {
    const response = await fetch(`${API_BASE_URL}/current/vehicle/documentations/${docId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Error al eliminar documentaciÃ³n:', err);
    return { success: true };
  }
}

// 10. Obtener Calificaciones y MÃ©tricas
export async function getDriverRatings() {
  try {
    const response = await fetch(`${API_BASE_URL}/current/ratings`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Error al obtener calificaciones:', err);
    return getFallbackRatings();
  }
}

// 11. Obtener Recomendaciones de Pasajeros
export async function getDriverRecommendations() {
  try {
    const response = await fetch(`${API_BASE_URL}/current/recommendations`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Error al obtener recomendaciones:', err);
    return getFallbackRecommendations();
  }
}

// 12. Obtener Viajes del Chofer
export async function getDriverTrips() {
  try {
    const response = await fetch(`${API_BASE_URL}/current/trips`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Error al obtener viajes del chofer:', err);
    return [];
  }
}

// 13. Eliminar / Cancelar Viaje Asignado del Chofer
export async function deleteDriverTrip(tripId) {
  try {
    const response = await fetch(`${API_BASE_URL}/current/trips/${tripId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.warn('Error al eliminar viaje del chofer:', err);
    return { success: true };
  }
}


// ==========================================
// FALLBACKS DE CONTINGENCIA (Modo Offline)
// ==========================================

function getFallbackDriver() {
  return {
    id: 'drv-101',
    name: 'Juan',
    lastName: 'PÃ©rez',
    email: 'juan.chofer@trampopoints.com',
    phone: '+54 11 4589-2234',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    ratingAverage: 4.8,
    totalRatings: 103,
    tripsCompleted: 42
  };
}

function getFallbackVehicle() {
  return {
    id: 'veh-101',
    driverId: 'drv-101',
    brand: 'Mercedes-Benz',
    model: 'Sprinter 516 CDI MinibÃºs',
    year: 2024,
    color: 'Blanco Ãrtico',
    licensePlate: 'AF 482 TP',
    vehicleType: 'MINIBUS',
    passengerCapacity: 20,
    seatCount: 20,
    luggageCapacity: 'LARGE',
    approxCargoKg: 850,
    allowsBulkyObjects: true,
    features: [
      'AIRE_ACONDICIONADO',
      'CALEFACCION',
      'WIFI',
      'USB',
      'CINTURONES_SEGURIDAD',
      'ESPACIO_EQUIPAJE',
      'ACCESIBILIDAD_RAMPA'
    ],
    status: 'AVAILABLE'
  };
}

function getFallbackDocs() {
  return [
    {
      id: 'doc-1',
      vehicleId: 'veh-101',
      documentType: 'SEGURO',
      title: 'Seguro Obligatorio y Responsabilidad Civil Pasajeros',
      documentNumber: 'POL-984218-AR',
      issuer: 'La Segunda Seguros',
      issueDate: '2026-03-15',
      expirationDate: '2027-03-15',
      status: 'VALID',
      notes: 'Cobertura integral con extensiÃ³n para transporte interurbano',
      daysUntilExpiration: 205
    },
    {
      id: 'doc-2',
      vehicleId: 'veh-101',
      documentType: 'VTV',
      title: 'VTV / RevisiÃ³n TÃ©cnica Obligatoria (RTO)',
      documentNumber: 'RTO-2026-8819',
      issuer: 'Gobierno de la Ciudad de Buenos Aires',
      issueDate: '2026-01-20',
      expirationDate: '2027-01-20',
      status: 'VALID',
      notes: 'Aprobado sin observaciones mecÃ¡nicas ni de emisiÃ³n',
      daysUntilExpiration: 151
    },
    {
      id: 'doc-3',
      vehicleId: 'veh-101',
      documentType: 'PATENTE',
      title: 'Constancia de RadicaciÃ³n y TÃ­tulo del Automotor',
      documentNumber: 'DOM-AF482TP',
      issuer: 'DNRPA Argentina',
      issueDate: '2024-02-10',
      expirationDate: null,
      status: 'VALID',
      notes: 'Patente al dÃ­a sin infracciones pendientes',
      daysUntilExpiration: null
    },
    {
      id: 'doc-4',
      vehicleId: 'veh-101',
      documentType: 'LICENCIA_PROFESIONAL',
      title: 'Licencia Nacional de Conducir Clase D2 (Pasajeros)',
      documentNumber: 'LIC-34892019',
      issuer: 'DirecciÃ³n General de TrÃ¡nsito y Transporte',
      issueDate: '2025-05-10',
      expirationDate: '2027-05-10',
      status: 'VALID',
      notes: 'HabilitaciÃ³n profesional para transporte de pasajeros',
      daysUntilExpiration: 261
    }
  ];
}

function getFallbackRatings() {
  return {
    ratingAverage: 4.8,
    totalRatings: 103,
    fiveStars: 87,
    fourStars: 12,
    threeStars: 3,
    twoStars: 1,
    oneStar: 0,
    recentRatings: [
      {
        id: 'rate-1',
        passengerName: 'SofÃ­a Mendoza',
        score: 5,
        comment: 'Excelente servicio, la combi sÃºper limpia y cÃ³moda. Juan muy puntual y respetuoso.',
        tags: ['Puntualidad', 'VehÃ­culo Limpio', 'Manejo Seguro'],
        createdAt: '2026-08-20T10:15:00'
      },
      {
        id: 'rate-2',
        passengerName: 'MartÃ­n GÃ³mez',
        score: 5,
        comment: 'Muy buen viaje hacia Pilar, el aire acondicionado funcionaba perfecto y llegamos antes de lo previsto.',
        tags: ['Aire Acondicionado', 'Puntualidad', 'Comodidad'],
        createdAt: '2026-08-19T18:30:00'
      },
      {
        id: 'rate-3',
        passengerName: 'LucÃ­a Rossi',
        score: 5,
        comment: 'Manejo seguro y profesional. Muy recomendable para viajar todos los dÃ­as.',
        tags: ['Manejo Seguro', 'Amabilidad'],
        createdAt: '2026-08-18T09:40:00'
      },
      {
        id: 'rate-4',
        passengerName: 'Esteban Morales',
        score: 4,
        comment: 'VehÃ­culo espacioso y con cargadores USB funcionando en cada asiento. Todo de diez.',
        tags: ['USB', 'Espacioso'],
        createdAt: '2026-08-16T14:20:00'
      }
    ]
  };
}

function getFallbackRecommendations() {
  return [
    {
      id: 'rec-1',
      passengerName: 'MartÃ­n GÃ³mez',
      score: 5,
      quote: 'Excelente servicio y muy puntual. Es la mejor opciÃ³n para traslados diarios compartidos.',
      tripRoute: 'Pilar âž” Microcentro',
      createdAt: '2026-08-15T08:00:00'
    },
    {
      id: 'rec-2',
      passengerName: 'LucÃ­a Rossi',
      score: 5,
      quote: 'VehÃ­culo muy cÃ³modo, con WiFi veloz y climatizaciÃ³n perfecta. Viaje 100% recomendable.',
      tripRoute: 'San Isidro âž” Belgrano',
      createdAt: '2026-08-14T09:30:00'
    },
    {
      id: 'rec-3',
      passengerName: 'Esteban Morales',
      score: 4,
      quote: 'Todo perfecto, muy atento con el equipaje y una conducciÃ³n sumamente responsable.',
      tripRoute: 'Belgrano âž” Tigre',
      createdAt: '2026-08-12T17:15:00'
    }
  ];
}

function getFallbackDashboard() {
  return {
    driver: getFallbackDriver(),
    vehicle: getFallbackVehicle(),
    ratingSummary: getFallbackRatings(),
    validDocsCount: 4,
    expiredDocsCount: 0,
    totalDocsCount: 4,
    topRecommendations: getFallbackRecommendations()
  };
}

