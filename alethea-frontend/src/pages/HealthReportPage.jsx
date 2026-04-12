import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const HealthReportPage = () => {
  const navigate = useNavigate()
  const [report, setReport] = useState(null)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    try {
      const response = await api.get('/health/report')
      if (response.data.report) setReport(response.data.report)
    } catch (error) {
      console.error('Failed to fetch report:', error)
    }
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">No health records found</p>
          <button onClick={() => navigate('/health-prediction')} className="mt-4 btn-primary">Log Health Records</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white p-6">
            <button onClick={() => navigate('/health-prediction')} className="mb-4 text-white hover:text-gray-200">← Back</button>
            <h1 className="text-2xl font-bold">Health Report</h1>
            <p className="text-indigo-100 mt-1">Complete health history</p>
          </div>

          <div className="p-6">
            <div className="mb-8 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold mb-2">Profile Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Name:</span> {report.user?.name}</div>
                <div><span className="text-gray-500">Age:</span> {report.user?.age}</div>
                <div><span className="text-gray-500">Gender:</span> {report.user?.gender}</div>
                <div><span className="text-gray-500">Goal:</span> {report.user?.goal}</div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-3">Weight History</h3>
              <div className="space-y-2">
                {report.weight_history?.slice(-10).map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{item.date}</span>
                    <span className="font-medium">{item.value} kg</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold mb-3">Health Metrics</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">Date</th>
                      <th className="p-2 text-left">Weight</th>
                      <th className="p-2 text-left">BMI</th>
                      <th className="p-2 text-left">Blood Sugar</th>
                      <th className="p-2 text-left">Cholesterol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.weight_history?.slice(-20).map((item, i) => (
                      <tr key={i} className="border-b">
                        <td className="p-2">{item.date}</td>
                        <td className="p-2">{item.value} kg</td>
                        <td className="p-2">{report.bmi_history?.[i]?.value || '-'}</td>
                        <td className="p-2">{report.sugar_history?.[i]?.value || '-'}</td>
                        <td className="p-2">{report.cholesterol_history?.[i]?.value || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="text-center text-gray-400 text-sm">
              Total Records: {report.total_records}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthReportPage