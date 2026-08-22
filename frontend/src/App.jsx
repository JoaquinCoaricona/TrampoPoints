import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TripRequestForm from './components/TripRequestForm';
import RequestConfirmation from './components/RequestConfirmation';
import MatchList from './components/MatchList';
import TripDetails from './components/TripDetails';
import RouteOptimizer from './components/RouteOptimizer';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import DriverModule from './components/driver/DriverModule';
import { AuthProvider, useAuth } from './context/AuthContext';
import { createTripRequest, getTripMatches, getTripDetails, getAllTripRequests, processGroupingAlgorithm } from './services/api';
import {
  PlusCircle,
  ListOrdered,
  Route as RouteIcon,
  Info,
  MapPin,
  Navigation,
  ArrowRight,
  UserCheck,
  LogIn,
  ShieldCheck
} from 'lucide-react';
import './App.css';

const LOCAL_STORAGE_REQUESTS_KEY = 'trampopoints_requests_store';

const SEEDED_DEMO_REQUESTS = [
  {
    requestId: 'req-101',
    userName: 'Juan Pérez',
    userEmail: 'juan@email.com',
    origin: { latitude: -34.6037, longitude: -58.3816, address: 'Obelisco (Av. 9 de Julio)' },
    destination: { latitude: -34.5895, longitude: -58.3974, address: 'Palermo Soho' },
    departureTime: '2026-08-22T08:30:00',
    status: 'CONFIRMED',
    createdAt: '08:15'
  },
  {
    requestId: 'req-102',
    userName: 'María González',
    userEmail: 'maria@email.com',
    origin: { latitude: -34.5614, longitude: -58.4563, address: 'Belgrano (Juramento y Cabildo)' },
    destination: { latitude: -34.4580, longitude: -58.9142, address: 'Pilar Centro' },
    departureTime: '2026-08-22T09:00:00',
    status: 'SEARCHING',
    createdAt: '08:20'
  },
  {
    requestId: 'req-103',
    userName: 'Carlos Rodríguez',
    userEmail: 'carlos@email.com',
    origin: { latitude: -34.4719, longitude: -58.5283, address: 'Estación San Isidro' },
    destination: { latitude: -34.6083, longitude: -58.3712, address: 'Plaza de Mayo / Microcentro' },
    departureTime: '2026-08-22T08:45:00',
    status: 'SEARCHING',
    createdAt: '08:25'
  }
];

function MainApp() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isDriver = user?.role === 'DRIVER' || user?.role === 'CHOFER';

  const [activeTab, setActiveTab] = useState('CREATE'); // 'ADMIN' | 'CREATE' | 'MY_REQUESTS' | 'OPTIMIZER'
  const [viewState, setViewState] = useState('FORM'); // 'FORM' | 'CONFIRMATION' | 'MATCHES' | 'DETAILS'
  
  const [loading, setLoading] = useState(false);
  const [allRequests, setAllRequests] = useState([]); // Almacén global de solicitudes (persistido)
  const [lastCreatedRequest, setLastCreatedRequest] = useState(null);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);


  // Cargar solicitudes desde LocalStorage al iniciar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_REQUESTS_KEY);
      if (stored) {
        setAllRequests(JSON.parse(stored));
      } else {
        setAllRequests(SEEDED_DEMO_REQUESTS);
        localStorage.setItem(LOCAL_STORAGE_REQUESTS_KEY, JSON.stringify(SEEDED_DEMO_REQUESTS));
      }
    } catch {
      setAllRequests(SEEDED_DEMO_REQUESTS);
    }
  }, []);

  // Guardar en LocalStorage cada vez que cambien las solicitudes
  const saveRequestsToStorage = (updatedRequests) => {
    setAllRequests(updatedRequests);
    try {
      localStorage.setItem(LOCAL_STORAGE_REQUESTS_KEY, JSON.stringify(updatedRequests));
    } catch (e) {
      console.warn('Error guardando solicitudes en LocalStorage:', e);
    }
  };

  // 1. Crear una solicitud de viaje (POST /api/trips/requests)
  const handleCreateRequest = async (formData) => {
    setLoading(true);
    try {
      const reqRes = await createTripRequest(formData);
      const newReqId = reqRes.requestId;

      const newRequestItem = {
        requestId: newReqId,
        userName: user?.name || 'Pasajero Invitado',
        userEmail: user?.email || 'invitado@trampopoints.com',
        origin: formData.origin,
        destination: formData.destination,
        departureTime: formData.departureTime,
        status: reqRes.status || 'SEARCHING',
        message: reqRes.message,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedList = [newRequestItem, ...allRequests];
      saveRequestsToStorage(updatedList);

      setLastCreatedRequest(newRequestItem);
      setCurrentRequestId(newReqId);

      // Pantalla de confirmación de solicitud cargada
      setViewState('CONFIRMATION');
    } catch (err) {
      console.error('Error al procesar la solicitud de viaje:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Ver coincidencias/recorrido de una solicitud seleccionada
  const handleViewRequestMatches = async (requestItem) => {
    setLoading(true);
    setCurrentRequestId(requestItem.requestId);
    setActiveTab('CREATE');
    try {
      const matchesRes = await getTripMatches(requestItem.requestId);
      setMatches(matchesRes.matches || []);
      setViewState('MATCHES');
    } catch (err) {
      console.error('Error al consultar las coincidencias:', err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Seleccionar un viaje de la lista y obtener sus detalles (GET /api/trips/{tripId})
  const handleSelectTrip = async (tripId) => {
    setLoading(true);
    try {
      const tripData = await getTripDetails(tripId);
      setSelectedTrip(tripData);
      setViewState('DETAILS');
    } catch (err) {
      console.error('Error al obtener los detalles del viaje:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunGroupingAlgorithm = async () => {
    try {
      const result = await processGroupingAlgorithm();
      try {
        const refreshedRequests = await getAllTripRequests();
        if (refreshedRequests && refreshedRequests.length > 0) {
          saveRequestsToStorage(refreshedRequests);
        }
      } catch (e) {
        console.warn('No se pudieron refrescar solicitudes desde backend:', e);
      }

      return {
        newTrips: result.trips || [],
        summary: {
          processedCount: result.processedCount || 0,
          tripsCreated: result.tripsCreatedCount || 0,
          message: result.message || 'Algoritmo ejecutado en el backend con éxito.'
        }
      };
    } catch (err) {
      console.error('Error al ejecutar algoritmo en el backend:', err);
      throw err;
    }
  };

  const handleUpdateStatusByAdmin = (requestId, newStatus) => {
    const updated = allRequests.map(r => r.requestId === requestId ? { ...r, status: newStatus } : r);
    saveRequestsToStorage(updated);
  };

  const handleDeleteRequestByAdmin = (requestId) => {
    const updated = allRequests.filter(r => r.requestId !== requestId);
    saveRequestsToStorage(updated);
  };

  const handleResetForm = () => {
    setViewState('FORM');
    setCurrentRequestId(null);
    setLastCreatedRequest(null);
    setMatches([]);
    setSelectedTrip(null);
  };

  // Filtrar las solicitudes propias del usuario logueado
  const userRequests = allRequests.filter(r =>
    !user || r.userEmail === user.email || r.userEmail === 'invitado@trampopoints.com'
  );

  return (
    <div className="app-layout">
      <Header />
      <AuthModal />

      <main className="main-content container">
        {isDriver ? (
          <DriverModule />
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="nav-tabs-container margin-bottom-24">
              {isAdmin && (
                <button
                  className={`tab-btn tab-btn-admin ${activeTab === 'ADMIN' ? 'active' : ''}`}
                  onClick={() => setActiveTab('ADMIN')}
                >
                  <ShieldCheck size={16} /> Panel Administrador ({allRequests.length})
                </button>
              )}


              <button
                className={`tab-btn ${activeTab === 'CREATE' ? 'active' : ''}`}
                onClick={() => { setActiveTab('CREATE'); setViewState('FORM'); }}
              >
                <PlusCircle size={16} /> Crear Solicitud
              </button>

              <button
                className={`tab-btn ${activeTab === 'MY_REQUESTS' ? 'active' : ''}`}
                onClick={() => setActiveTab('MY_REQUESTS')}
              >
                <ListOrdered size={16} /> Mis Solicitudes ({userRequests.length})
              </button>

              <button
                className={`tab-btn ${activeTab === 'OPTIMIZER' ? 'active' : ''}`}
                onClick={() => setActiveTab('OPTIMIZER')}
              >
                <RouteIcon size={16} /> Probar API Optimización
              </button>
            </div>

            {/* User Greeting / Auth Status Bar */}
            {isAuthenticated ? (
              <div className={`banner ${isAdmin ? 'banner-amber' : 'banner-auth-success'} margin-bottom-24`}>
                {isAdmin ? (
                  <ShieldCheck size={18} className="banner-icon text-amber" />
                ) : (
                  <UserCheck size={18} className="banner-icon text-emerald" />
                )}
                <div>
                  Sesión activa como <strong>{user.name}</strong> ({user.email}). {isAdmin ? 'Tenés permisos de Administrador para gestionar todas las solicitudes del sistema.' : 'Tus solicitudes creadas quedarán vinculadas a tu cuenta.'}
                </div>
              </div>
            ) : (
              <div className="banner banner-auth-prompt margin-bottom-24">
                <Info size={18} className="banner-icon text-indigo" />
                <div className="flex-between flex-grow">
                  <span>Ingresá a tu cuenta para gestionar reservas. Probá ingresar como Pasajero o como Administrador.</span>
                  <button
                    className="btn-link-action"
                    onClick={() => openAuthModal('LOGIN')}
                  >
                    <LogIn size={14} /> Iniciar Sesión
                  </button>
                </div>
              </div>
            )}

            {/* Pestaña Administrador */}
            {isAdmin && activeTab === 'ADMIN' && (
              <AdminPanel
                allRequests={allRequests}
                onRunAlgorithm={handleRunGroupingAlgorithm}
                onUpdateStatus={handleUpdateStatusByAdmin}
                onDeleteRequest={handleDeleteRequestByAdmin}
                onViewMatches={handleViewRequestMatches}
              />
            )}

            {/* Tab 1: Crear / Confirmación / Ver Matches / Ver Detalles */}
            {activeTab === 'CREATE' && (
              <div>
                {viewState === 'FORM' && (
                  <TripRequestForm onSubmit={handleCreateRequest} loading={loading} />
                )}

                {viewState === 'CONFIRMATION' && (
                  <RequestConfirmation
                    requestData={lastCreatedRequest}
                    onCreateAnother={() => setViewState('FORM')}
                    onViewMyRequests={() => setActiveTab(isAdmin ? 'ADMIN' : 'MY_REQUESTS')}
                  />
                )}

                {viewState === 'MATCHES' && (
                  <MatchList
                    requestId={currentRequestId}
                    matches={matches}
                    onSelectTrip={handleSelectTrip}
                    onReset={handleResetForm}
                  />
                )}

                {viewState === 'DETAILS' && (
                  <TripDetails
                    tripData={selectedTrip}
                    onBack={() => setViewState('MATCHES')}
                  />
                )}
              </div>
            )}

            {/* Tab 2: Mis Solicitudes */}
            {activeTab === 'MY_REQUESTS' && (
              <div className="card glass-card">
                <div className="card-header flex-between">
                  <h2>Mis Solicitudes de Viaje Cargadas</h2>
                  <button 
                    className="btn-primary"
                    onClick={() => { setActiveTab('CREATE'); setViewState('FORM'); }}
                  >
                    <PlusCircle size={16} /> + Nueva Solicitud
                  </button>
                </div>

                {userRequests.length === 0 ? (
                  <div className="empty-state padding-32 text-center">
                    <h3>No has cargado solicitudes de viaje todavía.</h3>
                    <p>Crea tu primera solicitud indicando origen, destino y hora deseada.</p>
                    <button 
                      className="btn-primary margin-top-16"
                      onClick={() => { setActiveTab('CREATE'); setViewState('FORM'); }}
                    >
                      Cargar Primera Solicitud
                    </button>
                  </div>
                ) : (
                  <div className="requests-list flex-column gap-16 margin-top-16">
                    {userRequests.map((req) => (
                      <div key={req.requestId} className="request-card-item card glass-card">
                        <div className="flex-between">
                          <span className="badge badge-subtle">ID Solicitud: {req.requestId}</span>
                          <span className="badge badge-success">Estado: {req.status}</span>
                        </div>

                        <div className="request-route-summary margin-top-12">
                          <div>
                            <strong><MapPin size={14} className="text-emerald" /> Origen:</strong> {req.origin?.address}
                          </div>
                          <div>
                            <strong><Navigation size={14} className="text-indigo" /> Destino:</strong> {req.destination?.address}
                          </div>
                          <div>
                            <strong>Hora Salida:</strong> {new Date(req.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs
                          </div>
                        </div>

                        <div className="margin-top-16 flex-between align-center">
                          <span className="text-muted text-xs">Cargada por {req.userName} a las {req.createdAt} hs</span>
                          <button
                            className="btn-secondary flex-center gap-4"
                            onClick={() => handleViewRequestMatches(req)}
                          >
                            Ver Recorrido del Viaje <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Ruta Optimizer */}
            {activeTab === 'OPTIMIZER' && <RouteOptimizer />}
          </>
        )}
      </main>

      <footer className="app-footer margin-top-48">
        <div className="container footer-content flex-between">
          <span>TrampoPoints MVP &copy; 2026 — Plataforma de Viajes Compartidos en Combis</span>
          <span>Cumplimiento estricto de Contratos JSON REST</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
