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
  message: string;
  incidentId: string;
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

interface RegenerateIncidentPayload {
  summary: string;
  email: string;
}

interface RegenerateIncidentResponse {
  summary: string;
  email: string;
}

export const submitIncident = async (payload: SubmitIncidentPayload): Promise<SubmitIncidentResponse> => {
  try {
    const apiUrl = import.meta.env.VITE_SUBMIT_INCIDENT_API_URL;
    if (!apiUrl) {
      throw new Error('VITE_SUBMIT_INCIDENT_API_URL is not defined in environment variables');
    }
    console.log('Submitting incident to:', apiUrl);
    const response = await apiClient.post<SubmitIncidentResponse>(apiUrl, payload);
    console.log('Submit incident response:', response.data);
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
    console.log('Confirming incident to:', apiUrl);
    const response = await apiClient.post<ConfirmedIncidentResponse>(apiUrl, payload);
    console.log('Confirm incident response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to confirm incident:', error);
    throw new Error('API call to confirm the incident failed');
  }
};

export const regenerateIncident = async (payload: RegenerateIncidentPayload): Promise<RegenerateIncidentResponse> => {
  try {
    const apiUrl = 'https://aitraigeandincidentreporting-c8grgvezh7c2fzgq.eastus-01.azurewebsites.net/api/v1/incidents/regenerate';
    console.log('Regenerating incident at:', apiUrl);
    const response = await apiClient.post<RegenerateIncidentResponse>(apiUrl, payload);
    console.log('Regenerate incident response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to regenerate incident:', error);
    throw new Error('API call to regenerate incident failed');
  }
};


interface TicketFromApi {
  incidentID: string;
  title: string | null; // Title can be null
  description: string;
  status: string; // e.g., "New", "In Progress"
  assignedMember: string; // This is a GUID
  category: string;
  lastUpdated: string; // ISO date string
}

// 2. Define the interface for the overall API response.
interface GetUserTicketsResponse {
  tickets: TicketFromApi[];
}

// 3. The API function (this function itself doesn't need changes, just the interfaces above)
export const getUserTickets = async (userId: string): Promise<GetUserTicketsResponse> => {
  try {
    const apiUrl = import.meta.env.VITE_GET_TICKETS_API_URL;
    if (!apiUrl) {
      throw new Error("VITE_GET_TICKETS_API_URL is not defined in your .env file.");
    }
    
    const payload = { currUser: userId };
    const response = await apiClient.post<GetUserTicketsResponse>(apiUrl, payload);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user tickets:', error);
    throw new Error('Could not retrieve tickets from the server.');
  }
};