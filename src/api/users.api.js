import api from "./index";

// Get all users with filtering
export const getUsers = (params = {}) => {
  return api.get("/users", { params });
};

// Get user statistics
export const getUserStats = () => {
  return api.get("/users/stats");
};

// Get user by ID
export const getUserById = (id) => {
  return api.get(`/users/${id}`);
};
