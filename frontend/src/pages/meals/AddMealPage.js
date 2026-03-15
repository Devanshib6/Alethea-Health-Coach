import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';

const AddMealPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  const [formData, setFormData] = useState({
    meal_type: 'breakfast',
    meal_name: '',
    total_calories: '',
    total_protein: '',
    total_carbs: '',
    total_fat: '',
    notes: ''
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    const timer = setTimeout(() => {
      doSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]); // eslint-disable-line

  const doSearch = async (query) => {
    setSearching(true);
    try {
      const res = await api.get(`/api/v1/diet/search?query=${query}`);
      setSearchResults(res.data);
      setShowResults(true);
    } catch (error) {
      console.log('Search failed');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleFoodSelect = (food) => {
    setFormData({
      ...formData,
      meal_name: food.name,
      total_calories: food.calories,
      total_protein: food.protein,
      total_carbs: food.carbs || food.carbohydrates || 0,
      total_fat: food.fat
    });
    setSearchQuery(food.name);
    setShowResults(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMealTypeChange = (type) => {
    setFormData({
      ...formData,
      meal_type: type,
      meal_name: '',
      total_calories: '',
      total_protein: '',
      total_carbs: '',
      total_fat: ''
    });
    setSearchQuery('');
    setSearchResults([]);
    setShowResults(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.meal_name) {
      toast.error('Please select a food from search!');
      return;
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6">

          <div className="text-center mb-6">
            <span className="text-4xl">🍛</span>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">Log a Meal</h1>
            <p className="text-gray-500 mt-1">Search from 256 Nepali & Indian foods</p>
          </div>

          {/* Meal Type Selector */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {['breakfast', 'lunch', 'dinner', 'snack'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handleMealTypeChange(type)}
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

          {/* Veg/Non-Veg Info Banner */}
          <div className="mb-4 flex items-center gap-3 text-sm text-gray-500">
            <span>🟢 Vegetarian</span>
            <span>🔴 Non-Vegetarian</span>
            <span className="ml-auto text-xs text-gray-400">
              Based on your profile preferences
            </span>
          </div>

          {/* Search Box */}
          <div className="mb-6" ref={searchRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔍 Search Food
              </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type to search... e.g. Dal, Momo, Chicken, Samosa"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {searching && (
                <span className="absolute right-3 top-3 text-gray-400 text-sm">
                  Searching...
                </span>
              )}

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {searchResults.map((food, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleFoodSelect(food)}
                      className="w-full text-left px-4 py-3 hover:bg-green-50 border-b border-gray-100 transition"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs">
                              {food.is_vegetarian ? '🟢' : '🔴'}
                            </span>
                            <p className="font-medium text-gray-800">{food.name}</p>
                          </div>
                          <p className="text-xs text-gray-500 capitalize ml-5">
                            {food.cuisine_type} • {food.category} • {food.serving_size} {food.serving_unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-orange-500 font-bold text-sm">
                            {food.calories} kcal
                          </p>
                          <p className="text-xs text-gray-400">
                            P:{food.protein}g C:{food.carbs}g F:{food.fat}g
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No results */}
              {showResults && searchResults.length === 0 && searchQuery.length >= 2 && !searching && (
                <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 p-4 text-center">
                  <p className="text-gray-500 text-sm">No foods found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Selected Food Preview */}
          {formData.meal_name && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-green-800">✅ {formData.meal_name}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {formData.total_calories} kcal •
                    P: {formData.total_protein}g •
                    C: {formData.total_carbs}g •
                    F: {formData.total_fat}g
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      meal_name: '',
                      total_calories: '',
                      total_protein: '',
                      total_carbs: '',
                      total_fat: ''
                    });
                    setSearchQuery('');
                  }}
                  className="text-gray-400 hover:text-red-500 transition text-lg"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calories (kcal)
                </label>
                <input
                  type="number"
                  name="total_calories"
                  value={formData.total_calories}
                  onChange={handleChange}
                  placeholder="Auto-filled"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Protein (g)
                </label>
                <input
                  type="number"
                  name="total_protein"
                  value={formData.total_protein}
                  onChange={handleChange}
                  placeholder="Auto-filled"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carbs (g)
                </label>
                <input
                  type="number"
                  name="total_carbs"
                  value={formData.total_carbs}
                  onChange={handleChange}
                  placeholder="Auto-filled"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fat (g)
                </label>
                <input
                  type="number"
                  name="total_fat"
                  value={formData.total_fat}
                  onChange={handleChange}
                  placeholder="Auto-filled"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optional)
              </label>
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