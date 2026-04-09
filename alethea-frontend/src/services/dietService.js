import API from './api'

export const getDietPlan = async () => {
    const response = await API.get('/diet/plan')
    return response.data
}

export const generateDietPlan = async () => {
    const response = await API.post('/diet/generate')
    return response.data
}

export const getWeeklyPlan = async () => {
    const response = await API.get('/diet/weekly')
    return response.data
}