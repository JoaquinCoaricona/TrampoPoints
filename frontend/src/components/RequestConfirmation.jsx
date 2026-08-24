import React, { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  Navigation,
  Clock,
  PlusCircle,
  ListOrdered,
  Search,
  ArrowRight,
  Radio,
  Layers,
  Sparkles,
  Lightbulb,
  CheckCircle
} from 'lucide-react';
import L from 'leaflet';

async function fetchOsrmRoute(originLat, originLng, destLat, destLng) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('OSRM error');
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    }
  } catch (e) {
    console.warn('OSRM fallback:', e);
  }
  return [
    [originLat, originLng],
    [destLat, destLng]
  ];
}

function RequestRouteMap({ origin, destination, isSearching }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distanceKm, setDistanceKm] = useState(null);

  useEffect(() => {
    if (!origin || !destination) return;

    let isMounted = true;
    fetchOsrmRoute(origin.latitude, origin.longitude, destination.latitude, destination.longitude)
      .then((coords) => {
        if (isMounted) {
          setRouteCoords(coords);
          // Calcular distancia aproximada
          let dist = 0;
          for (let i = 0; i < coords.length - 1; i++) {
            const p1 = L.latLng(coords[i][0], coords[i][1]);
            const p2 = L.latLng(coords[i + 1][0], coords[i + 1][1]);
            dist += p1.distanceTo(p2);
          }
          setDistanceKm((dist / 1000).toFixed(1));
        }
      });

    return () => {
      isMounted = false;
    };
  }, [origin, destination]);

  useEffect(() => {
    if (!mapContainerRef.current || !origin || !destination) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [origin.latitude, origin.longitude],
        zoom: 13,
        zoomControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      leafletMapRef.current = map;
    }

    const map = leafletMapRef.current;
    
    // Limpiar capas previas excepto tilelayer
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    // 1. Marcador Origen
    const originIcon = L.divIcon({
      className: '',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #10b981;
          border: 3px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 14px;
          box-shadow: 0 0 16px rgba(16, 185, 129, 0.6);
        ">A</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const originMarker = L.marker([origin.latitude, origin.longitude], { icon: originIcon }).addTo(map);
    originMarker.bindPopup(`<strong>Origen:</strong><br/>${origin.address || 'Punto de partida'}`);

    // 2. Marcador Destino
    const destIcon = L.divIcon({
      className: '',
      html: `
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #6366f1;
          border: 3px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: 14px;
          box-shadow: 0 0 16px rgba(99, 102, 241, 0.6);
        ">B</div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const destMarker = L.marker([destination.latitude, destination.longitude], { icon: destIcon }).addTo(map);
    destMarker.bindPopup(`<strong>Destino:</strong><br/>${destination.address || 'Punto de llegada'}`);

    // 3. Trazado por las calles
    const coordsToDraw = routeCoords.length > 0 ? routeCoords : [
      [origin.latitude, origin.longitude],
      [destination.latitude, destination.longitude]
    ];

    const polyline = L.polyline(coordsToDraw, {
      color: '#38bdf8',
      weight: 4.5,
      opacity: 0.88,
      lineCap: 'round',
      lineJoin: 'round',
      dashArray: isSearching ? '6, 10' : null
    }).addTo(map);

    // Ajustar límites de vista
    const bounds = L.latLngBounds([
      [origin.latitude, origin.longitude],
      [destination.latitude, destination.longitude],
      ...coordsToDraw
    ]);
    map.fitBounds(bounds, { padding: [45, 45] });

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [origin, destination, routeCoords, isSearching]);

  return (
    <div className="request-map-wrapper">
      <div ref={mapContainerRef} className="request-map-canvas" />
      <div className="request-map-overlay-badge">
        <div className="flex-center gap-6">
          <Layers size={13} className="text-cyan" />
          <span>Recorrido particular estimado {distanceKm ? `(${distanceKm} km por calles)` : ''}</span>
        </div>
      </div>
    </div>
  );
}

export default function RequestConfirmation({
  requestData,
  onCreateAnother,
  onViewMyRequests,
  onViewMatches
}) {
  if (!requestData) return null;

  const isSearching = requestData.status === 'SEARCHING';
  const isConfirmed = requestData.status === 'CONFIRMED';

  const departureDate = new Date(requestData.departureTime);

  const formattedDate = departureDate.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const formattedTime = departureDate.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="confirmation-page-container">
      {/* 1. Radar Sonar Expanding Circles Background (Solo en estado SEARCHING) */}
      {isSearching && (
        <div className="sonar-radar-bg-layer" aria-hidden="true">
          <div className="sonar-wave-circle wave-1"></div>
          <div className="sonar-wave-circle wave-2"></div>
          <div className="sonar-wave-circle wave-3"></div>
          <div className="sonar-wave-circle wave-4"></div>
        </div>
      )}

      <style>{`
        .confirmation-page-container {
          position: relative;
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px 16px 60px;
          color: #e4e4e7;
          overflow: hidden;
        }

        /* Sonar Radar Waves Effect */
        .sonar-radar-bg-layer {
          position: fixed;
          top: 50%;
          left: 50%;
          width: 100vw;
          height: 100vh;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          opacity: 0.85;
        }

        .sonar-wave-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          border: 1.5px solid rgba(56, 189, 248, 0.35);
          box-shadow: 0 0 35px rgba(56, 189, 248, 0.15), inset 0 0 25px rgba(56, 189, 248, 0.08);
          transform: translate(-50%, -50%) scale(0.05);
          animation: sonar-expand 7s cubic-bezier(0.1, 0.65, 0.3, 1) infinite;
        }

        .sonar-wave-circle.wave-1 {
          animation-delay: 0s;
        }
        .sonar-wave-circle.wave-2 {
          animation-delay: 1.75s;
        }
        .sonar-wave-circle.wave-3 {
          animation-delay: 3.5s;
        }
        .sonar-wave-circle.wave-4 {
          animation-delay: 5.25s;
        }

        @keyframes sonar-expand {
          0% {
            transform: translate(-50%, -50%) scale(0.05);
            opacity: 0.9;
            border-color: rgba(56, 189, 248, 0.6);
          }
          40% {
            opacity: 0.45;
          }
          100% {
            transform: translate(-50%, -50%) scale(3.2);
            opacity: 0;
            border-color: rgba(99, 102, 241, 0);
          }
        }

        /* Animated Searching Magnifying Glass Widget */
        @keyframes magnifying-scan {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          20% {
            transform: translate(10px, -6px) rotate(16deg) scale(1.08);
          }
          45% {
            transform: translate(18px, 8px) rotate(-14deg) scale(1.04);
          }
          70% {
            transform: translate(-6px, 12px) rotate(22deg) scale(1.1);
          }
          85% {
            transform: translate(-10px, -4px) rotate(-8deg) scale(0.98);
          }
          100% {
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 15px rgba(56, 189, 248, 0.25);
          }
          50% {
            box-shadow: 0 0 30px rgba(56, 189, 248, 0.55), 0 0 10px rgba(99, 102, 241, 0.4);
          }
        }

        .searching-scanner-widget {
          display: flex;
          align-items: center;
          gap: 14px;
          background: rgba(15, 23, 42, 0.75);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 14px;
          padding: 14px 20px;
          backdrop-filter: blur(16px);
          animation: pulse-glow 3s ease-in-out infinite;
          position: relative;
          z-index: 1;
        }

        .searching-glass-orb {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(14, 165, 233, 0.1) 70%);
          border: 1.5px solid rgba(56, 189, 248, 0.6);
          color: #38bdf8;
          flex-shrink: 0;
        }

        .searching-glass-icon-anim {
          animation: magnifying-scan 4s ease-in-out infinite;
          color: #38bdf8;
        }

        .confirmation-content-grid {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          margin-top: 24px;
        }

        @media (max-width: 920px) {
          .confirmation-content-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }

        /* Header Section */
        .confirmation-hero-header {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 20px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .confirmation-hero-title-area h1 {
          margin: 6px 0 0;
          font-size: 26px;
          font-weight: 700;
          color: #f4f4f5;
          letter-spacing: -0.02em;
        }

        .confirmation-hero-title-area p {
          margin: 6px 0 0;
          color: #a1a1aa;
          font-size: 14px;
          line-height: 1.5;
        }

        /* Map styling */
        .request-map-wrapper {
          position: relative;
          width: 100%;
          height: 380px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45);
          background: #09090b;
        }

        .request-map-canvas {
          width: 100%;
          height: 100%;
        }

        .request-map-overlay-badge {
          position: absolute;
          bottom: 14px;
          left: 14px;
          z-index: 1000;
          background: rgba(9, 9, 11, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          color: #f4f4f5;
          font-weight: 500;
        }

        /* Details Card */
        .request-details-card {
          background: rgba(24, 24, 27, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 24px;
          backdrop-filter: blur(12px);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .route-stop-row {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .route-pin-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .route-pin-origin {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.4);
        }

        .route-pin-dest {
          background: rgba(99, 102, 241, 0.15);
          color: #818cf8;
          border: 1px solid rgba(99, 102, 241, 0.4);
        }

        .route-stop-title {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #71717a;
          font-weight: 600;
        }

        .route-stop-address {
          font-size: 14px;
          color: #f4f4f5;
          font-weight: 500;
          margin-top: 2px;
        }

        .route-stop-coords {
          font-size: 11px;
          font-family: monospace;
          color: #52525b;
          margin-top: 2px;
        }

        .status-pill-big {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-pill-searching {
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.35);
          color: #38bdf8;
        }

        .status-pill-confirmed {
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.35);
          color: #4ade80;
        }

        .confirmation-buttons-row {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 28px;
          position: relative;
          z-index: 1;
        }

        .btn-confirm-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          color: #09090b;
          font-weight: 600;
          font-size: 13px;
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-confirm-primary:hover {
          background: #e4e4e7;
        }

        .btn-confirm-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: #d4d4d8;
          font-weight: 500;
          font-size: 13px;
          padding: 10px 18px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-confirm-secondary:hover {
          background: rgba(255, 255, 255, 0.09);
          color: #ffffff;
          border-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      {/* Header */}
      <header className="confirmation-hero-header">
        <div className="confirmation-hero-title-area">
          <div className="flex-center gap-8 margin-bottom-6">
            {isConfirmed ? (
              <span className="status-pill-big status-pill-confirmed">
                <CheckCircle2 size={14} /> Solicitud Confirmada y Asignada
              </span>
            ) : (
              <span className="status-pill-big status-pill-searching">
                <span className="dot pulse"></span> Buscando Combis Cercanas
              </span>
            )}
            <span className="text-xs text-muted">ID: #{requestData.requestId}</span>
          </div>

          <h1>
            {isConfirmed ? '¡Tu combi ya fue asignada!' : 'Tu solicitud está en búsqueda activa'}
          </h1>
          <p>
            {isConfirmed
              ? 'Tu recorrido fue agrupado con otros pasajeros afines en una combi.'
              : 'El algoritmo está optimizando las rutas de combis para agrupar pasajeros con trayectos afines.'}
          </p>
        </div>

        {/* Lateral Animated Search Radar Badge (Aprovechando lateral) */}
        {isSearching && (
          <div className="searching-scanner-widget">
            <div className="searching-glass-orb">
              <Search size={22} className="searching-glass-icon-anim" />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f4f4f5', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Escaneando rutas</span>
                <Sparkles size={13} className="text-cyan" />
              </div>
              <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
                Detectando combis disponibles en tu zona
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Grid: Map + Request Info */}
      <div className="confirmation-content-grid">
        {/* Street Map Preview */}
        <div>
          <RequestRouteMap
            origin={requestData.origin}
            destination={requestData.destination}
            isSearching={isSearching}
          />
        </div>

        {/* Route Details Card */}
        <div className="request-details-card">
          <div>
            <div className="text-xs text-muted uppercase font-semibold margin-bottom-12" style={{ letterSpacing: '0.05em' }}>
              Detalles del trayecto solicitado
            </div>

            {/* ORIGEN */}
            <div className="route-stop-row margin-bottom-16">
              <div className="route-pin-badge route-pin-origin">A</div>
              <div>
                <div className="route-stop-title">Punto de Partida (Origen)</div>
                <div className="route-stop-address">{requestData.origin?.address || 'Origen'}</div>
                <div className="route-stop-coords">
                  {requestData.origin?.latitude?.toFixed(4)}, {requestData.origin?.longitude?.toFixed(4)}
                </div>
              </div>
            </div>

            {/* DESTINO */}
            <div className="route-stop-row">
              <div className="route-pin-badge route-pin-dest">B</div>
              <div>
                <div className="route-stop-title">Punto de Llegada (Destino)</div>
                <div className="route-stop-address">{requestData.destination?.address || 'Destino'}</div>
                <div className="route-stop-coords">
                  {requestData.destination?.latitude?.toFixed(4)}, {requestData.destination?.longitude?.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
            <div className="flex-between align-center">
              <div className="flex-center gap-8 text-sm text-muted">
                <Clock size={15} />
                <span>Horario deseado:</span>
              </div>
              <span className="text-sm font-semibold text-main">
                {formattedDate} · {formattedTime} hs
              </span>
            </div>
          </div>

          <div style={{
            background: isSearching ? 'rgba(56, 189, 248, 0.05)' : 'rgba(34, 197, 94, 0.05)',
            border: isSearching ? '1px solid rgba(56, 189, 248, 0.18)' : '1px solid rgba(34, 197, 94, 0.18)',
            borderRadius: '10px',
            padding: '12px 14px',
            fontSize: '12px',
            color: isSearching ? '#7dd3fc' : '#86efac',
            lineHeight: 1.5
          }}>
            {isSearching
              ? <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Lightbulb size={16} /> Tu solicitud se agrupará de forma inteligente con otras personas que viajen en la misma dirección para conseguirte la mejor tarifa compartida.</div>
              : <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle size={16} /> ¡Viaje confirmado! Tu parada ya fue integrada al recorrido optimizado de la combi.</div>}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="confirmation-buttons-row">
        {isConfirmed && onViewMatches && (
          <button onClick={onViewMatches} className="btn-confirm-primary">
            Ver recorrido asignado <ArrowRight size={15} />
          </button>
        )}

        <button onClick={onViewMyRequests} className="btn-confirm-secondary">
          <ListOrdered size={15} /> Mis Solicitudes
        </button>

        <button onClick={onCreateAnother} className="btn-confirm-secondary">
          <PlusCircle size={15} /> Pedir otro viaje
        </button>
      </div>
    </div>
  );
}