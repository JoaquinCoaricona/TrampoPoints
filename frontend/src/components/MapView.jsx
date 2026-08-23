import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { decodePolyline } from '../utils/polyline';

export default function MapView({ stops, polyline, height = '100%' }) {
  const mapRef = useRef(null);
  const leafletMapInstance = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Inicializar mapa si aún no existe
    if (!leafletMapInstance.current) {
      const initialLat = stops && stops.length > 0 ? stops[0].latitude : -34.6037;
      const initialLng = stops && stops.length > 0 ? stops[0].longitude : -58.3816;

      const map = L.map(mapRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      leafletMapInstance.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = leafletMapInstance.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const bounds = [];

    // 1. Dibujar Paradas (Stops)
    if (stops && stops.length > 0) {
      stops.forEach((stop) => {
        const isPickup = stop.type === 'PICKUP';
        const color = isPickup ? '#10b981' : '#ef4444';
        
        const customIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `
            <div style="
              background-color: ${color};
              color: white;
              border: 2px solid white;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 14px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            ">
              ${stop.order}
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([stop.latitude, stop.longitude], { icon: customIcon });
        marker.bindPopup(`
          <div style="font-family: 'Inter', sans-serif; padding: 4px;">
            <strong style="color: ${color};">${stop.type === 'PICKUP' ? 'Subida' : 'Bajada'} #${stop.order}</strong><br/>
            <span style="font-size: 13px;">${stop.address || 'Parada'}</span>
          </div>
        `);
        
        layerGroup.addLayer(marker);
        bounds.push([stop.latitude, stop.longitude]);
      });
    }

    // 2. Dibujar Polyline de la ruta
    const polylineCoords = decodePolyline(polyline);
    if (polylineCoords && polylineCoords.length > 0) {
      const line = L.polyline(polylineCoords, {
        color: '#6366f1',
        weight: 5,
        opacity: 0.85,
        dashArray: '1, 2',
        lineCap: 'round'
      });
      layerGroup.addLayer(line);
      polylineCoords.forEach(c => bounds.push(c));
    }

    // Ajustar vista a los límites de las paradas/ruta
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [stops, polyline]);

  return (
    <div className="map-wrapper" style={{ height, width: '100%' }}>
      <div ref={mapRef} className="leaflet-map-container" style={{ height: '100%', width: '100%', borderRadius: '12px' }} />
    </div>
  );
}
