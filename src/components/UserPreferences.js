import React, { useState, useEffect } from 'react';
import UserPreferencesService from '../services/UserPreferencesService';

const UserPreferences = ({ userId }) => {
  const [preferences, setPreferences] = useState(UserPreferencesService.getDefaultPreferences());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPreferences();
  }, [userId]);

  const loadPreferences = async () => {
    setLoading(true);
    try {
      const response = await UserPreferencesService.getPreferences(userId);
      setPreferences(response.data || UserPreferencesService.getDefaultPreferences());
    } catch (error) {
      console.error('Error loading preferences:', error);
      setPreferences(UserPreferencesService.getDefaultPreferences());
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      await UserPreferencesService.updatePreferences(userId, preferences);
      setMessage('Preferences saved successfully');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving preferences: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Reset all preferences to default?')) return;

    setSaving(true);
    try {
      await UserPreferencesService.resetPreferences(userId);
      setPreferences(UserPreferencesService.getDefaultPreferences());
      setMessage('Preferences reset to default');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error resetting preferences: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const updatePreference = (section, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  if (loading) {
    return <div className="text-center"><div className="spinner-border" /></div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h5>User Preferences</h5>
      </div>
      <div className="card-body">
        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'}`}>
            {message}
          </div>
        )}

        {/* Theme Settings */}
        <div className="mb-4">
          <h6 className="border-bottom pb-2">Appearance</h6>
          <div className="mb-3">
            <label className="form-label">Theme</label>
            <select
              className="form-select"
              value={preferences.theme}
              onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Language</label>
            <select
              className="form-select"
              value={preferences.language}
              onChange={(e) => setPreferences({...preferences, language: e.target.value})}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="mb-4">
          <h6 className="border-bottom pb-2">Notifications</h6>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="emailNotif"
              checked={preferences.notifications?.email}
              onChange={(e) => updatePreference('notifications', 'email', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="emailNotif">
              Email Notifications
            </label>
          </div>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="pushNotif"
              checked={preferences.notifications?.push}
              onChange={(e) => updatePreference('notifications', 'push', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="pushNotif">
              Push Notifications
            </label>
          </div>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="smsNotif"
              checked={preferences.notifications?.sms}
              onChange={(e) => updatePreference('notifications', 'sms', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="smsNotif">
              SMS Notifications
            </label>
          </div>
        </div>

        {/* Display Settings */}
        <div className="mb-4">
          <h6 className="border-bottom pb-2">Display</h6>
          <div className="mb-3">
            <label className="form-label">Items per page</label>
            <select
              className="form-select"
              value={preferences.display?.itemsPerPage}
              onChange={(e) => updatePreference('display', 'itemsPerPage', parseInt(e.target.value))}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="compactView"
              checked={preferences.display?.compactView}
              onChange={(e) => updatePreference('display', 'compactView', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="compactView">
              Compact View
            </label>
          </div>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showAvatars"
              checked={preferences.display?.showAvatars}
              onChange={(e) => updatePreference('display', 'showAvatars', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showAvatars">
              Show Avatars
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="mb-4">
          <h6 className="border-bottom pb-2">Privacy</h6>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="profileVisible"
              checked={preferences.privacy?.profileVisible}
              onChange={(e) => updatePreference('privacy', 'profileVisible', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="profileVisible">
              Profile Visible to Others
            </label>
          </div>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showEmail"
              checked={preferences.privacy?.showEmail}
              onChange={(e) => updatePreference('privacy', 'showEmail', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showEmail">
              Show Email on Profile
            </label>
          </div>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPhone"
              checked={preferences.privacy?.showPhone}
              onChange={(e) => updatePreference('privacy', 'showPhone', e.target.checked)}
            />
            <label className="form-check-label" htmlFor="showPhone">
              Show Phone on Profile
            </label>
          </div>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleReset}
            disabled={saving}
          >
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferences;
