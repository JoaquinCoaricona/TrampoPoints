import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  User,
  Bus,
  FileCheck,
  Star,
  Sparkles,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import DriverDashboard from './DriverDashboard';
import DriverProfile from './DriverProfile';
import DriverVehicle from './DriverVehicle';
import DriverDocumentation from './DriverDocumentation';
import DriverRatings from './DriverRatings';
import DriverRecommendations from './DriverRecommendations';
import { getDriverDashboard } from '../../services/driverService';

export default function DriverModule({ onExit }) {
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // 'DASHBOARD' | 'PROFILE' | 'VEHICLE' | 'DOCS' | 'RATINGS' | 'RECOMMENDATIONS'
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

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

  return (
    <div className="driver-module-container">
      {/* Top Banner / Breadcrumb */}
      <div className="driver-module-header flex-between margin-bottom-20">
        <div className="driver-module-title-area flex-center gap-12">
          <button
            className="btn-secondary btn-sm flex-center gap-6"
            onClick={onExit}
            title="Volver a la vista principal"
          >
            <ArrowLeft size={16} /> Volver a TrampoPoints
          </button>
          <div className="driver-badge-indicator">
            <Bus size={18} className="text-indigo" />
            <span>Panel de Gestión del Chofer</span>
          </div>
        </div>

        <div className="driver-status-indicator hide-mobile">
          <span className="dot pulse"></span>
          <span>Sistema de Chofer Conectado</span>
        </div>
      </div>

      {/* Driver Module Secondary Navigation Tabs */}
      <div className="driver-subnav-tabs margin-bottom-24">
        <button
          className={`driver-tab-btn ${activeTab === 'DASHBOARD' ? 'active' : ''}`}
          onClick={() => setActiveTab('DASHBOARD')}
        >
          <LayoutDashboard size={16} /> Dashboard
        </button>
        <button
          className={`driver-tab-btn ${activeTab === 'PROFILE' ? 'active' : ''}`}
          onClick={() => setActiveTab('PROFILE')}
        >
          <User size={16} /> Mi Perfil
        </button>
        <button
          className={`driver-tab-btn ${activeTab === 'VEHICLE' ? 'active' : ''}`}
          onClick={() => setActiveTab('VEHICLE')}
        >
          <Bus size={16} /> Mi Vehículo
        </button>
        <button
          className={`driver-tab-btn ${activeTab === 'DOCS' ? 'active' : ''}`}
          onClick={() => setActiveTab('DOCS')}
        >
          <FileCheck size={16} /> Documentación
        </button>
        <button
          className={`driver-tab-btn ${activeTab === 'RATINGS' ? 'active' : ''}`}
          onClick={() => setActiveTab('RATINGS')}
        >
          <Star size={16} /> Calificaciones
        </button>
        <button
          className={`driver-tab-btn ${activeTab === 'RECOMMENDATIONS' ? 'active' : ''}`}
          onClick={() => setActiveTab('RECOMMENDATIONS')}
        >
          <Sparkles size={16} /> Recomendaciones
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="driver-tab-content">
        {activeTab === 'DASHBOARD' && (
          <DriverDashboard
            dashboardData={dashboardData}
            onNavigate={(tab) => setActiveTab(tab)}
            onRefresh={loadDashboard}
          />
        )}

        {activeTab === 'PROFILE' && (
          <DriverProfile onUpdateSuccess={loadDashboard} />
        )}

        {activeTab === 'VEHICLE' && (
          <DriverVehicle onUpdateSuccess={loadDashboard} />
        )}

        {activeTab === 'DOCS' && (
          <DriverDocumentation onUpdateSuccess={loadDashboard} />
        )}

        {activeTab === 'RATINGS' && (
          <DriverRatings />
        )}

        {activeTab === 'RECOMMENDATIONS' && (
          <DriverRecommendations />
        )}
      </div>
    </div>
  );
}
