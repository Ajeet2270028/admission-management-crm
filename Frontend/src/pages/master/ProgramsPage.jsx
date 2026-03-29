import React, { useEffect, useState } from 'react';
import { getPrograms, createProgram, getDepartments, getAcademicYears } from '../../services/api.js';

// const QUOTA_TYPES = ['KCET', 'COMEDK', 'MANAGEMENT'];
const COURSE_TYPES = ['UG', 'PG'];
const ENTRY_TYPES = ['REGULAR', 'LATERAL'];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '', code: '', courseType: 'UG', entryType: 'REGULAR',
    totalIntake: '', supernumerarySeats: 0, departmentId: '', academicYearId: '',
    quotas: [
      { quotaType: 'KCET', seats: '' },
      { quotaType: 'COMEDK', seats: '' },
      { quotaType: 'MANAGEMENT', seats: '' },
    ]
  });

  useEffect(() => {
    getPrograms().then(r => setPrograms(r.data));
    getDepartments().then(r => setDepartments(r.data));
    getAcademicYears().then(r => setAcademicYears(r.data));
  }, []);

  const quotaSum = form.quotas.reduce((s, q) => s + (parseInt(q.seats) || 0), 0);
  const intake = parseInt(form.totalIntake) || 0;
  const quotaValid = intake > 0 && quotaSum === intake;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quotaValid) { setError(`Quota sum (${quotaSum}) must equal total intake (${intake})`); return; }
    try {
      await createProgram({ ...form, totalIntake: intake, quotas: form.quotas.map(q => ({ ...q, seats: parseInt(q.seats) || 0 })) });
      const r = await getPrograms(); setPrograms(r.data);
      setShowForm(false);
      setSuccess('Program created successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error creating program');
    }
  };

  const updateQuota = (idx, val) => {
    setForm(f => {
      const quotas = [...f.quotas];
      quotas[idx] = { ...quotas[idx], seats: val };
      return { ...f, quotas };
    });
  };

  return (
    <>
      <div className="page-header">
        <div><h1>Programs & Seat Matrix</h1><p>Configure programs with quota allocations</p></div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Program'}
        </button>
      </div>
      <div className="page-body">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {showForm && (
          <div className="card mb-24">
            <div className="card-header"><h3>Create New Program</h3></div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-grid" style={{ marginBottom: 16 }}>
                  <div className="form-group">
                    <label>Program Name *</label>
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. B.E. Computer Science" required />
                  </div>
                  <div className="form-group">
                    <label>Code *</label>
                    <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. CSE" required />
                  </div>
                  <div className="form-group">
                    <label>Course Type</label>
                    <select value={form.courseType} onChange={e => setForm(f => ({ ...f, courseType: e.target.value }))}>
                      {COURSE_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Entry Type</label>
                    <select value={form.entryType} onChange={e => setForm(f => ({ ...f, entryType: e.target.value }))}>
                      {ENTRY_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Department *</label>
                    <select value={form.departmentId} onChange={e => setForm(f => ({ ...f, departmentId: e.target.value }))} required>
                      <option value="">Select Department</option>
                      {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Academic Year *</label>
                    <select value={form.academicYearId} onChange={e => setForm(f => ({ ...f, academicYearId: e.target.value }))} required>
                      <option value="">Select Year</option>
                      {academicYears.map(a => <option key={a.id} value={a.id}>{a.year}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Total Intake *</label>
                    <input type="number" min="1" value={form.totalIntake} onChange={e => setForm(f => ({ ...f, totalIntake: e.target.value }))} placeholder="e.g. 60" required />
                  </div>
                  <div className="form-group">
                    <label>Supernumerary Seats</label>
                    <input type="number" min="0" value={form.supernumerarySeats} onChange={e => setForm(f => ({ ...f, supernumerarySeats: e.target.value }))} />
                  </div>
                </div>

                <div style={{ background: '#f9fafb', borderRadius: 8, padding: 16, marginBottom: 16 }}>
                  <h4 style={{ marginBottom: 12, fontSize: 13, fontWeight: 600 }}>Quota Allocation
                    <span style={{ fontWeight: 400, color: quotaValid ? '#16a34a' : '#dc2626', marginLeft: 12, fontSize: 12 }}>
                      Sum: {quotaSum} / {intake || '?'} {intake > 0 && (quotaValid ? '✓ Valid' : '✗ Must equal intake')}
                    </span>
                  </h4>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {form.quotas.map((q, i) => (
                      <div className="form-group" key={q.quotaType} style={{ flex: 1 }}>
                        <label>{q.quotaType} Seats</label>
                        <input type="number" min="0" value={q.seats} onChange={e => updateQuota(i, e.target.value)} placeholder="0" />
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={!quotaValid}>Create Program</button>
              </form>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header"><h3>All Programs ({programs.length})</h3></div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Program</th><th>Code</th><th>Type</th><th>Department</th><th>Intake</th><th>Quota Split</th></tr>
              </thead>
              <tbody>
                {programs.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: '#6b7280' }}>No programs configured yet</td></tr>
                ) : programs.map(p => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td>{p.code}</td>
                    <td><span className="badge badge-applied">{p.courseType}</span> <span className="badge badge-submitted">{p.entryType}</span></td>
                    <td>{p.department?.name}</td>
                    <td>{p.totalIntake}</td>
                    <td style={{ fontSize: 12, color: '#6b7280' }}>KCET / COMEDK / MGMT</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
