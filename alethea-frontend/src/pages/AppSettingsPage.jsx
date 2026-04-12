import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const AppSettingsPage = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-gray-700">← Back</button>
            <h1 className="flex-1 text-2xl font-bold text-center">App Settings</h1>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-500">Receive meal reminders and health tips</div>
              </div>
              <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition ${notifications ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                <div className={`w-5 h-5 rounded-full bg-white transform transition ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="flex justify-between items-center py-3 border-b">
              <div>
                <div className="font-medium">Dark Mode</div>
                <div className="text-sm text-gray-500">Coming soon</div>
              </div>
              <button disabled className="w-12 h-6 rounded-full bg-gray-300 opacity-50 cursor-not-allowed">
                <div className="w-5 h-5 rounded-full bg-white transform translate-x-1" />
              </button>
            </div>

            <div className="pt-4">
              <button onClick={handleLogout} className="w-full py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition">
                Sign Out
              </button>
            </div>

            <div className="text-center pt-4">
              <button className="text-red-500 text-sm">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppSettingsPage