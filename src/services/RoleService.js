import http from "../http-common";

const getAllRoles = () => {
  return http.get("/roles");
};

const assignRole = (userId, roleId) => {
  return http.post(`/users/${userId}/roles/${roleId}`);
};

const removeRole = (userId, roleId) => {
  return http.delete(`/users/${userId}/roles/${roleId}`);
};

const getUserRoles = (userId) => {
  return http.get(`/users/${userId}/roles`);
};

const RoleService = {
  getAllRoles,
  assignRole,
  removeRole,
  getUserRoles
};

export default RoleService;
