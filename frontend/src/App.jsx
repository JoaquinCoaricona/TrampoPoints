import React, { useState } from 'react';
import Header from './components/Header';
import TripRequestForm from './components/TripRequestForm';
import MatchList from './components/MatchList';
import TripDetails from './components/TripDetails';
import RouteOptimizer from './components/RouteOptimizer';
import { createTripRequest, getTripMatches, getTripDetails } from './services/api';
import { Search, MapPin, Route as RouteIcon, Info } from 'lucide-react';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('MAIN'); // 'MAIN' | 'OPTIMIZER'
  const [viewState, setViewState] = useState('FORM'); // 'FORM' | 'MATCHES' | 'DETAILS'
  
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [matches, setMatches] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // 1. Enviar solicitud de viaje (POST /api/trips/requests) y buscar coincidencias (GET /api/trips/matches/{requestId})
  const handleCreateRequest = async (formData) => {
    setLoading(true);
    try {
      // Paso 1: POST /api/trips/requests
      const reqRes = await createTripRequest(formData);
      setRequestId(reqRes.requestId);

      // Paso 2: GET /api/trips/matches/{requestId}
      const matchesRes = await getTripMatches(reqRes.requestId);
      setMatches(matchesRes.matches || []);
      setViewState('MATCHES');
    } catch (err) {
      console.error('Error al procesar la solicitud de viaje:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Seleccionar un viaje de la lista y obtener sus detalles (GET /api/trips/{tripId})
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

  const handleReset = () => {
    setViewState('FORM');
    setRequestId(null);
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
            className={`tab-btn ${activeTab === 'MAIN' ? 'active' : ''}`}
            onClick={() => setActiveTab('MAIN')}
          >
            <Search size={16} /> Búsqueda y Reserva de Viajes
          </button>
          <button
            className={`tab-btn ${activeTab === 'OPTIMIZER' ? 'active' : ''}`}
            onClick={() => setActiveTab('OPTIMIZER')}
          >
            <RouteIcon size={16} /> Probar API de Optimización de Rutas
          </button>
        </div>

        {/* Info Banner */}
        <div className="banner banner-info margin-bottom-24">
          <Info size={18} className="banner-icon" />
          <div>
            <strong>MVP de Viajes Compartidos en Combis:</strong> Sistema automatizado para agrupar pasajeros compatibles en función de cercanía de origen, destino y ventana de tiempo.
          </div>
        </div>

        {/* Active Tab Content */}
        {activeTab === 'MAIN' ? (
          <div>
            {viewState === 'FORM' && (
              <TripRequestForm onSubmit={handleCreateRequest} loading={loading} />
            )}

            {viewState === 'MATCHES' && (
              <MatchList
                requestId={requestId}
                matches={matches}
                onSelectTrip={handleSelectTrip}
                onReset={handleReset}
              />
            )}

            {viewState === 'DETAILS' && (
              <TripDetails
                tripData={selectedTrip}
                onBack={() => setViewState('MATCHES')}
              />
            )}
          </div>
        ) : (
          <RouteOptimizer />
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
