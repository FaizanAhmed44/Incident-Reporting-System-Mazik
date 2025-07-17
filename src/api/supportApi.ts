import apiClient from './axios';


interface FetchUser {
    userId: string;
}
interface UserResponse{
    IncidentID: string,
    ReporterName: string,
    Status: string,
    Department: string,
    Severity: string,
    Summary: string,
    Title: string,
    ReporterEmail: string,
    ReportedOn: string

}
export const fetchIncidents = async (payload: FetchUser): Promise<UserResponse> => {
  try {
    const apiUrl = import.meta.env.VITE_FETCH_API_URL;
    if (!apiUrl) {
      throw new Error('VITE_FETCH_API_URL is not defined in environment variables');
    }
    console.log('Fetching incidents from:', apiUrl);
    const response = await apiClient.post<UserResponse>(apiUrl, payload);
    console.log('Submit incident response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to Fetch incidents:', error);
    throw new Error('API call to submit the incident failed');
  }
};