import axios from 'axios';
import { REACT_APP_API_URL } from '../constants';
// import dotenv from 'dotenv';
// dotenv.config();

const API_URL = REACT_APP_API_URL;

export const registerUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password });
    return response.data;
  } catch (error) {
    console.error("Error registering user", error);
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error("Error logging in", error);
    throw error;
  }
};

export const uploadFile = async (file, tags, token) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('tags', tags);

  try {
    const response = await axios.post(`${API_URL}/files/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};

export const getFiles = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/files`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching files", error);
    throw error;
  }
};

export const viewFile = async (fileId) => {
  try {
    const response = await axios.get(`${API_URL}/files/view/${fileId}`);
    return response.data;
  } catch (error) {
    console.error("Error viewing file", error);
    throw error;
  }
};
