import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    fetchAdminData()
  }, [user])

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ])
      setStats(statsRes.data)
      setRecentUsers(usersRes.data.slice(0, 5))
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = [
    { name: 'Mon', users: 120, meals: 450 },
    { name: 'Tue', users: 135, meals: 520 },
    { name: 'Wed', users: 148, meals: 580 },
    { name: 'Thu', users: 160, meals: 610 },
    { name: 'Fri', users: 175, meals: 650 },
    { name: 'Sat', users: 190, meals: 700 },
    { name: 'Sun', users: 210, meals: 780 },
  ]

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading admin panel...</div>

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
            <span className="ml-4 text-sm bg-yellow-500 text-black px-2 py-1 rounded">Admin Panel</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/admin/dashboard" className="hover:text-indigo-300">Dashboard</Link>
            <Link to="/admin/users" className="hover:text-indigo-300">Users</Link>
            <Link to="/admin/food-database" className="hover:text-indigo-300">Food DB</Link>
            <Link to="/admin/analytics" className="hover:text-indigo-300">Analytics</Link>
            <button onClick={() => { logout(); navigate('/login') }} className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-600 mb-8">Welcome back, {user?.full_name}</p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: stats?.total_users || 0, icon: '👥', color: 'bg-blue-500' },
            { label: 'Active Users', value: stats?.active_users || 0, icon: '✅', color: 'bg-green-500' },
            { label: 'Total Meals', value: stats?.total_meals || 0, icon: '🍽️', color: 'bg-orange-500' },
            { label: 'Admin Users', value: stats?.admin_users || 0, icon: '👑', color: 'bg-purple-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className={`${stat.color} text-white text-xs px-2 py-1 rounded`}>Today</span>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold mb-4">User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-semibold mb-4">Meals Logged</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="meals" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Recent Users</h3>
            <Link to="/admin/users" className="text-indigo-600 text-sm">View All →</Link>
          </div>
          <div className="divide-y">
            {recentUsers.map((u, i) => (
              <div key={i} className="px-6 py-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">{u.full_name}</div>
                  <div className="text-sm text-gray-500">{u.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-xs text-gray-400 capitalize">{u.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage