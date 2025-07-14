import apiClient from './axios';

// Define interface for Staff update request
export interface UpdateStaffRequest {
  id: string;
  name: string;
  email: string;
  department: string;
  skillset: string;
  status: string;
  // password?: string; // Optional, as it might not need updating
}

// Define interface for Staff update response
interface UpdateStaffResponse {
  updated: string;
}

// API call function for updating a staff user
export const updateStaffUser = async (staffData: UpdateStaffRequest): Promise<UpdateStaffResponse> => {
  try {
    const response = await apiClient.post<UpdateStaffResponse>(
      import.meta.env.VITE_EDIT_STAFF_API_URL,
      staffData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating staff user:', error);
    throw new Error('Failed to update staff user');
  }
};