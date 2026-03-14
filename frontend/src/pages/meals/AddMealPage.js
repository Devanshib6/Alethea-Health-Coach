import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';

const nepaliIndianFoods = {
  breakfast: [
    { name: 'Dal Bhat', calories: 450, protein: 18, carbs: 75, fat: 8 },
    { name: 'Roti with Sabji', calories: 320, protein: 10, carbs: 55, fat: 7 },
    { name: 'Poha', calories: 250, protein: 6, carbs: 45, fat: 5 },
    { name: 'Idli Sambar', calories: 280, protein: 9, carbs: 50, fat: 4 },
    { name: 'Aloo Paratha', calories: 380, protein: 8, carbs: 60, fat: 12 },
    { name: 'Chiura with Milk', calories: 300, protein: 8, carbs: 55, fat: 5 },
    { name: 'Upma', calories: 220, protein: 6, carbs: 38, fat: 6 },
    { name: 'Bread Omelette', calories: 350, protein: 16, carbs: 30, fat: 15 },
  ],
  lunch: [
    { name: 'Dal Bhat Tarkari', calories: 550, protein: 22, carbs: 85, fat: 10 },
    { name: 'Chicken Curry with Rice', calories: 620, protein: 35, carbs: 70, fat: 18 },
    { name: 'Mutton Curry with Rice', calories: 680, protein: 38, carbs: 68, fat: 22 },
    { name: 'Paneer Butter Masala with Roti', calories: 580, protein: 20, carbs: 65, fat: 22 },
    { name: 'Rajma Chawal', calories: 500, protein: 20, carbs: 80, fat: 8 },
    { name: 'Chole Bhature', calories: 650, protein: 18, carbs: 90, fat: 20 },
    { name: 'Thakali Khana Set', calories: 600, protein: 25, carbs: 88, fat: 12 },
    { name: 'Momo (8 pcs)', calories: 320, protein: 18, carbs: 40, fat: 10 },
  ],
  dinner: [
    { name: 'Dal Bhat', calories: 450, protein: 18, carbs: 75, fat: 8 },
    { name: 'Khichdi', calories: 380, protein: 14, carbs: 65, fat: 8 },
    { name: 'Roti with Dal', calories: 350, protein: 14, carbs: 58, fat: 7 },
    { name: 'Vegetable Soup with Bread', calories: 280, protein: 8, carbs: 45, fat: 6 },
    { name: 'Egg Curry with Rice', calories: 520, protein: 28, carbs: 65, fat: 16 },
    { name: 'Fish Curry with Rice', calories: 580, protein: 32, carbs: 68, fat: 18 },
    { name: 'Palak Paneer with Roti', calories: 480, protein: 18, carbs: 55, fat: 20 },
    { name: 'Biryani', calories: 650, protein: 28, carbs: 88, fat: 20 },
  ],
  snack: [
    { name: 'Samosa (2 pcs)', calories: 280, protein: 6, carbs: 35, fat: 14 },
    { name: 'Pakoda', calories: 250, protein: 5, carbs: 30, fat: 13 },
    { name: 'Fruits (Mixed)', calories: 120, protein: 2, carbs: 28, fat: 1 },
    { name: 'Chana Chaat', calories: 200, protein: 10, carbs: 30, fat: 5 },
    { name: 'Dahi (Curd)', calories: 150, protein: 8, carbs: 12, fat: 6 },
    { name: 'Lassi', calories: 220, protein: 8, carbs: 30, fat: 7 },
    { name: 'Masala Chai with Biscuits', calories: 180, protein: 4, carbs: 28, fat: 6 },
    { name: 'Banana', calories: 90, protein: 1, carbs: 22, fat: 0 },
  ]
};

const AddMealPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    meal_type: 'breakfast',
    meal_name: '',
    total_calories: '',
    total_protein: '',
    total_carbs: '',
    total_fat: '',
    notes: ''
  });

  const handleFoodSelect = (food) => {
    setFormData({
      ...formData,
      meal_name: food.name,
      total_calories: food.calories,
      total_protein: food.protein,
      total_carbs: food.carbs,
      total_fat: food.fat
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/v1/meals/add', {
        meal_type: formData.meal_type,
        meal_name: formData.meal_name,
        total_calories: parseFloat(formData.total_calories) || 0,
        total_protein: parseFloat(formData.total_protein) || 0,
        total_carbs: parseFloat(formData.total_carbs) || 0,
        total_fat: parseFloat(formData.total_fat) || 0,
        notes: formData.notes
      });
      toast.success('Meal logged successfully! 🍛');
      setTimeout(() => navigate('/meals/history'), 1500);
    } catch (error) {
      toast.error('Failed to log meal');
    } finally {
      setLoading(false);
    }
  };

  const currentFoods = nepaliIndianFoods[formData.meal_type] || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* ✅ New Navbar */}
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="text-center mb-6">
            <span className="text-4xl">🍛</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">Log a Meal</h1>
            <p className="text-gray-500 mt-1">Track what you eat today</p>
          </div>

          {/* Meal Type Selector */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, meal_type: type })}
                className={`py-2 rounded-lg text-sm font-medium capitalize transition ${
                  formData.meal_type === type
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type === 'breakfast' ? '🌅' : type === 'lunch' ? '☀️' : type === 'dinner' ? '🌙' : '🍎'} {type}
              </button>
            ))}
          </div>

          {/* Quick Select Foods */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Quick Select — Common {formData.meal_type} foods:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {currentFoods.map((food, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleFoodSelect(food)}
                  className={`text-left p-3 rounded-lg border text-sm transition ${
                    formData.meal_name === food.name
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <p className="font-medium text-gray-800">{food.name}</p>
                  <p className="text-gray-500 text-xs">{food.calories} kcal</p>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
              <input
                type="text"
                name="meal_name"
                value={formData.meal_name}
                onChange={handleChange}
                required
                placeholder="e.g. Dal Bhat, Momo, Roti Sabji"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  name="total_calories"
                  value={formData.total_calories}
                  onChange={handleChange}
                  required
                  placeholder="450"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                <input
                  type="number"
                  name="total_protein"
                  value={formData.total_protein}
                  onChange={handleChange}
                  placeholder="18"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  name="total_carbs"
                  value={formData.total_carbs}
                  onChange={handleChange}
                  placeholder="75"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                <input
                  type="number"
                  name="total_fat"
                  value={formData.total_fat}
                  onChange={handleChange}
                  placeholder="8"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
              <input
                type="text"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="e.g. Home cooked, Restaurant"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="w-1/3 border border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
              >
                {loading ? 'Saving...' : '🍛 Log Meal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMealPage;