import apiClient from './axios';

// Define interface for ReportedBy entity
interface ReportedBy {
  '@odata.type': string;
  '@odata.id': string;
  '@odata.editLink': string;
  cr6dd_name: string;
  cr6dd_usersid: string;
}

// Define interface for AssignedResolver entity
interface AssignedResolver {
  '@odata.type': string;
  '@odata.id': string;
  '@odata.editLink': string;
  cr6dd_staffid: string;
  cr6dd_staff1id: string;
}

// Define interface for Incident response
interface Incident {
  '@odata.type': string;
  '@odata.id': string;
  '@odata.etag': string;
  '@odata.editLink': string;
  cr6dd_incidentsid: string;
  cr6dd_incidentid: string;
  cr6dd_description: string;
  cr6dd_departmenttype: string;
  cr6dd_title?: string;
  cr6dd_status: string;
  cr6dd_ReportedBy: ReportedBy;
  cr6dd_AssignedResolver: AssignedResolver;
}

// API call function for Power Automate flow
export const tickets_to_admin = async (): Promise<Incident[]> => {
  try {
    const response = await apiClient.get<Incident[]>(
      import.meta.env.VITE_TICKETS_TO_ADMIN_API_URL
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw new Error('Failed to fetch tickets from Power Automate flow');
  }
};