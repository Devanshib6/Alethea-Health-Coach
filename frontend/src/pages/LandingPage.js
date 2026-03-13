import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="text-xl font-bold text-green-600">Alethea Health Coach</span>
        </div>
        <div className="flex gap-3">
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="border border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Your AI-Powered
          <span className="text-green-600"> Health Coach</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Personalized diet plans, meal tracking, health predictions and analytics
          — all powered by Machine Learning.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/signup')}
            className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-700 shadow-lg"
          >
            Get Started Free 🚀
          </button>
          <button
            onClick={() => navigate('/login')}
            className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-green-50"
          >
            Login
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Everything You Need
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🥗', title: 'Smart Diet Plans', desc: 'AI-generated personalized meal plans based on your goals' },
            { icon: '📊', title: 'Health Analytics', desc: 'Track your progress with detailed charts and insights' },
            { icon: '🤖', title: 'ML Predictions', desc: 'Predict your health outcomes with machine learning' },
            { icon: '🍽️', title: 'Meal Tracking', desc: 'Log your meals and track calories effortlessly' },
            { icon: '💪', title: 'Goal Setting', desc: 'Set and achieve your health and fitness goals' },
            { icon: '📱', title: 'Easy to Use', desc: 'Simple and intuitive interface for everyone' },
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-16 py-8 text-center text-gray-500">
        <p>🌿 Alethea Health Coach — Final Year Project © 2024</p>
      </footer>
    </div>
  );
};

export default LandingPage;