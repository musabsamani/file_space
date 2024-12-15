import ApiError from "../errors/ApiError";

export const handleAxiosError = (error) => {
    if (error?.code === 'ERR_NETWORK') {
        throw new ApiError({ message: 'Network Error', details: 'Please check your internet connection and try again' });
    } else if (error?.message.includes('ECONNREFUSED')) {
        throw new ApiError({ message: 'Connection Refused', details: 'The server refused the connection. Please try again later.' });
    } else if (error?.message.includes('ECONNABORTED')) {
        throw new ApiError({ message: 'Connection Aborted', details: 'The connection was aborted. Please try again.' });
    } else if (error?.message.includes('ETIMEDOUT')) {
        throw new ApiError({ message: 'Connection Timed Out', details: 'The connection timed out. Please try again.' });
    } else if (error?.response?.data.error) {
        throw new ApiError({ message: error.response.data.error.message, details: error.response.data.error.details })
    } else {
        throw new ApiError({ message: 'Unknown Error', details: 'An unknown error occurred. Please try again.' });
    }
}