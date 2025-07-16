import apiClient from './axios';

// Define interface for Delete ticket request
interface DeleteTicketRequest {
  id: string;
}

// Define interface for Delete ticket response
interface DeleteTicketResponse {
  "ticket deleted successfully": string;
}

// API call function for deleting a ticket
export const deleteTicket = async (ticketData: DeleteTicketRequest): Promise<DeleteTicketResponse> => {
  try {
    const response = await apiClient.post<DeleteTicketResponse>(
      import.meta.env.VITE_DELETE_TICKET_API_URL,
      ticketData
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting ticket:', error);
    throw new Error('Failed to delete ticket');
  }
};
