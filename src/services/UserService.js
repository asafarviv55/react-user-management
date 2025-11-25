import http from "../http-common";

const getAll = () => {
  return http.get("/list");
};

const get = (id) => {
  return http.get(`/${id}`);
};

const create = (data) => {
  return http.post("/addOrUpdate", data);
};

const update = (id, data) => {
  return http.put(`/addOrUpdate/${id}`, data);
};

const remove = (id) => {
  return http.delete(`/${id}`);
};

const removeAll = () => {
  return http.delete("/");
};

const UserService = {
  getAll,
  get,
  create,
  update,
  remove,
  removeAll
};

export default UserService;
