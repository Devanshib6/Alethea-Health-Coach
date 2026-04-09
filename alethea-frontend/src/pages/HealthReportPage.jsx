import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const HealthReportPage = () => {
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    try {
      const response = await API.get('/health/report')
      if (response.data.report) {
        setReport(response.data.report)
      }
    } catch (err) {
      console.error('Error fetching report:', err)
    } finally {
      setLoading(false)
    }
  }

  const SimpleChart = ({ data, label, color }) => {
    if (!data || data.length === 0) return (
      <p style={{ color: c.taupe, fontSize: 13, textAlign: 'center', padding: 20 }}>No data available</p>
    )

    const values = data.map(d => d.value).filter(Boolean)
    const max = Math.max(...values)
    const min = Math.min(...values)

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, marginBottom: 8 }}>
          {data.slice(-10).map((item, i) => {
            const height = max === min ? 50 : ((item.value - min) / (max - min)) * 80 + 20
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', height: `${height}px`, backgroundColor: color, borderRadius: '4px 4px 0 0', transition: 'height 0.3s' }} title={`${item.value}`} />
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: c.taupe }}>
          <span>{data[Math.max(0, data.length - 10)]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.white }}>
        <p style={{ color: c.taupe }}>Loading health report...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>

      {/* header */}
      <div style={{ backgroundColor: c.dark, padding: '20px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <button onClick={() => navigate('/health-prediction')}
            style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 14, marginBottom: 12 }}>
            ← Back to Health Prediction
          </button>
          <h1 style={{ color: c.white, fontSize: 28, fontWeight: 800, margin: 0 }}>Health Report</h1>
          <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>Complete overview of your health history</p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>

        {!report ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>📋</div>
            <h2 style={{ color: c.dark, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>No Report Available</h2>
            <p style={{ color: c.taupe, fontSize: 15, marginBottom: 32 }}>Start logging health records to generate your report.</p>
            <button onClick={() => navigate('/health-prediction')}
              style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '14px 36px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Log Health Records →
            </button>
          </div>
        ) : (
          <>
            {/* user summary */}
            <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24, marginBottom: 32, display: 'flex', gap: 32, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: c.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: c.peach, fontSize: 24, fontWeight: 900 }}>
                  {report.user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ color: c.dark, fontWeight: 800, fontSize: 20, margin: 0 }}>{report.user?.name}</h2>
                <p style={{ color: c.taupe, fontSize: 13, marginTop: 4 }}>
                  {report.user?.age && `Age: ${report.user.age}`}
                  {report.user?.gender && ` • Gender: ${report.user.gender}`}
                  {report.user?.goal && ` • Goal: ${report.user.goal}`}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Total Records</p>
                <p style={{ color: c.dark, fontSize: 36, fontWeight: 900 }}>{report.total_records}</p>
              </div>
            </div>

            {/* charts grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 32 }}>
              {[
                { title: 'Weight History', data: report.weight_history, unit: 'kg', color: c.dark },
                { title: 'BMI History', data: report.bmi_history, unit: 'bmi', color: c.taupe },
                { title: 'Blood Sugar History', data: report.sugar_history, unit: 'mg/dL', color: c.peach },
                { title: 'Cholesterol History', data: report.cholesterol_history, unit: 'mg/dL', color: '#b45309' },
              ].map((chart, i) => (
                <div key={i} style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 style={{ color: c.dark, fontWeight: 700, fontSize: 15, margin: 0 }}>{chart.title}</h3>
                    <span style={{ color: c.taupe, fontSize: 12 }}>{chart.unit}</span>
                  </div>
                  <SimpleChart data={chart.data} color={chart.color} />
                  {chart.data && chart.data.length > 0 && (
                    <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ color: c.taupe, fontSize: 11 }}>Latest</p>
                        <p style={{ color: c.dark, fontWeight: 700 }}>{chart.data[chart.data.length - 1]?.value} {chart.unit}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ color: c.taupe, fontSize: 11 }}>Records</p>
                        <p style={{ color: c.dark, fontWeight: 700 }}>{chart.data.length}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* history table */}
            <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ padding: '16px 24px', borderBottom: `1px solid ${c.peach}` }}>
                <h3 style={{ color: c.dark, fontWeight: 800, margin: 0 }}>Full History</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ backgroundColor: `${c.peach}15` }}>
                      {['Date', 'Weight (kg)', 'BMI', 'Blood Sugar', 'Cholesterol'].map((h, i) => (
                        <th key={i} style={{ padding: '12px 16px', color: c.taupe, textAlign: 'left', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontSize: 11 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {report.weight_history.map((item, i) => (
                      <tr key={i} style={{ borderTop: `1px solid ${c.peach}20` }}>
                        <td style={{ padding: '12px 16px', color: c.taupe }}>{item.date}</td>
                        <td style={{ padding: '12px 16px', color: c.dark, fontWeight: 600 }}>{item.value || '-'}</td>
                        <td style={{ padding: '12px 16px', color: c.dark }}>{report.bmi_history[i]?.value || '-'}</td>
                        <td style={{ padding: '12px 16px', color: c.dark }}>{report.sugar_history[i]?.value || '-'}</td>
                        <td style={{ padding: '12px 16px', color: c.dark }}>{report.cholesterol_history[i]?.value || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default HealthReportPage