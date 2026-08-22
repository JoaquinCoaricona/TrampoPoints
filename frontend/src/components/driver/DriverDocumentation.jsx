import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Edit,
  Loader2,
  X,
  Save
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
    setTitle('Seguro Obligatorio y Resp. Civil');
    setDocNumber('');
    setIssuer('La Segunda Seguros');
    setIssueDate(new Date().toISOString().split('T')[0]);
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setExpirationDate(nextYear.toISOString().split('T')[0]);
    setNotes('Cobertura integral para transporte interurbano de pasajeros');
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
          <span className="doc-status-tag text-neon-green flex-center gap-6">
            <CheckCircle2 size={13} /> Vigente
          </span>
        );
      case 'EXPIRING_SOON':
        return (
          <span className="doc-status-tag text-electric-violet flex-center gap-6">
            <Clock size={13} /> Por Vencer
          </span>
        );
      case 'EXPIRED':
        return (
          <span className="doc-status-tag text-rose flex-center gap-6">
            <AlertTriangle size={13} /> Vencido
          </span>
        );
      default:
        return <span className="doc-status-tag">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="driver-subpage-container flex-column gap-32">
        <div className="skeleton-box shimmer-wave" style={{ height: '80px', borderRadius: '10px' }} />
        <div className="skeleton-box shimmer-wave" style={{ height: '300px', borderRadius: '10px' }} />
      </div>
    );
  }

  const validCount = docs.filter((d) => d.status === 'VALID' || d.status === 'EXPIRING_SOON').length;
  const expiredCount = docs.filter((d) => d.status === 'EXPIRED').length;

  return (
    <div className="driver-subpage-container">
      {/* Top Header & New Doc Button */}
      <header className="docs-summary-header flex-between align-center flex-wrap gap-24 margin-bottom-40">
        <div className="flex-column gap-6">
          <span className="section-eyebrow text-neon-green">Habilitaciones & Cumplimiento</span>
          <h1 className="docs-page-title">Documentación del Chofer</h1>
          <div className="docs-counts-line text-sm text-muted">
            <strong className="text-main">{validCount}</strong> documentos al día ·{' '}
            <strong className={expiredCount > 0 ? 'text-rose' : 'text-muted'}>{expiredCount}</strong> vencidos · Unidad autorizada para circular
          </div>
        </div>

        <button
          type="button"
          className="btn-primary-neon flex-center gap-8"
          onClick={handleOpenAddModal}
        >
          <Plus size={16} /> Cargar Nuevo Documento
        </button>
      </header>

      <div className="hairline-divider margin-bottom-40" />

      {error && (
        <div className="alert-banner-red margin-bottom-32">
          <span>{error}</span>
        </div>
      )}

      {/* Structured Document List (Left-to-Right Scan) */}
      <div className="docs-structured-list flex-column">
        {docs.length === 0 ? (
          <div className="empty-state-clean text-center padding-48 flex-column align-center gap-12">
            <FileCheck size={36} className="text-muted" />
            <h3>No tenés documentos cargados</h3>
            <p className="text-muted text-sm max-w-400">
              Cargá tu primer seguro de pasajeros o VTV haciendo clic en el botón superior.
            </p>
          </div>
        ) : (
          docs.map((doc) => (
            <div key={doc.id} className="doc-entry-row flex-between align-start flex-wrap gap-24">
              {/* Left Column: Icon + Document details with distinct lines */}
              <div className="doc-details-col flex-start gap-32">
                <div className="doc-shield-icon">
                  <ShieldCheck size={24} className="text-neon-green" />
                </div>
                <div className="flex-column gap-12">
                  {/* Name + Status Tag */}
                  <div className="flex-center gap-16 flex-wrap margin-bottom-4">
                    <h3 className="doc-title-text">{doc.title}</h3>
                    {getStatusChip(doc.status)}
                  </div>

                  {/* Issuer & Policy Number */}
                  <div className="doc-issuer-line text-sm text-muted flex-center gap-16 flex-wrap">
                    {doc.issuer && <span>Emisor: <strong className="text-main">{doc.issuer}</strong></span>}
                    {doc.docNumber && <span>· Póliza / N°: <strong className="text-main">{doc.docNumber}</strong></span>}
                  </div>

                  {/* Notes / Description */}
                  {doc.notes && (
                    <p className="doc-notes-text text-sm text-muted">
                      {doc.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Expiration Date & Actions */}
              <div className="doc-meta-actions-col flex-center gap-24 align-self-center">
                {doc.expirationDate && (
                  <div className="doc-vencimiento-box text-right flex-column gap-2">
                    <span className="text-xs text-muted block">Vencimiento</span>
                    <span className="text-sm text-main font-semibold">
                      {new Date(doc.expirationDate).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <div className="flex-center gap-8">
                  <button
                    type="button"
                    className="btn-icon-subtle"
                    onClick={() => handleOpenEditModal(doc)}
                    title="Editar documento"
                    aria-label="Editar documento"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn-icon-subtle btn-delete-subtle"
                    onClick={() => handleDeleteDoc(doc.id)}
                    title="Eliminar documento"
                    aria-label="Eliminar documento"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Add / Edit Document */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container doc-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowModal(false)} aria-label="Cerrar modal">
              <X size={20} />
            </button>

            <div className="modal-header flex-column gap-6 margin-bottom-28">
              <span className="section-eyebrow text-neon-green">
                {editingDoc ? 'Modificar Registro' : 'Nueva Habilitación'}
              </span>
              <h2 className="modal-title">
                {editingDoc ? 'Editar Documento' : 'Cargar Nuevo Documento'}
              </h2>
            </div>

            <form onSubmit={handleSaveDoc} className="clean-doc-form">
              <div className="form-group flex-column gap-8 margin-bottom-20">
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

              <div className="form-group flex-column gap-8 margin-bottom-20">
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

              <div className="form-grid-2cols margin-bottom-20">
                <div className="form-group flex-column gap-8">
                  <label className="form-label">Número de Registro / Póliza</label>
                  <input
                    type="text"
                    className="form-input"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Ej. POL-984210"
                    required
                  />
                </div>

                <div className="form-group flex-column gap-8">
                  <label className="form-label">Entidad Emisora</label>
                  <input
                    type="text"
                    className="form-input"
                    value={issuer}
                    onChange={(e) => setIssuer(e.target.value)}
                    placeholder="Ej. La Segunda Seguros"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2cols margin-bottom-20">
                <div className="form-group flex-column gap-8">
                  <label className="form-label">Fecha de Emisión</label>
                  <input
                    type="date"
                    className="form-input"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                  />
                </div>

                <div className="form-group flex-column gap-8">
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

              <div className="form-group flex-column gap-8 margin-bottom-32">
                <label className="form-label">Observaciones</label>
                <textarea
                  className="form-input form-textarea"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Cobertura completa por pasajero y terceros transportados"
                />
              </div>

              <div className="modal-actions flex-between align-center">
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
                  className="btn-primary-neon flex-center gap-8"
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
