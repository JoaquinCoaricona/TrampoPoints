import React, { useEffect, useRef, useCallback } from "react";
import L from "leaflet";

const REQUEST_COLORS = [
  "#38bdf8", // Sky Blue
  "#f59e0b", // Amber / Warm Gold
  "#ec4899", // Neon Pink
  "#10b981", // Emerald Green
  "#a855f7", // Purple / Violet
  "#f97316", // Bright Orange
  "#06b6d4", // Cyan
  "#eab308", // Yellow
  "#6366f1", // Indigo
  "#14b8a6", // Teal
  "#f43f5e", // Rose Red
  "#84cc16", // Lime Green
];

function getRequestColor(req, index) {
  if (typeof index === 'number') {
    return REQUEST_COLORS[index % REQUEST_COLORS.length];
  }
  if (req?.requestId) {
    let sum = 0;
    for (let i = 0; i < req.requestId.length; i++) {
      sum = (sum * 31 + req.requestId.charCodeAt(i)) & 0xffffff;
    }
    return REQUEST_COLORS[Math.abs(sum) % REQUEST_COLORS.length];
  }
  return REQUEST_COLORS[0];
}

async function fetchOsrmRoute(originLat, originLng, destLat, destLng) {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${originLng},${originLat};${destLng},${destLat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("OSRM error");
    const data = await res.json();
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    }
  } catch (e) {
    console.warn("OSRM fallback:", e);
  }
  return [
    [originLat, originLng],
    [destLat, destLng],
  ];
}

function animatePolyline(map, coords, color, speedMs = 18) {
  return new Promise((resolve) => {
    if (!coords || coords.length === 0) {
      resolve(null);
      return;
    }
    const line = L.polyline([], {
      color,
      weight: 3.5,
      opacity: 0.88,
      lineCap: "round",
      lineJoin: "round",
    }).addTo(map);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= coords.length) {
        clearInterval(interval);
        resolve(line);
        return;
      }
      const current = line.getLatLngs();
      current.push(coords[i]);
      line.setLatLngs(current);
      i++;
    }, speedMs);
  });
}

function createRequestMarker(map, lat, lng, color, label) {
  const icon = L.divIcon({
    className: "",
    html: `<div style="width:10px;height:10px;background:${color};border:2px solid rgba(255,255,255,0.8);border-radius:50%;box-shadow:0 0 6px ${color}88;"></div>`,
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });
  const marker = L.marker([lat, lng], { icon }).addTo(map);
  marker.bindTooltip(label, { permanent: false, direction: "top", offset: [0, -8] });
  return marker;
}

function createStopMarker(map, lat, lng, order, type) {
  const isPickup = type === "PICKUP";
  const color = isPickup ? "#10b981" : "#818cf8";
  const icon = L.divIcon({
    className: "",
    html: `<div style="width:28px;height:28px;background:${color};border:2.5px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:12px;box-shadow:0 0 10px ${color}99,0 2px 8px rgba(0,0,0,0.4);font-family:Inter,system-ui,sans-serif;">${order}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
  const marker = L.marker([lat, lng], { icon }).addTo(map);
  marker.bindPopup(`<div style="font-family:Inter,sans-serif;font-size:13px;padding:2px 4px"><strong style="color:${color}">${isPickup ? "🟢 Subida" : "🔴 Bajada"} #${order}</strong></div>`);
  return marker;
}

export default function LiveAdminMap({ allRequests, lastAlgorithmResult }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const requestLayersRef = useRef({});
  const tripLayersRef = useRef([]);
  const knownRequestIdsRef = useRef(new Set());
  const isTripModeRef = useRef(false);
  const colorIndexRef = useRef(0);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;
    const map = L.map(mapContainerRef.current, {
      center: [-34.5895, -58.42],
      zoom: 12,
      zoomControl: true,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "\u00a9 OpenStreetMap contributors \u00a9 CARTO",
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const addRequestToMap = useCallback(async (req, index) => {
    const map = mapRef.current;
    if (!map || isTripModeRef.current) return;
    const originLat = req.origin?.latitude ?? req.originLatitude;
    const originLng = req.origin?.longitude ?? req.originLongitude;
    const destLat = req.destination?.latitude ?? req.destinationLatitude;
    const destLng = req.destination?.longitude ?? req.destinationLongitude;
    if (!originLat || !originLng || !destLat || !destLng) return;
    const color = getRequestColor(req, index ?? colorIndexRef.current);
    colorIndexRef.current++;
    const coords = await fetchOsrmRoute(originLat, originLng, destLat, destLng);
    if (isTripModeRef.current) return;
    const line = await animatePolyline(map, coords, color, 16);
    if (!line) return;
    const om = createRequestMarker(map, originLat, originLng, color, "Origen: " + (req.origin?.address || ""));
    const dm = createRequestMarker(map, destLat, destLng, color, "Destino: " + (req.destination?.address || ""));
    requestLayersRef.current[req.requestId] = { line, markers: [om, dm] };
  }, []);

  useEffect(() => {
    if (!mapRef.current || isTripModeRef.current) return;

    const currentIds = new Set(allRequests.map(r => r.requestId));

    // Limpiar capas de solicitudes eliminadas
    Object.keys(requestLayersRef.current).forEach(reqId => {
      if (!currentIds.has(reqId)) {
        const item = requestLayersRef.current[reqId];
        if (item) {
          try { mapRef.current.removeLayer(item.line); } catch (e) {}
          item.markers.forEach(m => { try { mapRef.current.removeLayer(m); } catch (e) {} });
        }
        delete requestLayersRef.current[reqId];
        knownRequestIdsRef.current.delete(reqId);
      }
    });

    // Agregar nuevas solicitudes con su color único diferenciado
    allRequests.forEach((req, idx) => {
      if (!knownRequestIdsRef.current.has(req.requestId)) {
        knownRequestIdsRef.current.add(req.requestId);
        addRequestToMap(req, idx);
      }
    });
  }, [allRequests, addRequestToMap]);


  useEffect(() => {
    const map = mapRef.current;
    if (!map || !lastAlgorithmResult) return;
    if (!lastAlgorithmResult.newTrips || lastAlgorithmResult.newTrips.length === 0) return;
    isTripModeRef.current = true;

    Object.values(requestLayersRef.current).forEach(({ line, markers }) => {
      let op = 0.82;
      const fade = setInterval(() => {
        op -= 0.08;
        if (op <= 0) {
          clearInterval(fade);
          try { map.removeLayer(line); } catch (e) {}
          markers.forEach((m) => { try { map.removeLayer(m); } catch (e) {} });
        } else {
          try { line.setStyle({ opacity: op }); } catch (e) {}
        }
      }, 40);
    });
    requestLayersRef.current = {};
    knownRequestIdsRef.current.clear();

    tripLayersRef.current.forEach((l) => { try { map.removeLayer(l); } catch (e) {} });
    tripLayersRef.current = [];

    const trip = lastAlgorithmResult.newTrips[0];
    if (!trip || !trip.stops || trip.stops.length === 0) return;

    const animateTripWithDelay = async () => {
      await new Promise((r) => setTimeout(r, 700));
      const sortedStops = [...trip.stops].sort((a, b) => (a.order || 0) - (b.order || 0));
      const allCoords = [];
      for (let i = 0; i < sortedStops.length - 1; i++) {
        const from = sortedStops[i];
        const to = sortedStops[i + 1];
        const segCoords = await fetchOsrmRoute(from.latitude, from.longitude, to.latitude, to.longitude);
        allCoords.push(...segCoords);
        const sm = createStopMarker(map, from.latitude, from.longitude, from.order, from.type);
        tripLayersRef.current.push(sm);
      }
      const lastStop = sortedStops[sortedStops.length - 1];
      const lm = createStopMarker(map, lastStop.latitude, lastStop.longitude, lastStop.order, lastStop.type);
      tripLayersRef.current.push(lm);
      if (allCoords.length > 0) {
        try { map.fitBounds(allCoords, { padding: [50, 50] }); } catch (e) {}
      }
      await new Promise((r) => setTimeout(r, 300));
      const tripLine = await animatePolyline(map, allCoords, "#818cf8", 10);
      if (tripLine) {
        tripLine.setStyle({ weight: 5, opacity: 1, color: "#a78bfa" });
        const glowLine = L.polyline(allCoords, {
          color: "#6366f1",
          weight: 10,
          opacity: 0.15,
          lineCap: "round",
        }).addTo(map);
        tripLayersRef.current.push(glowLine, tripLine);
      }
    };

    animateTripWithDelay();
  }, [lastAlgorithmResult]);

  return (
    <div style={{
      position: "relative",
      width: "100%",
      borderRadius: "12px",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.07)",
      boxShadow: "0 0 0 1px rgba(99,102,241,0.1), 0 8px 40px rgba(0,0,0,0.5)",
      background: "#09090b",
    }}>
      <div style={{
        position: "absolute", top: 12, left: 12, zIndex: 1000,
        display: "flex", alignItems: "center", gap: 6,
        background: "rgba(9,9,11,0.88)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 8, padding: "5px 10px", backdropFilter: "blur(8px)",
        fontSize: 11, fontWeight: 600, color: "#f4f4f5", letterSpacing: "0.05em",
        fontFamily: "Inter, system-ui, sans-serif", pointerEvents: "none", userSelect: "none",
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: "50%",
          background: lastAlgorithmResult ? "#818cf8" : "#22c55e",
          display: "inline-block", flexShrink: 0,
          boxShadow: lastAlgorithmResult ? "0 0 6px #818cf8" : "0 0 6px #22c55e",
          animation: "lam-pulse 2s ease-in-out infinite",
        }} />
        {lastAlgorithmResult ? "TRIP ASIGNADO" : "MAPA EN VIVO"}
      </div>

      <div style={{
        position: "absolute", top: 12, right: 12, zIndex: 1000,
        display: "flex", gap: 8, pointerEvents: "none", userSelect: "none",
      }}>
        <div style={{
          background: "rgba(9,9,11,0.88)", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, padding: "5px 10px", backdropFilter: "blur(8px)",
          fontSize: 11, fontWeight: 600, color: "#f59e0b", fontFamily: "Inter, system-ui, sans-serif",
        }}>
          {allRequests.filter((r) => r.status === "SEARCHING").length} en Busqueda
        </div>
        {allRequests.filter((r) => r.status === "CONFIRMED").length > 0 && (
          <div style={{
            background: "rgba(9,9,11,0.88)", border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: 8, padding: "5px 10px", backdropFilter: "blur(8px)",
            fontSize: 11, fontWeight: 600, color: "#22c55e", fontFamily: "Inter, system-ui, sans-serif",
          }}>
            {allRequests.filter((r) => r.status === "CONFIRMED").length} confirmadas
          </div>
        )}
      </div>

      <div ref={mapContainerRef} style={{ height: "65vh", width: "100%", minHeight: 420 }} />
      <style>{`@keyframes lam-pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </div>
  );
}
