//chatApi.ts
import apiClient from './axios';

export interface ChatMessageFromApi {
  id: string;
  message: string;
  time: string;
  timestamp?: string;
  staffid?: string;
  employeeid?: string;
  senderName?: string;
  staffName?: string;
  employeeName?: string;
  senderRole?: 'employee' | 'support' | 'admin';
  isRead?: boolean;
}

export interface RetrieveChatResponse {
  incidentid: string;
  messages: ChatMessageFromApi[];
}

export interface PostChatPayload {
  message: string;
  time: string;
  incidentid: string;
  staffid: string | null;
  employeeid: string | null;
  senderName?: string;
  senderRole?: 'employee' | 'support' | 'admin';
}

export interface PostChatResponse {
  message: string;
}

export interface RetrieveChatPayload {
  incidentid: string;
}

/**
 * Retrieves all chat messages for a specific incident
 * @param payload - Object containing incidentid (GUID of the incident record)
 * @returns Promise resolving to chat messages
 */
export const retrieveChatMessages = async (payload: RetrieveChatPayload): Promise<RetrieveChatResponse> => {
  try {
    const apiUrl = import.meta.env.VITE_RETRIEVE_MESSAGES_API_URL;
    if (!apiUrl) {
      throw new Error('VITE_RETRIEVE_MESSAGES_API_URL is not defined in environment variables');
    }
    
    console.log('Fetching chat messages from:', apiUrl);
    const response = await apiClient.post<RetrieveChatResponse>(apiUrl, payload);
    console.log('Retrieve chat response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to retrieve chat messages:', error);
    throw new Error('API call to retrieve chat messages failed');
  }
};

/**
 * Posts a new chat message to the incident
 * @param payload - Message data including content and sender info
 * @returns Promise resolving when message is sent
 */
export const postChatMessage = async (payload: PostChatPayload): Promise<PostChatResponse> => {
  try {
    const apiUrl = import.meta.env.VITE_SEND_MESSAGE_API_URL;
    if (!apiUrl) {
      throw new Error('VITE_SEND_MESSAGE_API_URL is not defined in environment variables');
    }
    
    console.log('Sending chat message to:', apiUrl);
    console.log('Payload:', payload);
    const response = await apiClient.post<PostChatResponse>(apiUrl, payload);
    console.log('Send message response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send chat message:', error);
    throw new Error('API call to send chat message failed');
  }
};
