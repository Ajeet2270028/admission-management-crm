import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getApplicant, allocateSeat, confirmAdmission,
  updateDocStatus, updateFeeStatus, cancelAdmission, getProgramQuotas
} from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const statusBadge = (s, type = 'admission') => {
  const cls = s?.toLowerCase().replace('_', '_');
  return <span className={`badge badge-${cls}`}>{s?.replace('_', ' ')}</span>;
};

const Field = ({ label, value }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{label}</div>
    <div style={{ fontSize: 14, color: '#111827', fontWeight: 500 }}>{value || '—'}</div>
  </div>
);

export default function ApplicantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const [applicant, setApplicant] = useState(null);
  const [quotas, setQuotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = useCallback(async () => {
    const r = await getApplicant(id);
    setApplicant(r.data);
    if (r.data.program?.id) {
      const q = await getProgramQuotas(r.data.program.id);
      setQuotas(q.data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const doAction = async (fn, msg) => {
    setActionLoading(true); setError(''); setSuccess('');
    try { await fn(); await load(); setSuccess(msg); setTimeout(() => setSuccess(''), 4000); }
    catch (err) { setError(err.response?.data?.error || 'Action failed'); }
    finally { setActionLoading(false); }
  };

  if (loading) return <div className="spinner" />;
  if (!applicant) return <div className="page-body"><div className="alert alert-error">Applicant not found</div></div>;

  const canEdit = hasRole('ADMIN', 'ADMISSION_OFFICER');
  const a = applicant;
  const quotaForApplicant = quotas.find(q => q.quotaType === a.quotaType);

  const steps = [
    { label: 'Applied', done: true },
    { label: 'Seat Locked', done: ['SEAT_LOCKED', 'CONFIRMED'].includes(a.admissionStatus) },
    { label: 'Docs Verified', done: a.documentStatus === 'VERIFIED' },
    { label: 'Fee Paid', done: a.feeStatus === 'PAID' },
    { label: 'Confirmed', done: a.admissionStatus === 'CONFIRMED' },
  ];

  return (
    <>
      <div className="page-header">
        <div>
          <h1>{a.firstName} {a.lastName}</h1>
          <p style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
            {statusBadge(a.admissionStatus)} &nbsp; {a.email} &nbsp; {a.phone}
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate('/applicants')}>← Back</button>
      </div>

      <div className="page-body">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Admission Number Banner */}
        {a.admissionNumber && (
          <div style={{ background: 'linear-gradient(135deg, #1e1b4b, #3730a3)', borderRadius: 10, padding: '16px 24px', marginBottom: 20, color: 'white', display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 24 }}>🎓</span>
            <div>
              <div style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admission Number</div>
              <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{a.admissionNumber}</div>
            </div>
          </div>
        )}

        {/* Progress Steps */}
        <div className="card mb-24">
          <div className="card-header"><h3>Admission Progress</h3></div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 0 }}>
              {steps.map((s, i) => (
                <div key={s.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  {i > 0 && <div style={{ position: 'absolute', top: 14, left: '-50%', right: '50%', height: 2, background: steps[i].done ? '#4f46e5' : '#e5e7eb', zIndex: 0 }} />}
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.done ? '#4f46e5' : '#e5e7eb', color: s.done ? 'white' : '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, zIndex: 1, border: `3px solid ${s.done ? '#4f46e5' : '#e5e7eb'}` }}>
                    {s.done ? '✓' : i + 1}
                  </div>
                  <div style={{ fontSize: 11, marginTop: 6, fontWeight: 500, color: s.done ? '#4f46e5' : '#9ca3af', textAlign: 'center' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid-2">
          {/* Left: Applicant Info */}
          <div>
            <div className="card mb-24">
              <div className="card-header"><h3>Personal Details</h3></div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                  <Field label="Full Name" value={`${a.firstName} ${a.lastName}`} />
                  <Field label="Email" value={a.email} />
                  <Field label="Phone" value={a.phone} />
                  <Field label="Gender" value={a.gender} />
                  <Field label="Date of Birth" value={a.dateOfBirth} />
                  <Field label="Category" value={a.category} />
                  <Field label="State" value={a.state} />
                  <Field label="Nationality" value={a.nationality} />
                </div>
              </div>
            </div>
            <div className="card mb-24">
              <div className="card-header"><h3>Academic Details</h3></div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                  <Field label="Qualifying Exam" value={a.qualifyingExam} />
                  <Field label="Percentage" value={a.qualifyingPercentage ? `${a.qualifyingPercentage}%` : null} />
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-header"><h3>Admission Details</h3></div>
              <div className="card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                  <Field label="Program" value={a.program?.name} />
                  <Field label="Entry Type" value={a.entryType} />
                  <Field label="Quota" value={a.quotaType} />
                  <Field label="Admission Mode" value={a.admissionMode} />
                  <Field label="Allotment No." value={a.allotmentNumber} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div>
            {/* Seat Availability */}
            {quotaForApplicant && (
              <div className="card mb-24">
                <div className="card-header"><h3>Seat Availability ({a.quotaType})</h3></div>
                <div className="card-body">
                  <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: '#4f46e5' }}>{quotaForApplicant.totalSeats}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>Total</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: '#d97706' }}>{quotaForApplicant.allocatedSeats}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>Allocated</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 28, fontWeight: 700, color: quotaForApplicant.availableSeats === 0 ? '#dc2626' : '#16a34a' }}>{quotaForApplicant.availableSeats}</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>Available</div>
                    </div>
                  </div>
                  {quotaForApplicant.full && <div className="alert alert-error" style={{ marginBottom: 0 }}>⚠️ This quota is full. Seat allocation blocked.</div>}
                </div>
              </div>
            )}

            {/* Status Management */}
            {canEdit && a.admissionStatus !== 'CANCELLED' && (
              <div className="card mb-24">
                <div className="card-header"><h3>Manage Status</h3></div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* Seat Allocation */}
                  {a.admissionStatus === 'APPLIED' && (
                    <div style={{ padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Step 1: Lock Seat</div>
                      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                        disabled={actionLoading || quotaForApplicant?.full}
                        onClick={() => doAction(() => allocateSeat(a.id), 'Seat locked successfully!')}>
                        🔒 Lock Seat ({a.quotaType})
                      </button>
                      {quotaForApplicant?.full && <div style={{ fontSize: 12, color: '#dc2626', marginTop: 6 }}>Quota is full — cannot allocate.</div>}
                    </div>
                  )}

                  {/* Document Status */}
                  <div style={{ padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                      Documents: {statusBadge(a.documentStatus)}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['PENDING', 'SUBMITTED', 'VERIFIED'].map(s => (
                        <button key={s} className={`btn btn-sm ${a.documentStatus === s ? 'btn-primary' : 'btn-secondary'}`}
                          disabled={actionLoading} onClick={() => doAction(() => updateDocStatus(a.id, s), `Documents marked as ${s}`)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fee Status */}
                  <div style={{ padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
                      Fee Status: {statusBadge(a.feeStatus)}
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['PENDING', 'PAID'].map(s => (
                        <button key={s} className={`btn btn-sm ${a.feeStatus === s ? 'btn-success' : 'btn-secondary'}`}
                          disabled={actionLoading} onClick={() => doAction(() => updateFeeStatus(a.id, s), `Fee marked as ${s}`)}>
                          {s === 'PAID' ? '✓ Mark Paid' : 'Mark Pending'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Confirm Admission */}
                  {a.admissionStatus === 'SEAT_LOCKED' && (
                    <div style={{ padding: 12, background: a.feeStatus === 'PAID' ? '#f0fdf4' : '#fff7ed', borderRadius: 8, border: `1px solid ${a.feeStatus === 'PAID' ? '#86efac' : '#fed7aa'}` }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Step 2: Confirm Admission</div>
                      {a.feeStatus !== 'PAID' && (
                        <div style={{ fontSize: 12, color: '#d97706', marginBottom: 8 }}>⚠️ Fee must be paid before confirmation</div>
                      )}
                      <button className="btn btn-success" style={{ width: '100%', justifyContent: 'center' }}
                        disabled={actionLoading || a.feeStatus !== 'PAID'}
                        onClick={() => doAction(() => confirmAdmission(a.id), 'Admission confirmed! Number generated.')}>
                        🎓 Confirm & Generate Admission Number
                      </button>
                    </div>
                  )}

                  {/* Cancel */}
                  {['APPLIED', 'SEAT_LOCKED'].includes(a.admissionStatus) && (
                    <button className="btn btn-danger btn-sm" disabled={actionLoading}
                      onClick={() => { if (window.confirm('Cancel this admission?')) doAction(() => cancelAdmission(a.id), 'Admission cancelled'); }}>
                      ✕ Cancel Admission
                    </button>
                  )}
                </div>
              </div>
            )}

            {a.admissionStatus === 'CANCELLED' && (
              <div className="card"><div className="card-body"><div className="alert alert-error" style={{ marginBottom: 0 }}>This admission has been cancelled.</div></div></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
