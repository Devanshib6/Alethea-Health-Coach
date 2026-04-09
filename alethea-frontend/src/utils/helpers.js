export const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    })
}

export const formatCalories = (cal) => {
    if (!cal) return '0 kcal'
    return `${Math.round(cal)} kcal`
}

export const calculateBMI = (weight, height) => {
    if (!weight || !height) return null
    const heightM = height / 100
    return (weight / (heightM * heightM)).toFixed(1)
}

export const getBMICategory = (bmi) => {
    if (!bmi) return 'unknown'
    if (bmi < 18.5) return 'underweight'
    if (bmi < 25) return 'normal'
    if (bmi < 30) return 'overweight'
    return 'obese'
}

export const capitalize = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1).replace('_', ' ')
}

export const truncate = (str, length = 30) => {
    if (!str) return ''
    return str.length > length ? str.substring(0, length) + '...' : str
}