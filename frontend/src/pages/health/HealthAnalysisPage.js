import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

const HealthAnalysisPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthAnalysis();
  }, []);

  const fetchHealthAnalysis = async () => {
    try {
      const res = await api.get('/api/v1/health/analysis');
      setData(res.data);
    } catch (error) {
      toast.error('Failed to load health analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-5xl mb-4">💪</div>
          <p className="text-gray-500 text-lg">Analyzing your health data...</p>
        </div>
      </div>
    </div>
  );

  if (data?.error) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <p className="text-gray-700 text-lg font-semibold">{data.message}</p>
          <button
            onClick={() => navigate('/profile/basic-info')}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Complete Profile
          </button>
        </div>
      </div>
    </div>
  );

  const getBmiColor = (category) => {
    const colors = {
      'Underweight': 'text-blue-600',
      'Normal': 'text-green-600',
      'Overweight': 'text-yellow-600',
      'Obese': 'text-red-600'
    };
    return colors[category] || 'text-gray-600';
  };

  const getBmiBgColor = (category) => {
    const colors = {
      'Underweight': 'bg-blue-50 border-blue-200',
      'Normal': 'bg-green-50 border-green-200',
      'Overweight': 'bg-yellow-50 border-yellow-200',
      'Obese': 'bg-red-50 border-red-200'
    };
    return colors[category] || 'bg-gray-50';
  };

  const getBmiBarWidth = (bmi) => {
    const maxBmi = 40;
    return Math.min(100, (bmi / maxBmi) * 100);
  };


  const caloriePercent = Math.min(100,
    (data.today_calories / data.calorie_target) * 100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">💪 Health Analysis</h1>
          <p className="text-gray-500 mt-1">
            Your personalized health insights and recommendations
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">Weight</p>
            <p className="text-2xl font-bold text-gray-800">
              {data.profile.weight}
            </p>
            <p className="text-xs text-gray-400">kg</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">Height</p>
            <p className="text-2xl font-bold text-gray-800">
              {data.profile.height}
            </p>
            <p className="text-xs text-gray-400">cm</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">Age</p>
            <p className="text-2xl font-bold text-gray-800">
              {data.profile.age}
            </p>
            <p className="text-xs text-gray-400">years</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-xs text-gray-500 mb-1">Activity</p>
            <p className="text-sm font-bold text-gray-800 capitalize">
              {data.profile.activity_level?.replace(/_/g, ' ')}
            </p>
          </div>
        </div>

        {/* BMI Card */}
        <div className={`rounded-xl p-6 border mb-6 ${getBmiBgColor(data.bmi_category)}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                📊 Body Mass Index (BMI)
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Based on your height and weight
              </p>
            </div>
            <div className="text-right">
              <p className={`text-4xl font-bold ${getBmiColor(data.bmi_category)}`}>
                {data.bmi}
              </p>
              <p className={`text-sm font-semibold ${getBmiColor(data.bmi_category)}`}>
                {data.bmi_category}
              </p>
            </div>
          </div>

          {/* BMI Scale */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Underweight</span>
              <span>Normal</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 relative">
              <div className="absolute top-0 left-0 h-3 rounded-l-full bg-blue-400"
                style={{ width: '25%' }} />
              <div className="absolute top-0 h-3 bg-green-400"
                style={{ left: '25%', width: '25%' }} />
              <div className="absolute top-0 h-3 bg-yellow-400"
                style={{ left: '50%', width: '25%' }} />
              <div className="absolute top-0 h-3 rounded-r-full bg-red-400"
                style={{ left: '75%', width: '25%' }} />
              {/* BMI Indicator */}
              <div
                className="absolute top-0 h-3 w-1 bg-gray-800 rounded"
                style={{ left: `${getBmiBarWidth(data.bmi)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{'<'}18.5</span>
              <span>18.5-24.9</span>
              <span>25-29.9</span>
              <span>30+</span>
            </div>
          </div>

          {/* Ideal Weight */}
          <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg">
            <p className="text-sm text-gray-600">
              🎯 Ideal weight range for your height:
              <span className="font-semibold text-green-700 ml-1">
                {data.ideal_weight_min} — {data.ideal_weight_max} kg
              </span>
            </p>
          </div>
        </div>

        {/* Calorie & Metabolic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Metabolic Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              ⚡ Metabolic Information
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">BMR</p>
                  <p className="text-xs text-gray-400">
                    Calories burned at complete rest
                  </p>
                </div>
                <p className="text-xl font-bold text-green-600">
                  {data.bmr} kcal
                </p>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">TDEE</p>
                  <p className="text-xs text-gray-400">
                    Total daily energy expenditure
                  </p>
                </div>
                <p className="text-xl font-bold text-blue-600">
                  {data.tdee} kcal
                </p>
              </div>
              <hr />
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-700">Daily Target</p>
                  <p className="text-xs text-gray-400">
                    Based on your goal
                  </p>
                </div>
                <p className="text-xl font-bold text-purple-600">
                  {data.calorie_target} kcal
                </p>
              </div>
            </div>
          </div>

          {/* Today's Progress */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              🍛 Today's Calorie Progress
            </h2>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-orange-500">
                {data.today_calories}
              </p>
              <p className="text-gray-500 text-sm">
                of {data.calorie_target} kcal target
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
              <div
                className={`h-4 rounded-full transition-all ${
                  caloriePercent > 100 ? 'bg-red-500' : 'bg-orange-400'
                }`}
                style={{ width: `${caloriePercent}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Consumed</span>
              <span className={
                data.calorie_remaining >= 0
                  ? 'text-green-600 font-medium'
                  : 'text-red-600 font-medium'
              }>
                {data.calorie_remaining >= 0
                  ? `${data.calorie_remaining} kcal remaining`
                  : `${Math.abs(data.calorie_remaining)} kcal over target`
                }
              </span>
            </div>

            {/* Goal Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Goal</span>
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {data.goal?.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-500">Target Weight</span>
                <span className="text-sm font-medium text-gray-700">
                  {data.target_weight} kg
                  {data.weight_to_goal !== 0 && (
                    <span className={`ml-1 text-xs ${
                      data.weight_to_goal > 0 ? 'text-blue-500' : 'text-red-500'
                    }`}>
                      ({data.weight_to_goal > 0 ? '+' : ''}{data.weight_to_goal} kg to go)
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Calorie Chart */}
        {data.weekly_calories && data.weekly_calories.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              📈 Last 7 Days — Calorie Intake
            </h2>
            <div className="flex items-end gap-3 h-32">
              {data.weekly_calories.map((day, idx) => {
                const maxCal = Math.max(
                  ...data.weekly_calories.map(d => d.calories),
                  data.calorie_target
                );
                const barHeight = (day.calories / maxCal) * 100;
                const isOverTarget = day.calories > data.calorie_target;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <p className="text-xs text-gray-500">
                      {Math.round(day.calories)}
                    </p>
                    <div className="w-full bg-gray-100 rounded-t-lg relative"
                      style={{ height: '100px' }}>
                      <div
                        className={`absolute bottom-0 w-full rounded-t-lg transition-all ${
                          isOverTarget ? 'bg-red-400' : 'bg-green-400'
                        }`}
                        style={{ height: `${barHeight}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(day.date).toLocaleDateString('en-US', {
                        weekday: 'short'
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-400 rounded"></span>
                Under target
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-red-400 rounded"></span>
                Over target
              </span>
              <span className="ml-auto">
                Target: {data.calorie_target} kcal/day
              </span>
            </div>
          </div>
        )}

        {/* Health Tips */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            💡 Health Tips for You
          </h2>
          <div className="space-y-3">
            {data.health_tips?.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-lg">{idx + 1}.</span>
                <p className="text-gray-700 text-sm">{tip}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HealthAnalysisPage;