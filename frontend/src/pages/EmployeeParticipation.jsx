import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api/v1/social';

const EmployeeParticipation = () => {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchParticipations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/participation`);
      const data = await res.json();
      if (data.success) setParticipations(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const approveParticipation = async (participationId) => {
    try {
      const res = await fetch(`${API_BASE}/participation/${participationId}/approve`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Participation approved successfully!');
        fetchParticipations();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const rejectParticipation = async (participationId) => {
    try {
      const res = await fetch(`${API_BASE}/participation/${participationId}/reject`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Participation rejected successfully!');
        fetchParticipations();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchParticipations();
  }, []);

  const pendingParticipations = participations.filter(p => !p.approved);
  const approvedParticipations = participations.filter(p => p.approved);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-2xl font-semibold text-gray-300">Loading participations...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Employee Participation</h1>

      {message && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
          {message}
        </div>
      )}

      {/* Proof Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4" onClick={() => setPreviewUrl(null)}>
          <div className="bg-gray-800 rounded-3xl p-4 max-w-4xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">Proof Preview</h3>
              <button onClick={() => setPreviewUrl(null)} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
            </div>
            {previewUrl.endsWith('.pdf') ? (
              <iframe src={`http://localhost:5000${previewUrl}`} className="w-full h-[70vh] rounded-xl" title="Proof Preview" />
            ) : (
              <img src={`http://localhost:5000${previewUrl}`} alt="Proof" className="w-full rounded-xl" />
            )}
          </div>
        </div>
      )}

      {/* Approval Queue Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 p-10 mb-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          ⏳ Approval Queue ({pendingParticipations.length})
        </h2>
        {pendingParticipations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No pending approvals. Great job!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="pb-4 text-gray-400 font-semibold text-lg">Employee</th>
                  <th className="pb-4 text-gray-400 font-semibold text-lg">Activity ID</th>
                  <th className="pb-4 text-gray-400 font-semibold text-lg">Proof</th>
                  <th className="pb-4 text-gray-400 font-semibold text-lg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingParticipations.map(p => (
                  <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700/30 transition-all">
                    <td className="py-6">
                      <div className="font-semibold text-xl text-white">{p.employee_name}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {p.employee_id} • {p.department || 'No department'}
                      </div>
                    </td>
                    <td className="py-6 text-gray-300">{p.csr_activity_id}</td>
                    <td className="py-6">
                      {p.proof_url ? (
                        <>
                          <button 
                            onClick={() => setPreviewUrl(p.proof_url)}
                            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2"
                          >
                            👁️ View Proof
                          </button>
                          {!p.proof_url.endsWith('.pdf') && (
                            <img 
                              src={`http://localhost:5000${p.proof_url}`} 
                              alt="Proof thumbnail" 
                              className="mt-2 w-24 h-24 object-cover rounded-lg border border-gray-600" 
                            />
                          )}
                        </>
                      ) : (
                        <span className="text-gray-500">No proof uploaded</span>
                      )}
                    </td>
                    <td className="py-6">
                      <div className="flex gap-4">
                        <button 
                          onClick={() => approveParticipation(p.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => rejectParticipation(p.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approved Participations Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 p-10 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          ✅ Approved Participations ({approvedParticipations.length})
        </h2>
        {approvedParticipations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No approved participations yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedParticipations.map(p => (
              <div 
                key={p.id} 
                className="bg-gray-700/50 rounded-2xl border border-gray-600 p-8 hover:border-green-500/50 transition-all"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{p.employee_name}</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm font-medium">Employee ID</span>
                    <span className="text-gray-300">{p.employee_id}</span>
                  </div>
                  {p.department && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm font-medium">Department</span>
                      <span className="text-gray-300">{p.department}</span>
                    </div>
                  )}
                  {p.gender && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm font-medium">Gender</span>
                      <span className="text-gray-300">{p.gender}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm font-medium">Status</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
                      {p.status}
                    </span>
                  </div>
                  {p.proof_url && (
                    <div className="pt-2">
                      <button 
                        onClick={() => setPreviewUrl(p.proof_url)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-2"
                      >
                        👁️ View Proof
                      </button>
                      {!p.proof_url.endsWith('.pdf') && (
                        <img 
                          src={`http://localhost:5000${p.proof_url}`} 
                          alt="Proof thumbnail" 
                          className="mt-2 w-24 h-24 object-cover rounded-lg border border-gray-600" 
                        />
                      )}
                    </div>
                  )}
                </div>
                {p.csr_activity_id && (
                  <Link 
                    to={`/csr/${p.csr_activity_id}`}
                    className="text-green-500 hover:text-green-400 font-medium flex items-center gap-2"
                  >
                    View Activity →
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeParticipation;
