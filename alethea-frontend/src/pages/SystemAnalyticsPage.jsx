import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const SystemAnalyticsPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
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
      const [statsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users')
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
    } catch (err) {
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const getGoalDistribution = () => {
    const goals = {}
    users.forEach(u => {
      const goal = u.goal || 'not set'
      goals[goal] = (goals[goal] || 0) + 1
    })
    return Object.entries(goals).map(([goal, count]) => ({ goal, count }))
  }

  const getDietDistribution = () => {
    const diets = {}
    users.forEach(u => {
      const diet = u.diet_type || 'not set'
      diets[diet] = (diets[diet] || 0) + 1
    })
    return Object.entries(diets).map(([diet, count]) => ({ diet, count }))
  }

  const getGenderDistribution = () => {
    const genders = {}
    users.forEach(u => {
      const gender = u.gender || 'not set'
      genders[gender] = (genders[gender] || 0) + 1
    })
    return Object.entries(genders).map(([gender, count]) => ({ gender, count }))
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.white }}>
        <p style={{ color: c.taupe }}>Loading analytics...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>

      <nav style={{ backgroundColor: c.dark, padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: c.white, fontWeight: 900, fontSize: 20, letterSpacing: 2 }}>ALETHEA</span>
          <span style={{ backgroundColor: c.peach, color: c.dark, fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700, textTransform: 'uppercase' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Users', path: '/admin/users' },
            { label: 'Food DB', path: '/admin/food-database' },
            { label: 'Analytics', path: '/admin/analytics' },
          ].map((item, i) => (
            <Link key={i} to={item.path} style={{ color: i === 3 ? c.peach : c.taupe, textDecoration: 'none', fontSize: 13, letterSpacing: 1 }}>{item.label}</Link>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>

        <div style={{ marginBottom: 40 }}>
          <p style={{ color: c.peach, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Admin Panel</p>
          <h1 style={{ color: c.dark, fontSize: 32, fontWeight: 900, letterSpacing: -1, margin: 0 }}>System Analytics</h1>
          <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>Overview of platform usage and user data</p>
        </div>

        {/* overview stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[
            { label: 'Total Users', value: stats?.total_users || 0, icon: '👥', color: c.dark },
            { label: 'Active Users', value: stats?.active_users || 0, icon: '✅', color: '#22c55e' },
            { label: 'Inactive', value: (stats?.total_users || 0) - (stats?.active_users || 0), icon: '⏸️', color: c.taupe },
            { label: 'Admins', value: stats?.admin_users || 0, icon: '🔑', color: c.peach },
          ].map((stat, i) => (
            <div key={i} style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
              <p style={{ color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</p>
              <p style={{ color: stat.color, fontSize: 36, fontWeight: 900, margin: '4px 0 0', lineHeight: 1 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 32 }}>

          {/* goal distribution */}
          <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ color: c.dark, fontWeight: 800, fontSize: 16, marginBottom: 20 }}>🎯 Goal Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {getGoalDistribution().map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: c.taupe, fontSize: 13, textTransform: 'capitalize' }}>{item.goal.replace('_', ' ')}</span>
                    <span style={{ color: c.dark, fontWeight: 700, fontSize: 13 }}>{item.count}</span>
                  </div>
                  <div style={{ height: 6, backgroundColor: `${c.peach}30`, borderRadius: 3 }}>
                    <div style={{ height: 6, backgroundColor: c.dark, borderRadius: 3, width: `${(item.count / users.length) * 100}%`, transition: 'width 0.5s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* diet distribution */}
          <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ color: c.dark, fontWeight: 800, fontSize: 16, marginBottom: 20 }}>🥗 Diet Type Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {getDietDistribution().map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: c.taupe, fontSize: 13, textTransform: 'capitalize' }}>{item.diet.replace('_', ' ')}</span>
                    <span style={{ color: c.dark, fontWeight: 700, fontSize: 13 }}>{item.count}</span>
                  </div>
                  <div style={{ height: 6, backgroundColor: `${c.peach}30`, borderRadius: 3 }}>
                    <div style={{ height: 6, backgroundColor: c.taupe, borderRadius: 3, width: `${(item.count / users.length) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* gender distribution */}
          <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ color: c.dark, fontWeight: 800, fontSize: 16, marginBottom: 20 }}>👤 Gender Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {getGenderDistribution().map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ color: c.taupe, fontSize: 13, textTransform: 'capitalize' }}>{item.gender}</span>
                    <span style={{ color: c.dark, fontWeight: 700, fontSize: 13 }}>{item.count}</span>
                  </div>
                  <div style={{ height: 6, backgroundColor: `${c.peach}30`, borderRadius: 3 }}>
                    <div style={{ height: 6, backgroundColor: c.peach, borderRadius: 3, width: `${(item.count / users.length) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* activity distribution */}
          <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24 }}>
            <h3 style={{ color: c.dark, fontWeight: 800, fontSize: 16, marginBottom: 20 }}>🏃 Activity Level Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(() => {
                const activities = {}
                users.forEach(u => {
                  const activity = u.activity_level || 'not set'
                  activities[activity] = (activities[activity] || 0) + 1
                })
                return Object.entries(activities).map(([activity, count], i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: c.taupe, fontSize: 13, textTransform: 'capitalize' }}>{activity.replace('_', ' ')}</span>
                      <span style={{ color: c.dark, fontWeight: 700, fontSize: 13 }}>{count}</span>
                    </div>
                    <div style={{ height: 6, backgroundColor: `${c.peach}30`, borderRadius: 3 }}>
                      <div style={{ height: 6, backgroundColor: '#b45309', borderRadius: 3, width: `${(count / users.length) * 100}%` }} />
                    </div>
                  </div>
                ))
              })()}
            </div>
          </div>
        </div>

        {/* recent users table */}
        <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${c.peach}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: c.dark, fontWeight: 800, margin: 0 }}>Recent Users</h3>
            <Link to="/admin/users" style={{ color: c.peach, fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>View All →</Link>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: `${c.peach}10` }}>
                {['Name', 'Email', 'Goal', 'Diet Type', 'Status'].map((h, i) => (
                  <th key={i} style={{ padding: '12px 16px', color: c.taupe, textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 8).map((u, i) => (
                <tr key={u.id} style={{ borderTop: `1px solid ${c.peach}20` }}>
                  <td style={{ padding: '12px 16px', color: c.dark, fontWeight: 600 }}>{u.full_name}</td>
                  <td style={{ padding: '12px 16px', color: c.taupe }}>{u.email}</td>
                  <td style={{ padding: '12px 16px', color: c.taupe, textTransform: 'capitalize' }}>{u.goal?.replace('_', ' ') || '-'}</td>
                  <td style={{ padding: '12px 16px', color: c.taupe, textTransform: 'capitalize' }}>{u.diet_type?.replace('_', ' ') || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ backgroundColor: u.is_active ? '#d4edda' : '#fde8e8', color: u.is_active ? '#155724' : '#b91c1c', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default SystemAnalyticsPage