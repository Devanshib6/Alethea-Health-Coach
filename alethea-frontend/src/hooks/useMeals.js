import { useState, useEffect } from 'react'
import { getMeals, logMeal, deleteMeal } from '../services/mealService'

const useMeals = () => {
    const [meals, setMeals] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchMeals()
    }, [])

    const fetchMeals = async () => {
        try {
            const data = await getMeals()
            setMeals(data)
        } catch (err) {
            setError('Failed to load meals')
        } finally {
            setLoading(false)
        }
    }

    const addMeal = async (mealData) => {
        const newMeal = await logMeal(mealData)
        setMeals([newMeal, ...meals])
        return newMeal
    }

    const removeMeal = async (mealId) => {
        await deleteMeal(mealId)
        setMeals(meals.filter(m => m.id !== mealId))
    }

    return { meals, loading, error, addMeal, removeMeal, fetchMeals }
}

export default useMeals