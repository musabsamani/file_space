import axios from 'axios';
import { apiUrls } from '../config';
import ApiError from '../errors/ApiError';
import { handleAxiosError } from '../utils/handleAxiosError';


export const registerUser = async (data) => {
  try {
    const response = await axios.post(apiUrls.register, data);
    return response;
  } catch (error) {
    handleAxiosError(error)
  }
};

export const loginUser = async ({ usernameOrEmail, password }) => {
  try {
    const response = await axios.post(apiUrls.login, { usernameOrEmail, password });
    return response;
  } catch (error) {
    handleAxiosError(error)
  }
};

export const uploadFile = async (file, tags, token) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tags', tags);
  try {
    const response = await axios.post(apiUrls.upload, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error)
  }
};

export const getFiles = async (token) => {
  try {
    const response = await axios.get(apiUrls.viewFile, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error)
  }
};

export const viewFile = async (fileId) => {
  try {
    const response = await axios.get(`${apiUrls.viewFile}/${fileId}`);
    return response.data;
  } catch (error) {
    console.error("Error viewing file", error);
    throw error;
  }
};
