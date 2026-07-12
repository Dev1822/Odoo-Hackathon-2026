import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api/v1/social';

const CreateCSR = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    max_participants: '',
    status: 'draft',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/csr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        navigate('/csr');
      } else {
        setError(data.message || 'Failed to create CSR activity');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          to="/csr" 
          className="text-green-500 hover:text-green-400 font-medium flex items-center gap-2 text-lg"
        >
          ← Back to CSR Activities
        </Link>
      </div>
      
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 p-10 shadow-2xl">
        <h1 className="text-4xl font-bold text-white mb-10">Create New CSR Activity</h1>
        
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-3">Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              placeholder="Enter activity title..."
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-3">Description</label>
            <textarea
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all resize-none"
              placeholder="Describe the activity..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-3">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="Where is it happening?"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-3">Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-3">Time</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-3">Max Participants</label>
              <input
                type="number"
                value={formData.max_participants}
                onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
                placeholder="100"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-3">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-gray-700/50 border border-gray-600 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all"
            >
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? 'Creating...' : 'Create Activity'}
            </button>
            <Link
              to="/csr"
              className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCSR;
