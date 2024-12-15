// backend api
export const TEXT_INPUT_TYPES = ["text", "number", "email", "password"];

const BASE_URL = import.meta.env.MODE === "production" ? import.meta.env.VITE_PRODUCTION_BASE_URL : import.meta.env.VITE_DEVELOPMENT_BASE_URL;


export const apiUrls = {
    baseUrl: BASE_URL,
    login: BASE_URL + "/auth/login",
    register: BASE_URL + "/auth/register",
    uploadFile: BASE_URL + "/auth/register",
    viewFile: BASE_URL + "/files/view",
}