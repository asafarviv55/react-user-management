import http from "../http-common";

const getPreferences = (userId) => {
  return http.get(`/users/${userId}/preferences`);
};

const updatePreferences = (userId, preferences) => {
  return http.put(`/users/${userId}/preferences`, preferences);
};

const resetPreferences = (userId) => {
  return http.delete(`/users/${userId}/preferences`);
};

const getDefaultPreferences = () => {
  return {
    theme: "light",
    language: "en",
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    display: {
      itemsPerPage: 10,
      compactView: false,
      showAvatars: true
    },
    privacy: {
      profileVisible: true,
      showEmail: false,
      showPhone: false
    }
  };
};

const UserPreferencesService = {
  getPreferences,
  updatePreferences,
  resetPreferences,
  getDefaultPreferences
};

export default UserPreferencesService;
