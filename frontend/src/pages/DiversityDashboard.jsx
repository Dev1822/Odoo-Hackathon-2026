import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:5000/api/v1/social';

const DiversityDashboard = () => {
  const [genderData, setGenderData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [genderRes, deptRes, trendsRes] = await Promise.all([
        fetch(`${API_BASE}/diversity/gender`),
        fetch(`${API_BASE}/diversity/department`),
        fetch(`${API_BASE}/diversity/trends`),
      ]);
      const gender = await genderRes.json();
      const dept = await deptRes.json();
      const trends = await trendsRes.json();
      if (gender.success) setGenderData(gender.data);
      if (dept.success) setDepartmentData(dept.data);
      if (trends.success) setTrendsData(trends.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-2xl font-semibold text-gray-300">Loading dashboard data...</div>
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
      <h1 className="text-4xl font-bold text-white mb-12">Diversity Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gender Distribution Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            👥 Gender Distribution
          </h2>
          <div className="space-y-4">
            {genderData.length === 0 ? (
              <p className="text-gray-400 text-lg">No data available</p>
            ) : (
              genderData.map((item, index) => (
                <div 
                  key={item.gender || index} 
                  className="flex justify-between items-center p-5 bg-gray-700/50 rounded-2xl hover:bg-gray-700 transition-all"
                >
                  <span className="text-gray-300 text-lg font-medium">
                    {item.gender || 'Not specified'}
                  </span>
                  <span className="text-3xl font-bold text-green-400">
                    {item.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Department Distribution Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            🏢 Department Distribution
          </h2>
          <div className="space-y-4">
            {departmentData.length === 0 ? (
              <p className="text-gray-400 text-lg">No data available</p>
            ) : (
              departmentData.map((item, index) => (
                <div 
                  key={item.department || index} 
                  className="flex justify-between items-center p-5 bg-gray-700/50 rounded-2xl hover:bg-gray-700 transition-all"
                >
                  <span className="text-gray-300 text-lg font-medium">
                    {item.department || 'Not specified'}
                  </span>
                  <span className="text-3xl font-bold text-blue-400">
                    {item.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Participation Trends Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-gray-700 p-10 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
            📈 Participation Trends
          </h2>
          <div className="space-y-4">
            {trendsData.length === 0 ? (
              <p className="text-gray-400 text-lg">No data available</p>
            ) : (
              trendsData.map((item, index) => (
                <div 
                  key={item.date || index} 
                  className="flex justify-between items-center p-5 bg-gray-700/50 rounded-2xl hover:bg-gray-700 transition-all"
                >
                  <span className="text-gray-300 text-lg font-medium">
                    {item.date}
                  </span>
                  <span className="text-3xl font-bold text-purple-400">
                    {item.count}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiversityDashboard;
