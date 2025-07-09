// import axios, { AxiosInstance } from 'axios';

// const apiClient: AxiosInstance = axios.create({
//   baseURL: 'https://5f257beee4e8e7459c386335509b51.00.environment.api.powerplatform.com:443',
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// apiClient.interceptors.request.use(
//   (config) => {
//     // Add auth headers if needed
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API error:', error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

// export default apiClient;
import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    console.log('Request URL:', config.url); // Debugging log
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;