import apiClient from './axios';

interface IncidentPayload {
  Description: string;
  Status: string;
  DepartmentType: string;
  AssignedResolverGUID: string;
  ReportedByGUID: string;
}

interface AiResponsePayload {
  SuggestedDesc: string;
  SuggestedEmail: string;
  SuggestedResolverGUID: string;
  SuggestionSeverity: string;
}

export interface IncidentConfirmationPayload {
  incident: IncidentPayload;
  ai_response: AiResponsePayload;
}

export interface ConfirmedIncidentResponse {
  url: string;
}

interface SubmitIncidentPayload {
  description: string;
}

interface SubmitIncidentResponse {
  classification: {
    category: string;
    severity: string;
    summary: string;
    email: string;
  };
  staff_assignment: {
    assigned_staff_email: string;
    assigned_staff_name: string;
    assigned_department: string;
    staff_skillset: string;
  };
}

export const submitIncident = async (payload: SubmitIncidentPayload): Promise<SubmitIncidentResponse> => {
  try {
    const apiUrl = import.meta.env.VITE_SUBMIT_INCIDENT_API_URL;
    if (!apiUrl) {
      throw new Error('VITE_SUBMIT_INCIDENT_API_URL is not defined in environment variables');
    }
    console.log('Submitting incident to:', apiUrl); // Debugging log
    const response = await apiClient.post<SubmitIncidentResponse>(apiUrl, payload);
    console.log('Submit incident response:', response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error('Failed to submit incident:', error);
    throw new Error('API call to submit the incident failed');
  }
};

export const confirmIncident = async (payload: IncidentConfirmationPayload): Promise<ConfirmedIncidentResponse> => {
  try {
    const apiUrl = import.meta.env.VITE_CONFIRM_INCIDENT_API_URL;
    if (!apiUrl) {
      throw new Error('VITE_CONFIRM_INCIDENT_API_URL is not defined in environment variables');
    }
    console.log('Confirming incident to:', apiUrl); // Debugging log
    const response = await apiClient.post<ConfirmedIncidentResponse>(apiUrl, payload);
    console.log('Confirm incident response:', response.data); // Debugging log
    return response.data;
  } catch (error) {
    console.error('Failed to confirm incident:', error);
    throw new Error('API call to confirm the incident failed');
  }
};