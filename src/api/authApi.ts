import apiClient from './axios';

interface LoginResponse {
  status: string;
  role: 'Employee' | 'Admin' | 'Staff';
  username: string;
  userid: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const apiUrl = import.meta.env.VITE_LOGIN_API_URL;
    if (!apiUrl) {
      throw new Error('Login API URL is not defined in environment variables');
    }
    const response = await apiClient.post<{ details: LoginResponse[] }>(apiUrl, credentials);
    const userData = response.data.details[0]; // Take the first item from the details array
    if (!userData || userData.status !== 'success') {
      throw new Error('Login failed: Invalid response status');
    }
    return userData;
  } catch (error) {
    console.error('Login API error:', error);
    throw new Error('Login failed: Invalid credentials or server error');
  }
};
