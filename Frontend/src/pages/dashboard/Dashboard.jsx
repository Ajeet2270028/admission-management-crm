// import React, { useEffect, useState } from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// import { getDashboardSummary } from '../../services/api.js';

// export default function Dashboard() {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getDashboardSummary().then(r => { setData(r.data); setLoading(false); }).catch(() => setLoading(false));
//   }, []);

//   if (loading) return <div className="spinner" />;
//   if (!data) return <div className="page-body"><div className="alert alert-error">Failed to load dashboard</div></div>;

//   const chartData = data.programStats?.flatMap(p =>
//     (p.quotaBreakdown || []).map(q => ({
//       name: `${p.programCode}-${q.quotaType}`,
//       total: q.totalSeats,
//       allocated: q.allocatedSeats,
//       available: q.availableSeats,
//     }))
//   ) || [];

//   return (
//     <>
//       <div className="page-header">
//         <div>
//           <h1>Dashboard</h1>
//           <p>Real-time admission status overview</p>
//         </div>
//       </div>
//       <div className="page-body">
//         {/* Summary Stats */}
//         <div className="stats-grid">
//           {[
//             { label: 'Total Applicants', value: data.totalApplicants, sub: 'All time', color: '#4f46e5' },
//             { label: 'Confirmed', value: data.confirmedAdmissions, sub: 'Fully admitted', color: '#16a34a' },
//             { label: 'Seat Locked', value: data.seatLockedCount, sub: 'Awaiting confirmation', color: '#d97706' },
//             { label: 'Pending Documents', value: data.pendingDocuments, sub: 'Need verification', color: '#dc2626' },
//             { label: 'Pending Fees', value: data.pendingFees, sub: 'Awaiting payment', color: '#7c3aed' },
//           ].map(s => (
//             <div className="stat-card" key={s.label}>
//               <div className="stat-label">{s.label}</div>
//               <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
//               <div className="stat-sub">{s.sub}</div>
//             </div>
//           ))}
//         </div>

//         {/* Seat Matrix per Program */}
//         <div className="grid-2" style={{ marginBottom: 24 }}>
//           <div className="card">
//             <div className="card-header"><h3>Quota-wise Seat Status</h3></div>
//             <div className="card-body" style={{ padding: '12px 8px' }}>
//               <ResponsiveContainer width="100%" height={240}>
//                 <BarChart data={chartData} margin={{ top: 0, right: 16, left: -16, bottom: 0 }}>
//                   <XAxis dataKey="name" tick={{ fontSize: 11 }} />
//                   <YAxis tick={{ fontSize: 11 }} />
//                   <Tooltip />
//                   <Bar dataKey="allocated" name="Allocated" fill="#4f46e5" radius={[4,4,0,0]} />
//                   <Bar dataKey="available" name="Available" fill="#e0e7ff" radius={[4,4,0,0]} />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>Program Intake vs Admitted</h3></div>
//             <div className="card-body">
//               {data.programStats?.map(p => (
//                 <div key={p.programId} style={{ marginBottom: 16 }}>
//                   <div className="flex-between" style={{ marginBottom: 4 }}>
//                     <span style={{ fontSize: 13, fontWeight: 500 }}>{p.programCode}</span>
//                     <span style={{ fontSize: 12, color: '#6b7280' }}>{p.admittedCount} / {p.totalIntake}</span>
//                   </div>
//                   <div style={{ background: '#e5e7eb', borderRadius: 4, height: 8 }}>
//                     <div style={{
//                       width: `${(p.admittedCount / p.totalIntake) * 100}%`,
//                       background: '#4f46e5', borderRadius: 4, height: 8, transition: 'width 0.5s'
//                     }} />
//                   </div>
//                   <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>{p.remainingSeats} seats remaining</div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Program Quota Table */}
//         <div className="card">
//           <div className="card-header"><h3>Seat Matrix Detail</h3></div>
//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Program</th>
//                   <th>Total Intake</th>
//                   <th>Quota</th>
//                   <th>Total Seats</th>
//                   <th>Allocated</th>
//                   <th>Available</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.programStats?.flatMap(p =>
//                   p.quotaBreakdown?.map((q, i) => (
//                     <tr key={`${p.programId}-${q.quotaType}`}>
//                       {i === 0 && <td rowSpan={p.quotaBreakdown.length} style={{ fontWeight: 600 }}>{p.programName}</td>}
//                       {i === 0 && <td rowSpan={p.quotaBreakdown.length}>{p.totalIntake}</td>}
//                       <td><span className="badge badge-applied">{q.quotaType}</span></td>
//                       <td>{q.totalSeats}</td>
//                       <td>{q.allocatedSeats}</td>
//                       <td style={{ fontWeight: 600, color: q.availableSeats === 0 ? '#dc2626' : '#16a34a' }}>{q.availableSeats}</td>
//                       <td>
//                         {q.availableSeats === 0
//                           ? <span className="badge badge-cancelled">Full</span>
//                           : <span className="badge badge-confirmed">Open</span>}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useEffect, useState } from 'react';
import { getDashboardSummary } from '../../services/api';

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.total), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 180, padding: '0 8px' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: 10, color: '#6b7280' }}>{d.allocated}/{d.total}</div>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: 140, gap: 2 }}>
            <div style={{ width: '100%', height: `${(d.allocated / max) * 130}px`, background: 'linear-gradient(180deg, #6366f1, #4f46e5)', borderRadius: '4px 4px 0 0', minHeight: d.allocated > 0 ? 4 : 0 }} title={`Allocated: ${d.allocated}`} />
            <div style={{ width: '100%', height: `${(d.available / max) * 130}px`, background: '#e0e7ff', borderRadius: '4px 4px 0 0', minHeight: d.available > 0 ? 4 : 0 }} title={`Available: ${d.available}`} />
          </div>
          <div style={{ fontSize: 9, color: '#374151', textAlign: 'center', lineHeight: 1.2 }}>{d.name}</div>
        </div>
      ))}
    </div>
  );
}

function Legend() {
  return (
    <div style={{ display: 'flex', gap: 16, padding: '8px 16px', fontSize: 12, color: '#6b7280' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 12, height: 12, background: '#4f46e5', borderRadius: 2, display: 'inline-block' }} /> Allocated
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ width: 12, height: 12, background: '#e0e7ff', borderRadius: 2, display: 'inline-block' }} /> Available
      </span>
    </div>
  );
}

function ProgressBar({ value, max, color = '#4f46e5' }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ background: '#e5e7eb', borderRadius: 4, height: 8, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, background: color, height: '100%', borderRadius: 4, transition: 'width 0.5s ease' }} />
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardSummary()
      .then(r => { setData(r.data); setLoading(false); })
      .catch(() => { setError('Failed to load dashboard'); setLoading(false); });
  }, []);

  if (loading) return <div className="spinner" />;
  if (error) return <div className="page-body"><div className="alert alert-error">{error}</div></div>;

  const chartData = (data.programStats || []).flatMap(p =>
    (p.quotaBreakdown || []).map(q => ({
      name: `${p.programCode}-${q.quotaType}`,
      total: q.totalSeats,
      allocated: q.allocatedSeats,
      available: q.availableSeats,
    }))
  );

  const stats = [
    { label: 'Total Applicants', value: data.totalApplicants, color: '#4f46e5', icon: '👥' },
    { label: 'Confirmed', value: data.confirmedAdmissions, color: '#16a34a', icon: '✅' },
    { label: 'Seat Locked', value: data.seatLockedCount, color: '#d97706', icon: '🔒' },
    { label: 'Pending Documents', value: data.pendingDocuments, color: '#dc2626', icon: '📄' },
    { label: 'Pending Fees', value: data.pendingFees, color: '#7c3aed', icon: '💰' },
  ];

  return (
    <>
      <div className="page-header">
        <div><h1>Dashboard</h1><p>Real-time admission status overview</p></div>
      </div>
      <div className="page-body">
        <div className="stats-grid">
          {stats.map(s => (
            <div className="stat-card" key={s.label}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card">
            <div className="card-header"><h3>Quota-wise Seat Status</h3></div>
            <BarChart data={chartData} />
            <Legend />
          </div>
          <div className="card">
            <div className="card-header"><h3>Program Intake vs Admitted</h3></div>
            <div className="card-body">
              {(data.programStats || []).map(p => (
                <div key={p.programId} style={{ marginBottom: 20 }}>
                  <div className="flex-between" style={{ marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{p.programCode} — {p.programName}</span>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>{p.admittedCount} / {p.totalIntake} admitted</span>
                  </div>
                  <ProgressBar value={p.admittedCount} max={p.totalIntake} />
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>{p.remainingSeats} seats remaining</div>
                </div>
              ))}
              {(!data.programStats || data.programStats.length === 0) && <div className="empty-state">No programs configured yet</div>}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Seat Matrix Detail</h3></div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Program</th><th>Total Intake</th><th>Quota</th><th>Total Seats</th><th>Allocated</th><th>Available</th><th>Fill %</th><th>Status</th></tr>
              </thead>
              <tbody>
                {(data.programStats || []).flatMap(p =>
                  (p.quotaBreakdown || []).map((q, i) => (
                    <tr key={`${p.programId}-${q.quotaType}`}>
                      {i === 0 && <td rowSpan={p.quotaBreakdown.length} style={{ fontWeight: 600, verticalAlign: 'top', paddingTop: 14 }}>{p.programName}</td>}
                      {i === 0 && <td rowSpan={p.quotaBreakdown.length} style={{ verticalAlign: 'top', paddingTop: 14 }}>{p.totalIntake}</td>}
                      <td><span className="badge badge-applied">{q.quotaType}</span></td>
                      <td>{q.totalSeats}</td>
                      <td>{q.allocatedSeats}</td>
                      <td style={{ fontWeight: 600, color: q.availableSeats === 0 ? '#dc2626' : '#16a34a' }}>{q.availableSeats}</td>
                      <td style={{ minWidth: 100 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ flex: 1 }}><ProgressBar value={q.allocatedSeats} max={q.totalSeats} color={q.availableSeats === 0 ? '#dc2626' : '#4f46e5'} /></div>
                          <span style={{ fontSize: 11, color: '#6b7280', whiteSpace: 'nowrap' }}>{q.totalSeats > 0 ? Math.round((q.allocatedSeats / q.totalSeats) * 100) : 0}%</span>
                        </div>
                      </td>
                      <td>{q.availableSeats === 0 ? <span className="badge badge-cancelled">Full</span> : <span className="badge badge-confirmed">Open</span>}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
