import React, { useState } from 'react';
import Header from './components/Header';
import TripRequestForm from './components/TripRequestForm';
import RequestConfirmation from './components/RequestConfirmation';
import MatchList from './components/MatchList';
import TripDetails from './components/TripDetails';
import RouteOptimizer from './components/RouteOptimizer';
import { createTripRequest, getTripMatches, getTripDetails } from './services/api';
import { PlusCircle, ListOrdered, Route as RouteIcon, Info, MapPin, Navigation, ArrowRight } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('CREATE'); // 'CREATE' | 'MY_REQUESTS' | 'OPTIMIZER'
  const [viewState, setViewState] = useState('FORM'); // 'FORM' | 'CONFIRMATION' | 'MATCHES' | 'DETAILS'
  
  const [loading, setLoading] = useState(false);
  const [myRequests, setMyRequests] = useState([]); // Lista de solicitudes creadas por el usuario
  const [lastCreatedRequest, setLastCreatedRequest] = useState(null);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // 1. Crear una solicitud de viaje (POST /api/trips/requests)
  const handleCreateRequest = async (formData) => {
    setLoading(true);
    try {
      const reqRes = await createTripRequest(formData);
      const newReqId = reqRes.requestId;

      const newRequestItem = {
        requestId: newReqId,
        origin: formData.origin,
        destination: formData.destination,
        departureTime: formData.departureTime,
        status: reqRes.status || 'SEARCHING',
        message: reqRes.message,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMyRequests(prev => [newRequestItem, ...prev]);
      setLastCreatedRequest(newRequestItem);
      setCurrentRequestId(newReqId);

      // Mostrar pantalla de confirmación de solicitud cargada (sin mostrar mapas aún)
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

  const handleResetForm = () => {
    setViewState('FORM');
    setCurrentRequestId(null);
    setLastCreatedRequest(null);
    setMatches([]);
    setSelectedTrip(null);
  };

  return (
    <div className="app-layout">
      <Header />

      <main className="main-content container">
        {/* Navigation Tabs */}
        <div className="nav-tabs-container margin-bottom-24">
          <button
            className={`tab-btn ${activeTab === 'CREATE' ? 'active' : ''}`}
            onClick={() => { setActiveTab('CREATE'); setViewState('FORM'); }}
          >
            <PlusCircle size={16} /> Crear Solicitud de Viaje
          </button>
          <button
            className={`tab-btn ${activeTab === 'MY_REQUESTS' ? 'active' : ''}`}
            onClick={() => setActiveTab('MY_REQUESTS')}
          >
            <ListOrdered size={16} /> Mis Solicitudes ({myRequests.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'OPTIMIZER' ? 'active' : ''}`}
            onClick={() => setActiveTab('OPTIMIZER')}
          >
            <RouteIcon size={16} /> Probar API de Optimización
          </button>
        </div>

        {/* Info Banner */}
        <div className="banner banner-info margin-bottom-24">
          <Info size={18} className="banner-icon" />
          <div>
            <strong>Módulo de Carga de Solicitudes:</strong> Sistema para crear y registrar solicitudes de transporte compartido. Las solicitudes guardadas quedan en estado de búsqueda hasta agruparse en una combi.
          </div>
        </div>

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
                onViewMyRequests={() => setActiveTab('MY_REQUESTS')}
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

            {myRequests.length === 0 ? (
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
                {myRequests.map((req) => (
                  <div key={req.requestId} className="request-card-item card glass-card">
                    <div className="flex-between">
                      <span className="badge badge-subtle">ID Solicitud: {req.requestId}</span>
                      <span className="badge badge-success">Estado: {req.status}</span>
                    </div>

                    <div className="request-route-summary margin-top-12">
                      <div>
                        <strong><MapPin size={14} className="text-emerald" /> Origen:</strong> {req.origin.address}
                      </div>
                      <div>
                        <strong><Navigation size={14} className="text-indigo" /> Destino:</strong> {req.destination.address}
                      </div>
                      <div>
                        <strong>Hora Salida:</strong> {new Date(req.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hs
                      </div>
                    </div>

                    <div className="margin-top-16 flex-between align-center">
                      <span className="text-muted text-xs">Cargada a las {req.createdAt} hs</span>
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
