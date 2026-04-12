import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'

const DietPlanPage = () => {
  const navigate = useNavigate()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchPlan()
  }, [])

  const fetchPlan = async () => {
    try {
      const response = await api.get('/diet/plan')
      if (response.data.plan_data) setPlan(response.data.plan_data)
    } catch (error) {
      console.error('Failed to fetch plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const generatePlan = async () => {
    setGenerating(true)
    try {
      const response = await api.post('/diet/generate')
      setPlan(response.data.plan_data)
      toast.success('Diet plan generated!')
    } catch (error) {
      toast.error('Please complete your profile first')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white p-6">
            <button onClick={() => navigate('/dashboard')} className="mb-4 text-white hover:text-gray-200">← Back</button>
            <h1 className="text-2xl font-bold">Your AI Diet Plan</h1>
            <p className="text-indigo-100 mt-1">Personalized for your health goals</p>
          </div>

          <div className="p-6">
            {!plan ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🥗</div>
                <h2 className="text-xl font-semibold mb-2">No Diet Plan Yet</h2>
                <p className="text-gray-500 mb-6">Complete your profile to get a personalized AI diet plan</p>
                <button onClick={generatePlan} disabled={generating} className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-8 py-3 rounded-xl disabled:opacity-50">
                  {generating ? 'Generating...' : 'Generate My Plan →'}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-indigo-50 rounded-xl">
                    <div className="text-2xl font-bold text-indigo-600">{plan.daily_calories}</div>
                    <div className="text-sm text-gray-600">Daily Calories</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{plan.protein_g}g</div>
                    <div className="text-sm text-gray-600">Protein</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">{plan.carbs_g}g</div>
                    <div className="text-sm text-gray-600">Carbs</div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-semibold mb-3">💡 Daily Tips</h3>
                  <ul className="space-y-2">
                    {plan.tips?.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <span className="text-indigo-500">✓</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => navigate('/weekly-meal-plan')} className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl">
                    View Weekly Plan →
                  </button>
                  <button onClick={generatePlan} className="px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50">
                    Regenerate
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DietPlanPage