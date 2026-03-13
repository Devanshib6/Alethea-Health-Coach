import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

const PreferencesPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    diet_type: '',
    allergies: [],
    preferred_cuisines: []
  });

  const allergyOptions = [
    'Gluten', 'Dairy', 'Nuts', 'Eggs',
    'Soy', 'Seafood', 'Mustard', 'None'
  ];

  const cuisineOptions = [
    'Nepali', 'Indian', 'Newari',
    'Thakali', 'Tibetan', 'Mughlai',
    'South Indian', 'Punjabi', 'Bengali',
    'Chinese', 'Continental'
  ];

  const toggleItem = (field, item) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/v1/profile/preferences', {
        diet_type: formData.diet_type,
        allergies: formData.allergies,
        preferred_cuisines: formData.preferred_cuisines
      });
      toast.success('Setup complete! Welcome to Alethea 🎉');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <Toaster position="top-right" />
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step 3 of 3</span>
            <span>Preferences</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full w-full"></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <span className="text-4xl">🍛</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">Dietary Preferences</h1>
          <p className="text-gray-500 mt-1">Help us personalize your meal plans</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diet Type</label>
            <select
              value={formData.diet_type}
              onChange={(e) => setFormData({...formData, diet_type: e.target.value})}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select diet type</option>
              <option value="omnivore">Omnivore (Sakahari + Maamsahari)</option>
              <option value="vegetarian">Vegetarian (Sakahari)</option>
              <option value="vegan">Vegan (No animal products)</option>
              <option value="eggetarian">Eggetarian (Veg + Eggs)</option>
              <option value="jain">Jain (No root vegetables)</option>
              <option value="pescatarian">Pescatarian (Veg + Fish)</option>
              <option value="keto">Keto (Low carb)</option>
              <option value="sattvic">Sattvic (Pure/Spiritual diet)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Allergies / Intolerances
            </label>
            <div className="flex flex-wrap gap-2">
              {allergyOptions.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem('allergies', item)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    formData.allergies.includes(item)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Cuisines
            </label>
            <div className="flex flex-wrap gap-2">
              {cuisineOptions.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem('preferred_cuisines', item)}
                  className={`px-3 py-1 rounded-full text-sm border transition ${
                    formData.preferred_cuisines.includes(item)
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-green-400'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate('/profile/goals')}
              className="w-1/3 border border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {loading ? 'Saving...' : 'Complete Setup 🎉'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreferencesPage;