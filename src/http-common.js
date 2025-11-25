import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api/users";

export default axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json"
  }
});
