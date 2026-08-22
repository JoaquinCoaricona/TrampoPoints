import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Bus,
  FileCheck,
  Star,
  Sparkles
} from 'lucide-react';
import Header from '../components/Header';
import { getDriverDashboard } from '../services/driverService';

export default function DriverLayout() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await getDriverDashboard();
      setDashboardData(data);
    } catch (err) {
      console.error('Error al cargar dashboard del chofer:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="driver-layout-root">
      <Header />

      <main className="driver-main-container container">
        {/* Driver Top Banner */}
        <div className="driver-header-strip flex-between align-center">
          <div className="driver-title-chip flex-center gap-8">
            <Bus size={18} className="text-neon-green" />
            <span className="driver-title-text">Portal Oficial del Chofer</span>
            <span className="driver-live-dot pulse"></span>
          </div>

          <div className="driver-system-status hide-mobile">
            <span className="text-xs text-muted">Red de Minibuses • Conexión Segura</span>
          </div>
        </div>

        {/* Driver Navigation Bar with NavLinks */}
        <nav className="driver-navbar" aria-label="Navegación del Chofer">
          <NavLink
            to="/driver"
            end
            className={({ isActive }) => `driver-navlink ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/driver/profile"
            className={({ isActive }) => `driver-navlink ${isActive ? 'active' : ''}`}
          >
            <User size={16} />
            <span>Mi Perfil</span>
          </NavLink>

          <NavLink
            to="/driver/vehicle"
            className={({ isActive }) => `driver-navlink ${isActive ? 'active' : ''}`}
          >
            <Bus size={16} />
            <span>Mi Vehículo</span>
          </NavLink>

          <NavLink
            to="/driver/documents"
            className={({ isActive }) => `driver-navlink ${isActive ? 'active' : ''}`}
          >
            <FileCheck size={16} />
            <span>Documentación</span>
          </NavLink>

          <NavLink
            to="/driver/ratings"
            className={({ isActive }) => `driver-navlink ${isActive ? 'active' : ''}`}
          >
            <Star size={16} />
            <span>Calificaciones</span>
          </NavLink>

          <NavLink
            to="/driver/recommendations"
            className={({ isActive }) => `driver-navlink ${isActive ? 'active' : ''}`}
          >
            <Sparkles size={16} />
            <span>Recomendaciones</span>
          </NavLink>
        </nav>

        {/* Subpage Content rendered via Outlet */}
        <div className="driver-page-outlet">
          <Outlet context={{ dashboardData, onRefresh: loadDashboard }} />
        </div>
      </main>
    </div>
  );
}
