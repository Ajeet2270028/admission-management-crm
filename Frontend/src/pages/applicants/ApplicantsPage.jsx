import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApplicants } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const statusBadge = (s) => <span className={`badge badge-${s?.toLowerCase()}`}>{s?.replace('_', ' ')}</span>;

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const { hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getApplicants().then(r => { setApplicants(r.data); setFiltered(r.data); setLoading(false); });
  }, []);

  useEffect(() => {
    let list = applicants;
    if (statusFilter) list = list.filter(a => a.admissionStatus === statusFilter);
    if (search) list = list.filter(a =>
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      a.email?.toLowerCase().includes(search.toLowerCase()) ||
      a.admissionNumber?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(list);
  }, [search, statusFilter, applicants]);

  if (loading) return <div className="spinner" />;

  return (
    <>
      <div className="page-header">
        <div><h1>Applicants</h1><p>{applicants.length} total applicants</p></div>
        {hasRole('ADMIN', 'ADMISSION_OFFICER') && (
          <button className="btn btn-primary" onClick={() => navigate('/applicants/new')}>+ New Applicant</button>
        )}
      </div>
      <div className="page-body">
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <input
            placeholder="🔍 Search by name, email or admission number..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13 }}>
            <option value="">All Status</option>
            <option value="APPLIED">Applied</option>
            <option value="SEAT_LOCKED">Seat Locked</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div className="card">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Program</th>
                  <th>Quota</th>
                  <th>Category</th>
                  <th>Admission Status</th>
                  <th>Documents</th>
                  <th>Fee</th>
                  <th>Admission No.</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={9}><div className="empty-state">No applicants found</div></td></tr>
                ) : filtered.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{a.firstName} {a.lastName}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{a.email}</div>
                    </td>
                    <td style={{ fontSize: 12 }}>{a.program?.name || <span style={{ color: '#9ca3af' }}>—</span>}</td>
                    <td>{a.quotaType ? <span className="badge badge-applied">{a.quotaType}</span> : '—'}</td>
                    <td>{a.category}</td>
                    <td>{statusBadge(a.admissionStatus)}</td>
                    <td>{statusBadge(a.documentStatus)}</td>
                    <td>{statusBadge(a.feeStatus)}</td>
                    <td style={{ fontSize: 12, fontFamily: 'monospace', color: '#4f46e5' }}>
                      {a.admissionNumber || '—'}
                    </td>
                    <td>
                      <Link to={`/applicants/${a.id}`} className="btn btn-secondary btn-sm">View</Link>
                    </td>
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
