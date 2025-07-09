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
//     const response = await apiClient.post<LoginResponse>(
//       '/powerautomate/automations/direct/workflows/8a47a2fc26d046718ba64e2a8e8c3035/triggers/manual/paths/invoke/?api-version=1&tenantId=tId&environmentName=5f257bee-e4e8-e745-9c38-6335509b5100&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=gluhnU1Ci_rbHbWfXfI2Q-JZ_OdQntpCtOJrijmlVP4',
//       credentials
//     );
//     return response.data;
//   } catch (error) {
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