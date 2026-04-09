import API from './api'

export const addHealthRecord = async (data) => {
    const response = await API.post('/health/record', data)
    return response.data
}

export const getHealthRecords = async () => {
    const response = await API.get('/health/records')
    return response.data
}

export const getHealthPrediction = async () => {
    const response = await API.get('/health/predict')
    return response.data
}

export const getHealthReport = async () => {
    const response = await API.get('/health/report')
    return response.data
}