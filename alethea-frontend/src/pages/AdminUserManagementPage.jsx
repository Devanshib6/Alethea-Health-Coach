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

const AdminUserManagementPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

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
    } finally {
      setDeleting(false)
    }
  }

  const filteredUsers = users.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.white }}>
        <p style={{ color: c.taupe }}>Loading users...</p>
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
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {[
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Users', path: '/admin/users' },
            { label: 'Food DB', path: '/admin/food-database' },
            { label: 'Analytics', path: '/admin/analytics' },
          ].map((item, i) => (
            <Link key={i} to={item.path} style={{ color: i === 1 ? c.peach : c.taupe, textDecoration: 'none', fontSize: 13, letterSpacing: 1 }}>{item.label}</Link>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ color: c.peach, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Admin Panel</p>
            <h1 style={{ color: c.dark, fontSize: 32, fontWeight: 900, letterSpacing: -1, margin: 0 }}>User Management</h1>
            <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>{users.length} total users registered</p>
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: `1.5px solid ${c.peach}`, borderRadius: 8, padding: '10px 16px', fontSize: 14, outline: 'none', width: 260 }}
          />
        </div>

        {/* users table */}
        <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: c.dark }}>
                {['Name', 'Email', 'Role', 'Status', 'Goal', 'Actions'].map((h, i) => (
                  <th key={i} style={{ padding: '14px 16px', color: i === 0 ? c.white : c.peach, textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontSize: 11 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: c.taupe }}>No users found</td>
                </tr>
              ) : (
                filteredUsers.map((u, i) => (
                  <tr key={u.id} style={{ borderTop: `1px solid ${c.peach}20`, backgroundColor: i % 2 === 0 ? c.white : `${c.peach}05` }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: c.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ color: c.peach, fontSize: 12, fontWeight: 700 }}>{u.full_name?.charAt(0) || 'U'}</span>
                        </div>
                        <span style={{ color: c.dark, fontWeight: 600 }}>{u.full_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: c.taupe }}>{u.email}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ backgroundColor: u.role === 'admin' ? c.dark : `${c.peach}20`, color: u.role === 'admin' ? c.white : c.dark, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' }}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ backgroundColor: u.is_active ? '#d4edda' : '#fde8e8', color: u.is_active ? '#155724' : '#b91c1c', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                        {u.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', color: c.taupe, textTransform: 'capitalize' }}>{u.goal?.replace('_', ' ') || '-'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {u.id !== user?.id && (
                        <button onClick={() => { setSelectedUser(u); setShowDeleteModal(true) }}
                          style={{ backgroundColor: 'transparent', border: `1px solid #f5c6c6`, color: '#ef4444', padding: '6px 12px', fontSize: 12, cursor: 'pointer', borderRadius: 4 }}>
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

      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: c.white, borderRadius: 12, padding: 32, maxWidth: 400, width: '90%' }}>
            <h3 style={{ color: c.dark, marginBottom: 12 }}>Delete User?</h3>
            <p style={{ color: c.taupe, marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
              Are you sure you want to delete <strong>{selectedUser?.full_name}</strong>? This will permanently remove their account and all data.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowDeleteModal(false)}
                style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: `1.5px solid ${c.peach}`, borderRadius: 8, cursor: 'pointer', color: c.taupe }}>
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleting}
                style={{ flex: 1, padding: '12px', backgroundColor: '#ef4444', color: c.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, opacity: deleting ? 0.6 : 1 }}>
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