// import apiClient from './axios';

// interface LoginResponse {
//   status: string;
//   role: 'Employee' | 'Admin' | 'Staff';
//   username: string;
//   userid: string;
// }

// interface LoginCredentials {
//   email: string;
//   password: string;
// }

// export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
//   try {
//     const apiUrl = import.meta.env.VITE_LOGIN_API_URL;
//     if (!apiUrl) {
//       throw new Error('Login API URL is not defined in environment variables');
//     }
//     const response = await apiClient.post<{ details: LoginResponse[] }>(apiUrl, credentials);
//     const userData = response.data.details[0]; // Take the first item from the details array
//     if (!userData || userData.status !== 'success') {
//       throw new Error('Login failed: Invalid response status');
//     }
//     return userData;
//   } catch (error) {
//     console.error('Login API error:', error);
//     throw new Error('Login failed: Invalid credentials or server error');
//   }
// };

import apiClient from './axios';

interface LoginResponse {
  status: string;
  role: 'Employee' | 'Admin' | 'Staff';
  username: string;
  userid: string;
}

interface StaffDetails {
  staffid?: string;
}

interface LoginApiResponse {
  details: (LoginResponse | StaffDetails)[];
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = async (credentials: LoginCredentials): Promise<{ user: LoginResponse; id: string }> => {
  try {
    const apiUrl = import.meta.env.VITE_LOGIN_API_URL;
    if (!apiUrl) {
      throw new Error('Login API URL is not defined in environment variables');
    }
    const response = await apiClient.post<LoginApiResponse>(apiUrl, credentials);
    const details = response.data.details;

    const userData = details[0] as LoginResponse;
    if (!userData || userData.status !== 'success') {
      throw new Error('Login failed: Invalid response status');
    }

    let id: string;
    if (userData.role === 'Staff') {
      // Extract staffid from the second object in details
      id = details[1] && 'staffid' in details[1] ? (details[1] as StaffDetails).staffid || userData.userid : userData.userid;
    } else {
      // For Employee or Admin, use userid
      id = userData.userid;
    }

    return { user: userData, id };
  } catch (error) {
    console.error('Login API error:', error);
    throw new Error('Login failed: Invalid credentials or server error');
  }
};