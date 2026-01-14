import api from "./index";

// Login
export const login = (data) => {
  return api.post("/auth/login", data);
};

// Get current user
export const getMe = () => {
  return api.get("/auth/me");
};
