import React from 'react';
import AdminPanel from '../components/AdminPanel';

export default function AdminPage({
  allRequests,
  onRunAlgorithm,
  onUpdateStatus,
  onDeleteRequest,
  onViewMatches
}) {
  return (
    <div className="admin-page-wrapper">
      <AdminPanel
        allRequests={allRequests}
        onRunAlgorithm={onRunAlgorithm}
        onUpdateStatus={onUpdateStatus}
        onDeleteRequest={onDeleteRequest}
        onViewMatches={onViewMatches}
      />
    </div>
  );
}
