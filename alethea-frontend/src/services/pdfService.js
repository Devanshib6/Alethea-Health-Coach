import jsPDF from 'jspdf'

// Add autoTable plugin manually
const loadAutoTable = () => {
    if (typeof window !== 'undefined' && !window.jspdf) {
        window.jspdf = { jsPDF: jsPDF }
    }
}

export const generateHealthReportPDF = (user, meals, healthScore, predictions) => {
    console.log('Generating PDF...')
    
    try {
        // Load autoTable
        loadAutoTable()
        
        // Create new PDF document
        const doc = new jsPDF()
        
        // ========== PAGE 1 ==========
        
        // Title
        doc.setFontSize(20)
        doc.setTextColor(26, 4, 5)
        doc.text('ALETHEA HEALTH REPORT', 105, 20, { align: 'center' })
        
        // Date
        doc.setFontSize(10)
        doc.setTextColor(122, 96, 88)
        doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, 40)
        doc.text(`Report Time: ${new Date().toLocaleTimeString()}`, 20, 48)
        
        // User Information Section
        doc.setFontSize(14)
        doc.setTextColor(26, 4, 5)
        doc.text('USER INFORMATION', 20, 70)
        
        doc.setFontSize(10)
        doc.setTextColor(122, 96, 88)
        
        const userInfo = [
            `Name: ${user?.full_name || 'N/A'}`,
            `Email: ${user?.email || 'N/A'}`,
            `Age: ${user?.age || 'N/A'} years`,
            `Gender: ${user?.gender || 'N/A'}`,
            `Height: ${user?.height || 'N/A'} cm`,
            `Weight: ${user?.weight || 'N/A'} kg`
        ]
        
        let yPos = 80
        for (let i = 0; i < userInfo.length; i++) {
            doc.text(userInfo[i], 25, yPos)
            yPos += 8
        }
        
        // Health Metrics
        yPos += 10
        doc.setFontSize(14)
        doc.setTextColor(26, 4, 5)
        doc.text('HEALTH METRICS', 20, yPos)
        yPos += 10
        
        doc.setFontSize(10)
        doc.setTextColor(122, 96, 88)
        
        // Calculate BMI
        let bmi = 'N/A'
        let bmiCategory = 'N/A'
        if (user?.weight && user?.height) {
            const heightM = user.height / 100
            bmi = (user.weight / (heightM * heightM)).toFixed(1)
            if (bmi < 18.5) bmiCategory = 'Underweight'
            else if (bmi < 25) bmiCategory = 'Normal'
            else if (bmi < 30) bmiCategory = 'Overweight'
            else bmiCategory = 'Obese'
        }
        
        const metrics = [
            `BMI: ${bmi} (${bmiCategory})`,
            `Goal: ${user?.goal || 'Not set'}`,
            `Diet Type: ${user?.diet_type || 'Not set'}`,
            `Activity Level: ${user?.activity_level || 'Not set'}`
        ]
        
        for (let i = 0; i < metrics.length; i++) {
            doc.text(metrics[i], 25, yPos)
            yPos += 8
        }
        
        // ========== PAGE 2 - Manual Table (no autoTable) ==========
        doc.addPage()
        
        doc.setFontSize(16)
        doc.setTextColor(26, 4, 5)
        doc.text('NUTRITION SUMMARY', 105, 20, { align: 'center' })
        
        // Calculate totals
        let totalCalories = 0
        let totalProtein = 0
        let totalCarbs = 0
        let totalFat = 0
        
        if (meals && meals.length > 0) {
            meals.forEach(meal => {
                totalCalories += meal.calories || 0
                totalProtein += meal.protein || 0
                totalCarbs += meal.carbs || 0
                totalFat += meal.fat || 0
            })
        }
        
        const mealCount = meals?.length || 1
        
        // Manual table
        let tableY = 40
        
        // Table Header
        doc.setFillColor(26, 4, 5)
        doc.rect(20, tableY, 170, 10, 'F')
        doc.setTextColor(212, 160, 144)
        doc.setFontSize(10)
        doc.text('Metric', 25, tableY + 7)
        doc.text('Total', 80, tableY + 7)
        doc.text('Daily Avg', 120, tableY + 7)
        doc.text('Unit', 160, tableY + 7)
        
        tableY += 10
        
        // Table Rows
        const rows = [
            ['Calories', Math.round(totalCalories), Math.round(totalCalories / mealCount), 'kcal'],
            ['Protein', Math.round(totalProtein), Math.round(totalProtein / mealCount), 'g'],
            ['Carbs', Math.round(totalCarbs), Math.round(totalCarbs / mealCount), 'g'],
            ['Fat', Math.round(totalFat), Math.round(totalFat / mealCount), 'g'],
        ]
        
        for (let i = 0; i < rows.length; i++) {
            // Alternating row colors
            if (i % 2 === 0) {
                doc.setFillColor(245, 235, 230)
                doc.rect(20, tableY, 170, 8, 'F')
            }
            doc.setTextColor(26, 4, 5)
            doc.text(rows[i][0], 25, tableY + 6)
            doc.text(rows[i][1].toString(), 80, tableY + 6)
            doc.text(rows[i][2].toString(), 120, tableY + 6)
            doc.text(rows[i][3], 160, tableY + 6)
            tableY += 8
        }
        
        // ========== PAGE 3 ==========
        doc.addPage()
        
        doc.setFontSize(16)
        doc.setTextColor(26, 4, 5)
        doc.text('HEALTH ANALYSIS', 105, 20, { align: 'center' })
        
        // Health Score
        let healthScoreValue = healthScore?.health_score || 75
        let scoreColor = healthScoreValue >= 80 ? [34, 197, 94] : healthScoreValue >= 60 ? [245, 158, 11] : [239, 68, 68]
        
        doc.setFillColor(245, 235, 230)
        doc.rect(20, 40, 170, 50, 'F')
        
        doc.setFontSize(12)
        doc.setTextColor(26, 4, 5)
        doc.text('AI HEALTH SCORE', 25, 55)
        
        doc.setFontSize(24)
        doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2])
        doc.text(`${healthScoreValue} / 100`, 25, 75)
        
        let scoreCategory = healthScoreValue >= 80 ? 'Excellent' : healthScoreValue >= 60 ? 'Good' : 'Needs Attention'
        doc.setFontSize(10)
        doc.setTextColor(122, 96, 88)
        doc.text(`Status: ${scoreCategory}`, 25, 88)
        
        // Recommendations
        let yRec = 110
        
        doc.setFontSize(12)
        doc.setTextColor(26, 4, 5)
        doc.text('RECOMMENDATIONS', 20, yRec)
        yRec += 10
        
        doc.setFontSize(10)
        doc.setTextColor(122, 96, 88)
        
        const recommendations = [
            '• Drink at least 2.5L of water daily',
            '• Include protein in every meal',
            '• Eat 5 servings of fruits and vegetables daily',
            '• Log your meals consistently for accurate insights',
            '• Get 7-9 hours of quality sleep'
        ]
        
        for (let i = 0; i < recommendations.length; i++) {
            doc.text(recommendations[i], 25, yRec + (i * 7))
        }
        
        // ========== PAGE 4 - Manual Meal Logs Table ==========
        doc.addPage()
        
        doc.setFontSize(16)
        doc.setTextColor(26, 4, 5)
        doc.text('RECENT MEAL LOGS', 105, 20, { align: 'center' })
        
        if (meals && meals.length > 0) {
            let tableY2 = 40
            
            // Table Header
            doc.setFillColor(26, 4, 5)
            doc.rect(20, tableY2, 170, 10, 'F')
            doc.setTextColor(212, 160, 144)
            doc.setFontSize(8)
            doc.text('Date', 25, tableY2 + 7)
            doc.text('Food', 60, tableY2 + 7)
            doc.text('Cal', 100, tableY2 + 7)
            doc.text('Pro', 120, tableY2 + 7)
            doc.text('Carbs', 140, tableY2 + 7)
            doc.text('Fat', 160, tableY2 + 7)
            
            tableY2 += 10
            
            const limitedMeals = meals.slice(0, 12)
            for (let i = 0; i < limitedMeals.length; i++) {
                const meal = limitedMeals[i]
                if (tableY2 > 270) {
                    doc.addPage()
                    tableY2 = 20
                    
                    // Repeat header on new page
                    doc.setFillColor(26, 4, 5)
                    doc.rect(20, tableY2, 170, 10, 'F')
                    doc.setTextColor(212, 160, 144)
                    doc.text('Date', 25, tableY2 + 7)
                    doc.text('Food', 60, tableY2 + 7)
                    doc.text('Cal', 100, tableY2 + 7)
                    doc.text('Pro', 120, tableY2 + 7)
                    doc.text('Carbs', 140, tableY2 + 7)
                    doc.text('Fat', 160, tableY2 + 7)
                    tableY2 += 10
                }
                
                // Alternating row colors
                if (i % 2 === 0) {
                    doc.setFillColor(245, 235, 230)
                    doc.rect(20, tableY2, 170, 8, 'F')
                }
                
                doc.setTextColor(26, 4, 5)
                doc.setFontSize(8)
                doc.text(new Date(meal.created_at).toLocaleDateString(), 25, tableY2 + 6)
                const foodName = (meal.food_name || '').substring(0, 25)
                doc.text(foodName, 60, tableY2 + 6)
                doc.text(Math.round(meal.calories || 0).toString(), 100, tableY2 + 6)
                doc.text((meal.protein || 0).toString(), 120, tableY2 + 6)
                doc.text((meal.carbs || 0).toString(), 140, tableY2 + 6)
                doc.text((meal.fat || 0).toString(), 160, tableY2 + 6)
                
                tableY2 += 8
            }
        } else {
            doc.setFontSize(11)
            doc.setTextColor(122, 96, 88)
            doc.text('No meal logs available for this period.', 20, 50)
        }
        
        // Footer on all pages
        const pageCount = doc.internal.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(8)
            doc.setTextColor(122, 96, 88)
            doc.text('Alethea Health Coach - AI-Powered Nutrition Platform', 20, 285)
            doc.text(`Page ${i} of ${pageCount}`, 180, 285)
            doc.setFontSize(7)
            doc.text('*This report is for informational purposes only. Not a substitute for medical advice.*', 105, 292, { align: 'center' })
        }
        
        // Download PDF
        const fileName = `Alethea_Health_Report_${user?.full_name || 'User'}_${new Date().toISOString().split('T')[0]}.pdf`
        doc.save(fileName)
        console.log('PDF downloaded successfully!')
        
    } catch (error) {
        console.error('Error generating PDF:', error)
        alert('Failed to generate PDF: ' + error.message)
    }
}