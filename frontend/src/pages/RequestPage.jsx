import React from 'react';
import TripRequestForm from '../components/TripRequestForm';
import RequestConfirmation from '../components/RequestConfirmation';
import MatchList from '../components/MatchList';
import TripDetails from '../components/TripDetails';

export default function RequestPage({
  viewState,
  setViewState,
  lastCreatedRequest,
  currentRequestId,
  matches,
  selectedTrip,
  loading,
  onSubmitRequest,
  onSelectTrip,
  onResetForm,
  onViewMyRequests
}) {
  return (
    <div className="request-page-wrapper">
      {viewState === 'FORM' && (
        <TripRequestForm onSubmit={onSubmitRequest} loading={loading} />
      )}

      {viewState === 'CONFIRMATION' && (
        <RequestConfirmation
          requestData={lastCreatedRequest}
          onCreateAnother={() => setViewState('FORM')}
          onViewMyRequests={onViewMyRequests}
        />
      )}

      {viewState === 'MATCHES' && (
        <MatchList
          requestId={currentRequestId}
          matches={matches}
          onSelectTrip={onSelectTrip}
          onReset={onResetForm}
        />
      )}

      {viewState === 'DETAILS' && (
        <TripDetails
          tripData={selectedTrip}
          onBack={() => setViewState('MATCHES')}
        />
      )}
    </div>
  );
}
