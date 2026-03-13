import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

const GoalsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    primary_goal: '',
    target_weight: '',
    daily_calorie_target: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/v1/profile/goals', {
        primary_goal: formData.primary_goal,
        target_weight: parseFloat(formData.target_weight),
        daily_calorie_target: parseInt(formData.daily_calorie_target)
      });
      toast.success('Goals saved!');
      navigate('/profile/preferences');
    } catch (error) {
      toast.error('Failed to save goals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <Toaster position="top-right" />
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step 2 of 3</span>
            <span>Health Goals</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-2/3"></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-4xl">🎯</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Your Health Goals</h1>
          <p className="text-gray-500 mt-1">What do you want to achieve?</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Goal</label>
            <select
              name="primary_goal"
              value={formData.primary_goal}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select your goal</option>
              <option value="lose_weight">Lose Weight (motaai kam garne)</option>
              <option value="gain_weight">Gain Weight (taakatwar banne)</option>
              <option value="maintain_weight">Maintain Weight</option>
              <option value="build_muscle">Build Muscle (muscle banaaune)</option>
              <option value="control_diabetes">Control Diabetes (madhumeha niyantran)</option>
              <option value="control_bp">Control Blood Pressure</option>
              <option value="improve_digestion">Improve Digestion (pachan sudhaarne)</option>
              <option value="improve_health">Improve Overall Health</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Weight (kg)</label>
            <input
              type="number"
              name="target_weight"
              value={formData.target_weight}
              onChange={handleChange}
              required
              placeholder="60"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Daily Calorie Target</label>
            <select
              name="daily_calorie_target"
              value={formData.daily_calorie_target}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select calorie target</option>
              <option value="1200">1200 kcal — Very Low (strict diet)</option>
              <option value="1500">1500 kcal — Low (weight loss)</option>
              <option value="1800">1800 kcal — Moderate (average person)</option>
              <option value="2000">2000 kcal — Standard (active person)</option>
              <option value="2500">2500 kcal — High (heavy work/sports)</option>
              <option value="3000">3000 kcal — Very High (athlete)</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/profile/basic-info')}
              className="w-1/3 border border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? 'Saving...' : 'Next →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalsPage;