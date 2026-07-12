import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api/v1/social';

const CSRList = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE}/csr`);
      const data = await res.json();
      if (data.success) setActivities(data.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch activities');
      console.error('Error fetching CSR activities:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this CSR activity?')) return;
    try {
      const res = await fetch(`${API_BASE}/csr/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessage('CSR Activity deleted successfully!');
        fetchActivities();
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-2xl font-semibold text-gray-300">Loading activities...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">CSR Activities</h1>
        <Link 
          to="/csr/create" 
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
        >
          + Create New Activity
        </Link>
      </div>
      
      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
          {message}
        </div>
      )}

      {activities.length === 0 ? (
        <div className="text-center py-16 bg-gray-800 rounded-2xl border border-gray-700">
          <p className="text-gray-400 text-xl">No CSR activities yet. Create one to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 hover:border-green-500/50 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white line-clamp-2">{activity.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  activity.status === 'open' ? 'bg-green-500/20 text-green-300' :
                  activity.status === 'completed' ? 'bg-blue-500/20 text-blue-300' :
                  activity.status === 'cancelled' ? 'bg-red-500/20 text-red-300' :
                  'bg-gray-500/20 text-gray-300'
                }`}>
                  {activity.status}
                </span>
              </div>
              
              {activity.description && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-3">{activity.description}</p>
              )}
              
              <div className="space-y-2 text-sm mb-6">
                {activity.location && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-gray-500">📍</span>
                    {activity.location}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-300">
                  <span className="text-gray-500">📅</span>
                  {new Date(activity.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                {activity.time && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-gray-500">⏰</span>
                    {activity.time}
                  </div>
                )}
                {activity.max_participants && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-gray-500">👥</span>
                    Max {activity.max_participants} participants
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Link 
                  to={`/csr/${activity.id}`}
                  className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  View
                </Link>
                <Link 
                  to={`/csr/${activity.id}/edit`}
                  className="flex-1 text-center bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Edit
                </Link>
                <button 
                  onClick={() => deleteActivity(activity.id)}
                  className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CSRList;
