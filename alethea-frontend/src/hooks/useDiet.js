import { useState, useEffect } from 'react'
import { getDietPlan, getWeeklyPlan } from '../services/dietService'

const useDiet = () => {
    const [plan, setPlan] = useState(null)
    const [weeklyPlan, setWeeklyPlan] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPlans()
    }, [])

    const fetchPlans = async () => {
        try {
            const [planData, weeklyData] = await Promise.all([
                getDietPlan(),
                getWeeklyPlan()
            ])
            if (planData.plan_data) setPlan(planData.plan_data)
            if (weeklyData.weekly_plan) setWeeklyPlan(weeklyData.weekly_plan)
        } catch (err) {
            console.error('Diet fetch error:', err)
        } finally {
            setLoading(false)
        }
    }

    return { plan, weeklyPlan, loading, fetchPlans }
}

export default useDiet