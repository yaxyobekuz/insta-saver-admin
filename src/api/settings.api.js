import api from "./index";

// Get all settings
export const getSettings = () => {
  return api.get("/settings");
};

// Update setting
export const updateSetting = (key, value) => {
  return api.put(`/settings/${key}`, { value });
};
