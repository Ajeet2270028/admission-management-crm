import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApplicant, getPrograms } from '../../services/api.js';

export default function NewApplicantPage() {
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    // 15 fields exactly as required
    firstName: '',          // 1
    lastName: '',           // 2
    email: '',              // 3
    phone: '',              // 4
    dateOfBirth: '',        // 5
    gender: '',             // 6
    category: 'GM',         // 7
    state: '',              // 8
    qualifyingExam: '',     // 9
    qualifyingPercentage: '',// 10
    entryType: 'REGULAR',   // 11
    quotaType: 'KCET',      // 12
    admissionMode: 'GOVERNMENT', // 13
    allotmentNumber: '',    // 14
    programId: '',          // 15
  });

  useEffect(() => { getPrograms().then(r => setPrograms(r.data)); }, []);

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await createApplicant(form);
      navigate(`/applicants/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating applicant');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div><h1>New Applicant</h1><p>Application form — 15 fields</p></div>
      </div>
      <div className="page-body">
        {error && <div className="alert alert-error">{error}</div>}
        <div className="card">
          <form onSubmit={handleSubmit}>
            {/* Personal Details */}
            <div className="card-header"><h3>Personal Details</h3></div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name * <small style={{color:'#9ca3af'}}>(1)</small></label>
                  <input value={form.firstName} onChange={set('firstName')} placeholder="First name" required />
                </div>
                <div className="form-group">
                  <label>Last Name * <small style={{color:'#9ca3af'}}>(2)</small></label>
                  <input value={form.lastName} onChange={set('lastName')} placeholder="Last name" required />
                </div>
                <div className="form-group">
                  <label>Email * <small style={{color:'#9ca3af'}}>(3)</small></label>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="email@example.com" required />
                </div>
                <div className="form-group">
                  <label>Phone * <small style={{color:'#9ca3af'}}>(4)</small></label>
                  <input value={form.phone} onChange={set('phone')} placeholder="10-digit mobile" required />
                </div>
                <div className="form-group">
                  <label>Date of Birth <small style={{color:'#9ca3af'}}>(5)</small></label>
                  <input type="date" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
                </div>
                <div className="form-group">
                  <label>Gender <small style={{color:'#9ca3af'}}>(6)</small></label>
                  <select value={form.gender} onChange={set('gender')}>
                    <option value="">Select</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category <small style={{color:'#9ca3af'}}>(7)</small></label>
                  <select value={form.category} onChange={set('category')}>
                    {['GM','SC','ST','OBC','EWS'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>State <small style={{color:'#9ca3af'}}>(8)</small></label>
                  <input value={form.state} onChange={set('state')} placeholder="e.g. Karnataka" />
                </div>
              </div>
            </div>

            {/* Academic Details */}
            <div className="card-header" style={{ borderTop: '1px solid #e5e7eb' }}><h3>Academic Details</h3></div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Qualifying Exam <small style={{color:'#9ca3af'}}>(9)</small></label>
                  <input value={form.qualifyingExam} onChange={set('qualifyingExam')} placeholder="e.g. 12th / Diploma" />
                </div>
                <div className="form-group">
                  <label>Percentage / Marks <small style={{color:'#9ca3af'}}>(10)</small></label>
                  <input type="number" min="0" max="100" step="0.01" value={form.qualifyingPercentage} onChange={set('qualifyingPercentage')} placeholder="e.g. 85.5" />
                </div>
              </div>
            </div>

            {/* Admission Details */}
            <div className="card-header" style={{ borderTop: '1px solid #e5e7eb' }}><h3>Admission Details</h3></div>
            <div className="card-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Entry Type <small style={{color:'#9ca3af'}}>(11)</small></label>
                  <select value={form.entryType} onChange={set('entryType')}>
                    <option value="REGULAR">Regular</option>
                    <option value="LATERAL">Lateral</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Quota Type <small style={{color:'#9ca3af'}}>(12)</small></label>
                  <select value={form.quotaType} onChange={e => {
                    const q = e.target.value;
                    setForm(f => ({ ...f, quotaType: q, admissionMode: q === 'MANAGEMENT' ? 'MANAGEMENT' : 'GOVERNMENT' }));
                  }}>
                    <option value="KCET">KCET</option>
                    <option value="COMEDK">COMEDK</option>
                    <option value="MANAGEMENT">Management</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Admission Mode <small style={{color:'#9ca3af'}}>(13)</small></label>
                  <select value={form.admissionMode} onChange={set('admissionMode')}>
                    <option value="GOVERNMENT">Government</option>
                    <option value="MANAGEMENT">Management</option>
                  </select>
                </div>
                {form.admissionMode === 'GOVERNMENT' && (
                  <div className="form-group">
                    <label>Allotment Number <small style={{color:'#9ca3af'}}>(14)</small></label>
                    <input value={form.allotmentNumber} onChange={set('allotmentNumber')} placeholder="KCET/COMEDK allotment no." />
                  </div>
                )}
                <div className="form-group">
                  <label>Program <small style={{color:'#9ca3af'}}>(15)</small></label>
                  <select value={form.programId} onChange={set('programId')} required>
                    <option value="">Select Program</option>
                    {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : '✓ Create Applicant'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/applicants')}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
