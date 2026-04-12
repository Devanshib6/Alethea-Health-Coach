import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../services/authService'
import toast from 'react-hot-toast'

const GoalsHealthPage = () => {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    goal: user?.goal || '',
    activity_level: user?.activity_level || '',
  })

  const goals = [
    { value: 'lose_weight', label: 'Lose Weight', icon: '⚖️', desc: 'Shed those extra pounds' },
    { value: 'gain_muscle', label: 'Gain Muscle', icon: '💪', desc: 'Build strength and mass' },
    { value: 'maintain', label: 'Maintain Weight', icon: '🎯', desc: 'Stay fit and healthy' },
    { value: 'improve_health', label: 'Improve Health', icon: '❤️', desc: 'Better overall wellness' },
  ]

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', icon: '🛋️', desc: 'Little or no exercise' },
    { value: 'light', label: 'Light', icon: '🚶', desc: 'Exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderate', icon: '🏃', desc: 'Exercise 3-5 days/week' },
    { value: 'active', label: 'Active', icon: '🏋️', desc: 'Exercise 6-7 days/week' },
    { value: 'very_active', label: 'Very Active', icon: '⚡', desc: 'Intense daily exercise' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedUser = await updateProfile(formData)
      login(localStorage.getItem('token'), { ...user, ...updatedUser })
      toast.success('Goals saved!')
      // Redirect to dietary preferences page
      navigate('/dietary-preferences')
    } catch (error) {
      toast.error('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/basic-info')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🎯</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Your Health Goals</h1>
            <p className="text-gray-500 mt-2">What do you want to achieve?</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Primary Goal</label>
              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => (
                  <div
                    key={goal.value}
                    onClick={() => setFormData({ ...formData, goal: goal.value })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.goal === goal.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                  >
                    <div className="text-2xl mb-2">{goal.icon}</div>
                    <div className="font-semibold text-gray-800">{goal.label}</div>
                    <div className="text-xs text-gray-500">{goal.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Activity Level</label>
              <div className="space-y-3">
                {activityLevels.map((level) => (
                  <div
                    key={level.value}
                    onClick={() => setFormData({ ...formData, activity_level: level.value })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${formData.activity_level === level.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                  >
                    <div className="text-2xl">{level.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{level.label}</div>
                      <div className="text-sm text-gray-500">{level.desc}</div>
                    </div>
                    {formData.activity_level === level.value && <div className="text-indigo-600 text-xl">✓</div>}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={handleBack} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition">
                Back
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50">
                {loading ? 'Saving...' : 'Continue →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GoalsHealthPage