import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';

const DietPlanPage = () => {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    fetchDietPlan();
  }, []);

  const fetchDietPlan = async () => {
    try {
      const res = await api.get('/api/v1/diet/plan');
      setPlanData(res.data);
    } catch (error) {
      toast.error('Failed to load diet plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-5xl mb-4">🥗</div>
          <p className="text-gray-500 text-lg">Generating your personalized diet plan...</p>
          <p className="text-gray-400 text-sm mt-2">Based on your profile and goals</p>
        </div>
      </div>
    </div>
  );

  const currentDay = planData?.meal_plan?.[activeDay];

  const getMealColor = (type) => {
    const colors = {
      breakfast: 'bg-yellow-50 border-yellow-200',
      lunch: 'bg-green-50 border-green-200',
      dinner: 'bg-blue-50 border-blue-200',
      snack: 'bg-purple-50 border-purple-200'
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  const getMealIcon = (type) => {
    const icons = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍎'
    };
    return icons[type] || '🍽️';
  };

  const getMealLabelColor = (type) => {
    const colors = {
      breakfast: 'text-yellow-700',
      lunch: 'text-green-700',
      dinner: 'text-blue-700',
      snack: 'text-purple-700'
    };
    return colors[type] || 'text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            🥗 Your Personalized Diet Plan
          </h1>
          <p className="text-gray-500 mt-1">
            AI-generated 7-day meal plan based on your goals and preferences
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">BMR</p>
            <p className="text-2xl font-bold text-green-600">
              {planData?.bmr}
            </p>
            <p className="text-xs text-gray-400">kcal/day at rest</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">TDEE</p>
            <p className="text-2xl font-bold text-blue-600">
              {planData?.tdee}
            </p>
            <p className="text-xs text-gray-400">kcal/day active</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">Recommended</p>
            <p className="text-2xl font-bold text-orange-600">
              {planData?.recommended_calories}
            </p>
            <p className="text-xs text-gray-400">kcal/day</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">Your Target</p>
            <p className="text-2xl font-bold text-purple-600">
              {planData?.calorie_target}
            </p>
            <p className="text-xs text-gray-400">kcal/day</p>
          </div>
        </div>

        {/* Goal & Diet Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">🎯 Goal:</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {planData?.goal?.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">🥗 Diet:</span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {planData?.diet_type}
              </span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-gray-400">🟢 Veg</span>
              <span className="text-xs text-gray-400">🔴 Non-Veg</span>
            </div>
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {planData?.meal_plan?.map((day, idx) => (
            <button
              key={idx}
              onClick={() => setActiveDay(idx)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                activeDay === idx
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
              }`}
            >
              {day.day}
            </button>
          ))}
        </div>

        {/* Daily Meal Plan */}
        {currentDay && (
          <div>

            {/* Day Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl p-5 text-white mb-5 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">{currentDay.day}</h2>
                <p className="text-sm opacity-90 mt-1">
                  Total: <strong>{currentDay.total_calories} kcal</strong>
                  {' '} / Target: <strong>{currentDay.target_calories} kcal</strong>
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl">{currentDay.status}</span>
              </div>
            </div>

            {/* Meals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                const meal = currentDay[mealType];
                if (!meal || Object.keys(meal).length === 0) return null;
                return (
                  <div
                    key={mealType}
                    className={`rounded-xl p-5 border ${getMealColor(mealType)}`}
                  >
                    {/* Meal Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wide ${getMealLabelColor(mealType)}`}>
                          {getMealIcon(mealType)} {mealType}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs">
                            {meal.is_vegetarian ? '🟢' : '🔴'}
                          </span>
                          <p className="font-semibold text-gray-800 text-lg">
                            {meal.name}
                          </p>
                        </div>
                        {meal.cuisine_type && (
                          <p className="text-xs text-gray-400 mt-1 capitalize ml-5">
                            {meal.cuisine_type} cuisine
                          </p>
                        )}
                      </div>
                      <span className="text-orange-500 font-bold text-lg">
                        {meal.calories} kcal
                      </span>
                    </div>

                    {/* Macros */}
                    <div className="grid grid-cols-3 gap-2 mt-3">
                      <div className="text-center bg-white bg-opacity-70 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Protein</p>
                        <p className="font-semibold text-blue-600 text-sm">
                          {meal.protein}g
                        </p>
                      </div>
                      <div className="text-center bg-white bg-opacity-70 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Carbs</p>
                        <p className="font-semibold text-yellow-600 text-sm">
                          {meal.carbs}g
                        </p>
                      </div>
                      <div className="text-center bg-white bg-opacity-70 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Fat</p>
                        <p className="font-semibold text-red-600 text-sm">
                          {meal.fat}g
                        </p>
                      </div>
                    </div>

                    {/* Serving Size */}
                    {meal.serving_size && (
                      <p className="text-xs text-gray-400 mt-2">
                        📏 Serving: {meal.serving_size} {meal.serving_unit}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Daily Nutrition Summary */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">
                📊 Daily Nutrition Summary — {currentDay.day}
              </h3>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-orange-500">
                    {currentDay.total_calories}
                  </p>
                  <p className="text-xs text-gray-500">Total Calories</p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-400 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (currentDay.total_calories / currentDay.target_calories) * 100)}%`
                      }}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-500">
                    {['breakfast', 'lunch', 'dinner', 'snack']
                      .reduce((sum, m) => sum + (currentDay[m]?.protein || 0), 0)}g
                  </p>
                  <p className="text-xs text-gray-500">Total Protein</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-500">
                    {['breakfast', 'lunch', 'dinner', 'snack']
                      .reduce((sum, m) => sum + (currentDay[m]?.carbs || 0), 0)}g
                  </p>
                  <p className="text-xs text-gray-500">Total Carbs</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-500">
                    {['breakfast', 'lunch', 'dinner', 'snack']
                      .reduce((sum, m) => sum + (currentDay[m]?.fat || 0), 0)}g
                  </p>
                  <p className="text-xs text-gray-500">Total Fat</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default DietPlanPage;