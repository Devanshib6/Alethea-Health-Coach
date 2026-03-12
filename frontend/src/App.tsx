import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          🌿 Alethea Health Coach
        </h1>
        <p className="text-gray-600 text-lg mb-2">
          AI-Powered Health & Nutrition App
        </p>
        <p className="text-gray-400 text-sm">
          Frontend is running successfully ✅
        </p>
        <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-sm">API Connected to:</p>
          <p className="text-green-500 font-mono text-sm">
            {process.env.REACT_APP_API_URL}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;