export const INPUT_TYPES_TEXT_LIKE = ["text", "number", "email", "password"];
const BASE_URL = "http://localhost:5005/api/v1"
export const apiUrls = {
    baseUrl: BASE_URL,
    login: BASE_URL + "/auth/login",
    register: BASE_URL + "/auth/register",
    uploadFile: BASE_URL + "/auth/register",
    viewFile: BASE_URL + "/files/view",
}