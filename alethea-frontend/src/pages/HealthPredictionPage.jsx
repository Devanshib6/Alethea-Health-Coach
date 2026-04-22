import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

const HealthPredictionPage = () => {
  const navigate = useNavigate()
  const [prediction, setPrediction] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [records, setRecords] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ 
    weight: '', 
    blood_pressure: '', 
    sugar_level: '', 
    cholesterol: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [recordsRes, predictRes, forecastRes] = await Promise.all([
        api.get('/health/records'),
        api.get('/health/predict'),
        api.get('/health/forecast')
      ])
      setRecords(recordsRes.data)
      if (predictRes.data.prediction) setPrediction(predictRes.data.prediction)
      if (forecastRes.data.forecast) setForecast(forecastRes.data.forecast)
    } catch (error) {
      console.error('Failed to fetch health data:', error)
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.')
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.weight && !formData.blood_pressure && !formData.sugar_level && !formData.cholesterol) {
      toast.error('Please fill at least one health metric')
      return
    }

    setSubmitting(true)
    
    try {
      const payload = {
        weight: formData.weight ? parseFloat(formData.weight) : null,
        blood_pressure: formData.blood_pressure || null,
        sugar_level: formData.sugar_level ? parseFloat(formData.sugar_level) : null,
        cholesterol: formData.cholesterol ? parseFloat(formData.cholesterol) : null,
        notes: formData.notes || null
      }

      await api.post('/health/record', payload)
      
      toast.success('Health record added successfully!')
      setShowForm(false)
      setFormData({ weight: '', blood_pressure: '', sugar_level: '', cholesterol: '', notes: '' })
      
      await fetchData()
      
    } catch (error) {
      console.error('Error saving health record:', error)
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.')
        navigate('/login')
      } else if (error.response?.data?.detail) {
        toast.error(error.response.data.detail)
      } else {
        toast.error('Failed to add health record. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const getHealthScoreColor = (score) => {
    if (score >= 80) return '#16a34a'
    if (score >= 60) return '#f59e0b'
    return '#dc2626'
  }

  const getHealthScoreLabel = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Attention'
  }

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return '↑'
    if (trend === 'decreasing') return '↓'
    return '→'
  }

  const getTrendColor = (trend) => {
    if (trend === 'increasing') return '#dc2626'
    if (trend === 'decreasing') return '#16a34a'
    return '#f59e0b'
  }

  const chartData = records.slice(-7).map(r => ({ 
    date: new Date(r.recorded_at).toLocaleDateString(), 
    weight: r.weight 
  })).filter(r => r.weight)

  // Prepare forecast chart data
  const forecastChartData = forecast?.forecast_dates?.map((date, index) => ({
    day: date,
    weight: forecast.forecast_values?.[index]
  })) || []

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.cream, fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ backgroundColor: c.white, borderBottom: `1px solid ${c.peach}15`, padding: '20px 32px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Link 
            to="/dashboard" 
            style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 13, marginBottom: 12, textDecoration: 'none', display: 'inline-block' }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ color: c.dark, fontSize: 28, fontWeight: 800, margin: '8px 0 4px' }}>Health Prediction</h1>
          <p style={{ color: c.taupe, marginTop: 4, fontSize: 14 }}>Track your health metrics and get AI-powered predictions</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px' }}>
        <div style={{ 
          backgroundColor: c.white, 
          borderRadius: 24, 
          overflow: 'hidden',
          border: `1px solid ${c.peach}15`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          
          {/* Action Bar */}
          <div style={{ 
            padding: '20px 24px', 
            borderBottom: `1px solid ${c.peach}15`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: c.white,
          }}>
            <h2 style={{ color: c.dark, fontWeight: 600, fontSize: 16, margin: 0 }}>
              {prediction ? 'Your Health Insights' : 'Health Monitoring'}
            </h2>
            <button 
              onClick={() => setShowForm(!showForm)} 
              style={{
                backgroundColor: c.dark,
                color: c.white,
                border: 'none',
                padding: '8px 20px',
                borderRadius: 40,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.charcoal}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.dark}
            >
              {showForm ? 'Cancel' : '+ Add Record'}
            </button>
          </div>

          {/* Add Record Form */}
          {showForm && (
            <div style={{ padding: '24px', borderBottom: `1px solid ${c.peach}15`, backgroundColor: `${c.peach}04` }}>
              <h3 style={{ color: c.dark, fontWeight: 600, fontSize: 15, marginBottom: 20 }}>Log Health Metrics</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: 12, color: c.taupe, marginBottom: 4, display: 'block' }}>Weight (kg)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      placeholder="70" 
                      value={formData.weight} 
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })} 
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: `1.5px solid ${c.peach}20`,
                        fontSize: 14,
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                      onFocus={(e) => e.target.style.borderColor = c.peach}
                      onBlur={(e) => e.target.style.borderColor = `${c.peach}20`}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: c.taupe, marginBottom: 4, display: 'block' }}>Blood Pressure</label>
                    <input 
                      type="text" 
                      placeholder="120/80" 
                      value={formData.blood_pressure} 
                      onChange={(e) => setFormData({ ...formData, blood_pressure: e.target.value })} 
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: `1.5px solid ${c.peach}20`,
                        fontSize: 14,
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                      onFocus={(e) => e.target.style.borderColor = c.peach}
                      onBlur={(e) => e.target.style.borderColor = `${c.peach}20`}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: c.taupe, marginBottom: 4, display: 'block' }}>Blood Sugar (mg/dL)</label>
                    <input 
                      type="number" 
                      step="1"
                      placeholder="100" 
                      value={formData.sugar_level} 
                      onChange={(e) => setFormData({ ...formData, sugar_level: e.target.value })} 
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: `1.5px solid ${c.peach}20`,
                        fontSize: 14,
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                      onFocus={(e) => e.target.style.borderColor = c.peach}
                      onBlur={(e) => e.target.style.borderColor = `${c.peach}20`}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, color: c.taupe, marginBottom: 4, display: 'block' }}>Cholesterol (mg/dL)</label>
                    <input 
                      type="number" 
                      step="1"
                      placeholder="180" 
                      value={formData.cholesterol} 
                      onChange={(e) => setFormData({ ...formData, cholesterol: e.target.value })} 
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: `1.5px solid ${c.peach}20`,
                        fontSize: 14,
                        outline: 'none',
                        fontFamily: 'inherit',
                      }}
                      onFocus={(e) => e.target.style.borderColor = c.peach}
                      onBlur={(e) => e.target.style.borderColor = `${c.peach}20`}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 12, color: c.taupe, marginBottom: 4, display: 'block' }}>Notes (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Any additional notes..." 
                    value={formData.notes} 
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })} 
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: 12,
                      border: `1.5px solid ${c.peach}20`,
                      fontSize: 14,
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => e.target.style.borderColor = c.peach}
                    onBlur={(e) => e.target.style.borderColor = `${c.peach}20`}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={submitting}
                  style={{
                    backgroundColor: c.dark,
                    color: c.white,
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 40,
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    width: '100%',
                    transition: 'all 0.2s',
                    opacity: submitting ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) e.currentTarget.style.backgroundColor = c.charcoal
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) e.currentTarget.style.backgroundColor = c.dark
                  }}
                >
                  {submitting ? 'Saving...' : 'Save Record'}
                </button>
              </form>
            </div>
          )}

          {/* Content Area */}
          <div style={{ padding: '24px' }}>
            
            {/* ML Forecast Section - Shows forecast when data is sufficient */}
            {forecast && !forecast.message ? (
              <>
                {/* ML Forecast Header */}
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ color: c.dark, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>📈 ML Health Forecast</h3>
                  <p style={{ color: c.taupe, fontSize: 13 }}>30, 60 and 90 day weight predictions based on your historical data</p>
                </div>

                {/* Forecast Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: 24, 
                    backgroundColor: `${c.peach}05`, 
                    borderRadius: 20,
                    border: `1px solid ${c.peach}15`,
                  }}>
                    <div style={{ color: c.taupe, fontSize: 12, marginBottom: 8 }}>Current Weight</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: c.dark }}>{forecast.current_weight} kg</div>
                  </div>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: 24, 
                    backgroundColor: `${c.peach}05`, 
                    borderRadius: 20,
                    border: `1px solid ${c.peach}15`,
                  }}>
                    <div style={{ color: c.taupe, fontSize: 12, marginBottom: 8 }}>30 Day Forecast</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: c.peach }}>{forecast.forecast_30_days} kg</div>
                    <div style={{ fontSize: 12, color: getTrendColor(forecast.trend), marginTop: 4 }}>
                      {getTrendIcon(forecast.trend)} {forecast.weight_change_30 > 0 ? '+' : ''}{forecast.weight_change_30} kg
                    </div>
                  </div>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: 24, 
                    backgroundColor: `${c.peach}05`, 
                    borderRadius: 20,
                    border: `1px solid ${c.peach}15`,
                  }}>
                    <div style={{ color: c.taupe, fontSize: 12, marginBottom: 8 }}>60 Day Forecast</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: c.peach }}>{forecast.forecast_60_days} kg</div>
                    <div style={{ fontSize: 12, color: getTrendColor(forecast.trend), marginTop: 4 }}>
                      {getTrendIcon(forecast.trend)} {forecast.weight_change_60 > 0 ? '+' : ''}{forecast.weight_change_60} kg
                    </div>
                  </div>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: 24, 
                    backgroundColor: `${c.peach}05`, 
                    borderRadius: 20,
                    border: `1px solid ${c.peach}15`,
                  }}>
                    <div style={{ color: c.taupe, fontSize: 12, marginBottom: 8 }}>90 Day Forecast</div>
                    <div style={{ fontSize: 32, fontWeight: 800, color: c.peach }}>{forecast.forecast_90_days} kg</div>
                    <div style={{ fontSize: 12, color: getTrendColor(forecast.trend), marginTop: 4 }}>
                      {getTrendIcon(forecast.trend)} {forecast.weight_change_90 > 0 ? '+' : ''}{forecast.weight_change_90} kg
                    </div>
                  </div>
                </div>

                {/* Forecast Chart */}
                {forecastChartData.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <h3 style={{ color: c.dark, fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Weight Forecast Chart (30 Days)</h3>
                    <div style={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={forecastChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={`${c.peach}20`} />
                          <XAxis dataKey="day" stroke={c.taupe} fontSize={11} />
                          <YAxis stroke={c.taupe} fontSize={11} domain={['auto', 'auto']} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: c.white, 
                              border: `1px solid ${c.peach}20`,
                              borderRadius: 12,
                              fontSize: 12,
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="weight" 
                            stroke={c.peach} 
                            strokeWidth={2.5}
                            dot={{ fill: c.dark, strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Trend Advice */}
                <div style={{ 
                  marginBottom: 32, 
                  padding: 16, 
                  backgroundColor: `${c.peach}05`, 
                  borderRadius: 16,
                  border: `1px solid ${c.peach}15`,
                }}>
                  <p style={{ color: c.taupe, fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                    <strong style={{ color: c.dark }}>Trend Analysis:</strong> {forecast.trend_advice}
                  </p>
                  <p style={{ color: c.taupe, fontSize: 12, marginTop: 12, marginBottom: 0 }}>
                    Confidence Level: {forecast.confidence_level}% • Based on {forecast.data_points} data points
                  </p>
                </div>

                {/* Risk Assessment */}
                {forecast.risks && forecast.risks.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <h3 style={{ color: c.dark, fontWeight: 600, fontSize: 16, marginBottom: 16 }}>⚠️ Risk Assessment</h3>
                    <div style={{ 
                      backgroundColor: `${c.peach}05`, 
                      borderRadius: 16, 
                      padding: 20,
                      border: `1px solid ${c.peach}15`,
                    }}>
                      {forecast.risks.map((risk, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: i < forecast.risks.length - 1 ? 12 : 0 }}>
                          <div>
                            <div style={{ fontWeight: 600, color: c.dark, marginBottom: 4 }}>{risk.type}</div>
                            <div style={{ fontSize: 13, color: c.taupe }}>{risk.message}</div>
                          </div>
                          <div style={{ 
                            padding: '4px 12px', 
                            borderRadius: 20, 
                            fontSize: 11, 
                            fontWeight: 600,
                            backgroundColor: risk.severity === 'High' ? '#dc2626' : risk.severity === 'Medium' ? '#f59e0b' : '#16a34a',
                            color: 'white'
                          }}>
                            {risk.severity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Insufficient Data Message - For Test UT-39 */
              <div style={{ 
                marginBottom: 32, 
                padding: 32, 
                backgroundColor: `${c.peach}05`, 
                    borderRadius: 20,
                textAlign: 'center',
                border: `1px solid ${c.peach}15`,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <h3 style={{ color: c.dark, fontSize: 18, fontWeight: 700, marginBottom: 12 }}>Insufficient Data for ML Forecast</h3>
                <p style={{ color: c.taupe, fontSize: 14, marginBottom: 8 }}>
                  Not enough data to predict. Please log at least 7 health records.
                </p>
                <p style={{ color: c.taupe, fontSize: 12 }}>
                  Current records: {records.length} / 7 needed
                </p>
                <button 
                  onClick={() => setShowForm(true)} 
                  style={{
                    marginTop: 20,
                    backgroundColor: c.dark,
                    color: c.white,
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: 40,
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.charcoal}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.dark}
                >
                  + Add Health Record
                </button>
              </div>
            )}

            {/* Health Score Section - Only show when prediction exists */}
            {prediction ? (
              <>
                {/* Health Score Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '24px', 
                    backgroundColor: `${c.peach}05`, 
                    borderRadius: 20,
                    border: `1px solid ${c.peach}15`,
                  }}>
                    <div style={{ 
                      fontSize: 48, 
                      fontWeight: 800, 
                      color: getHealthScoreColor(prediction.health_score),
                      marginBottom: 8,
                    }}>
                      {prediction.health_score}
                    </div>
                    <div style={{ color: c.taupe, fontSize: 12, marginBottom: 4 }}>Health Score</div>
                    <div style={{ 
                      fontSize: 13, 
                      fontWeight: 600, 
                      color: getHealthScoreColor(prediction.health_score),
                      marginTop: 8,
                    }}>
                      {getHealthScoreLabel(prediction.health_score)}
                    </div>
                  </div>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '24px', 
                    backgroundColor: `${c.peach}05`, 
                    borderRadius: 20,
                    border: `1px solid ${c.peach}15`,
                  }}>
                    <div style={{ 
                      fontSize: 24, 
                      fontWeight: 700, 
                      color: c.dark,
                      marginBottom: 8,
                      textTransform: 'capitalize',
                    }}>
                      {prediction.bmi_category || 'Unknown'}
                    </div>
                    <div style={{ color: c.taupe, fontSize: 12 }}>BMI Category</div>
                    {prediction.latest_bmi && (
                      <div style={{ fontSize: 13, color: c.taupe, marginTop: 8 }}>
                        BMI: {prediction.latest_bmi}
                      </div>
                    )}
                  </div>
                </div>

                {/* Weight Trend Chart */}
                {chartData.length > 0 && (
                  <div style={{ marginBottom: 32 }}>
                    <h3 style={{ color: c.dark, fontWeight: 600, fontSize: 16, marginBottom: 16 }}>Weight Trend (Last 7 Records)</h3>
                    <div style={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={`${c.peach}20`} />
                          <XAxis dataKey="date" stroke={c.taupe} fontSize={11} />
                          <YAxis stroke={c.taupe} fontSize={11} />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: c.white, 
                              border: `1px solid ${c.peach}20`,
                              borderRadius: 12,
                              fontSize: 12,
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="weight" 
                            stroke={c.peach} 
                            strokeWidth={2.5}
                            dot={{ fill: c.dark, strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Trends Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
                  <div style={{ padding: '16px', backgroundColor: `${c.peach}05`, borderRadius: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: c.dark, textTransform: 'capitalize' }}>{prediction.weight_trend || 'Stable'}</div>
                    <div style={{ fontSize: 12, color: c.taupe }}>Weight Trend</div>
                  </div>
                  <div style={{ padding: '16px', backgroundColor: `${c.peach}05`, borderRadius: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: c.dark, textTransform: 'capitalize' }}>{prediction.bmi_trend || 'Stable'}</div>
                    <div style={{ fontSize: 12, color: c.taupe }}>BMI Trend</div>
                  </div>
                </div>

                {/* AI Recommendations */}
                {prediction.recommendations && prediction.recommendations.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ color: c.dark, fontWeight: 600, fontSize: 16, marginBottom: 16 }}>AI Recommendations</h3>
                    <div style={{ 
                      backgroundColor: `${c.peach}05`, 
                      borderRadius: 16, 
                      padding: 20,
                      border: `1px solid ${c.peach}15`,
                    }}>
                      {prediction.recommendations.map((rec, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: i < prediction.recommendations.length - 1 ? 12 : 0 }}>
                          <div style={{
                            width: 5,
                            height: 5,
                            borderRadius: '50%',
                            backgroundColor: c.peach,
                            marginTop: 8,
                            flexShrink: 0,
                          }} />
                          <p style={{ color: c.taupe, fontSize: 14, lineHeight: 1.5, margin: 0 }}>{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* View Report Button */}
                <button 
                  onClick={() => navigate('/health-report')} 
                  style={{
                    width: '100%',
                    backgroundColor: c.dark,
                    color: c.white,
                    border: 'none',
                    padding: '14px 20px',
                    borderRadius: 40,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.charcoal}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.dark}
                >
                  View Full Health Report →
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ 
                  width: 80, 
                  height: 80, 
                  backgroundColor: `${c.peach}10`, 
                  borderRadius: 40, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 20px' 
                }}>
                  <span style={{ fontSize: 36 }}>📊</span>
                </div>
                <h2 style={{ color: c.dark, fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No Health Data Yet</h2>
                <p style={{ color: c.taupe, fontSize: 14, marginBottom: 24, maxWidth: 350, margin: '0 auto 24px' }}>
                  Log at least 2 health records to get AI-powered health predictions and insights
                </p>
                <button 
                  onClick={() => setShowForm(true)} 
                  style={{
                    backgroundColor: c.dark,
                    color: c.white,
                    border: 'none',
                    padding: '12px 28px',
                    borderRadius: 40,
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.charcoal}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.dark}
                >
                  Log First Record
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthPredictionPage