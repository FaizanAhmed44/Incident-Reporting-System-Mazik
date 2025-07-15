import apiClient from './axios';

// Define interface for Delete staff request
interface DeleteStaffRequest {
  id: string;
}

// Define interface for Delete staff response
interface DeleteStaffResponse {
  "staff deleted successfully": string;
}

// API call function for deleting a staff user
export const deleteStaffUser = async (staffData: DeleteStaffRequest): Promise<DeleteStaffResponse> => {
  try {
    const response = await apiClient.post<DeleteStaffResponse>(
      import.meta.env.VITE_DELETE_STAFF_API_URL,
      staffData
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting staff user:', error);
    throw new Error('Failed to delete staff user');
  }
};