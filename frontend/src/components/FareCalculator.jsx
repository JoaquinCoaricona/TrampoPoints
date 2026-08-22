import React, { useState } from 'react';
import { MapPin, Car, Bus, ArrowRight } from 'lucide-react';

export default function FareCalculator({ onStartRequest }) {
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  const routesData = [
    {
      name: 'Belgrano ➔ Microcentro',
      distance: '11.4 km',
      time: '28 min',
      uberPrice: 9800,
      taxiPrice: 10500,
      trampoPrice: 2400
    },
    {
      name: 'Pilar Centro ➔ Palermo',
      distance: '48.2 km',
      time: '52 min',
      uberPrice: 28500,
      taxiPrice: 31000,
      trampoPrice: 6800
    },
    {
      name: 'San Isidro ➔ Puerto Madero',
      distance: '24.6 km',
      time: '38 min',
      uberPrice: 16200,
      taxiPrice: 17800,
      trampoPrice: 4100
    }
  ];

  const currentRoute = routesData[selectedRouteIndex];
  const savings = currentRoute.uberPrice - currentRoute.trampoPrice;
  const savingsPercent = Math.round((savings / currentRoute.uberPrice) * 100);

  return (
    <section className="calculator-section card glass-card padding-36">
      <div className="section-header text-center margin-bottom-32">
        <span className="badge badge-indigo font-bold text-xs uppercase margin-bottom-8">
          Comparativa Transparente de Tarifas
        </span>
        <h2 className="text-gradient-white text-32 font-extrabold">
          ¿Cuánto te ahorrás viajando con TrampoPoints?
        </h2>
        <p className="text-muted text-14 margin-top-4">
          Compará el costo de una combi compartida frente a pedir un Uber o Taxi privado.
        </p>
      </div>

      {/* Route Selector Tabs */}
      <div className="route-selector-tabs flex-center gap-12 margin-bottom-28">
        {routesData.map((route, idx) => (
          <button
            key={route.name}
            type="button"
            className={`btn-route-tab ${selectedRouteIndex === idx ? 'active' : ''}`}
            onClick={() => setSelectedRouteIndex(idx)}
          >
            <MapPin size={14} className={selectedRouteIndex === idx ? 'text-indigo' : 'text-muted'} />
            {route.name}
          </button>
        ))}
      </div>

      {/* Comparison Cards Grid */}
      <div className="comparison-grid grid-3-col gap-20 align-stretch">
        {/* Card Uber */}
        <div className="price-compare-card card-dimmed flex-column flex-between padding-24">
          <div>
            <div className="flex-between align-center margin-bottom-12">
              <span className="text-muted text-xs font-bold uppercase flex-center gap-6">
                <Car size={16} /> UberX / Cabify
              </span>
              <span className="badge badge-subtle text-xs">Individual</span>
            </div>
            <strong className="block text-32 font-mono text-muted line-through">
              ${currentRoute.uberPrice.toLocaleString('es-AR')}
            </strong>
            <span className="text-xs text-muted block margin-top-4">
              Trayecto de {currentRoute.distance} ({currentRoute.time})
            </span>
          </div>
          <span className="text-xs text-muted margin-top-16 block border-top-glass padding-top-8">
            Tarifa estándar de auto privado
          </span>
        </div>

        {/* Card Taxi */}
        <div className="price-compare-card card-dimmed flex-column flex-between padding-24">
          <div>
            <div className="flex-between align-center margin-bottom-12">
              <span className="text-muted text-xs font-bold uppercase flex-center gap-6">
                <Car size={16} /> Taxi Oficial CABA
              </span>
              <span className="badge badge-subtle text-xs">Bajada de Bandera</span>
            </div>
            <strong className="block text-32 font-mono text-muted line-through">
              ${currentRoute.taxiPrice.toLocaleString('es-AR')}
            </strong>
            <span className="text-xs text-muted block margin-top-4">
              Con bajada de bandera y fichas
            </span>
          </div>
          <span className="text-xs text-muted margin-top-16 block border-top-glass padding-top-8">
            Sujeto a tráfico y fichas por minuto
          </span>
        </div>

        {/* Card TrampoPoints (DESTACADO) */}
        <div className="price-compare-card card-featured border-emerald flex-column flex-between padding-24 relative overflow-hidden">
          <div className="featured-glow" />
          <div>
            <div className="flex-between align-center margin-bottom-12">
              <span className="text-emerald text-xs font-extrabold uppercase flex-center gap-6">
                <Bus size={18} /> TrampoPoints Combi
              </span>
              <span className="badge badge-emerald font-bold text-xs">
                -{savingsPercent}% Descuento
              </span>
            </div>
            <strong className="block text-42 font-mono text-emerald font-extrabold">
              ${currentRoute.trampoPrice.toLocaleString('es-AR')}
            </strong>
            <span className="text-xs text-emerald font-semibold block margin-top-4">
              ¡Te ahorrás ${savings.toLocaleString('es-AR')} ARS por viaje!
            </span>
          </div>
          <button
            type="button"
            className="btn-emerald width-full margin-top-20 flex-center gap-8 font-bold"
            onClick={onStartRequest}
          >
            Pedir Viaje Ahora <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
