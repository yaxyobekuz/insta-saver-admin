import api from "./index";

// Create new broadcast
export const createBroadcast = (data) => {
  return api.post("/broadcasts", data);
};

// Get all broadcasts (history)
export const getBroadcasts = (params = {}) => {
  return api.get("/broadcasts", { params });
};

// Get broadcast by ID
export const getBroadcastById = (id) => {
  return api.get(`/broadcasts/${id}`);
};

// Get broadcast recipients
export const getBroadcastRecipients = (id, params = {}) => {
  return api.get(`/broadcasts/${id}/recipients`, { params });
};

// Cancel broadcast
export const cancelBroadcast = (id) => {
  return api.delete(`/broadcasts/${id}`);
};
