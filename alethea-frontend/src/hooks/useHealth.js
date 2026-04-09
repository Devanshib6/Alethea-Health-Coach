import { useState, useEffect } from 'react'
import { getHealthRecords, getHealthPrediction } from '../services/healthService'

const useHealth = () => {
    const [records, setRecords] = useState([])
    const [prediction, setPrediction] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAll()
    }, [])

    const fetchAll = async () => {
        try {
            const [recordsData, predictionData] = await Promise.all([
                getHealthRecords(),
                getHealthPrediction()
            ])
            setRecords(recordsData)
            if (predictionData.prediction) {
                setPrediction(predictionData.prediction)
            }
        } catch (err) {
            console.error('Health fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    return { records, prediction, loading, fetchAll }
}

export default useHealth