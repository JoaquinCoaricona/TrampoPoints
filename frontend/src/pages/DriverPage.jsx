import React from 'react';
import DriverModule from '../components/driver/DriverModule';

export default function DriverPage({ onExit }) {
  return (
    <div className="driver-page-wrapper">
      <DriverModule onExit={onExit} />
    </div>
  );
}
