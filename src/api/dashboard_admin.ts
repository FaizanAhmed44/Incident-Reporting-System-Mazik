import apiClient from './axios';

// Interface for User entity
export interface User {
  '@odata.type': string;
  '@odata.id': string;
  '@odata.etag': string;
  '@odata.editLink': string;
  cr6dd_name: string;
  cr6dd_email: string;
  modifiedon: string;
  'modifiedon@OData.Community.Display.V1.FormattedValue': string;
  'modifiedon@odata.type': string;
  '_createdonbehalfby_value@OData.Community.Display.V1.FormattedValue': string;
  '_createdonbehalfby_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_createdonbehalfby_value@odata.type': string;
  '_createdonbehalfby_value': string;
  cr6dd_password: string;
  '_owninguser_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_owninguser_value@odata.type': string;
  '_owninguser_value': string;
  'statecode@OData.Community.Display.V1.FormattedValue': string;
  statecode: number;
  createdon: string;
  'createdon@OData.Community.Display.V1.FormattedValue': string;
  'createdon@odata.type': string;
  '_modifiedby_value@OData.Community.Display.V1.FormattedValue': string;
  '_modifiedby_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_modifiedby_value@odata.type': string;
  '_modifiedby_value': string;
  cr6dd_role: string;
  '_owningbusinessunit_value@OData.Community.Display.V1.FormattedValue': string;
  '_owningbusinessunit_value@Microsoft.Dynamics.CRM.associatednavigationproperty': string;
  '_owningbusinessunit_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_owningbusinessunit_value@odata.type': string;
  '_owningbusinessunit_value': string;
  'versionnumber@OData.Community.Display.V1.FormattedValue': string;
  'versionnumber@odata.type': string;
  versionnumber: number;
  '_createdby_value@OData.Community.Display.V1.FormattedValue': string;
  '_createdby_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_createdby_value@odata.type': string;
  '_createdby_value': string;
  'statuscode@OData.Community.Display.V1.FormattedValue': string;
  statuscode: number;
  '_ownerid_value@OData.Community.Display.V1.FormattedValue': string;
  '_ownerid_value@Microsoft.Dynamics.CRM.associatednavigationproperty': string;
  '_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_ownerid_value@odata.type': string;
  '_ownerid_value': string;
  cr6dd_userid: string;
  'cr6dd_usersid@odata.type': string;
  cr6dd_usersid: string;
}

// Interface for Staff entity
export interface Staff {
  '@odata.type': string;
  '@odata.id': string;
  '@odata.etag': string;
  '@odata.editLink': string;
  '_modifiedby_value@OData.Community.Display.V1.FormattedValue': string;
  '_modifiedby_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_modifiedby_value@odata.type': string;
  '_modifiedby_value': string;
  createdon: string;
  'createdon@OData.Community.Display.V1.FormattedValue': string;
  'createdon@odata.type': string;
  cr6dd_staffid: string;
  '_owninguser_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_owninguser_value@odata.type': string;
  '_owninguser_value': string;
  cr6dd_skillset: string;
  '_ownerid_value@OData.Community.Display.V1.FormattedValue': string;
  '_ownerid_value@Microsoft.Dynamics.CRM.associatednavigationproperty': string;
  '_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_ownerid_value@odata.type': string;
  '_ownerid_value': string;
  '_cr6dd_userid_value@OData.Community.Display.V1.FormattedValue': string;
  '_cr6dd_userid_value@Microsoft.Dynamics.CRM.associatednavigationproperty': string;
  '_cr6dd_userid_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_cr6dd_userid_value@odata.type': string;
  '_cr6dd_userid_value': string;
  'versionnumber@OData.Community.Display.V1.FormattedValue': string;
  'versionnumber@odata.type': string;
  versionnumber: number;
  cr6dd_departmentname: string;
  '_owningbusinessunit_value@OData.Community.Display.V1.FormattedValue': string;
  '_owningbusinessunit_value@Microsoft.Dynamics.CRM.associatednavigationproperty': string;
  '_owningbusinessunit_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_owningbusinessunit_value@odata.type': string;
  '_owningbusinessunit_value': string;
  'cr6dd_staff1id@odata.type': string;
  cr6dd_staff1id: string;
  '_createdby_value@OData.Community.Display.V1.FormattedValue': string;
  '_createdby_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_createdby_value@odata.type': string;
  '_createdby_value': string;
  'statuscode@OData.Community.Display.V1.FormattedValue': string;
  statuscode: number;
  'statecode@OData.Community.Display.V1.FormattedValue': string;
  statecode: number;
  cr6dd_availability: string;
  modifiedon: string;
  'modifiedon@OData.Community.Display.V1.FormattedValue': string;
  'modifiedon@odata.type': string;
  '_createdonbehalfby_value@OData.Community.Display.V1.FormattedValue'?: string;
  '_createdonbehalfby_value@Microsoft.Dynamics.CRM.lookuplogicalname'?: string;
  '_createdonbehalfby_value@odata.type'?: string;
  '_createdonbehalfby_value'?: string;
}

// Interface for Incident entity
export interface Incident {
  '@odata.type': string;
  '@odata.id': string;
  '@odata.etag': string;
  '@odata.editLink': string;
  modifiedon: string;
  'modifiedon@OData.Community.Display.V1.FormattedValue': string;
  'modifiedon@odata.type': string;
  'versionnumber@OData.Community.Display.V1.FormattedValue': string;
  'versionnumber@odata.type': string;
  versionnumber: number;
  '_owningbusinessunit_value@OData.Community.Display.V1.FormattedValue': string;
  '_owningbusinessunit_value@Microsoft.Dynamics.CRM.associatednavigationproperty': string;
  '_owningbusinessunit_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_owningbusinessunit_value@odata.type': string;
  '_owningbusinessunit_value': string;
  cr6dd_reportername: string;
  '_ownerid_value@OData.Community.Display.V1.FormattedValue': string;
  '_ownerid_value@Microsoft.Dynamics.CRM.associatednavigationproperty': string;
  '_ownerid_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_ownerid_value@odata.type': string;
  '_ownerid_value': string;
  'statuscode@OData.Community.Display.V1.FormattedValue': string;
  statuscode: number;
  '_owninguser_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_owninguser_value@odata.type': string;
  '_owninguser_value': string;
  cr6dd_descriptionsummary: string;
  createdon: string;
  'createdon@OData.Community.Display.V1.FormattedValue': string;
  'createdon@odata.type': string;
  '_cr6dd_assignedresolver_value@OData.Community.Display.V1.FormattedValue': string;
  '_cr6dd_assignedresolver_value@Microsoft.Dynamics.CRM.associatednavigationproperty': string;
  '_cr6dd_assignedresolver_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_cr6dd_assignedresolver_value@odata.type': string;
  '_cr6dd_assignedresolver_value': string;
  cr6dd_incidentid: string;
  'cr6dd_incidentsid@odata.type': string;
  cr6dd_incidentsid: string;
  cr6dd_departmenttype: string;
  cr6dd_emaildraft: string;
  cr6dd_reporteremail: string;
  cr6dd_resolveremail: string;
  'statecode@OData.Community.Display.V1.FormattedValue': string;
  statecode: number;
  '_createdby_value@OData.Community.Display.V1.FormattedValue': string;
  '_createdby_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_createdby_value@odata.type': string;
  '_createdby_value': string;
  cr6dd_resolvername: string;
  cr6dd_userdescription: string;
  '_modifiedby_value@OData.Community.Display.V1.FormattedValue': string;
  '_modifiedby_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_modifiedby_value@odata.type': string;
  '_modifiedby_value': string;
  '_cr6dd_reportedby_value@OData.Community.Display.V1.FormattedValue': string;
  '_cr6dd_reportedby_value@Microsoft.Dynamics.CRM.associatednavigationproperty': string;
  '_cr6dd_reportedby_value@Microsoft.Dynamics.CRM.lookuplogicalname': string;
  '_cr6dd_reportedby_value@odata.type': string;
  '_cr6dd_reportedby_value': string;
  cr6dd_severity: string;
  cr6dd_status: string;
  cr6dd_title: string;
}

// Interface for the full API response
export interface ApiResponse {
  user_table: User[];
  staff_table: Staff[];
  incident_table: Incident[];
}

// API call function to get all data
export const get_all_data = async (): Promise<ApiResponse> => {
  try {
    const response = await apiClient.get<ApiResponse>(
      import.meta.env.VITE_DASHBOARD_ADMIN_API_URL
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching all data:', error);
    throw new Error('Failed to fetch data from API');
  }
};