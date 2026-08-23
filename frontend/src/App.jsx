import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
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
import RequestConfirmation from './components/RequestConfirmation';
import MatchList from './components/MatchList';
import TripDetails from './components/TripDetails';

import { AuthProvider, useAuth } from './context/AuthContext';
import { resolveUserRole } from './services/authService';
import { createTripRequest, getTripMatches, getTripDetails, getAllTripRequests, processGroupingAlgorithm, deleteTripRequest } from './services/api';
import {
  PlusCircle,
  ListOrdered,
  Route as RouteIcon,
  Info,
  UserCheck,
  LogIn,
  ShieldCheck,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import './App.css';

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

// Sub-Wrappers using URL parameters for Passenger system sub-states

function ConfirmationWrapper({ allRequests }) {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const requestData = allRequests.find(r => r.requestId === requestId);

  return (
    <RequestConfirmation
      requestData={requestData}
      onCreateAnother={() => navigate('/app')}
      onViewMyRequests={() => navigate('/app/requests')}
    />
  );
}

function MatchesWrapper() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      try {
        const res = await getTripMatches(requestId);
        const tripMatches = res.matches || [];
        setMatches(tripMatches);
        
        // Si ya está asignada a una sola combi (ej. por confirmación del algoritmo),
        // llevamos al usuario directamente a ver el mapa/recorrido del viaje asignado.
        if (tripMatches.length === 1) {
          navigate(`/app/trip/${tripMatches[0].tripId}`, { replace: true });
        }
      } catch (err) {
        console.error("Error cargando coincidencias:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, [requestId, navigate]);

  if (loading) {
    return (
      <div className="flex-center padding-48 flex-col gap-12" style={{ minHeight: '300px' }}>
        <Loader2 className="spinner color-white" size={32} />
        <p className="color-zinc-400 text-sm">Consultando recorridos de combis disponibles...</p>
      </div>
    );
  }

  return (
    <MatchList
      requestId={requestId}
      matches={matches}
      onSelectTrip={(tripId) => navigate(`/app/trip/${tripId}`)}
      onReset={() => navigate('/app')}
    />
  );
}

function TripDetailsWrapper() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrip() {
      setLoading(true);
      try {
        const res = await getTripDetails(tripId);
        setTripData(res);
      } catch (err) {
        console.error("Error al cargar detalles del viaje:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, [tripId]);

  if (loading) {
    return (
      <div className="flex-center padding-48 flex-col gap-12" style={{ minHeight: '300px' }}>
        <Loader2 className="spinner color-white" size={32} />
        <p className="color-zinc-400 text-sm">Cargando paradas y mapa del recorrido...</p>
      </div>
    );
  }

  return (
    <TripDetails
      tripData={tripData}
      onBack={() => navigate(-1)}
    />
  );
}

// Passenger & Admin Application View (/app)
function PassengerApp() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = resolveUserRole(user?.role, user?.email);
  const isAdmin = userRole === 'ADMIN';

  const [loading, setLoading] = useState(false);
  const [allRequests, setAllRequests] = useState([]);

  // Enforce authentication and role limits for the system flow
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    } else if (userRole === 'DRIVER') {
      navigate('/driver', { replace: true });
    } else if (isAdmin && location.pathname === '/app') {
      navigate('/app/admin', { replace: true });
    }
  }, [isAuthenticated, userRole, isAdmin, location.pathname, navigate]);

  const fetchAllRequests = async () => {
    try {
      const data = await getAllTripRequests();
      if (Array.isArray(data)) {
        setAllRequests(data);
      }
    } catch (err) {
      console.warn('No se pudieron obtener las solicitudes del backend:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllRequests();
    }
  }, [isAuthenticated]);

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

      setAllRequests(prev => [newRequestItem, ...prev]);
      navigate(`/app/confirmation/${newReqId}`);
    } catch (err) {
      console.error('Error al procesar la solicitud de viaje:', err);
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
          setAllRequests(refreshedRequests);
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
    setAllRequests(updated);
  };

  const handleDeleteRequestByAdmin = async (requestId) => {
    if (window.confirm(`¿Estás seguro de que querés eliminar la solicitud ${requestId}?`)) {
      try {
        await deleteTripRequest(requestId);
        const updated = allRequests.filter(r => r.requestId !== requestId);
        setAllRequests(updated);
      } catch (err) {
        console.error('Error al eliminar la solicitud en el backend:', err);
        alert('No se pudo eliminar la solicitud. Intente nuevamente.');
      }
    }
  };

  const handleDeleteRequestByUser = async (requestId) => {
    if (window.confirm('¿Estás seguro de que querés cancelar esta solicitud de viaje?')) {
      try {
        await deleteTripRequest(requestId);
        const updated = allRequests.filter(r => r.requestId !== requestId);
        setAllRequests(updated);
      } catch (err) {
        console.error('Error al cancelar la solicitud en el backend:', err);
        alert('No se pudo cancelar la solicitud. Intente nuevamente.');
      }
    }
  };

  const userRequests = allRequests.filter(r =>
    !user || r.userEmail === user.email || r.userEmail === 'invitado@trampopoints.com'
  );

  return (
    <div className="app-layout system-layout">
      <Header />

      <main className="main-content container margin-top-20">
        {/* Navigation Tabs (solo para pasajeros) */}
        {!isAdmin && isAuthenticated && (
          <div className="nav-tabs-container margin-bottom-24 flex-between align-center flex-wrap gap-12">
            <div className="flex-center gap-10 flex-wrap">
              <button
                className={`tab-btn ${location.pathname === '/app' || location.pathname === '/app/' ? 'active' : ''}`}
                onClick={() => navigate('/app')}
              >
                <PlusCircle size={16} /> Pedir Viaje
              </button>

              <button
                className={`tab-btn ${location.pathname.includes('/requests') ? 'active' : ''}`}
                onClick={() => navigate('/app/requests')}
              >
                <ListOrdered size={16} /> Mis Solicitudes ({userRequests.length})
              </button>
            </div>
          </div>
        )}

        {/* Nested Routing structure for sub-panels and detail maps */}
        <Routes>
          {/* Admin routes */}
          <Route path="admin" element={
            isAdmin ? (
              <AdminPage
                allRequests={allRequests}
                onRunAlgorithm={handleRunGroupingAlgorithm}
                onUpdateStatus={handleUpdateStatusByAdmin}
                onDeleteRequest={handleDeleteRequestByAdmin}
                onViewMatches={(req) => navigate(`/app/matches/${req.requestId}`)}
              />
            ) : (
              <Navigate to="/app" replace />
            )
          } />

          {/* Rutas compartidas (Mapa de viaje y coincidencias accesibles por todos) */}
          <Route path="matches/:requestId" element={<MatchesWrapper />} />
          <Route path="trip/:tripId" element={<TripDetailsWrapper />} />

          {/* Passenger routes */}
          <Route index element={
            isAdmin ? (
              <Navigate to="/app/admin" replace />
            ) : (
              <RequestPage
                viewState="FORM"
                loading={loading}
                onSubmitRequest={handleCreateRequest}
              />
            )
          } />
          
          <Route path="requests" element={
            isAdmin ? (
              <Navigate to="/app/admin" replace />
            ) : (
              <MyRequestsPage
                userRequests={userRequests}
                onNewRequest={() => navigate('/app')}
                onViewMatches={(req) => navigate(`/app/matches/${req.requestId}`)}
                onDeleteRequest={handleDeleteRequestByUser}
              />
            )
          } />

          <Route path="confirmation/:requestId" element={
            isAdmin ? (
              <Navigate to="/app/admin" replace />
            ) : (
              <ConfirmationWrapper allRequests={allRequests} />
            )
          } />

          <Route path="optimizer" element={
            isAdmin ? (
              <Navigate to="/app/admin" replace />
            ) : (
              <OptimizerPage />
            )
          } />

          {/* Fallback local */}
          <Route path="*" element={<Navigate to={isAdmin ? "/app/admin" : "/app"} replace />} />
        </Routes>
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
              <Route path="trip/:tripId" element={<TripDetailsWrapper />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
