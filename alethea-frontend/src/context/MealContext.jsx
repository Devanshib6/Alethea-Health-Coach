import { createContext, useContext, useState, useEffect } from 'react'
import API from '../services/authService'

const MealContext = createContext()

export const MealProvider = ({ children }) => {
    const [meals, setMeals] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchMeals = async () => {
        setLoading(true)
        try {
            const response = await API.get('/meals/')
            setMeals(response.data)
        } catch (err) {
            console.error('Error fetching meals:', err)
        } finally {
            setLoading(false)
        }
    }

    const addMeal = (meal) => {
        setMeals([meal, ...meals])
    }

    const removeMeal = (mealId) => {
        setMeals(meals.filter(m => m.id !== mealId))
    }

    return (
        <MealContext.Provider value={{ meals, loading, fetchMeals, addMeal, removeMeal }}>
            {children}
        </MealContext.Provider>
    )
}

export const useMeals = () => useContext(MealContext)