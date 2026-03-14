import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/api/v1/dashboard/summary');
      setData(res.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    </div>
  );

  const bmiColor = () => {
    if (!data?.bmi_category) return 'text-gray-600';
    if (data.bmi_category === 'Normal') return 'text-green-600';
    if (data.bmi_category === 'Underweight') return 'text-blue-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* ✅ New Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-6 text-white mb-8">
          <h1 className="text-2xl font-bold">
            Welcome back, {data?.user?.username}! 🎉
          </h1>
          <p className="mt-1 opacity-90">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric',
              month: 'long', day: 'numeric'
            })}
          </p>
          {data?.goals?.primary_goal && (
            <p className="mt-2 opacity-80 text-sm">
              🎯 Goal: {data.goals.primary_goal.replace(/_/g, ' ').toUpperCase()}
            </p>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">BMI</p>
            <p className={`text-3xl font-bold ${bmiColor()}`}>
              {data?.bmi || '—'}
            </p>
            <p className={`text-sm mt-1 ${bmiColor()}`}>
              {data?.bmi_category || 'Not calculated'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Current Weight</p>
            <p className="text-3xl font-bold text-gray-800">
              {data?.profile?.weight || '—'}
            </p>
            <p className="text-sm text-gray-500 mt-1">kg</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Target Weight</p>
            <p className="text-3xl font-bold text-blue-600">
              {data?.goals?.target_weight || '—'}
            </p>
            <p className="text-sm text-gray-500 mt-1">kg</p>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Calories Today</p>
            <p className="text-3xl font-bold text-orange-500">
              {data?.total_calories_today || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              / {data?.goals?.daily_calorie_target || '—'} kcal
            </p>
          </div>
        </div>

        {/* Goal Progress + Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              🎯 Goal Progress
            </h2>
            {data?.goal_progress !== null ? (
              <>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{data?.goals?.primary_goal?.replace(/_/g, ' ')}</span>
                  <span>{data?.goal_progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all"
                    style={{ width: `${data?.goal_progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Current: {data?.profile?.weight} kg</span>
                  <span>Target: {data?.goals?.target_weight} kg</span>
                </div>
              </>
            ) : (
              <p className="text-gray-400">No goals set yet</p>
            )}

            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Daily Calories</span>
                <span>{data?.total_calories_today} / {data?.goals?.daily_calorie_target} kcal</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-orange-400 h-4 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, ((data?.total_calories_today || 0) / (data?.goals?.daily_calorie_target || 2000)) * 100)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              👤 Profile Summary
            </h2>
            {data?.profile ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Age</span>
                  <span className="font-medium">{data.profile.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Gender</span>
                  <span className="font-medium capitalize">{data.profile.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Height</span>
                  <span className="font-medium">{data.profile.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Weight</span>
                  <span className="font-medium">{data.profile.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Activity</span>
                  <span className="font-medium capitalize">
                    {data.profile.activity_level?.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 mb-3">Profile not complete</p>
                <button
                  onClick={() => navigate('/profile/basic-info')}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Complete Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            ⚡ Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/meals/add')}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition"
            >
              <span className="text-2xl">🍽️</span>
              <span className="text-sm font-medium text-green-700">Log Meal</span>
            </button>
            <button
              onClick={() => navigate('/diet-plan')}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition"
            >
              <span className="text-2xl">📋</span>
              <span className="text-sm font-medium text-blue-700">Diet Plan</span>
            </button>
            <button
              onClick={() => navigate('/health-analysis')}
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition"
            >
              <span className="text-2xl">📊</span>
              <span className="text-sm font-medium text-purple-700">Health Analysis</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition"
            >
              <span className="text-2xl">⚙️</span>
              <span className="text-sm font-medium text-orange-700">Settings</span>
            </button>
          </div>
        </div>

        {/* Today's Meals */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              🍛 Today's Meals
            </h2>
            <button
              onClick={() => navigate('/meals/add')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
            >
              + Add Meal
            </button>
          </div>
          {data?.meals_today > 0 ? (
            <div>
              <p className="text-gray-600">{data.meals_today} meals logged today</p>
              <button
                onClick={() => navigate('/meals/history')}
                className="mt-3 text-green-600 text-sm hover:underline"
              >
                View all meals →
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-4xl">🍽️</span>
              <p className="text-gray-400 mt-2">No meals logged today</p>
              <button
                onClick={() => navigate('/meals/add')}
                className="mt-3 bg-green-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-700 transition"
              >
                Log Your First Meal
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;