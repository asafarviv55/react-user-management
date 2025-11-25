import http from "../http-common";

const logActivity = (activity) => {
  return http.post("/activity-logs", {
    ...activity,
    timestamp: new Date().toISOString()
  });
};

const getUserActivities = (userId, limit = 50) => {
  return http.get(`/activity-logs/user/${userId}?limit=${limit}`);
};

const getAllActivities = (params = {}) => {
  const { page = 1, limit = 50, startDate, endDate, userId } = params;
  let url = `/activity-logs?page=${page}&limit=${limit}`;

  if (startDate) url += `&startDate=${startDate}`;
  if (endDate) url += `&endDate=${endDate}`;
  if (userId) url += `&userId=${userId}`;

  return http.get(url);
};

const getActivityStats = () => {
  return http.get("/activity-logs/stats");
};

const ActivityLogService = {
  logActivity,
  getUserActivities,
  getAllActivities,
  getActivityStats
};

export default ActivityLogService;
