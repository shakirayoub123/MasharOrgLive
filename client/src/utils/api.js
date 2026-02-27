import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5001/api/v1"
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("alumni_token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export default API;
