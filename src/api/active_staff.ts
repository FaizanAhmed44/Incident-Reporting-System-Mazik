import apiClient from './axios';

// Define interface for Staff data
export interface Staff {
  '@odata.etag': string;
  cr6dd_departmentname: string;
  cr6dd_staff1id: string;
  cr6dd_UserID: {
    cr6dd_name: string;
    cr6dd_email: string;
    cr6dd_usersid: string;
  };
}

// API call function for retrieving staff list
export const getStaffList = async (): Promise<Staff[]> => {
  try {
    const response = await apiClient.get<Staff[]>(
      import.meta.env.VITE_GET_ACTIVE_STAFF_API_URL
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching staff list:', error);
    throw new Error('Failed to fetch staff list');
  }
};