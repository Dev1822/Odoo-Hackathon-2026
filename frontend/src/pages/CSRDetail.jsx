import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api/v1/social';

const CSRDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinFormData, setJoinFormData] = useState({
    employee_id: '',
    employee_name: '',
    department: '',
    gender: 'male'
  });
  const [joinProofFile, setJoinProofFile] = useState(null);
  const [uploadingProofFor, setUploadingProofFor] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/csr/${id}`);
      const data = await res.json();
      if (data.success) setActivity(data.data);
      else throw new Error(data.message || 'Failed to fetch activity');
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchParticipations = async () => {
    try {
      const res = await fetch(`${API_BASE}/participation`);
      const data = await res.json();
      if (data.success) {
        setParticipations(data.data.filter(p => p.csr_activity_id === id));
      }
    } catch (err) {
      console.error('Error fetching participations:', err);
    } finally {
      setLoading(false);
    }
  };

  const joinActivity = async (e) => {
    e.preventDefault();
    if (!joinProofFile) {
      setError('Please upload proof of participation!');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('employee_id', joinFormData.employee_id);
      formData.append('employee_name', joinFormData.employee_name);
      formData.append('department', joinFormData.department);
      formData.append('gender', joinFormData.gender);
      formData.append('proof', joinProofFile);
      
      const res = await fetch(`${API_BASE}/csr/${id}/join`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Successfully joined the CSR activity!');
        setShowJoinForm(false);
        setJoinFormData({
          employee_id: '',
          employee_name: '',
          department: '',
          gender: 'male'
        });
        setJoinProofFile(null);
        fetchParticipations();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setError(err.message);
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

  const uploadProof = async (participationId, file) => {
    if (!file) return;
    try {
      setUploadingProofFor(participationId);
      const formData = new FormData();
      formData.append('proof', file);
      const res = await fetch(`${API_BASE}/csr/${participationId}/proof`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Proof uploaded successfully!');
        fetchParticipations();
        setTimeout(() => setMessage(null), 3000);
      }
      setProofFile(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingProofFor(null);
    }
  };

  useEffect(() => {
    fetchActivity();
    fetchParticipations();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-2xl font-semibold text-gray-300">Loading activity details...</div>
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
  if (!activity) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700">
          <p className="text-gray-400 text-xl">Activity not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          to="/csr" 
          className="text-green-500 hover:text-green-400 font-medium flex items-center gap-2 text-lg"
        >
          ← Back to CSR Activities
        </Link>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
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

      {/* Activity Details Card */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 p-10 mb-8 shadow-2xl">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{activity.title}</h1>
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              activity.status === 'open' ? 'bg-green-500/20 text-green-300' :
              activity.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
              activity.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
              'bg-gray-500/20 text-gray-300'
            }`}>
              {activity.status}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-gray-400 text-sm font-semibold mb-3">Description</h3>
            <p className="text-gray-300 text-lg leading-relaxed">{activity.description || 'No description'}</p>
          </div>
          <div className="space-y-4">
            {activity.location && (
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xl">📍</span>
                <div>
                  <span className="text-gray-400 text-sm font-medium block">Location</span>
                  <span className="text-gray-300 text-lg">{activity.location}</span>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-xl">📅</span>
              <div>
                <span className="text-gray-400 text-sm font-medium block">Date</span>
                <span className="text-gray-300 text-lg">
                  {new Date(activity.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
            {activity.time && (
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xl">⏰</span>
                <div>
                  <span className="text-gray-400 text-sm font-medium block">Time</span>
                  <span className="text-gray-300 text-lg">{activity.time}</span>
                </div>
              </div>
            )}
            {activity.max_participants && (
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-xl">👥</span>
                <div>
                  <span className="text-gray-400 text-sm font-medium block">Max Participants</span>
                  <span className="text-gray-300 text-lg">{activity.max_participants}</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-4">
          <Link 
            to={`/csr/${id}/edit`}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 rounded-xl font-semibold transition-all"
          >
            Edit Activity
          </Link>
          <button 
            onClick={() => setShowJoinForm(!showJoinForm)}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            {showJoinForm ? 'Cancel' : 'Join Activity'}
          </button>
        </div>
      </div>

      {/* Join Activity Form */}
      {showJoinForm && (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 p-10 mb-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white mb-8">Join This CSR Activity</h2>
          <form onSubmit={joinActivity} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-3">Employee ID *</label>
              <input 
                type="text"
                required
                value={joinFormData.employee_id}
                onChange={(e) => setJoinFormData({ ...joinFormData, employee_id: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-3">Employee Name *</label>
              <input 
                type="text"
                required
                value={joinFormData.employee_name}
                onChange={(e) => setJoinFormData({ ...joinFormData, employee_name: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-3">Department</label>
              <input 
                type="text"
                value={joinFormData.department}
                onChange={(e) => setJoinFormData({ ...joinFormData, department: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-3">Gender</label>
              <select 
                value={joinFormData.gender}
                onChange={(e) => setJoinFormData({ ...joinFormData, gender: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-gray-300 text-sm font-semibold mb-3">Proof of Participation *</label>
              <input 
                type="file"
                accept="image/*,.pdf"
                required
                onChange={(e) => setJoinProofFile(e.target.files[0])}
                className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              />
              {joinProofFile && (
                <p className="mt-2 text-green-300 text-sm">Selected: {joinProofFile.name}</p>
              )}
            </div>
            <div className="md:col-span-2 flex gap-4 pt-4">
              <button 
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Join Activity
              </button>
              <button 
                type="button"
                onClick={() => setShowJoinForm(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Participants Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 p-10">
        <h2 className="text-3xl font-bold text-white mb-8">
          Participants ({participations.length})
        </h2>
        {participations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-xl">No participants yet. Be the first to join!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {participations.map(p => (
              <div 
                key={p.id} 
                className="bg-gray-700/50 rounded-2xl border border-gray-600 p-6 hover:border-green-500/50 transition-all"
              >
                <h3 className="text-xl font-bold text-white mb-4">{p.employee_name}</h3>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Employee ID</span>
                    <span className="text-gray-300">{p.employee_id}</span>
                  </div>
                  {p.department && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Department</span>
                      <span className="text-gray-300">{p.department}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-600 text-white">
                      {p.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Approved</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.approved ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {p.approved ? 'Yes' : 'Pending'}
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
                
                <div className="space-y-3">
                  {uploadingProofFor === p.id ? (
                    <div className="space-y-3">
                      <input 
                        type="file" 
                        accept="image/*,.pdf"
                        onChange={(e) => setProofFile(e.target.files[0])}
                        className="w-full text-sm text-gray-300"
                      />
                      <div className="flex gap-3">
                        <button 
                          onClick={() => uploadProof(p.id, proofFile)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                        >
                          Upload
                        </button>
                        <button 
                          onClick={() => setUploadingProofFor(null)}
                          className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setUploadingProofFor(p.id)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                    >
                      Upload Proof
                    </button>
                  )}
                  
                  {!p.approved && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => approveParticipation(p.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => rejectParticipation(p.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CSRDetail;
