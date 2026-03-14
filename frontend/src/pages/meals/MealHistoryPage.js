import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';

const MealHistoryPage = () => {
  const navigate = useNavigate();
  const [todayMeals, setTodayMeals] = useState([]);
  const [historyMeals, setHistoryMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        api.get('/api/v1/meals/today'),
        api.get('/api/v1/meals/history')
      ]);
      setTodayMeals(todayRes.data);
      setHistoryMeals(historyRes.data);
    } catch (error) {
      toast.error('Failed to load meals');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (mealId) => {
    try {
      await api.delete(`/api/v1/meals/${mealId}`);
      toast.success('Meal deleted!');
      fetchMeals();
    } catch (error) {
      toast.error('Failed to delete meal');
    }
  };

  const getMealIcon = (mealType) => {
    const icons = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍎'
    };
    return icons[mealType] || '🍽️';
  };

  const getTotalCalories = (meals) =>
    meals.reduce((sum, meal) => sum + (meal.total_calories || 0), 0);
  const getTotalProtein = (meals) =>
    meals.reduce((sum, meal) => sum + (meal.total_protein || 0), 0);
  const getTotalCarbs = (meals) =>
    meals.reduce((sum, meal) => sum + (meal.total_carbs || 0), 0);
  const getTotalFat = (meals) =>
    meals.reduce((sum, meal) => sum + (meal.total_fat || 0), 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-500">Loading meals...</p>
      </div>
    </div>
  );

  const displayMeals = activeTab === 'today' ? todayMeals : historyMeals;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* ✅ New Navbar */}
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">🍛 Meal History</h1>
            <p className="text-gray-500 mt-1">Track your daily nutrition</p>
          </div>
          <button
            onClick={() => navigate('/meals/add')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Add Meal
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'today'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'history'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Last 30 Days
          </button>
        </div>

        {/* Today's Summary */}
        {activeTab === 'today' && (
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <p className="text-xs text-gray-500">Calories</p>
              <p className="text-xl font-bold text-orange-500">
                {getTotalCalories(todayMeals)}
              </p>
              <p className="text-xs text-gray-400">kcal</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <p className="text-xs text-gray-500">Protein</p>
              <p className="text-xl font-bold text-blue-500">
                {getTotalProtein(todayMeals)}g
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <p className="text-xs text-gray-500">Carbs</p>
              <p className="text-xl font-bold text-yellow-500">
                {getTotalCarbs(todayMeals)}g
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm text-center">
              <p className="text-xs text-gray-500">Fat</p>
              <p className="text-xl font-bold text-red-500">
                {getTotalFat(todayMeals)}g
              </p>
            </div>
          </div>
        )}

        {/* Meals List */}
        {displayMeals.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <span className="text-5xl">🍽️</span>
            <p className="text-gray-500 mt-4 text-lg">No meals logged yet</p>
            <button
              onClick={() => navigate('/meals/add')}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
            >
              Log Your First Meal
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayMeals.map((meal) => (
              <div
                key={meal.id}
                className="bg-white rounded-xl p-5 shadow-sm flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">
                    {getMealIcon(meal.meal_type)}
                  </span>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {meal.meal_name}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {meal.meal_type} •{' '}
                      {new Date(meal.meal_date || meal.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    {meal.notes && (
                      <p className="text-xs text-gray-400 mt-1">{meal.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden md:block">
                    <div className="flex gap-3 text-sm">
                      <span className="text-orange-500 font-medium">
                        {meal.total_calories} kcal
                      </span>
                      <span className="text-blue-500">P: {meal.total_protein}g</span>
                      <span className="text-yellow-500">C: {meal.total_carbs}g</span>
                      <span className="text-red-500">F: {meal.total_fat}g</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(meal.id)}
                    className="text-red-400 hover:text-red-600 transition p-2"
                    title="Delete meal"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MealHistoryPage;