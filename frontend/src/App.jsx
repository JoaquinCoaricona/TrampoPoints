import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import AuthModal from './components/AuthModal';

// Pages & Layouts
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DriverLayout from './layouts/DriverLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Driver Subpages
import DriverDashboard from './components/driver/DriverDashboard';
import DriverProfile from './components/driver/DriverProfile';
import DriverVehicle from './components/driver/DriverVehicle';
import DriverDocumentation from './components/driver/DriverDocumentation';
import DriverRatings from './components/driver/DriverRatings';
import DriverRecommendations from './components/driver/DriverRecommendations';

// Passenger & Admin Pages (Intact)
import RequestPage from './pages/RequestPage';
import MyRequestsPage from './pages/MyRequestsPage';
import AdminPage from './pages/AdminPage';
import OptimizerPage from './pages/OptimizerPage';

import { AuthProvider, useAuth } from './context/AuthContext';
import { resolveUserRole } from './services/authService';
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
    origin: { latitude: -34.5614, longitude: -58.4563, address: 'Juramento y Vuelta de Obligado, Belgrano' },
    destination: { latitude: -34.6040, longitude: -58.3750, address: 'Florida y Corrientes, Microcentro' },
    departureTime: '2026-08-22T08:30:00',
    status: 'SEARCHING',
    createdAt: '08:16'
  },
  {
    requestId: 'req-103',
    userName: 'Carlos Rodríguez',
    userEmail: 'carlos@email.com',
    origin: { latitude: -34.5630, longitude: -58.4550, address: 'Ciudad de la Paz y Echeverría, Belgrano' },
    destination: { latitude: -34.6085, longitude: -58.3715, address: 'Leandro N. Alem y Rivadavia, Casa Rosada' },
    departureTime: '2026-08-22T08:30:00',
    status: 'SEARCHING',
    createdAt: '08:17'
  }
];

// Landing Page Wrapper (Preserves Protected Landing without changes)
function LandingPageWrapper() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const userRole = resolveUserRole(user?.role, user?.email);

  // If already logged in as driver, forward directly to driver portal
  useEffect(() => {
    if (isAuthenticated && userRole === 'DRIVER') {
      navigate('/driver', { replace: true });
    }
  }, [isAuthenticated, userRole, navigate]);

  return (
    <div className="landing-page-wrap">
      <LandingPage
        onEnterApp={() => navigate('/app')}
        onOpenAuthModal={() => navigate('/login')}
      />
    </div>
  );
}

// Passenger & Admin Application View (/app)
function PassengerApp() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const userRole = resolveUserRole(user?.role, user?.email);
  const isAdmin = userRole === 'ADMIN';

  const [activeTab, setActiveTab] = useState('CREATE'); // 'CREATE' | 'ADMIN' | 'MY_REQUESTS' | 'OPTIMIZER'
  const [viewState, setViewState] = useState('FORM'); // 'FORM' | 'CONFIRMATION' | 'MATCHES' | 'DETAILS'

  const [loading, setLoading] = useState(false);
  const [allRequests, setAllRequests] = useState([]);
  const [lastCreatedRequest, setLastCreatedRequest] = useState(null);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

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

  const saveRequestsToStorage = (updatedRequests) => {
    setAllRequests(updatedRequests);
    try {
      localStorage.setItem(LOCAL_STORAGE_REQUESTS_KEY, JSON.stringify(updatedRequests));
    } catch (e) {
      console.warn('Error guardando solicitudes en LocalStorage:', e);
    }
  };

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
          message: result.message || 'Algoritmo ejecutado con éxito.'
        }
      };
    } catch (err) {
      console.error('Error al ejecutar algoritmo:', err);
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

  return (
    <div className="app-layout system-layout">
      <Header />

      <main className="main-content container margin-top-20">
        {/* Navigation Tabs */}
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

          <button
            className="btn-secondary text-xs flex-center gap-6"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={14} /> Volver a la Landing
          </button>
        </div>

        {/* User Auth Status Banner */}
        {isAuthenticated ? (
          <div className={`banner ${isAdmin ? 'banner-amber' : 'banner-auth-success'} margin-bottom-24`}>
            {isAdmin ? (
              <ShieldCheck size={18} className="banner-icon text-amber" />
            ) : (
              <UserCheck size={18} className="banner-icon text-neon-green" />
            )}
            <div>
              Sesión activa como <strong>{user.name}</strong> ({user.email}). {isAdmin ? 'Tenés permisos de Administrador para gestionar todas las solicitudes del sistema.' : 'Tus solicitudes creadas quedarán vinculadas a tu cuenta.'}
            </div>
          </div>
        ) : (
          <div className="banner banner-auth-prompt margin-bottom-24">
            <Info size={18} className="banner-icon text-electric-violet" />
            <div className="flex-between flex-grow">
              <span>Ingresá a tu cuenta para gestionar reservas o como chofer de combi.</span>
              <button
                className="btn-link-action"
                onClick={() => navigate('/login')}
              >
                <LogIn size={14} /> Iniciar Sesión
              </button>
            </div>
          </div>
        )}

        {/* 1. Admin Page */}
        {isAdmin && activeTab === 'ADMIN' && (
          <AdminPage
            allRequests={allRequests}
            onRunAlgorithm={handleRunGroupingAlgorithm}
            onUpdateStatus={handleUpdateStatusByAdmin}
            onDeleteRequest={handleDeleteRequestByAdmin}
            onViewMatches={handleViewRequestMatches}
          />
        )}

        {/* 2. Create Trip / Details */}
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

        {/* 3. My Requests Page */}
        {activeTab === 'MY_REQUESTS' && (
          <MyRequestsPage
            userRequests={userRequests}
            onNewRequest={() => { setActiveTab('CREATE'); setViewState('FORM'); }}
            onViewMatches={handleViewRequestMatches}
          />
        )}

        {/* 4. Optimizer Page */}
        {activeTab === 'OPTIMIZER' && (
          <OptimizerPage />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPageWrapper />} />

          {/* Standalone Login / Register Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* Passenger & Admin System Flow */}
          <Route path="/app/*" element={<PassengerApp />} />

          {/* Protected Driver Portal Routes */}
          <Route element={<ProtectedRoute allowedRoles={['DRIVER', 'CHOFER']} />}>
            <Route path="/driver" element={<DriverLayout />}>
              <Route index element={<DriverDashboard />} />
              <Route path="profile" element={<DriverProfile />} />
              <Route path="vehicle" element={<DriverVehicle />} />
              <Route path="documents" element={<DriverDocumentation />} />
              <Route path="ratings" element={<DriverRatings />} />
              <Route path="recommendations" element={<DriverRecommendations />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
