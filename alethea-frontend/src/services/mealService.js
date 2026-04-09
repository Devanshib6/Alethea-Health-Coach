import API from './api'

export const logMeal = async (mealData) => {
    const response = await API.post('/meals/', mealData)
    return response.data
}

export const getMeals = async () => {
    const response = await API.get('/meals/')
    return response.data
}

export const deleteMeal = async (mealId) => {
    const response = await API.delete(`/meals/${mealId}`)
    return response.data
}

export const searchFood = async (query) => {
    const response = await API.get(`/food/search?query=${encodeURIComponent(query)}`)
    return response.data
}