import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

const AdminUserManagementPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Food Database', path: '/admin/food-database' },
    { label: 'Analytics', path: '/admin/analytics' },
  ]

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    fetchUsers()
  }, [user])

  const fetchUsers = async () => {
    try {
      const response = await API.get('/admin/users')
      setUsers(response.data)
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return
    setDeleting(true)
    try {
      await API.delete(`/admin/users/${selectedUser.id}`)
      setUsers(users.filter(u => u.id !== selectedUser.id))
      setShowDeleteModal(false)
      setSelectedUser(null)
    } catch (err) {
      console.error('Error deleting user:', err)
      alert(err.response?.data?.detail || 'Failed to delete user')
    } finally {
      setDeleting(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.cream }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${c.peach}`, borderTopColor: c.dark, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: c.taupe }}>Loading users...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.cream, fontFamily: "'Inter', system-ui, sans-serif", display: 'flex' }}>
      
      {/* Sidebar Navigation */}
      <div style={{
        width: sidebarCollapsed ? 80 : 260,
        backgroundColor: c.dark,
        minHeight: '100vh',
        transition: 'width 0.3s ease',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{ padding: sidebarCollapsed ? '24px 0' : '24px 20px', borderBottom: `1px solid ${c.taupe}30`, marginBottom: 24 }}>
          <div style={{ color: c.white, fontWeight: 700, fontSize: sidebarCollapsed ? 20 : 22, letterSpacing: 2, textTransform: 'uppercase', textAlign: sidebarCollapsed ? 'center' : 'left' }}>
            {sidebarCollapsed ? 'A' : 'Alethea'}
          </div>
          {!sidebarCollapsed && (
            <div style={{ fontSize: 10, color: c.peach, marginTop: 4, letterSpacing: 1 }}>ADMIN</div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute',
            right: -12,
            top: 80,
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: c.peach,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: c.dark,
            fontSize: 12,
          }}
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>

        {/* Nav Items */}
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: sidebarCollapsed ? '14px 0' : '12px 20px',
                margin: '4px 12px',
                borderRadius: 12,
                textDecoration: 'none',
                backgroundColor: location.pathname === item.path ? `${c.peach}20` : 'transparent',
                color: location.pathname === item.path ? c.peach : c.taupe,
                transition: 'all 0.2s',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = `${c.white}10`
                  e.currentTarget.style.color = c.white
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = c.taupe
                }
              }}
            >
              {!sidebarCollapsed && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>}
              {sidebarCollapsed && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label.charAt(0)}</span>}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div style={{ padding: sidebarCollapsed ? '20px 0' : '20px', borderTop: `1px solid ${c.taupe}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: c.peach,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 700,
              color: c.dark,
            }}>
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1 }}>
                <p style={{ color: c.white, fontWeight: 600, margin: 0, fontSize: 13 }}>{user?.full_name?.split(' ')[0] || 'Admin'}</p>
                <p style={{ color: c.taupe, fontSize: 11, margin: '4px 0 0' }}>Administrator</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                marginTop: 16,
                padding: '10px',
                backgroundColor: 'transparent',
                border: `1px solid ${c.taupe}40`,
                borderRadius: 8,
                color: c.taupe,
                cursor: 'pointer',
                fontSize: 13,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${c.peach}20`
                e.currentTarget.style.borderColor = c.peach
                e.currentTarget.style.color = c.peach
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = `${c.taupe}40`
                e.currentTarget.style.color = c.taupe
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? 80 : 260,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
      }}>
        
        {/* Header */}
        <div style={{ backgroundColor: c.white, borderBottom: `1px solid ${c.peach}15`, padding: '20px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ color: c.dark, fontSize: 28, fontWeight: 800, margin: 0 }}>User Management</h1>
              <p style={{ color: c.taupe, marginTop: 4, fontSize: 14 }}>{users.length} total users registered</p>
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                border: `1.5px solid ${c.peach}20`, 
                borderRadius: 40, 
                padding: '12px 20px', 
                fontSize: 14, 
                outline: 'none', 
                width: 280,
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = c.peach
                e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = `${c.peach}20`
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          
          {/* Users Table */}
          <div style={{ 
            backgroundColor: c.white, 
            borderRadius: 20, 
            overflow: 'hidden',
            border: `1px solid ${c.peach}15`,
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
                <thead>
                  <tr style={{ backgroundColor: c.dark }}>
                    <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12, letterSpacing: 0.5 }}>User</th>
                    <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12, letterSpacing: 0.5 }}>Email</th>
                    <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12, letterSpacing: 0.5 }}>Role</th>
                    <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12, letterSpacing: 0.5 }}>Status</th>
                    <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12, letterSpacing: 0.5 }}>Joined</th>
                    <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12, letterSpacing: 0.5 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '60px 20px', textAlign: 'center', color: c.taupe }}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, i) => (
                      <tr key={u.id} style={{ 
                        borderBottom: `1px solid ${c.peach}10`,
                        backgroundColor: i % 2 === 0 ? c.white : `${c.peach}02`,
                      }}>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ 
                              width: 36, 
                              height: 36, 
                              borderRadius: '50%', 
                              backgroundColor: c.dark, 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              flexShrink: 0 
                            }}>
                              <span style={{ color: c.peach, fontSize: 14, fontWeight: 700 }}>
                                {u.full_name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <span style={{ color: c.dark, fontWeight: 600 }}>{u.full_name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', color: c.taupe }}>{u.email}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ 
                            padding: '4px 12px', 
                            borderRadius: 20, 
                            fontSize: 11, 
                            fontWeight: 600,
                            backgroundColor: u.role === 'admin' ? `${c.peach}15` : `${c.taupe}15`,
                            color: u.role === 'admin' ? c.peach : c.taupe,
                          }}>
                            {u.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{ 
                            padding: '4px 12px', 
                            borderRadius: 20, 
                            fontSize: 11, 
                            fontWeight: 600,
                            backgroundColor: u.is_active ? '#16a34a15' : '#dc262615',
                            color: u.is_active ? '#16a34a' : '#dc2626',
                          }}>
                            {u.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', color: c.taupe, fontSize: 12 }}>{formatDate(u.created_at)}</td>
                        <td style={{ padding: '14px 20px' }}>
                          {u.id !== user?.id && (
                            <button 
                              onClick={() => { setSelectedUser(u); setShowDeleteModal(true) }}
                              style={{ 
                                backgroundColor: 'transparent', 
                                border: `1px solid #dc262640`, 
                                color: '#dc2626', 
                                padding: '6px 16px', 
                                fontSize: 12, 
                                cursor: 'pointer', 
                                borderRadius: 20,
                                fontWeight: 500,
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.backgroundColor = '#dc2626'
                                e.currentTarget.style.color = c.white
                                e.currentTarget.style.borderColor = '#dc2626'
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.backgroundColor = 'transparent'
                                e.currentTarget.style.color = '#dc2626'
                                e.currentTarget.style.borderColor = '#dc262640'
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 1000 
        }}>
          <div style={{ 
            backgroundColor: c.white, 
            borderRadius: 24, 
            padding: 32, 
            maxWidth: 400, 
            width: '90%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ color: c.dark, marginBottom: 12, fontWeight: 700, fontSize: 20 }}>Delete User?</h3>
            <p style={{ color: c.taupe, marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
              Are you sure you want to delete <strong style={{ color: c.dark }}>{selectedUser?.full_name}</strong>? 
              This will permanently remove their account and all associated data.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setShowDeleteModal(false)}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  backgroundColor: 'transparent', 
                  border: `1.5px solid ${c.peach}`, 
                  borderRadius: 40, 
                  cursor: 'pointer', 
                  color: c.taupe,
                  fontWeight: 600,
                  fontSize: 14,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${c.peach}08`
                  e.currentTarget.style.borderColor = c.dark
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = c.peach
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                disabled={deleting}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  backgroundColor: '#dc2626', 
                  color: c.white, 
                  border: 'none', 
                  borderRadius: 40, 
                  cursor: deleting ? 'not-allowed' : 'pointer', 
                  fontWeight: 600,
                  fontSize: 14,
                  opacity: deleting ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!deleting) e.currentTarget.style.backgroundColor = '#b91c1c'
                }}
                onMouseLeave={(e) => {
                  if (!deleting) e.currentTarget.style.backgroundColor = '#dc2626'
                }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminUserManagementPage