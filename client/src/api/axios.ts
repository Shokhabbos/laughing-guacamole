import axios from "axios";

const instance = axios.create({
  baseURL: "https://itranstion-final-project.onrender.com",
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "*/*",
    "Access-Control-Allow-Origin": "*",
  },
});

export default instance;
