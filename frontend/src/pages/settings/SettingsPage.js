import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const [userData, setUserData] = useState({
    username: '',
    email: ''
  });

  const [appSettings, setAppSettings] = useState({
    theme: 'light',
    units: 'metric',
    notification_enabled: true,
    email_notifications: true
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    if (appSettings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#111827';
      document.body.style.color = '#f9fafb';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    }
  }, [appSettings.theme]);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/v1/settings/');
      setUserData({
        username: res.data.user.username,
        email: res.data.user.email
      });
      setAppSettings(res.data.settings);

      // Apply saved theme on load
      if (res.data.settings.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#111827';
        document.body.style.color = '#f9fafb';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!userData.username.trim()) {
      toast.error('Username cannot be empty');
      return;
    }
    setSaving(true);
    try {
      await api.put('/api/v1/settings/change-username', {
        username: userData.username
      });
      toast.success('Username updated successfully! ✅');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.username = userData.username;
      localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update username');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.old_password || !passwordData.new_password) {
      toast.error('Please fill all password fields');
      return;
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await api.put('/api/v1/settings/change-password', {
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      });
      toast.success('Password changed successfully! ✅');
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      });
      setShowPasswordForm(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateAppSettings = async () => {
    setSaving(true);
    try {
      await api.put('/api/v1/settings/update', appSettings);
      toast.success('Settings saved! ✅');

      // Apply theme immediately
      if (appSettings.theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#111827';
        document.body.style.color = '#f9fafb';
      } else {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/api/v1/settings/delete-account');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success('Account deleted');
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-5xl mb-4">⚙️</div>
          <p className="text-gray-500">Loading settings...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">⚙️ Settings</h1>
          <p className="text-gray-500 mt-1">Manage your account and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              activeTab === 'profile'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
            }`}
          >
            👤 Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`px-5 py-2 rounded-lg font-medium transition ${
              activeTab === 'app'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
            }`}
          >
            🔧 App Settings
          </button>
        </div>

        {/* Profile Settings Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">

            {/* Account Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                👤 Account Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={userData.username}
                      onChange={(e) => setUserData({
                        ...userData,
                        username: e.target.value
                      })}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={handleUpdateUsername}
                      disabled={saving}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                    >
                      {saving ? 'Saving...' : 'Update'}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Email cannot be changed
                  </p>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  🔐 Change Password
                </h2>
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="text-green-600 text-sm hover:underline"
                >
                  {showPasswordForm ? 'Cancel' : 'Change Password'}
                </button>
              </div>

              {showPasswordForm && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.old_password}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        old_password: e.target.value
                      })}
                      placeholder="Enter current password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        new_password: e.target.value
                      })}
                      placeholder="Enter new password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        confirm_password: e.target.value
                      })}
                      placeholder="Confirm new password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <button
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 transition"
                  >
                    {saving ? 'Changing...' : '🔐 Change Password'}
                  </button>
                </div>
              )}

              {!showPasswordForm && (
                <p className="text-gray-400 text-sm">
                  Click "Change Password" to update your password
                </p>
              )}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                🔗 Quick Links
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/profile/basic-info')}
                  className="p-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition text-left"
                >
                  👤 Update Basic Info
                </button>
                <button
                  onClick={() => navigate('/profile/goals')}
                  className="p-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition text-left"
                >
                  🎯 Update Goals
                </button>
                <button
                  onClick={() => navigate('/profile/preferences')}
                  className="p-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition text-left"
                >
                  🥗 Update Diet Preferences
                </button>
                <button
                  onClick={() => navigate('/health-analysis')}
                  className="p-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition text-left"
                >
                  💪 View Health Analysis
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-red-700 mb-2">
                ⚠️ Danger Zone
              </h2>
              <p className="text-sm text-red-600 mb-4">
                Once you delete your account, all your data will be permanently
                removed. This action cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
              >
                🗑️ Delete My Account
              </button>
            </div>

          </div>
        )}

        {/* App Settings Tab */}
        {activeTab === 'app' && (
          <div className="space-y-6">

            {/* Theme */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                🎨 Appearance
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Changes background color of the app
              </p>
              <div className="flex gap-3">
                {['light', 'dark'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => setAppSettings({ ...appSettings, theme })}
                    className={`flex-1 py-3 rounded-lg border-2 capitalize font-medium transition ${
                      appSettings.theme === theme
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {theme === 'light' ? '☀️' : '🌙'} {theme}
                  </button>
                ))}
              </div>
              {/* Live Preview */}
              <div className={`mt-4 p-4 rounded-lg transition-all ${
                appSettings.theme === 'dark'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p className="text-sm font-medium">
                  {appSettings.theme === 'dark' ? '🌙 Dark Mode Preview' : '☀️ Light Mode Preview'}
                </p>
                <p className="text-xs mt-1 opacity-70">
                  This is how your app will look
                </p>
              </div>
            </div>

            {/* Units */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                📏 Units
              </h2>
              <div className="flex gap-3">
                {['metric', 'imperial'].map(unit => (
                  <button
                    key={unit}
                    onClick={() => setAppSettings({ ...appSettings, units: unit })}
                    className={`flex-1 py-3 rounded-lg border-2 capitalize font-medium transition ${
                      appSettings.units === unit
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {unit === 'metric' ? '🌍 Metric (kg, cm)' : '🌎 Imperial (lb, ft)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                🔔 Notifications
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700">Push Notifications</p>
                    <p className="text-xs text-gray-400">
                      Receive meal reminders and health tips
                    </p>
                  </div>
                  <button
                    onClick={() => setAppSettings({
                      ...appSettings,
                      notification_enabled: !appSettings.notification_enabled
                    })}
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      appSettings.notification_enabled
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all absolute top-0.5 ${
                      appSettings.notification_enabled
                        ? 'left-6'
                        : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <hr />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-700">Email Notifications</p>
                    <p className="text-xs text-gray-400">
                      Receive weekly health reports via email
                    </p>
                  </div>
                  <button
                    onClick={() => setAppSettings({
                      ...appSettings,
                      email_notifications: !appSettings.email_notifications
                    })}
                    className={`w-12 h-6 rounded-full transition-all relative ${
                      appSettings.email_notifications
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all absolute top-0.5 ${
                      appSettings.email_notifications
                        ? 'left-6'
                        : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleUpdateAppSettings}
              disabled={saving}
              className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {saving ? 'Saving...' : '💾 Save Settings'}
            </button>

          </div>
        )}

      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <span className="text-5xl">⚠️</span>
              <h2 className="text-xl font-bold text-gray-800 mt-3">
                Delete Account?
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                This will permanently delete your account and all your data
                including meals, diet plans, and health records.
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsPage;