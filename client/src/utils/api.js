import axios from "axios";
import { getApiBaseUrl } from "./baseUrl";

const API = axios.create({
    baseURL: getApiBaseUrl()
});

API.interceptors.request.use((req) => {
    // Check if the request explicitly provides an authorization header (e.g., admin tokens)
    if (req.headers.Authorization || req.headers.authorization) {
        return req;
    }

    const token = localStorage.getItem("alumni_token");

    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
});

export default API;
