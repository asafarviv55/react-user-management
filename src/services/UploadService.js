import http from "../http-common";

const uploadProfilePicture = (userId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return http.post(`/users/${userId}/profile-picture`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

const deleteProfilePicture = (userId) => {
  return http.delete(`/users/${userId}/profile-picture`);
};

const getProfilePictureUrl = (userId) => {
  return `${http.defaults.baseURL}/users/${userId}/profile-picture`;
};

const uploadBulkUsers = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return http.post("/users/bulk-import", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

const UploadService = {
  uploadProfilePicture,
  deleteProfilePicture,
  getProfilePictureUrl,
  uploadBulkUsers
};

export default UploadService;
