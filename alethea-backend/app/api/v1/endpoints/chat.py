from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
import random

router = APIRouter()

# Pydantic models
class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str


@router.post("/chat")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """AI Chatbot endpoint - returns personalized responses"""
    
    message = request.message.lower()
    
    # Get user data for personalization
    user_name = current_user.full_name.split()[0]
    user_goal = current_user.goal or "maintain"
    user_diet = current_user.diet_type or "non-veg"
    user_weight = current_user.weight or 70
    user_height = current_user.height or 170
    user_age = current_user.age or 25
    user_gender = current_user.gender or "male"
    user_activity = current_user.activity_level or "moderate"
    
    # Calculate BMI
    height_m = user_height / 100
    bmi = round(user_weight / (height_m * height_m), 1)
    
    if bmi < 18.5:
        bmi_category = "underweight"
    elif bmi < 25:
        bmi_category = "normal"
    elif bmi < 30:
        bmi_category = "overweight"
    else:
        bmi_category = "obese"
    
    # Calculate BMR and TDEE
    if user_gender == "male":
        bmr = 10 * user_weight + 6.25 * user_height - 5 * user_age + 5
    else:
        bmr = 10 * user_weight + 6.25 * user_height - 5 * user_age - 161
    
    activity_multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }
    multiplier = activity_multipliers.get(user_activity, 1.55)
    tdee = int(bmr * multiplier)
    
    if user_goal in ["lose_weight", "lose weight"]:
        calorie_target = tdee - 500
        goal_text = "lose weight"
    elif user_goal in ["gain_muscle", "gain muscle"]:
        calorie_target = tdee + 300
        goal_text = "gain muscle"
    else:
        calorie_target = tdee
        goal_text = "maintain weight"
    
    # Diet type labels
    diet_labels = {
        "veg": "vegetarian",
        "eggitarian": "eggitarian",
        "non-veg": "non-vegetarian"
    }
    diet_text = diet_labels.get(user_diet, "balanced")
    
    # Response logic based on user question
    if "calorie" in message or "calories" in message:
        response = f"""Based on your profile {user_name}:

Your daily calorie target for {goal_text} is {calorie_target} calories.

This is calculated from:
- BMR: {int(bmr)} calories
- Activity level: {user_activity}
- TDEE: {tdee} calories

Recommended breakdown per meal:
- Breakfast: {int(calorie_target * 0.25)} calories
- Lunch: {int(calorie_target * 0.35)} calories
- Dinner: {int(calorie_target * 0.30)} calories
- Snacks: {int(calorie_target * 0.10)} calories

Would you like me to suggest some meal ideas?"""

    elif "protein" in message:
        if user_diet == "veg":
            response = f"""Here are high-protein vegetarian foods for you {user_name}:

1. Paneer - 18g protein per 100g
2. Lentils (Dal) - 9g protein per 100g cooked
3. Chickpeas (Chole) - 8g protein per 100g
4. Tofu - 8g protein per 100g
5. Greek Yogurt - 10g protein per 100g
6. Quinoa - 4g protein per 100g
7. Nuts and Seeds - 5-7g per handful

Aim for {int(calorie_target * 0.30 / 4)}g of protein daily for your {goal_text} goal."""
        
        elif user_diet == "eggitarian":
            response = f"""Here are high-protein eggitarian foods for you {user_name}:

1. Eggs - 6g protein per egg
2. Paneer - 18g protein per 100g
3. Greek Yogurt - 10g protein per 100g
4. Lentils - 9g protein per 100g
5. Cottage Cheese - 11g protein per 100g

Aim for {int(calorie_target * 0.30 / 4)}g of protein daily for your {goal_text} goal."""
        
        else:
            response = f"""Here are high-protein non-vegetarian foods for you {user_name}:

1. Chicken Breast - 31g protein per 100g
2. Eggs - 6g protein per egg
3. Fish (Salmon/Tuna) - 25g protein per 100g
4. Lean Beef - 26g protein per 100g
5. Greek Yogurt - 10g protein per 100g

Aim for {int(calorie_target * 0.30 / 4)}g of protein daily for your {goal_text} goal."""

    elif "weight loss" in message or "lose weight" in message:
        response = f"""To lose weight effectively {user_name}:

1. Calorie Deficit: Eat {calorie_target} calories daily ({tdee - calorie_target} calorie deficit)
2. Expected loss: 0.5 kg per week
3. Prioritize protein to feel full
4. Drink 2.5-3 liters of water daily
5. Exercise: 30-45 minutes, 5 days/week

Your current BMI is {bmi} ({bmi_category}). 
Would you like a sample meal plan?"""

    elif "bmi" in message:
        response = f"""Your BMI Calculation {user_name}:

Weight: {user_weight} kg
Height: {user_height} cm ({height_m} m)

BMI = {user_weight} ÷ ({height_m} × {height_m}) = {bmi}

Category: {bmi_category.upper()}

{bmi_category.upper()} Range:
- Underweight: Below 18.5
- Normal: 18.5 - 24.9
- Overweight: 25 - 29.9
- Obese: 30 and above

Your BMI is in the {bmi_category} range."""

    elif "water" in message:
        response = f"""Water intake recommendation for you {user_name}:

Daily goal: 2.5 - 3 liters (8-10 glasses)

Benefits of proper hydration:
- Boosts metabolism by 3-5%
- Reduces hunger cravings
- Improves digestion
- Helps with {goal_text}

Tip: Drink a glass of water before each meal!"""

    elif "workout" in message or "exercise" in message:
        response = f"""Workout recommendation for {user_name} (Activity: {user_activity}):

Weekly plan for {goal_text}:
- Cardio: 150 minutes (brisk walking, jogging, cycling)
- Strength training: 2-3 sessions per week
- Rest days: 1-2 days

Sample schedule:
- Monday/Wednesday/Friday: Strength training
- Tuesday/Thursday/Saturday: Cardio
- Sunday: Rest or light stretching

Would you like specific exercises?"""

    elif "meal plan" in message or "what should i eat" in message:
        response = f"""Sample meal plan for {goal_text} ({calorie_target} calories):

Breakfast ({int(calorie_target * 0.25)} cal):
- Oatmeal with banana or Poha

Lunch ({int(calorie_target * 0.35)} cal):
- Dal with rice and vegetables

Dinner ({int(calorie_target * 0.30)} cal):
- Grilled vegetables with roti or salad

Snacks ({int(calorie_target * 0.10)} cal):
- Fruits, nuts, or yogurt

Following a {diet_text} diet."""

    elif "hello" in message or "hi" in message:
        responses = [
            f"Hello {user_name}! How can I help with your health goals today?",
            f"Hi {user_name}! Ready to track your nutrition?",
            f"Hey {user_name}! What health question do you have?",
            f"Welcome back {user_name}! Ask me anything about diet and health."
        ]
        response = random.choice(responses)

    elif "thank" in message:
        responses = [
            f"You're welcome {user_name}! Stay healthy! 💪",
            f"Happy to help {user_name}! Any other questions?",
            f"My pleasure {user_name}! Keep up the great work! 🎉"
        ]
        response = random.choice(responses)

    else:
        response = f"""Thanks for your question {user_name}!

Based on your profile:
- Goal: {goal_text}
- Diet: {diet_text}
- Daily calories: {calorie_target} kcal
- BMI: {bmi} ({bmi_category})

You can ask me about:
- Calories needed per day
- High protein foods
- Weight loss tips
- BMI calculation
- Water intake
- Workout plans
- Meal plans

What would you like to know?"""

    return {"response": response}