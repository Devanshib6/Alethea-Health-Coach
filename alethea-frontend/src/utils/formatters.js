export const formatNutrition = (value, unit = 'g') => {
    if (!value) return `-`
    return `${Math.round(value)}${unit}`
}

export const formatWeight = (weight) => {
    if (!weight) return '-'
    return `${weight} kg`
}

export const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString()
}

export const formatMealType = (type) => {
    const map = {
        breakfast: '🌅 Breakfast',
        lunch: '☀️ Lunch',
        dinner: '🌙 Dinner',
        snack: '🍎 Snack'
    }
    return map[type] || type
}

export const formatGoal = (goal) => {
    if (!goal) return '-'
    return goal.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}