import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const HealthPredictionPage = () => {
  const navigate = useNavigate()
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    weight: '',
    blood_pressure: '',
    sugar_level: '',
    cholesterol: '',
    notes: ''
  })

  useEffect(() => {
    fetchPrediction()
  }, [])

  const fetchPrediction = async () => {
    try {
      const response = await API.get('/health/predict')
      if (response.data.prediction) {
        setPrediction(response.data.prediction)
      }
    } catch (err) {
      console.error('Error fetching prediction:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await API.post('/health/record', {
        weight: formData.weight ? parseFloat(formData.weight) : null,
        blood_pressure: formData.blood_pressure || null,
        sugar_level: formData.sugar_level ? parseFloat(formData.sugar_level) : null,
        cholesterol: formData.cholesterol ? parseFloat(formData.cholesterol) : null,
        notes: formData.notes || null
      })
      setSuccess('Health record added successfully!')
      setShowForm(false)
      setFormData({ weight: '', blood_pressure: '', sugar_level: '', cholesterol: '', notes: '' })
      setTimeout(() => {
        fetchPrediction()
        setSuccess('')
      }, 1000)
    } catch (err) {
      setError('Failed to add health record.')
    } finally {
      setSubmitting(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return '↑'
    if (trend === 'decreasing') return '↓'
    return '→'
  }

  const getTrendColor = (trend, metric) => {
    if (metric === 'weight') {
      return trend === 'decreasing' ? '#22c55e' : trend === 'increasing' ? '#ef4444' : c.taupe
    }
    return trend === 'stable' ? '#22c55e' : c.taupe
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.white }}>
        <p style={{ color: c.taupe }}>Loading health data...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>

      {/* header */}
      <div style={{ backgroundColor: c.dark, padding: '20px 32px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <button onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 14, marginBottom: 12 }}>
            ← Back to Dashboard
          </button>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ color: c.white, fontSize: 28, fontWeight: 800, margin: 0 }}>Health Prediction</h1>
              <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>AI powered health analysis and predictions</p>
            </div>
            <button onClick={() => setShowForm(!showForm)}
              style={{ backgroundColor: c.peach, color: c.dark, border: 'none', padding: '10px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              + Log Health Record
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 32px' }}>

        {/* log form */}
        {showForm && (
          <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 28, marginBottom: 32 }}>
            <h3 style={{ color: c.dark, fontWeight: 800, marginBottom: 20 }}>Log Health Record</h3>

            {error && <div style={{ backgroundColor: '#fde8e8', color: '#b91c1c', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{error}</div>}
            {success && <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>{success}</div>}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                {[
                  { name: 'weight', label: 'Weight (kg)', placeholder: 'e.g., 70' },
                  { name: 'blood_pressure', label: 'Blood Pressure', placeholder: 'e.g., 120/80' },
                  { name: 'sugar_level', label: 'Blood Sugar (mg/dL)', placeholder: 'e.g., 95' },
                  { name: 'cholesterol', label: 'Cholesterol (mg/dL)', placeholder: 'e.g., 180' },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>{field.label}</label>
                    <input
                      type={field.name === 'blood_pressure' ? 'text' : 'number'}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Notes</label>
                <input
                  type="text"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes..."
                  style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ flex: 1, backgroundColor: 'transparent', border: `1.5px solid ${c.peach}`, color: c.taupe, padding: '12px', borderRadius: 8, cursor: 'pointer', fontSize: 14 }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  style={{ flex: 1, backgroundColor: c.dark, color: c.white, border: 'none', padding: '12px', borderRadius: 8, cursor: submitting ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700, opacity: submitting ? 0.6 : 1 }}>
                  {submitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        )}

        {!prediction ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🏥</div>
            <h2 style={{ color: c.dark, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>No Health Data Yet</h2>
            <p style={{ color: c.taupe, fontSize: 15, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
              Log at least 2 health records to get AI powered health predictions.
            </p>
            <button onClick={() => setShowForm(true)}
              style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '14px 36px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Log First Health Record →
            </button>
          </div>
        ) : (
          <>
            {/* health score */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 32, flexWrap: 'wrap' }}>
              <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 28, textAlign: 'center' }}>
                <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Health Score</p>
                <div style={{ width: 120, height: 120, borderRadius: '50%', border: `8px solid ${getScoreColor(prediction.health_score)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <span style={{ fontSize: 36, fontWeight: 900, color: getScoreColor(prediction.health_score) }}>{prediction.health_score}</span>
                </div>
                <p style={{ color: c.dark, fontWeight: 700, fontSize: 15 }}>
                  {prediction.health_score >= 80 ? 'Excellent' : prediction.health_score >= 60 ? 'Good' : 'Needs Attention'}
                </p>
                <p style={{ color: c.taupe, fontSize: 12, marginTop: 4 }}>Based on {prediction.total_records} records</p>
              </div>

              <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 28 }}>
                <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Current Metrics</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { label: 'Weight', value: prediction.latest_weight ? `${prediction.latest_weight} kg` : 'N/A', trend: prediction.weight_trend, metric: 'weight' },
                    { label: 'BMI', value: prediction.latest_bmi ? prediction.latest_bmi : 'N/A', trend: prediction.bmi_trend, metric: 'bmi' },
                    { label: 'Blood Sugar', value: prediction.latest_sugar ? `${prediction.latest_sugar} mg/dL` : 'N/A', trend: prediction.sugar_trend, metric: 'sugar' },
                    { label: 'Cholesterol', value: prediction.latest_cholesterol ? `${prediction.latest_cholesterol} mg/dL` : 'N/A', trend: prediction.cholesterol_trend, metric: 'cholesterol' },
                  ].map((item, i) => (
                    <div key={i} style={{ backgroundColor: `${c.peach}10`, borderRadius: 8, padding: 14 }}>
                      <p style={{ color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</p>
                      <p style={{ color: c.dark, fontWeight: 700, fontSize: 18, margin: '4px 0' }}>{item.value}</p>
                      <p style={{ fontSize: 12, color: getTrendColor(item.trend, item.metric), fontWeight: 600 }}>
                        {getTrendIcon(item.trend)} {item.trend}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* bmi category */}
            <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>BMI Category</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 32 }}>
                  {prediction.bmi_category === 'normal' ? '✅' : prediction.bmi_category === 'underweight' ? '⚠️' : '⚠️'}
                </span>
                <div>
                  <p style={{ color: c.dark, fontWeight: 800, fontSize: 20, textTransform: 'capitalize' }}>{prediction.bmi_category}</p>
                  <p style={{ color: c.taupe, fontSize: 13 }}>
                    {prediction.bmi_category === 'normal' ? 'Your BMI is in the healthy range.' :
                     prediction.bmi_category === 'underweight' ? 'Consider increasing calorie intake.' :
                     prediction.bmi_category === 'overweight' ? 'Consider reducing calorie intake.' :
                     'Please consult a healthcare professional.'}
                  </p>
                </div>
              </div>
            </div>

            {/* recommendations */}
            <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>AI Recommendations</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {prediction.recommendations.map((rec, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.peach, flexShrink: 0, marginTop: 6 }} />
                    <p style={{ color: c.taupe, fontSize: 14, lineHeight: 1.6 }}>{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* actions */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/health-report')}
                style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '14px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                View Full Health Report →
              </button>
              <button onClick={() => setShowForm(true)}
                style={{ backgroundColor: 'transparent', color: c.taupe, border: `1.5px solid ${c.peach}`, padding: '14px 32px', fontSize: 14, cursor: 'pointer' }}>
                Log New Record
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default HealthPredictionPage