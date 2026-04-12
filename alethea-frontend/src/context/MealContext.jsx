import { createContext, useContext, useState, useCallback } from 'react'
import api from '../services/api'

const MealContext = createContext()

export const MealProvider = ({ children }) => {
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchMeals = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get('/meals/')
      setMeals(response.data)
    } catch (error) {
      console.error('Failed to fetch meals:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const addMeal = (meal) => setMeals(prev => [meal, ...prev])
  const removeMeal = (id) => setMeals(prev => prev.filter(m => m.id !== id))

  return (
    <MealContext.Provider value={{ meals, loading, fetchMeals, addMeal, removeMeal }}>
      {children}
    </MealContext.Provider>
  )
}

export const useMeals = () => useContext(MealContext)