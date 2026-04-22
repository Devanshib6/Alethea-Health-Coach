from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, meals, diet, health, admin, food_search, water, chat

api_router = APIRouter()

# Authentication routes
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])

# User profile routes
api_router.include_router(users.router, prefix="/users", tags=["Users"])

# Meal tracking routes
api_router.include_router(meals.router, prefix="/meals", tags=["Meals"])

# Diet plan routes
api_router.include_router(diet.router, prefix="/diet", tags=["Diet Plans"])

# Health records routes
api_router.include_router(health.router, prefix="/health", tags=["Health"])

# Admin panel routes
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])

# Food search routes
api_router.include_router(food_search.router, prefix="/food", tags=["Food Search"])

# Water tracking routes
api_router.include_router(water.router, prefix="/water", tags=["Water Intake"])

# AI Chatbot routes
api_router.include_router(chat.router, prefix="/chat", tags=["AI Chatbot"])