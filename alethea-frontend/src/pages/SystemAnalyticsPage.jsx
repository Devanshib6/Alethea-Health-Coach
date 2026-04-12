import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const SystemAnalyticsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Analytics Data
  const goalDistribution = {}
  const dietDistribution = {}
  const genderDistribution = {}
  const activityDistribution = {}

  users.forEach(u => {
    const goal = u.goal || 'not set'
    goalDistribution[goal] = (goalDistribution[goal] || 0) + 1

    const diet = u.diet_type || 'not set'
    dietDistribution[diet] = (dietDistribution[diet] || 0) + 1

    const gender = u.gender || 'not set'
    genderDistribution[gender] = (genderDistribution[gender] || 0) + 1

    const activity = u.activity_level || 'not set'
    activityDistribution[activity] = (activityDistribution[activity] || 0) + 1
  })

  const goalData = Object.entries(goalDistribution).map(([name, value]) => ({ name: name.replace('_', ' '), value }))
  const dietData = Object.entries(dietDistribution).map(([name, value]) => ({ name: name.replace('_', ' '), value }))
  const genderData = Object.entries(genderDistribution).map(([name, value]) => ({ name, value }))
  const activityData = Object.entries(activityDistribution).map(([name, value]) => ({ name: name.replace('_', ' '), value }))

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444']

  const weeklyData = [
    { day: 'Mon', active: 145, new: 12 },
    { day: 'Tue', active: 162, new: 8 },
    { day: 'Wed', active: 178, new: 15 },
    { day: 'Thu', active: 195, new: 10 },
    { day: 'Fri', active: 210, new: 18 },
    { day: 'Sat', active: 225, new: 22 },
    { day: 'Sun', active: 240, new: 14 },
  ]

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading analytics...</div>

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navbar */}
      <nav className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-indigo-900 font-bold">A</span>
            </div>
            <span className="font-bold text-xl">Alethea Admin</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/admin/dashboard" className="hover:text-indigo-300">Dashboard</Link>
            <Link to="/admin/users" className="hover:text-indigo-300">Users</Link>
            <Link to="/admin/food-database" className="hover:text-indigo-300">Food DB</Link>
            <Link to="/admin/analytics" className="text-indigo-300">Analytics</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">System Analytics</h1>
          <p className="text-gray-600 mt-1">Platform usage statistics and insights</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: users.length, icon: '👥', change: '+12%' },
            { label: 'Active Users', value: users.filter(u => u.is_active).length, icon: '✅', change: '+8%' },
            { label: 'Completion Rate', value: '68%', icon: '📊', change: '+5%' },
            { label: 'Avg Health Score', value: '74', icon: '❤️', change: '+3%' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-green-600 text-sm">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Goal Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold mb-4">🎯 User Goals Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={goalData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {goalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Diet Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold mb-4">🥗 Diet Type Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={dietData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {dietData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold mb-4">📈 Weekly Active Users</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="active" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gender Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold mb-4">👤 Gender Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={genderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Levels */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <h3 className="font-semibold mb-4">🏃 Activity Level Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Insights Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold">User Insights</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Metric</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-6 py-4">Average Age</td>
                  <td className="px-6 py-4 font-medium">32 years</td>
                  <td className="px-6 py-4 text-gray-500">Young adult demographic</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Most Popular Goal</td>
                  <td className="px-6 py-4 font-medium capitalize">{Object.entries(goalDistribution).sort((a,b) => b[1] - a[1])[0]?.[0] || '-'}</td>
                  <td className="px-6 py-4 text-gray-500">Primary user motivation</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Most Common Diet</td>
                  <td className="px-6 py-4 font-medium capitalize">{Object.entries(dietDistribution).sort((a,b) => b[1] - a[1])[0]?.[0] || '-'}</td>
                  <td className="px-6 py-4 text-gray-500">Popular dietary preference</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">User Retention</td>
                  <td className="px-6 py-4 font-medium">78%</td>
                  <td className="px-6 py-4 text-gray-500">30-day retention rate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemAnalyticsPage