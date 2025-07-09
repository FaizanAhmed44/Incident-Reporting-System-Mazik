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
    console.log('Using API URL:', apiUrl); // Debugging log
    const response = await apiClient.post<LoginResponse>(apiUrl,
      credentials
    );
    return response.data;
  } catch (error) {
    console.error('Login API error:', error); // Debugging log
    throw new Error('Login failed: Invalid credentials or server error');
  }
};