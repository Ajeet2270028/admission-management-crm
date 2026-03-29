import React, { useEffect, useState } from 'react';
import {
  getInstitutions, createInstitution,
  getCampuses, createCampus,
  getDepartments, createDepartment,
  getAcademicYears, createAcademicYear
} from '../../services/api.js';

function Section({ title, children }) {
  return (
    <div className="card mb-24">
      <div className="card-header"><h3>{title}</h3></div>
      <div className="card-body">{children}</div>
    </div>
  );
}

export default function MasterSetup() {
  const [institutions, setInstitutions] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Forms
  const [instForm, setInstForm] = useState({ name: '', code: '', address: '' });
  const [campusForm, setCampusForm] = useState({ name: '', location: '', institutionId: '' });
  const [deptForm, setDeptForm] = useState({ name: '', code: '', campusId: '' });
  const [ayForm, setAyForm] = useState({ year: '', current: false });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const [i, c, d, a] = await Promise.all([
      getInstitutions(), getCampuses(), getDepartments(), getAcademicYears()
    ]);
    setInstitutions(i.data); setCampuses(c.data); setDepartments(d.data); setAcademicYears(a.data);
  };

  const notify = (msg, isError = false) => {
    if (isError) setError(msg); else setSuccess(msg);
    setTimeout(() => { setError(''); setSuccess(''); }, 3000);
  };

  const handleInst = async (e) => {
    e.preventDefault();
    try { await createInstitution(instForm); setInstForm({ name: '', code: '', address: '' }); await loadAll(); notify('Institution created!'); }
    catch (err) { notify(err.response?.data?.message || 'Error creating institution', true); }
  };

  const handleCampus = async (e) => {
    e.preventDefault();
    try { await createCampus(campusForm); setCampusForm({ name: '', location: '', institutionId: '' }); await loadAll(); notify('Campus created!'); }
    catch (err) { notify('Error creating campus', true); }
  };

  const handleDept = async (e) => {
    e.preventDefault();
    try { await createDepartment(deptForm); setDeptForm({ name: '', code: '', campusId: '' }); await loadAll(); notify('Department created!'); }
    catch (err) { notify('Error creating department', true); }
  };

  const handleAY = async (e) => {
    e.preventDefault();
    try { await createAcademicYear(ayForm); setAyForm({ year: '', current: false }); await loadAll(); notify('Academic Year created!'); }
    catch (err) { notify('Error creating academic year', true); }
  };

  return (
    <>
      <div className="page-header">
        <div><h1>Master Setup</h1><p>Configure institution hierarchy and academic settings</p></div>
      </div>
      <div className="page-body">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Institutions */}
        <Section title="🏛️ Institutions">
          <form onSubmit={handleInst}>
            <div className="form-grid" style={{ marginBottom: 12 }}>
              <div className="form-group">
                <label>Institution Name *</label>
                <input value={instForm.name} onChange={e => setInstForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. EIT Bangalore" required />
              </div>
              <div className="form-group">
                <label>Code *</label>
                <input value={instForm.code} onChange={e => setInstForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. EIT" required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input value={instForm.address} onChange={e => setInstForm(f => ({ ...f, address: e.target.value }))} placeholder="City, State" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">+ Add Institution</button>
          </form>
          {institutions.length > 0 && (
            <div className="table-wrapper" style={{ marginTop: 16 }}>
              <table>
                <thead><tr><th>Name</th><th>Code</th><th>Address</th></tr></thead>
                <tbody>{institutions.map(i => <tr key={i.id}><td>{i.name}</td><td>{i.code}</td><td>{i.address}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </Section>

        {/* Campuses */}
        <Section title="🏢 Campuses">
          <form onSubmit={handleCampus}>
            <div className="form-grid" style={{ marginBottom: 12 }}>
              <div className="form-group">
                <label>Institution *</label>
                <select value={campusForm.institutionId} onChange={e => setCampusForm(f => ({ ...f, institutionId: e.target.value }))} required>
                  <option value="">Select Institution</option>
                  {institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Campus Name *</label>
                <input value={campusForm.name} onChange={e => setCampusForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Main Campus" required />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input value={campusForm.location} onChange={e => setCampusForm(f => ({ ...f, location: e.target.value }))} placeholder="City" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">+ Add Campus</button>
          </form>
          {campuses.length > 0 && (
            <div className="table-wrapper" style={{ marginTop: 16 }}>
              <table>
                <thead><tr><th>Name</th><th>Location</th><th>Institution</th></tr></thead>
                <tbody>{campuses.map(c => <tr key={c.id}><td>{c.name}</td><td>{c.location}</td><td>{c.institution?.name}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </Section>

        {/* Departments */}
        <Section title="📂 Departments">
          <form onSubmit={handleDept}>
            <div className="form-grid" style={{ marginBottom: 12 }}>
              <div className="form-group">
                <label>Campus *</label>
                <select value={deptForm.campusId} onChange={e => setDeptForm(f => ({ ...f, campusId: e.target.value }))} required>
                  <option value="">Select Campus</option>
                  {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Department Name *</label>
                <input value={deptForm.name} onChange={e => setDeptForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Computer Science" required />
              </div>
              <div className="form-group">
                <label>Code</label>
                <input value={deptForm.code} onChange={e => setDeptForm(f => ({ ...f, code: e.target.value }))} placeholder="e.g. CSE" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">+ Add Department</button>
          </form>
          {departments.length > 0 && (
            <div className="table-wrapper" style={{ marginTop: 16 }}>
              <table>
                <thead><tr><th>Name</th><th>Code</th><th>Campus</th></tr></thead>
                <tbody>{departments.map(d => <tr key={d.id}><td>{d.name}</td><td>{d.code}</td><td>{d.campus?.name}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </Section>

        {/* Academic Years */}
        <Section title="📅 Academic Years">
          <form onSubmit={handleAY}>
            <div className="form-grid" style={{ marginBottom: 12 }}>
              <div className="form-group">
                <label>Year *</label>
                <input value={ayForm.year} onChange={e => setAyForm(f => ({ ...f, year: e.target.value }))} placeholder="e.g. 2025-26" required />
              </div>
              <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="checkbox" checked={ayForm.current} onChange={e => setAyForm(f => ({ ...f, current: e.target.checked }))} />
                  Set as current year
                </label>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">+ Add Academic Year</button>
          </form>
          {academicYears.length > 0 && (
            <div className="table-wrapper" style={{ marginTop: 16 }}>
              <table>
                <thead><tr><th>Year</th><th>Status</th></tr></thead>
                <tbody>{academicYears.map(a => <tr key={a.id}><td>{a.year}</td><td>{a.current ? <span className="badge badge-confirmed">Current</span> : '-'}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </Section>
      </div>
    </>
  );
}
