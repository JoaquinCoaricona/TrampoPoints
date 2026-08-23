import React from 'react';
import AdminPanel from '../components/AdminPanel';

export default function AdminPage({
  allRequests,
  availableCombisCount,
  onRefreshCombis,
  onRunAlgorithm,
  onUpdateStatus,
  onDeleteRequest,
  onViewMatches
}) {
  return (
    <div className="admin-page-wrapper">
      <AdminPanel
        allRequests={allRequests}
        availableCombisCount={availableCombisCount}
        onRefreshCombis={onRefreshCombis}
        onRunAlgorithm={onRunAlgorithm}
        onUpdateStatus={onUpdateStatus}
        onDeleteRequest={onDeleteRequest}
        onViewMatches={onViewMatches}
      />
    </div>
  );
}

