import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Sun,
  Eye,
  Camera,
  Layers,
  Sparkles,
  Zap,
  CheckCircle,
  Play,
  Pause,
  Sliders,
  DoorClosed,
  DoorOpen,
  Car,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { ARGENTINA_VEHICLE_CATALOG, ARGENTINA_COLORS } from './vehicle3d/vehicleCatalogData';
import { buildCombi3D } from './vehicle3d/Combi3DBuilder';

export default function Vehicle3DViewer({ vehicle, onVehicleChange }) {
  const containerRef = useRef(null);

  // Three.js References
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const vehicleGroupRef = useRef(null);
  const slidingDoorRef = useRef(null);
  const doorPositionsRef = useRef({ closed: null, open: null });
  const headlightsSpotRef = useRef(null);
  const activeMaterialsRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Selected Preset
  const [selectedPresetId, setSelectedPresetId] = useState('MERCEDES_SPRINTER');

  // Orbit / Interaction State
  const [autoRotate, setAutoRotate] = useState(true);
  const [headlightsOn, setHeadlightsOn] = useState(true);
  const [doorOpen, setDoorOpen] = useState(false);

  // Spherical Coordinates for Orbit
  const sphericalRef = useRef({
    radius: 9.5,
    theta: 0.65, // Azimuth (yaw)
    phi: 1.25    // Elevation (pitch)
  });

  const targetSphericalRef = useRef({
    radius: 9.5,
    theta: 0.65,
    phi: 1.25
  });

  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Find active preset
  useEffect(() => {
    if (vehicle?.brand && vehicle?.model) {
      const match = ARGENTINA_VEHICLE_CATALOG.find(
        (p) =>
          vehicle.brand.toLowerCase().includes(p.brand.toLowerCase()) ||
          p.model.toLowerCase().includes(vehicle.model.toLowerCase())
      );
      if (match) {
        setSelectedPresetId(match.id);
      }
    }
  }, [vehicle?.brand, vehicle?.model]);

  const activePreset =
    ARGENTINA_VEHICLE_CATALOG.find((p) => p.id === selectedPresetId) ||
    ARGENTINA_VEHICLE_CATALOG[0];

  const brand = vehicle?.brand || activePreset.brand;
  const model = vehicle?.model || activePreset.model;
  const licensePlate = vehicle?.licensePlate || 'AF 482 TP';
  const currentColor = vehicle?.color || activePreset.colorDefault;

  // Resolve Hex Color
  const getVehicleHex = () => {
    const matched = ARGENTINA_COLORS.find(
      (c) => c.name.toLowerCase() === currentColor.toLowerCase()
    );
    if (matched) return matched.hex;
    if (currentColor.startsWith('#')) return currentColor;
    return '#f8fafc';
  };

  const currentHex = getVehicleHex();

  // =========================================================================
  // INITIALIZE THREE.JS WEBGL SCENE
  // =========================================================================
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 720;
    const height = container.clientHeight || 420;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05080C);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    cameraRef.current = camera;

    // 3. Renderer with ACES ToneMapping & High DPI
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting Rig
    // A. Soft Ambient Hemisphere Light (Electric violet sky & dark carbon ground)
    const hemiLight = new THREE.HemisphereLight(0xa78bfa, 0x05080c, 0.75);
    scene.add(hemiLight);

    // B. Key Studio Directional Light (Soft top-front highlight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.7);
    keyLight.position.set(6, 10, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // C. Fill Studio Light (Electric Violet / Neon rim accent)
    const fillLight = new THREE.DirectionalLight(0x7c4dff, 0.7);
    fillLight.position.set(-8, 6, -6);
    scene.add(fillLight);

    // D. Front Headlights Projection Light
    const spotLight = new THREE.SpotLight(0xffffff, headlightsOn ? 3.5 : 0, 15, Math.PI / 4, 0.5, 1);
    spotLight.position.set(0, 1.2, 3.5);
    spotLight.target.position.set(0, 0, 9);
    scene.add(spotLight);
    scene.add(spotLight.target);
    headlightsSpotRef.current = spotLight;

    // 5. Studio Floor Grid & Contact Shadow Plane
    const floorGeom = new THREE.PlaneGeometry(40, 40);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x05080C,
      roughness: 0.85,
      metalness: 0.15
    });


    const floor = new THREE.Mesh(floorGeom, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Studio Circular Podium Ring
    const ringGeom = new THREE.RingGeometry(3.6, 3.65, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x6366f1, opacity: 0.4, transparent: true, side: THREE.DoubleSide });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.005;
    scene.add(ringMesh);

    // Inner subtle glow ring
    const innerRingGeom = new THREE.RingGeometry(2.2, 2.23, 64);
    const innerRingMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, opacity: 0.25, transparent: true, side: THREE.DoubleSide });
    const innerRing = new THREE.Mesh(innerRingGeom, innerRingMat);
    innerRing.rotation.x = -Math.PI / 2;
    innerRing.position.y = 0.005;
    scene.add(innerRing);

    // Soft Radial Shadow Texture Disc under vehicle
    const shadowGeom = new THREE.PlaneGeometry(8.5, 4.5);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      opacity: 0.65,
      transparent: true
    });
    const shadowPlane = new THREE.Mesh(shadowGeom, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    scene.add(shadowPlane);

    // 6. Build Initial 3D Combi Model
    buildCurrentModel();

    // 7. Animation Loop with Smooth Damping
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Auto-turntable rotation if enabled
      if (autoRotate && !isDraggingRef.current) {
        targetSphericalRef.current.theta += 0.005;
      }

      // Smooth spherical interpolation (Damping / Inertia)
      const cur = sphericalRef.current;
      const target = targetSphericalRef.current;
      cur.theta += (target.theta - cur.theta) * 0.08;
      cur.phi += (target.phi - cur.phi) * 0.08;
      cur.radius += (target.radius - cur.radius) * 0.08;

      // Clamp elevation phi to prevent camera flipping
      cur.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, cur.phi));

      // Calculate Cartesian Camera Position from Spherical
      const x = cur.radius * Math.sin(cur.phi) * Math.sin(cur.theta);
      const y = cur.radius * Math.cos(cur.phi);
      const z = cur.radius * Math.sin(cur.phi) * Math.cos(cur.theta);

      camera.position.set(x, y, z);
      camera.lookAt(0, 1.1, 0);

      // Animate sliding door interpolation
      if (slidingDoorRef.current && doorPositionsRef.current.closed && doorPositionsRef.current.open) {
        const destPos = doorOpen ? doorPositionsRef.current.open : doorPositionsRef.current.closed;
        slidingDoorRef.current.position.lerp(destPos, 0.12);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      renderer.dispose();
    };
  }, []);

  // Helper to re-build 3D model on preset change
  const buildCurrentModel = () => {
    if (!sceneRef.current) return;

    // Remove old model if present
    if (vehicleGroupRef.current) {
      sceneRef.current.remove(vehicleGroupRef.current);
    }

    const { group, slidingDoorGroup, doorClosedPos, doorOpenPos, materials } = buildCombi3D(activePreset, {
      carColor: currentHex,
      licensePlate,
      headlightsOn,
      doorOpen
    });

    vehicleGroupRef.current = group;
    slidingDoorRef.current = slidingDoorGroup;
    doorPositionsRef.current = { closed: doorClosedPos, open: doorOpenPos };
    activeMaterialsRef.current = materials;

    sceneRef.current.add(group);
  };

  // Re-build when preset changes
  useEffect(() => {
    buildCurrentModel();
  }, [selectedPresetId]);

  // Update paint color dynamically without re-building
  useEffect(() => {
    if (activeMaterialsRef.current?.paintMaterial) {
      activeMaterialsRef.current.paintMaterial.color.set(currentHex);
    }
  }, [currentHex]);

  // Update headlights state dynamically
  useEffect(() => {
    if (activeMaterialsRef.current?.ledHeadlightMaterial) {
      const mat = activeMaterialsRef.current.ledHeadlightMaterial;
      mat.emissive.set(headlightsOn ? 0x93c5fd : 0x000000);
      mat.emissiveIntensity = headlightsOn ? 2.5 : 0;
    }
    if (headlightsSpotRef.current) {
      headlightsSpotRef.current.intensity = headlightsOn ? 3.5 : 0;
    }
  }, [headlightsOn]);

  // =========================================================================
  // MOUSE & TOUCH ORBIT CONTROLS WITH DAMPING
  // =========================================================================
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    setAutoRotate(false);
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;

    targetSphericalRef.current.theta -= deltaX * 0.007;
    targetSphericalRef.current.phi -= deltaY * 0.005;
    targetSphericalRef.current.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, targetSphericalRef.current.phi));

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      setAutoRotate(false);
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - lastMousePosRef.current.x;
    const deltaY = e.touches[0].clientY - lastMousePosRef.current.y;

    targetSphericalRef.current.theta -= deltaX * 0.008;
    targetSphericalRef.current.phi -= deltaY * 0.006;
    targetSphericalRef.current.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, targetSphericalRef.current.phi));

    lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  // Wheel Zoom with clamping
  const handleWheel = (e) => {
    e.preventDefault();
    setAutoRotate(false);
    targetSphericalRef.current.radius = Math.max(
      4.5,
      Math.min(14.0, targetSphericalRef.current.radius + e.deltaY * 0.008)
    );
  };

  // Camera Presets
  const setCameraPreset = (preset) => {
    setAutoRotate(false);
    switch (preset) {
      case 'HERO': // Frente 3/4
        targetSphericalRef.current.theta = 0.65;
        targetSphericalRef.current.phi = 1.25;
        targetSphericalRef.current.radius = 9.5;
        break;
      case 'SIDE': // Lateral
        targetSphericalRef.current.theta = Math.PI / 2;
        targetSphericalRef.current.phi = 1.45;
        targetSphericalRef.current.radius = 9.2;
        break;
      case 'FRONT': // Frente
        targetSphericalRef.current.theta = 0;
        targetSphericalRef.current.phi = 1.42;
        targetSphericalRef.current.radius = 8.5;
        break;
      case 'REAR': // Trasera
        targetSphericalRef.current.theta = Math.PI;
        targetSphericalRef.current.phi = 1.38;
        targetSphericalRef.current.radius = 9.0;
        break;
      case 'TOP': // Isométrica
        targetSphericalRef.current.theta = 0.78;
        targetSphericalRef.current.phi = 0.55;
        targetSphericalRef.current.radius = 11.5;
        break;
      default:
        break;
    }
  };

  const handleSelectModelPreset = (preset) => {
    setSelectedPresetId(preset.id);
    if (onVehicleChange) {
      onVehicleChange({
        ...vehicle,
        brand: preset.brand,
        model: preset.model,
        vehicleType: preset.type,
        passengerCapacity: preset.capacity,
        seatCount: preset.seatCount,
        luggageCapacity: preset.luggage,
        approxCargoKg: preset.approxCargoKg,
        color: vehicle?.color || preset.colorDefault
      });
    }
  };

  const handleSelectColor = (colorObj) => {
    if (onVehicleChange) {
      onVehicleChange({ ...vehicle, color: colorObj.name });
    }
  };

  return (
    <div className="vehicle-3d-showroom-wrapper margin-bottom-24">
      {/* Studio Header HUD */}
      <div className="showroom-hud-header flex-between">
        <div className="flex-center gap-10">
          <div className="showroom-badge">
            <Sparkles size={15} className="text-amber" />
            <span>Showroom 3D Profesional (Three.js WebGL)</span>
          </div>
          <div className="vehicle-title-spec">
            <strong>{brand} {model}</strong>
            <span className="text-muted text-xs">
              • <span className="text-indigo font-weight-700">{activePreset.badge}</span>
              • Patente: <span className="font-mono text-emerald font-weight-700">{licensePlate}</span>
            </span>
          </div>
        </div>

        <div className="flex-center gap-8">
          <span className="badge badge-success flex-center gap-4 text-xs">
            <CheckCircle size={12} /> Render PBR Automotriz
          </span>
        </div>
      </div>

      {/* Argentina Combi Catalog Selector */}
      <div className="arg-models-catalog-bar margin-bottom-14">
        <div className="catalog-bar-label">
          <Car size={15} className="text-indigo" />
          <span>Elegí el modelo 3D de tu combi en Argentina:</span>
        </div>
        <div className="arg-models-scroll-row">
          {ARGENTINA_VEHICLE_CATALOG.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                className={`arg-model-card-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSelectModelPreset(preset)}
              >
                <div className="model-btn-header">
                  <span className="model-brand-name">{preset.brand}</span>
                  {isSelected && <span className="selected-check-dot">✓</span>}
                </div>
                <strong className="model-full-name">{preset.model}</strong>
                <div className="model-btn-footer">
                  <span>{preset.capacity} Asientos</span>
                  <span className="model-type-chip">{preset.type}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="showroom-stage-container">
        <div
          ref={containerRef}
          className="showroom-canvas-box"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          onWheel={handleWheel}
        />

        {/* Interaction Hint */}
        <div className="showroom-interaction-hint">
          <span>Click + arrastrá para rotar 360° • Rueda del mouse para Zoom</span>
        </div>

        {/* Floating Spec Badges */}
        <div className="showroom-overlay-badges">
          <div className="spec-floating-tag">
            <span className="tag-dot" style={{ backgroundColor: currentHex }}></span>
            <span>{currentColor}</span>
          </div>
          <div className="spec-floating-tag">
            <span>{activePreset.capacity} Pasajeros</span>
          </div>
          {doorOpen && (
            <div className="spec-floating-tag tag-active-door">
              <DoorOpen size={12} /> Puerta Pasajeros Abierta
            </div>
          )}
          {headlightsOn && (
            <div className="spec-floating-tag tag-active-light">
              <Zap size={12} /> Faros LED Encendidos
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="showroom-controls-bar flex-between flex-wrap gap-12">
          {/* Angle Presets */}
          <div className="controls-group flex-center gap-6">
            <span className="control-label text-xs text-muted">Cámara:</span>
            <button type="button" className="btn-control-chip" onClick={() => setCameraPreset('HERO')}>
              Perspectiva 3/4
            </button>
            <button type="button" className="btn-control-chip" onClick={() => setCameraPreset('SIDE')}>
              Lateral
            </button>
            <button type="button" className="btn-control-chip" onClick={() => setCameraPreset('FRONT')}>
              Frente
            </button>
            <button type="button" className="btn-control-chip" onClick={() => setCameraPreset('REAR')}>
              Trasera
            </button>
            <button type="button" className="btn-control-chip" onClick={() => setCameraPreset('TOP')}>
              Superior
            </button>
          </div>


          {/* Interactive Toggles */}
          <div className="controls-group flex-center gap-8">
            <button
              type="button"
              className={`btn-action-toggle ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
              title="Rotación continua 360°"
            >
              {autoRotate ? <Pause size={14} /> : <Play size={14} />}
              <span>{autoRotate ? 'Pausar Giro' : 'Girar 360°'}</span>
            </button>

            <button
              type="button"
              className={`btn-action-toggle ${headlightsOn ? 'active' : ''}`}
              onClick={() => setHeadlightsOn(!headlightsOn)}
              title="Encender / Apagar Faros LED"
            >
              <Sun size={14} />
              <span>Faros</span>
            </button>

            <button
              type="button"
              className={`btn-action-toggle ${doorOpen ? 'active' : ''}`}
              onClick={() => setDoorOpen(!doorOpen)}
              title="Abrir / Cerrar Puerta Corrediza de Pasajeros"
            >
              {doorOpen ? <DoorOpen size={14} /> : <DoorClosed size={14} />}
              <span>{doorOpen ? 'Puerta Abierta' : 'Puerta'}</span>
            </button>
          </div>

          {/* Paint Swatches Palette */}
          <div className="controls-group flex-center gap-6">
            <span className="control-label text-xs text-muted">Pintura:</span>
            <div className="swatches-row flex-center gap-4">
              {ARGENTINA_COLORS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  className={`color-swatch-circle ${currentColor === preset.name ? 'selected' : ''}`}
                  style={{ backgroundColor: preset.hex }}
                  onClick={() => handleSelectColor(preset)}
                  title={`${preset.name} (${preset.desc})`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
