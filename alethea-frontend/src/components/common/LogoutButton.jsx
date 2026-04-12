import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const LogoutButton = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-red-500 hover:text-red-700 transition font-medium"
    >
      Sign Out
    </button>
  )
}

export default LogoutButton