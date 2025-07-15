import apiClient from './axios';

// Define interface for Incident (Ticket) entity
export interface Incident {
  '@odata.type': string;
  '@odata.id': string;
  '@odata.etag': string;
  '@odata.editLink': string;
  cr6dd_reportername: string;
  cr6dd_descriptionsummary: string;
  createdon: string;
  'createdon@OData.Community.Display.V1.FormattedValue': string;
  'createdon@odata.type': string;
  cr6dd_incidentid: string;
  cr6dd_incidentsid: string;
  'cr6dd_incidentsid@odata.type': string;
  cr6dd_departmenttype: string;
  cr6dd_emaildraft: string;
  cr6dd_resolvername: string;
  cr6dd_severity: string;
  cr6dd_status: string; 
  cr6dd_title: string;
  cr6dd_userdescription: string;
}

// API call function to get all tickets data
export const get_tickets = async (): Promise<Incident[]> => {
  try {
    const response = await apiClient.get<Incident[]>(
      import.meta.env.VITE_TICKETS_TO_ADMIN_API_URL
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw new Error('Failed to fetch tickets from API');
  }
};