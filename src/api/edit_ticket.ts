import apiClient from './axios';

// Define interface for Incident update request
export interface UpdateIncidentRequest {
  incidentId: string;
  title: string;
  status: string;
  department: string;
  resolver_name: string;
  resolver_email: string;
  userDescription: string;
  suggestedDescription: string;
  severity: string;
  draftEmail: string;
}

// Define interface for Incident update response
interface UpdateIncidentResponse {
  message: string;
}

// API call function for updating an incident
export const updateIncident = async (incidentData: UpdateIncidentRequest): Promise<UpdateIncidentResponse> => {
  try {
    const response = await apiClient.post<UpdateIncidentResponse>(
      import.meta.env.VITE_EDIT_TICKET_API_URL,
      incidentData
    );
    return response.data;
  } catch (error) {
    console.error('Error updating incident:', error);
    throw new Error('Failed to update incident');
  }
};