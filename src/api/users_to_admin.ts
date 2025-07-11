import apiClient from './axios';

// Define interface for UserID entity
interface UserID {
  '@odata.type': string;
  '@odata.id': string;
  '@odata.editLink': string;
  cr6dd_name: string;
  cr6dd_email: string;
  createdon: string;
  cr6dd_role: string;
  cr6dd_userid: string;
}

// Define interface for Staff response
export interface Staff {
  '@odata.type': string;
  '@odata.id': string;
  '@odata.etag': string;
  '@odata.editLink': string;
  cr6dd_departmentname: string;
  cr6dd_availability: string;
  cr6dd_UserID: UserID;
}

// API call function to get all users data
export const get_users = async (): Promise<Staff[]> => {
  try {
    const response = await apiClient.get<Staff[]>(
      import.meta.env.VITE_USERS_API_URL
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users from API');
  }
};