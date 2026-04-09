import { AuthProvider } from './context/AuthContext'
import { MealProvider } from './context/MealContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'

const App = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <MealProvider>
                    <AppRoutes />
                </MealProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App