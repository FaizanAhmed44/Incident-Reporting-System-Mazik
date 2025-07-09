import axios, { AxiosInstance } from 'axios';

// Create an Axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // Replace with your API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add request interceptor for handling headers, auth, etc.
apiClient.interceptors.request.use(
  (config) => {
    // Add any custom headers or auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Add response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally (e.g., 401, 500, etc.)
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;