import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMeals } from '../context/MealContext'
import api from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DashboardPage = () => {
  const { user } = useAuth()
  const { meals, fetchMeals } = useMeals()
  const [stats, setStats] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 })
  const [healthData, setHealthData] = useState([])

  useEffect(() => {
    fetchMeals()
    fetchHealthData()
  }, [])

  useEffect(() => {
    const totals = meals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 })
    setStats(totals)
  }, [meals])

  const fetchHealthData = async () => {
    try {
      const response = await api.get('/health/records')
      const formatted = response.data.slice(-7).map(r => ({
        date: new Date(r.recorded_at).toLocaleDateString(),
        weight: r.weight,
      }))
      setHealthData(formatted)
    } catch (error) {
      console.error('Failed to fetch health data:', error)
    }
  }

  const quickActions = [
    { title: 'Log Meal', icon: '🍽️', path: '/log-meal', color: 'from-blue-500 to-cyan-500' },
    { title: 'Diet Plan', icon: '🥗', path: '/diet-plan', color: 'from-green-500 to-emerald-500' },
    { title: 'Health Check', icon: '❤️', path: '/health-prediction', color: 'from-red-500 to-pink-500' },
    { title: 'Meal History', icon: '📋', path: '/meal-history', color: 'from-purple-500 to-indigo-500' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold">Welcome back, {user?.full_name?.split(' ')[0]}! 👋</h1>
          <p className="text-indigo-100 mt-2">Track your progress and stay on top of your health goals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Calories', value: stats.calories, unit: 'kcal', icon: '🔥', color: 'orange' },
            { label: 'Protein', value: stats.protein, unit: 'g', icon: '💪', color: 'blue' },
            { label: 'Carbs', value: stats.carbs, unit: 'g', icon: '🌾', color: 'green' },
            { label: 'Fat', value: stats.fat, unit: 'g', icon: '🥑', color: 'red' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`text-${stat.color}-500 text-sm font-semibold`}>Today</span>
              </div>
              <div className="text-3xl font-bold text-gray-800">{Math.round(stat.value)}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, i) => (
            <Link key={i} to={action.path} className={`bg-gradient-to-r ${action.color} p-6 rounded-2xl text-white hover:shadow-xl transition-all transform hover:-translate-y-1`}>
              <div className="text-3xl mb-2">{action.icon}</div>
              <div className="font-semibold">{action.title}</div>
            </Link>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weight Trend */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">📊 Weight Trend</h3>
            {healthData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={healthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-gray-400">No data yet. Start logging your health!</div>
            )}
          </div>

          {/* Recent Meals */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">🍽️ Recent Meals</h3>
              <Link to="/meal-history" className="text-indigo-600 text-sm">View All →</Link>
            </div>
            {meals.slice(0, 5).map((meal, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <div className="font-medium">{meal.food_name}</div>
                  <div className="text-sm text-gray-500 capitalize">{meal.meal_type}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{Math.round(meal.calories || 0)} kcal</div>
                  <div className="text-xs text-gray-400">{meal.protein}g P • {meal.carbs}g C • {meal.fat}g F</div>
                </div>
              </div>
            ))}
            {meals.length === 0 && (
              <div className="text-center py-8 text-gray-400">No meals logged today</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage