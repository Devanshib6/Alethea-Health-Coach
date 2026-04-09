export const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const validatePassword = (password) => {
    return password && password.length >= 6
}

export const validateRequired = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== ''
}

export const validateNumber = (value, min = 0, max = 9999) => {
    const num = parseFloat(value)
    return !isNaN(num) && num >= min && num <= max
}