import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Edit,
  Loader2,
  Calendar,
  Building,
  X,
  Save,
  Sparkles
} from 'lucide-react';
import {
  getDocumentations,
  saveDocumentation,
  deleteDocumentation
} from '../../services/driverService';

export default function DriverDocumentation({ onUpdateSuccess }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [docType, setDocType] = useState('SEGURO');
  const [title, setTitle] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const data = await getDocumentations();
      setDocs(data);
    } catch (err) {
      setError('Error al cargar la documentación');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingDoc(null);
    setDocType('SEGURO');
    setTitle('Seguro de Pasajeros y Resp. Civil');
    setDocNumber('');
    setIssuer('Compañía Aseguradora');
    setIssueDate(new Date().toISOString().split('T')[0]);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setExpirationDate(nextYear.toISOString().split('T')[0]);
    setNotes('');
    setShowModal(true);
  };

  const handleOpenEditModal = (doc) => {
    setEditingDoc(doc);
    setDocType(doc.type);
    setTitle(doc.title);
    setDocNumber(doc.docNumber || '');
    setIssuer(doc.issuer || '');
    setIssueDate(doc.issueDate || '');
    setExpirationDate(doc.expirationDate || '');
    setNotes(doc.notes || '');
    setShowModal(true);
  };

  const handleSaveDoc = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      id: editingDoc ? editingDoc.id : null,
      type: docType,
      title: title.trim(),
      docNumber: docNumber.trim(),
      issuer: issuer.trim(),
      issueDate: issueDate || null,
      expirationDate: expirationDate || null,
      notes: notes.trim(),
      status: 'VALID'
    };

    try {
      await saveDocumentation(payload);
      setShowModal(false);
      await loadDocs();
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      setError('Error al guardar el documento');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este documento?')) return;
    try {
      await deleteDocumentation(id);
      await loadDocs();
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      setError('Error al eliminar el documento');
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'VALID':
        return (
          <span className="chip-status-clean status-valid flex-center gap-4">
            <CheckCircle2 size={13} className="text-neon-green" /> Vigente
          </span>
        );
      case 'EXPIRING_SOON':
        return (
          <span className="chip-status-clean status-expiring flex-center gap-4">
            <Clock size={13} className="text-electric-violet" /> Por Vencer
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="chip-status-clean status-expired flex-center gap-4">
            <AlertTriangle size={13} className="text-rose" /> Vencido
          </span>
        );
      default:
        return <span className="chip-status-clean">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="driver-docs-skeleton flex-column gap-20">
        <div className="skeleton-box shimmer-wave" style={{ height: '90px', borderRadius: '14px' }} />
        <div className="skeleton-box shimmer-wave" style={{ height: '320px', borderRadius: '14px' }} />
      </div>
    );
  }

  const validCount = docs.filter((d) => d.status === 'VALID' || d.status === 'EXPIRING_SOON').length;
  const expiredCount = docs.filter((d) => d.status === 'EXPIRED').length;

  return (
    <div className="driver-subpage-container">
      {/* Header section (Clean, no heavy card) */}
      <div className="subpage-header flex-between align-center flex-wrap gap-12 margin-bottom-24">
        <div>
          <span className="subpage-eyebrow text-neon-green flex-center gap-6">
            <FileCheck size={14} /> Requisitos Legales & Habilitaciones
          </span>
          <h1 className="subpage-title">Documentación del Chofer</h1>
          <p className="subpage-subtitle">
            Mantené al día tus pólizas de seguro, VTV/RTO y licencia profesional para operar viajes en la plataforma.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary-neon flex-center gap-6"
          onClick={handleOpenAddModal}
        >
          <Plus size={16} /> + Cargar Nuevo Documento
        </button>
      </div>

      {/* Summary strip */}
      <div className="profile-metrics-strip margin-bottom-28">
        <div className="metric-strip-item">
          <span className="metric-strip-label">Documentos Totales</span>
          <strong className="metric-strip-value">{docs.length}</strong>
        </div>
        <div className="metric-strip-item">
          <span className="metric-strip-label">Habilitados & Vigentes</span>
          <strong className="metric-strip-value text-neon-green">{validCount}</strong>
        </div>
        <div className="metric-strip-item">
          <span className="metric-strip-label">Requieren Atención</span>
          <strong className={`metric-strip-value ${expiredCount > 0 ? 'text-rose' : 'text-muted'}`}>
            {expiredCount}
          </strong>
        </div>
        <div className="metric-strip-item">
          <span className="metric-strip-label">Estado de Flota</span>
          <strong className="metric-strip-value text-neon-green">● Habilitada</strong>
        </div>
      </div>

      {error && (
        <div className="alert-banner-red margin-bottom-20">
          <span>{error}</span>
        </div>
      )}

      {/* Clean Documents Table / List */}
      <div className="docs-clean-list">
        {docs.length === 0 ? (
          <div className="empty-state-clean text-center padding-32">
            <FileCheck size={32} className="text-muted margin-bottom-12" />
            <h3>No tenés documentos cargados</h3>
            <p className="text-muted text-xs margin-top-4">Cargá tu primer seguro o VTV haciendo clic en "+ Cargar Nuevo Documento".</p>
          </div>
        ) : (
          docs.map((doc) => (
            <div key={doc.id} className="doc-row-clean flex-between align-center flex-wrap gap-16">
              <div className="doc-info-main flex-center gap-16">
                <div className="doc-type-icon-wrap">
                  <ShieldCheck size={20} className="text-neon-green" />
                </div>
                <div className="flex-column gap-2">
                  <div className="flex-center gap-8">
                    <strong className="doc-title-text">{doc.title}</strong>
                    {getStatusChip(doc.status)}
                  </div>
                  <div className="doc-meta-subtext flex-center gap-12 text-xs text-muted">
                    {doc.docNumber && <span><strong>N°:</strong> {doc.docNumber}</span>}
                    {doc.issuer && <span><strong>Emisor:</strong> {doc.issuer}</span>}
                    {doc.expirationDate && (
                      <span className="text-neon-green">
                        <strong>Vence:</strong> {new Date(doc.expirationDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {doc.notes && <p className="doc-notes-text text-xs text-muted">{doc.notes}</p>}
                </div>
              </div>

              <div className="doc-actions-wrap flex-center gap-8">
                <button
                  type="button"
                  className="btn-icon-action btn-edit-doc"
                  onClick={() => handleOpenEditModal(doc)}
                  title="Editar documento"
                  aria-label="Editar documento"
                >
                  <Edit size={16} />
                </button>
                <button
                  type="button"
                  className="btn-icon-action btn-delete-doc"
                  onClick={() => handleDeleteDoc(doc.id)}
                  title="Eliminar documento"
                  aria-label="Eliminar documento"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit Document */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container glass-card doc-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowModal(false)} aria-label="Cerrar modal">
              <X size={20} />
            </button>

            <div className="modal-header margin-bottom-20">
              <div className="flex-center gap-10">
                <ShieldCheck size={24} className="text-neon-green" />
                <h2 className="modal-title">
                  {editingDoc ? 'Editar Documento' : 'Cargar Nuevo Documento'}
                </h2>
              </div>
              <p className="modal-subtitle text-xs text-muted margin-top-4">
                Ingresá los datos de la póliza, VTV o habilitación municipal.
              </p>
            </div>

            <form onSubmit={handleSaveDoc} className="clean-doc-form">
              <div className="form-group margin-bottom-16">
                <label className="form-label">Tipo de Documento</label>
                <select
                  className="form-input form-select"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  required
                >
                  <option value="SEGURO">Póliza de Seguro de Pasajeros / Resp. Civil</option>
                  <option value="VTV_RTO">VTV / RTO Nacional Vigente</option>
                  <option value="LICENCIA_CONDUCIR">Licencia Profesional (CNRT / Municipal)</option>
                  <option value="CEDULA_VERDE">Cédula Verde / Identificación del Minibús</option>
                  <option value="HABILITACION_CNRT">Habilitación Turística / Transporte de Pasajeros</option>
                </select>
              </div>

              <div className="form-group margin-bottom-16">
                <label className="form-label">Título o Descripción</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Seguro Todo Riesgo Pasajeros"
                  required
                />
              </div>

              <div className="form-grid-2cols margin-bottom-16">
                <div className="form-group">
                  <label className="form-label">Número de Póliza / Registro</label>
                  <input
                    type="text"
                    className="form-input"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Ej. POL-984210"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Entidad Emisora</label>
                  <input
                    type="text"
                    className="form-input"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="Ej. Federación Patronal / CNRT"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2cols margin-bottom-16">
                <div className="form-group">
                  <label className="form-label">Fecha de Emisión</label>
                  <input
                    type="date"
                    className="form-input"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Fecha de Vencimiento</label>
                  <input
                    type="date"
                    className="form-input"
                    value={expirationDate}
                    onChange={(e) => setExpirationDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group margin-bottom-24">
                <label className="form-label">Observaciones o Cobertura</label>
                <textarea
                  className="form-input form-textarea"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Cobertura hasta $50.000.000 por pasajero y terceros transportados"
                />
              </div>

              <div className="modal-actions flex-between">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary-neon flex-center gap-6"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="spinner" size={16} /> Guardando...
                    </>
                  ) : (
                    <>
                      <Save size={16} /> Guardar Documento
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
