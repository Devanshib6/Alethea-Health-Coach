import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const HealthPredictionPage = () => {
  const navigate = useNavigate()
  const [prediction, setPrediction] = useState(null)
  const [records, setRecords] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ weight: '', blood_pressure: '', sugar_level: '', cholesterol: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [recordsRes, predictRes] = await Promise.all([
        api.get('/health/records'),
        api.get('/health/predict')
      ])
      setRecords(recordsRes.data)
      if (predictRes.data.prediction) setPrediction(predictRes.data.prediction)
    } catch (error) {
      console.error('Failed to fetch health data:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/health/record', formData)
      toast.success('Health record added!')
      setShowForm(false)
      setFormData({ weight: '', blood_pressure: '', sugar_level: '', cholesterol: '' })
      fetchData()
    } catch (error) {
      toast.error('Failed to add record')
    }
  }

  const chartData = records.slice(-7).map(r => ({ date: new Date(r.recorded_at).toLocaleDateString(), weight: r.weight }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white p-6">
            <div className="flex justify-between items-center">
              <button onClick={() => navigate('/dashboard')} className="text-white hover:text-gray-200">← Back</button>
              <h1 className="text-2xl font-bold">Health Prediction</h1>
              <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-white/20 rounded-lg">+ Add Record</button>
            </div>
          </div>

          <div className="p-6">
            {showForm && (
              <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-xl">
                <h3 className="font-semibold mb-4">Log Health Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Weight (kg)" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="input-modern" />
                  <input type="text" placeholder="Blood Pressure" value={formData.blood_pressure} onChange={(e) => setFormData({ ...formData, blood_pressure: e.target.value })} className="input-modern" />
                  <input type="number" placeholder="Blood Sugar (mg/dL)" value={formData.sugar_level} onChange={(e) => setFormData({ ...formData, sugar_level: e.target.value })} className="input-modern" />
                  <input type="number" placeholder="Cholesterol (mg/dL)" value={formData.cholesterol} onChange={(e) => setFormData({ ...formData, cholesterol: e.target.value })} className="input-modern" />
                </div>
                <button type="submit" className="mt-4 btn-primary w-full">Save Record</button>
              </form>
            )}

            {prediction ? (
              <>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-indigo-50 rounded-xl">
                    <div className="text-3xl font-bold text-indigo-600">{prediction.health_score}</div>
                    <div className="text-sm text-gray-600">Health Score</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-xl font-semibold capitalize">{prediction.bmi_category}</div>
                    <div className="text-sm text-gray-600">BMI Category</div>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="font-semibold mb-4">Weight Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">AI Recommendations</h3>
                  <ul className="space-y-2">
                    {prediction.recommendations?.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600">
                        <span className="text-indigo-500">💡</span> {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <button onClick={() => navigate('/health-report')} className="mt-6 btn-primary w-full py-3">
                  View Full Health Report →
                </button>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📊</div>
                <h2 className="text-xl font-semibold mb-2">No Health Data Yet</h2>
                <p className="text-gray-500 mb-6">Log at least 2 health records to get AI predictions</p>
                <button onClick={() => setShowForm(true)} className="btn-primary">Log First Record</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthPredictionPage