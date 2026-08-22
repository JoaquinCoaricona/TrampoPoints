import React from 'react';
import { Bus, ShieldCheck, MapPin } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand">
          <div className="logo-badge">
            <Bus className="icon-bus" size={26} />
          </div>
          <div className="brand-text">
            <h1>TrampoPoints</h1>
            <span className="subtitle">Viajes Compartidos en Combi</span>
          </div>
        </div>

        <div className="header-status">
          <div className="status-badge">
            <span className="dot pulse"></span>
            <span>Sistema de Matching Activo</span>
          </div>
          <div className="mode-badge">
            <ShieldCheck size={16} />
            <span>MVP v1.0</span>
          </div>
        </div>
      </div>
    </header>
  );
}
