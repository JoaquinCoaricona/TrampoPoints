import React from 'react';

export default function MiniLogoTP({ size = 44, className = '' }) {
  return (
    <div className={`tp-mini-logo-box ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="24" fill="#151d2a" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="4" />
        <path d="M26 26H74V38H54V74H40V38H26V26Z" fill="#34d399" />
        <path d="M40 38H66C72.6 38 78 43.4 78 50C78 56.6 72.6 62 66 62H54V50H66C66 50 66 50 66 50Z" fill="#34d399" />
      </svg>
    </div>
  );
}
