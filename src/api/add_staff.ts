import apiClient from './axios';

// Define interface for Staff creation request
interface StaffRequest {
  name: string;
  email: string;
  department: string;
  skillset: string;
  password: string;
}

// Define interface for Staff creation response
interface StaffResponse {
  staff_id: string;
}

// API call function for adding a staff user
export const addStaffUser = async (staffData: StaffRequest): Promise<StaffResponse> => {
  try {
    const response = await apiClient.post<StaffResponse>(
      import.meta.env.VITE_ADD_STAFF_API_URL,
      staffData
    );
    return response.data;
  } catch (error) {
    console.error('Error adding staff user:', error);
    throw new Error('Failed to add staff user');
  }
};