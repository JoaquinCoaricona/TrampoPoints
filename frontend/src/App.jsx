import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';

// Vistas y Páginas de la Aplicación (Estructura Modular de React)
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import RequestPage from './pages/RequestPage';
import MyRequestsPage from './pages/MyRequestsPage';
import DriverPage from './pages/DriverPage';
import OptimizerPage from './pages/OptimizerPage';

import { AuthProvider, useAuth } from './context/AuthContext';
import { createTripRequest, getTripMatches, getTripDetails, getAllTripRequests, processGroupingAlgorithm } from './services/api';
import {
  PlusCircle,
  ListOrdered,
  Route as RouteIcon,
  Info,
  UserCheck,
  LogIn,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import './App.css';

const LOCAL_STORAGE_REQUESTS_KEY = 'trampopoints_requests_store';

const SEEDED_DEMO_REQUESTS = [
  {
    requestId: 'req-101',
    userName: 'Juan Pérez',
    userEmail: 'juan@email.com',
    origin: { latitude: -34.5620, longitude: -58.4560, address: 'Av. Cabildo y Juramento, Belgrano' },
    destination: { latitude: -34.6080, longitude: -58.3720, address: 'Plaza de Mayo, Microcentro' },
    departureTime: '2026-08-22T08:30:00',
    status: 'SEARCHING',
    createdAt: '08:15'
  },
  {
    requestId: 'req-102',
    userName: 'María González',
    userEmail: 'maria@email.com',
    origin: { latitude: -34.5635, longitude: -58.4542, address: 'Av. Cabildo y Mendoza, Belgrano' },
    destination: { latitude: -34.6065, longitude: -58.3740, address: 'Av. de Mayo y Perú, Microcentro' },
    departureTime: '2026-08-22T08:30:00',
    status: 'SEARCHING',
    createdAt: '08:16'
  },
  {
    requestId: 'req-103',
    userName: 'Carlos Rodríguez',
    userEmail: 'carlos@email.com',
    origin: { latitude: -34.5602, longitude: -58.4580, address: 'Av. Cabildo y Echeverría, Belgrano' },
    destination: { latitude: -34.6040, longitude: -58.3755, address: 'Florida y Diagonal Norte, Microcentro' },
    departureTime: '2026-08-22T08:30:00',
    status: 'SEARCHING',
    createdAt: '08:17'
  },
  {
    requestId: 'req-104',
    userName: 'Ana Martínez',
    userEmail: 'ana@email.com',
    origin: { latitude: -34.5650, longitude: -58.4520, address: 'Av. Cramer y Juramento, Belgrano' },
    destination: { latitude: -34.6095, longitude: -58.3705, address: 'Paseo Colón y Belgrano, Puerto Madero' },
    departureTime: '2026-08-22T08:30:00',
    status: 'SEARCHING',
    createdAt: '08:18'
  },
  {
    requestId: 'req-105',
    userName: 'Lucas Fernández',
    userEmail: 'lucas@email.com',
    origin: { latitude: -34.5610, longitude: -58.4530, address: 'Cuba y Sucre, Belgrano' },
    destination: { latitude: -34.6050, longitude: -58.3730, address: 'Reconquista y Corrientes, Microcentro' },
    departureTime: '2026-08-22T08:30:00',
    status: 'SEARCHING',
    createdAt: '08:19'
  },
  {
    requestId: 'req-106',
    userName: 'Sofía López',
    userEmail: 'sofia@email.com',
    origin: { latitude: -34.5640, longitude: -58.4575, address: 'Av. Cabildo y Olazábal, Belgrano' },
    destination: { latitude: -34.6070, longitude: -58.3710, address: 'Balcarce y Alsina, Montserrat' },
    departureTime: '2026-08-22T08:30:00',
    status: 'SEARCHING',
    createdAt: '08:20'
  },
  {
    requestId: 'req-107',
    userName: 'Diego Gómez',
    userEmail: 'diego@email.com',
    origin: { latitude: -34.5590, longitude: -58.4550, address: 'Av. Cabildo y Blanco Encalada, Belgrano' },
    destination: { latitude: -34.6030, longitude: -58.3770, address: 'Lavalle y Florida, Microcentro' },
    departureTime: '2026-08-22T08:30:00',
    status: 'SEARCHING',
    createdAt: '08:21'
  },
  {
    requestId: 'req-108',
    userName: 'Valentina Díaz',
    userEmail: 'valentina@email.com',
    origin: { latitude: -34.5628, longitude: -58.4510, address: 'Vuelta de Obligado y Juramento, Belgrano' },
    destination: { latitude: -34.6088, longitude: -58.3735, address: 'Av. de Mayo y Bolívar, Microcentro' },
    departureTime: '2026-08-22T08:30:00',
    status: 'SEARCHING',
    createdAt: '08:22'
  },
  {
    requestId: 'req-109',
    userName: 'Mateo Romero',
    userEmail: 'mateo@email.com',
    origin: { latitude: -34.5662, longitude: -58.4535, address: 'Av. Cabildo y Monroe, Belgrano' },
    destination: { latitude: -34.6045, longitude: -58.3715, address: '25 de Mayo y Tucumán, Microcentro' },
    departureTime: '2026-08-22T08:30:00',
    status: 'SEARCHING',
    createdAt: '08:23'
  },
  {
    requestId: 'req-110',
    userName: 'Camila Torres',
    userEmail: 'camila@email.com',
    origin: { latitude: -34.5615, longitude: -58.4590, address: 'Ciudad de la Paz y Juramento, Belgrano' },
    destination: { latitude: -34.6060, longitude: -58.3760, address: 'Bartolomé Mitre y San Martín, Microcentro' },
    departureTime: '2026-08-22T08:30:00',
    status: 'SEARCHING',
    createdAt: '08:24'
  }
];

function MainApp() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [isDriverMode, setIsDriverMode] = useState(false);
  const [activeTab, setActiveTab] = useState('LANDING'); // 'LANDING' (Pagina de ventas) o 'CREATE' | 'ADMIN' | 'MY_REQUESTS' | 'OPTIMIZER' (Sistema)
  const [viewState, setViewState] = useState('FORM'); // 'FORM' | 'CONFIRMATION' | 'MATCHES' | 'DETAILS'
  
  const [loading, setLoading] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  const [lastCreatedRequest, setLastCreatedRequest] = useState(null);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // Cargar solicitudes desde LocalStorage al iniciar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_REQUESTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.length < 10) {
          setAllRequests(SEEDED_DEMO_REQUESTS);
          localStorage.setItem(LOCAL_STORAGE_REQUESTS_KEY, JSON.stringify(SEEDED_DEMO_REQUESTS));
        } else {
          setAllRequests(parsed);
        }
      } else {
        setAllRequests(SEEDED_DEMO_REQUESTS);
        localStorage.setItem(LOCAL_STORAGE_REQUESTS_KEY, JSON.stringify(SEEDED_DEMO_REQUESTS));
      }
    } catch {
      setAllRequests(SEEDED_DEMO_REQUESTS);
    }
  }, []);

  const saveRequestsToStorage = (updatedRequests) => {
    setAllRequests(updatedRequests);
    try {
      localStorage.setItem(LOCAL_STORAGE_REQUESTS_KEY, JSON.stringify(updatedRequests));
    } catch (e) {
      console.warn('Error guardando solicitudes en LocalStorage:', e);
    }
  };

  // Ingresar al sistema desde la Landing Page
  const handleEnterAppFromLanding = (targetTab = 'CREATE') => {
    setActiveTab(targetTab);
    setViewState('FORM');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Crear solicitud de viaje
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
      setViewState('CONFIRMATION');
    } catch (err) {
      console.error('Error al procesar la solicitud de viaje:', err);
    } finally {
      setLoading(false);
    }
  };

  // Ver coincidencias
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

  // Seleccionar viaje
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

  // Ejecutar algoritmo de agrupamiento (Backend REST)
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

  const userRequests = allRequests.filter(r =>
    !user || r.userEmail === user.email || r.userEmail === 'invitado@trampopoints.com'
  );

  // SI ESTAMOS EN LA LANDING PAGE: Se muestra la Landing Page en pantalla completa (separada del sistema)
  if (activeTab === 'LANDING') {
    return (
      <div className="app-layout landing-layout">
        <AuthModal />
        <LandingPage
          onEnterApp={handleEnterAppFromLanding}
          onOpenAuthModal={() => openAuthModal('LOGIN')}
        />
      </div>
    );
  }

  // SI EL USUARIO HIZO CLIC EN "QUIERO VIAJAR" O ENTRA AL SISTEMA: Se muestra el Sistema con su Header y Pestañas
  return (
    <div className="app-layout system-layout">
      <Header
        onToggleDriverMode={() => setIsDriverMode(!isDriverMode)}
        isDriverModeActive={isDriverMode}
      />
      <AuthModal />

      <main className="main-content container margin-top-20">
        {isDriverMode ? (
          <DriverPage onExit={() => setIsDriverMode(false)} />
        ) : (
          <>
            {/* Navegación del Sistema */}
            <div className="nav-tabs-container margin-bottom-24 flex-between align-center flex-wrap gap-12">
              <div className="flex-center gap-10 flex-wrap">
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
                  <PlusCircle size={16} /> Pedir Viaje
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

              {/* Botón para regresar a la Landing Page */}
              <button
                className="btn-secondary text-xs flex-center gap-6"
                onClick={() => setActiveTab('LANDING')}
              >
                <ArrowLeft size={14} /> Volver a la Landing
              </button>
            </div>

            {/* Banner de Estado de Autenticación */}
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

            {/* VISTAS DEL SISTEMA */}
            {/* 1. PAGINA DE ADMINISTRADOR */}
            {isAdmin && activeTab === 'ADMIN' && (
              <AdminPage
                allRequests={allRequests}
                onRunAlgorithm={handleRunGroupingAlgorithm}
                onUpdateStatus={handleUpdateStatusByAdmin}
                onDeleteRequest={handleDeleteRequestByAdmin}
                onViewMatches={handleViewRequestMatches}
              />
            )}

            {/* 2. PAGINA DE PEDIR VIAJE / SOLICITUDES */}
            {activeTab === 'CREATE' && (
              <RequestPage
                viewState={viewState}
                setViewState={setViewState}
                lastCreatedRequest={lastCreatedRequest}
                currentRequestId={currentRequestId}
                matches={matches}
                selectedTrip={selectedTrip}
                loading={loading}
                onSubmitRequest={handleCreateRequest}
                onSelectTrip={handleSelectTrip}
                onResetForm={handleResetForm}
                onViewMyRequests={() => setActiveTab(isAdmin ? 'ADMIN' : 'MY_REQUESTS')}
              />
            )}

            {/* 3. PAGINA DE HISTORIAL DEL PASAJERO */}
            {activeTab === 'MY_REQUESTS' && (
              <MyRequestsPage
                userRequests={userRequests}
                onNewRequest={() => { setActiveTab('CREATE'); setViewState('FORM'); }}
                onViewMatches={handleViewRequestMatches}
              />
            )}

            {/* 4. PAGINA DE PRUEBA DE API DE OPTIMIZACION */}
            {activeTab === 'OPTIMIZER' && (
              <OptimizerPage />
            )}
          </>
        )}
      </main>
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
