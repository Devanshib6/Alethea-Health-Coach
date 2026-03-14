import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { label: '📊 Dashboard', path: '/dashboard' },
    { label: '🍛 Add Meal', path: '/meals/add' },
    { label: '📋 Meal History', path: '/meals/history' },
    { label: '🥗 Diet Plan', path: '/diet-plan' },
    { label: '💪 Health Analysis', path: '/health-analysis' },
    { label: '⚙️ Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-green-700">Alethea</span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(link.path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* User + Logout */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-sm text-gray-600">
              👋 {user?.username || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition ${
                  isActive(link.path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="border-t pt-3 mt-2 flex justify-between items-center px-4">
              <span className="text-sm text-gray-600">
                👋 {user?.username || 'User'}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;