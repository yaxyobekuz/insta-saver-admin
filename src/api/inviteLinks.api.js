import api from "./index";

// Create new invite link
export const createInviteLink = (data) => {
  return api.post("/invite-links", data);
};

// Get all invite links
export const getInviteLinks = (params = {}) => {
  return api.get("/invite-links", { params });
};

// Get invite link statistics
export const getInviteLinkStats = () => {
  return api.get("/invite-links/stats");
};

// Get invite link by ID
export const getInviteLinkById = (id) => {
  return api.get(`/invite-links/${id}`);
};

// Get invited users for a link
export const getInvitedUsers = (id, params = {}) => {
  return api.get(`/invite-links/${id}/users`, { params });
};

// Update invite link
export const updateInviteLink = (id, data) => {
  return api.put(`/invite-links/${id}`, data);
};

// Delete invite link
export const deleteInviteLink = (id) => {
  return api.delete(`/invite-links/${id}`);
};
