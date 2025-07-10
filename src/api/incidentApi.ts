  // import apiClient from './axios';

  
  // interface PowerAutomateResponse {
  //   classification: {
  //     category: string;
  //     severity: string;
  //     summary: string;
  //     email: string;
  //   };
  //   staff_assignment: {
  //     assigned_staff_id: string;
  //     assigned_staff_code: string;
  //     assigned_department: string;
  //     staff_skillset: string;
  //   };
  // }

  // // API call function for Power Automate flow
  // export const triggerPowerAutomateFlow = async (description: string): Promise<PowerAutomateResponse> => {
  //   try {
  //     const response = await apiClient.post<PowerAutomateResponse>(
  //       import.meta.env.VITE_INCIDENT_GENERATE_API_URL,
  //       { description }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new Error('Failed to trigger Power Automate flow');
  //   }
  // };

  import apiClient from './axios';


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

  export interface IncidentConfirmationPayload {
  incident: IncidentPayload;
  ai_response: AiResponsePayload;
}

export interface ConfirmedIncidentResponse {
  url: string;
}

export const confirmIncident = async (payload: IncidentConfirmationPayload): Promise<ConfirmedIncidentResponse> => {
  try {
    // We use a new environment variable for this specific Power Automate URL
    const apiUrl = import.meta.env.VITE_CONFIRM_INCIDENT_API_URL;
    
    if (!apiUrl) {
      throw new Error("VITE_CONFIRM_INCIDENT_API_URL is not defined in your .env file.");
    }

    const response = await apiClient.post<ConfirmedIncidentResponse>(apiUrl, payload);
    return response.data;
  } catch (error) {
    // More specific error handling
    console.error('Failed to confirm incident:', error);
    throw new Error('API call to confirm the incident failed.');
  }
};