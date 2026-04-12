import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../services/authService'
import toast from 'react-hot-toast'

const DietaryPreferencesPage = () => {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    diet_type: user?.diet_type || '',
    allergies: user?.allergies || '',
  })

  const dietTypes = [
    { value: 'balanced', label: 'Balanced', icon: '🥗', desc: 'All foods in moderation' },
    { value: 'vegetarian', label: 'Vegetarian', icon: '🥦', desc: 'No meat, includes dairy & eggs' },
    { value: 'vegan', label: 'Vegan', icon: '🌱', desc: 'No animal products' },
    { value: 'keto', label: 'Keto', icon: '🥩', desc: 'Low carb, high fat' },
    { value: 'paleo', label: 'Paleo', icon: '🍖', desc: 'Whole foods only' },
    { value: 'mediterranean', label: 'Mediterranean', icon: '🫒', desc: 'Heart-healthy diet' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedUser = await updateProfile(formData)
      login(localStorage.getItem('token'), { ...user, ...updatedUser })
      toast.success('Preferences saved!')
      // Redirect to dashboard after completing profile
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/goals-health')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🥗</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Dietary Preferences</h1>
            <p className="text-gray-500 mt-2">Tell us about your eating habits</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Diet Type</label>
              <div className="grid grid-cols-2 gap-3">
                {dietTypes.map((diet) => (
                  <div
                    key={diet.value}
                    onClick={() => setFormData({ ...formData, diet_type: diet.value })}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.diet_type === diet.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}
                  >
                    <div className="text-2xl mb-2">{diet.icon}</div>
                    <div className="font-semibold text-gray-800">{diet.label}</div>
                    <div className="text-xs text-gray-500">{diet.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Allergies / Intolerances</label>
              <input
                type="text"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                placeholder="e.g., nuts, dairy, gluten, shellfish"
              />
              <p className="text-xs text-gray-400 mt-1">Separate multiple items with commas</p>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={handleBack} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition">
                Back
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50">
                {loading ? 'Saving...' : 'Complete Setup →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DietaryPreferencesPage