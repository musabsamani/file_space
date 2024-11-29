class ApiError extends Error {
    constructor({ message, details = null }) {
        super(message || "An unexpected error occurred");
        this.name = "ApiError";
        this.details = details;
    }
}

export default ApiError;
