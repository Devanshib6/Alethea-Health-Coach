from fastapi import APIRouter
from app.api.v1.endpoints import auth, users, meals, diet, health, admin, food_search

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(meals.router, prefix="/meals", tags=["Meals"])
api_router.include_router(diet.router, prefix="/diet", tags=["Diet"])
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin"])
api_router.include_router(food_search.router, prefix="/food", tags=["Food Search"])