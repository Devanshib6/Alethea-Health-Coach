import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../services/authService'
import toast from 'react-hot-toast'

const ProfileSettingsPage = () => {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    height: user?.height || '',
    weight: user?.weight || '',
    goal: user?.goal || '',
    activity_level: user?.activity_level || '',
    diet_type: user?.diet_type || '',
    allergies: user?.allergies || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedUser = await updateProfile(formData)
      login(localStorage.getItem('token'), { ...user, ...updatedUser })
      toast.success('Profile updated!')
      // Stay on same page after save
    } catch (error) {
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">← Back</button>
            <h1 className="flex-1 text-2xl font-bold text-center">Profile Settings</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
                <input type="number" value={formData.height} onChange={(e) => setFormData({ ...formData, height: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                <input type="number" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Health Goal</label>
              <select value={formData.goal} onChange={(e) => setFormData({ ...formData, goal: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none">
                <option value="">Select Goal</option>
                <option value="lose_weight">Lose Weight</option>
                <option value="gain_muscle">Gain Muscle</option>
                <option value="maintain">Maintain Weight</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
              <select value={formData.activity_level} onChange={(e) => setFormData({ ...formData, activity_level: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none">
                <option value="">Select Activity Level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
              <select value={formData.diet_type} onChange={(e) => setFormData({ ...formData, diet_type: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none">
                <option value="">Select Diet Type</option>
                <option value="balanced">Balanced</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
              <input type="text" value={formData.allergies} onChange={(e) => setFormData({ ...formData, allergies: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none" placeholder="e.g., nuts, dairy" />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={handleCancel} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettingsPage