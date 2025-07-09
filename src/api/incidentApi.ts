import apiClient from './axios';

// Define interfaces for existing API response types (e.g., JSONPlaceholder)
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// Define interface for Power Automate API request body
interface PowerAutomateRequest {
  description: string;
}

// Define interface for Power Automate API response based on provided structure
interface PowerAutomateResponse {
  classification: {
    category: string;
    severity: string;
    summary: string;
    email: string;
  };
  staff_assignment: {
    assigned_staff_id: string;
    assigned_staff_code: string;
    assigned_department: string;
    staff_skillset: string;
  };
}

// API call function for Power Automate flow
export const triggerPowerAutomateFlow = async (description: string): Promise<PowerAutomateResponse> => {
  try {
    const response = await apiClient.post<PowerAutomateResponse>(
      import.meta.env.VITE_INCIDENT_GENERATE_API_URL,
      { description }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to trigger Power Automate flow');
  }
};