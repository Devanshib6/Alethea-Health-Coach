import React from 'react';
import Navbar from '../../components/Navbar';

const HealthAnalysisPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <span className="text-6xl">💪</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-4">Health Analysis</h1>
          <p className="text-gray-500 mt-2">Coming in Phase 17! 🚀</p>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalysisPage;