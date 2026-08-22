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
  Building
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
    setIssuer('Compañía Aseguradora');
    setIssueDate(new Date().toISOString().slice(0, 10));
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setExpirationDate(nextYear.toISOString().slice(0, 10));
    setNotes('');
    setShowModal(true);
  };

  const handleOpenEditModal = (doc) => {
    setEditingDoc(doc);
    setDocType(doc.documentType || 'SEGURO');
    setTitle(doc.title || '');
    setDocNumber(doc.documentNumber || '');
    setIssuer(doc.issuer || '');
    setIssueDate(doc.issueDate || '');
    setExpirationDate(doc.expirationDate || '');
    setNotes(doc.notes || '');
    setShowModal(true);
  };

  const handleDelete = async (docId) => {
    if (!window.confirm('¿Seguro que deseas eliminar este registro de documentación?')) {
      return;
    }
    try {
      await deleteDocumentation(docId);
      setDocs(docs.filter((d) => d.id !== docId));
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      alert('Error al eliminar documento');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        id: editingDoc ? editingDoc.id : null,
        documentType: docType,
        title,
        documentNumber: docNumber,
        issuer,
        issueDate: issueDate || null,
        expirationDate: expirationDate || null,
        notes
      };

      const saved = await saveDocumentation(payload);
      if (editingDoc) {
        setDocs(docs.map((d) => (d.id === saved.id ? saved : d)));
      } else {
        setDocs([...docs, saved]);
      }
      setShowModal(false);
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      alert('Error al guardar documento');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (doc) => {
    if (!doc.expirationDate) {
      return (
        <span className="badge badge-success flex-center gap-4">
          <CheckCircle2 size={12} /> Permanente / Al Día
        </span>
      );
    }

    if (doc.status === 'EXPIRED') {
      return (
        <span className="badge badge-rose flex-center gap-4">
          <XCircle size={12} /> Vencido ({Math.abs(doc.daysUntilExpiration)} días)
        </span>
      );
    }

    if (doc.status === 'PENDING_RENEWAL') {
      return (
        <span className="badge badge-amber flex-center gap-4">
          <Clock size={12} /> Por Vencer ({doc.daysUntilExpiration} días)
        </span>
      );
    }

    return (
      <span className="badge badge-success flex-center gap-4">
        <CheckCircle2 size={12} /> ✓ Vigente ({doc.daysUntilExpiration} días restantes)
      </span>
    );
  };

  if (loading) {
    return (
      <div className="card glass-card padding-32 text-center flex-center">
        <Loader2 className="spinner" size={24} />
        <span>Cargando documentación del vehículo...</span>
      </div>
    );
  }

  return (
    <div className="driver-docs-view">
      <div className="card glass-card">
        <div className="card-header flex-between margin-bottom-24">
          <div>
            <h2 className="title-with-icon">
              <ShieldCheck className="accent-icon text-emerald" size={22} /> Documentación Legal del Vehículo
            </h2>
            <p className="card-subtitle">
              Gestioná las pólizas de seguro, certificados de VTV/RTO y habilitaciones obligatorias para circular.
            </p>
          </div>

          <button className="btn-primary btn-auto flex-center gap-6" onClick={handleOpenAddModal}>
            <Plus size={16} /> + Registrar Documento
          </button>
        </div>

        {/* Documentation Cards List */}
        <div className="docs-list-grid">
          {docs.map((doc) => (
            <div key={doc.id} className="doc-item-card card glass-card">
              <div className="flex-between margin-bottom-8">
                <span className="doc-type-badge">{doc.documentType}</span>
                {getStatusBadge(doc)}
              </div>

              <h3 className="doc-title">{doc.title}</h3>
              <div className="doc-number-box font-mono">
                <span>N° / Póliza: <strong>{doc.documentNumber}</strong></span>
              </div>

              <div className="doc-meta-info margin-top-12">
                <div className="flex-center-left gap-6">
                  <Building size={14} className="text-muted shrink-0" />
                  <span>Emisor: <strong>{doc.issuer}</strong></span>
                </div>

                {doc.expirationDate && (
                  <div className="flex-center-left gap-6 margin-top-4">
                    <Calendar size={14} className="text-muted shrink-0" />
                    <span>
                      Vence: <strong>{new Date(doc.expirationDate).toLocaleDateString('es-AR')}</strong>
                    </span>
                  </div>
                )}

                {doc.notes && (
                  <p className="doc-notes-text margin-top-8 text-xs text-muted">
                    {doc.notes}
                  </p>
                )}
              </div>

              <div className="doc-actions-footer margin-top-16 flex-between">
                <button
                  className="btn-secondary btn-sm flex-center gap-4"
                  onClick={() => handleOpenEditModal(doc)}
                >
                  <Edit size={13} /> Editar
                </button>
                <button
                  className="btn-text text-rose btn-sm flex-center gap-4"
                  onClick={() => handleDelete(doc.id)}
                >
                  <Trash2 size={13} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Add / Edit */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="card-header margin-bottom-16">
              <h3>{editingDoc ? 'Editar Documento' : 'Registrar Nuevo Documento'}</h3>
            </div>

            <form onSubmit={handleSubmit} className="doc-form">
              <div className="form-group margin-bottom-12">
                <label className="form-label">Tipo de Documento</label>
                <select
                  className="form-input"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="SEGURO">Seguro de Pasajeros / Flota</option>
                  <option value="VTV">VTV / RTO (Revisión Técnica)</option>
                  <option value="LICENCIA_PROFESIONAL">Licencia Nacional Profesional</option>
                  <option value="PATENTE">Cédula / Patente Automotor</option>
                  <option value="HABILITACION">Habilitación Municipal / CNRT</option>
                </select>
              </div>

              <div className="form-group margin-bottom-12">
                <label className="form-label">Título / Descripción</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. Seguro Todo Riesgo Pasajeros"
                  required
                />
              </div>

              <div className="form-group margin-bottom-12">
                <label className="form-label">Número de Póliza / Identificador</label>
                <input
                  type="text"
                  className="form-input font-mono"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  placeholder="Ej. POL-881920"
                  required
                />
              </div>

              <div className="form-group margin-bottom-12">
                <label className="form-label">Entidad Emisora</label>
                <input
                  type="text"
                  className="form-input"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="Ej. La Segunda Seguros, Gobierno CABA"
                  required
                />
              </div>

              <div className="form-grid margin-bottom-16">
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
                  />
                </div>
              </div>

              <div className="form-group margin-bottom-20">
                <label className="form-label">Notas Adicionales</label>
                <textarea
                  className="form-input"
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observaciones sobre la póliza..."
                ></textarea>
              </div>

              <div className="flex-between">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary btn-auto flex-center gap-6"
                  disabled={saving}
                >
                  {saving && <Loader2 className="spinner" size={14} />}
                  {editingDoc ? 'Actualizar Documento' : 'Guardar Documento'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
