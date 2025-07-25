import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  MessageCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  retrieveChatMessages,
  postChatMessage,
  ChatMessageFromApi,
  PostChatPayload,
} from "../../api/chatApi";
import { getUserTickets, TicketFromApi } from "../../api/incidentApi";
import { fetchIncidents, UserResponse } from "../../api/supportApi";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "employee" | "support" | "admin";
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface IncidentChatProps {
  ticketId: string;
}

const IncidentChat: React.FC<IncidentChatProps> = ({ ticketId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping] = useState(false);
  const [onlineUsers] = useState(2);

  // Critical IDs for chat functionality
  const [incidentGuid, setIncidentGuid] = useState<string | null>(null);
  const [resolverStaffId, setResolverStaffId] = useState<string | null>(null);
  const [reporterEmployeeId, setReporterEmployeeId] = useState<string | null>(
    null
  );
  const [ticketData, setTicketData] = useState<
    TicketFromApi | UserResponse | null
  >(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch Incident GUID and other critical IDs based on user role
  const fetchIncidentData = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);

    try {
      let data: TicketFromApi | UserResponse | undefined;

      if (user.role === "support" || user.role === "admin") {
        const incidentsArray = await fetchIncidents({ userId: user.id });
        data = incidentsArray.find((t) => t.IncidentID === ticketId);
      } else {
        const response = await getUserTickets(user.id);
        data = response.tickets.find((t) => t.incidentID === ticketId);
      }

      if (data) {
        setTicketData(data);
        setIncidentGuid(data.incidents);
        setResolverStaffId(data.assignedResolver);
        const reporterId =
          (data as TicketFromApi).reportedBy ||
          (data as UserResponse).reportedBy;
        setReporterEmployeeId(reporterId);

        if (!reporterId) {
          console.warn(
            "Reporter/Employee GUID not found in API response. Sending messages may fail."
          );
        }
      } else {
        setError(
          "Could not find this ticket. Check permissions or ticket assignment."
        );
      }
    } catch (err) {
      console.error("Error fetching incident data:", err);
      setError("Failed to load incident information.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages from Dataverse
  const fetchMessages = async () => {
    if (!incidentGuid) return;

    try {
      const response = await retrieveChatMessages({ incidentid: incidentGuid });

      const transformedMessages: ChatMessage[] = response.messages.map(
        (msg: ChatMessageFromApi) => {
          // Determine sender ID and role more reliably
          let actualSenderId: string;
          let actualSenderRole: "employee" | "support" | "admin";
          let actualSenderName: string;

          // Check if this message is from the current user by comparing names first
          const isCurrentUserByName = msg.senderName === user?.name;

          if (isCurrentUserByName) {
            // This is the current user's message
            actualSenderId = user?.id || "current-user";
            actualSenderRole =
              (user?.role as "employee" | "support" | "admin") || "employee";
            actualSenderName = user?.name || msg.senderName || "You";
          } else {
            // This is from another user
            actualSenderId = msg.staffid || msg.employeeid || "other-user";
            actualSenderName =
              msg.senderName ||
              msg.staffName ||
              msg.employeeName ||
              "Other User";

            // Determine role based on current user's role (opposite user type)
            if (user?.role === "employee") {
              // If current user is employee, other messages are from support/admin
              actualSenderRole = "support";
            } else {
              // If current user is support/admin, other messages are from employee
              actualSenderRole = "employee";
            }
          }

          return {
            id: msg.id || Date.now().toString(),
            senderId: actualSenderId,
            senderName: actualSenderName,
            senderRole: actualSenderRole,
            message: msg.message || "",
            timestamp: msg.time || msg.timestamp || new Date().toISOString(),
            isRead: msg.isRead !== undefined ? msg.isRead : true,
          };
        }
      );

      setMessages(transformedMessages);
      setError(null);
    } catch (err) {
      console.error("Error fetching messages:", err);
      // setError("Failed to load chat messages. Please try again.");
    }
  };

  // Send message to Dataverse
  const sendMessageToDataverse = async (messageText: string) => {
    if (!incidentGuid || !resolverStaffId || !reporterEmployeeId || !user?.id) {
      setError("Cannot send message. Critical ticket information is missing.");
      return;
    }

    setIsSending(true);

    try {
      const payload: PostChatPayload = {
        message: messageText,
        time: new Date().toISOString(),
        incidentid: incidentGuid,
        staffid: resolverStaffId,
        employeeid: reporterEmployeeId,
        senderName: user.name || "Unknown User",
        senderRole: user.role,
      };

      await postChatMessage(payload);
      await fetchMessages();
      setError(null);
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Initial data load effect
  useEffect(() => {
    if (ticketId && user?.id) {
      fetchIncidentData();
    }
  }, [ticketId, user?.id]);

  // Message fetching and auto-refresh effect
  useEffect(() => {
    if (incidentGuid) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [incidentGuid]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || isSending) return;

    const messageText = newMessage.trim();
    setNewMessage("");

    // Optimistic UI update
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      message: messageText,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setMessages((prev) => [...prev, tempMessage]);

    await sendMessageToDataverse(messageText);
  };

  const handleRefresh = () => {
    if (incidentGuid) {
      fetchMessages();
    } else {
      fetchIncidentData();
    }
  };

  // Helper functions for rendering
  const formatTime = (timestamp: string) =>
    new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString();
  };

  const getRoleColor = (role: string) =>
    ({
      support: "bg-gradient-to-br from-blue-500 to-blue-600",
      admin: "bg-gradient-to-br from-purple-500 to-purple-600",
      employee: "bg-gradient-to-br from-green-500 to-green-600",
    }[role] || "bg-gradient-to-br from-gray-400 to-gray-500");

  const getRoleBadge = (role: string) =>
    ({
      support:
        "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
      admin:
        "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800",
      employee:
        "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    }[role] ||
    "bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600");

  const getStatusColor = (status: string) =>
    ({
      Open: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300",
      "In Progress":
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300",
      Pending:
        "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300",
      Resolved:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300",
    }[status] || "bg-gray-100 text-gray-800");

  // FIXED: Simplified logic - current user messages go to the right, others to the left
  const isMyMessage = (message: ChatMessage) => {
    // Primary check: Compare sender name (most reliable)
    if (user?.name && message.senderName) {
      return message.senderName === user.name;
    }

    // Secondary check: Compare sender ID if name comparison fails
    if (user?.id && message.senderId && message.senderId !== "unknown") {
      return message.senderId === user.id;
    }

    // Fallback: Check if sender ID matches current user pattern
    return message.senderId === user?.id || message.senderId === "current-user";
  };

  const canSendMessage =
    newMessage.trim() && !isSending && incidentGuid && user?.id;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Enhanced Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  Incident Chat
                </h3>
                <p className="text-blue-100 text-sm font-medium">
                  Ticket #{ticketId}
                </p>
                {ticketData && (
                  <p className="text-blue-200 text-xs mt-1">
                    {(ticketData as TicketFromApi).title ||
                      (ticketData as UserResponse).Title}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 disabled:opacity-50"
                title="Refresh messages"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Status and Activity Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {ticketData && (
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                    (ticketData as TicketFromApi).status ||
                      (ticketData as UserResponse).Status
                  )}`}
                >
                  <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></div>
                  {(ticketData as TicketFromApi).status ||
                    (ticketData as UserResponse).Status}
                </span>
              )}
              <span className="text-blue-100 text-sm flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                {onlineUsers} online
              </span>
              {ticketData && (
                <span className="text-blue-100 text-sm">
                  Severity:{" "}
                  {(ticketData as TicketFromApi).severity ||
                    (ticketData as UserResponse).Severity}
                </span>
              )}
            </div>
            {isTyping && (
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-200 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-200 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-200 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-blue-200 text-sm">
                  Someone is typing...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 m-4 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading conversation...
              </p>
            </div>
          </div>
        ) : messages.length === 0 && !error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="bg-blue-100 dark:bg-blue-900/20 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <MessageCircle className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Start the conversation
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No messages yet. Send a message to begin chatting about this
                incident.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const showDate =
              index === 0 ||
              formatDate(messages[index - 1].timestamp) !==
                formatDate(message.timestamp);
            const isFromCurrentUser = isMyMessage(message);
            const showAvatar = !isFromCurrentUser; // Always show avatar for non-current-user messages

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex justify-center my-6">
                    <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300">
                      {formatDate(message.timestamp)}
                    </div>
                  </div>
                )}
                <div
                  className={`flex items-end gap-3 ${
                    isFromCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isFromCurrentUser && (
                    <div
                      className={`w-8 h-8 rounded-full ${getRoleColor(
                        message.senderRole
                      )} flex items-center justify-center flex-shrink-0 shadow-lg ${
                        showAvatar ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg/1200px-Mark_Zuckerberg_F8_2019_Keynote_%2832830578717%29_%28cropped%29.jpg"
                        alt="Mark Zuckerberg"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-md ${
                      isFromCurrentUser ? "order-2" : "order-1"
                    }`}
                  >
                    {!isFromCurrentUser && showAvatar && (
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {message.senderName}
                        </span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(
                            message.senderRole
                          )}`}
                        >
                          {message.senderRole}
                        </span>
                      </div>
                    )}
                    <div className="group relative">
                      <div
                        className={`rounded-2xl px-4 py-3 shadow-sm ${
                          isFromCurrentUser
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-md"
                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.message}
                        </p>
                      </div>
                      <div
                        className={`flex items-center space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isFromCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <Clock className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(message.timestamp)}
                        </span>
                        {isFromCurrentUser && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {message.isRead ? "Read" : "Sent"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isFromCurrentUser && (
                    <div
                      className={`w-8 h-8 rounded-full ${getRoleColor(
                        message.senderRole
                      )} flex items-center justify-center flex-shrink-0 shadow-lg`}
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/1200px-Elon_Musk_Royal_Society_%28crop2%29.jpg"
                        alt="Elon Musk"
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Message Input */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={!incidentGuid}
              className="w-full px-4 py-3 pr-20 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed resize-none"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
          </div>
          <button
            type="submit"
            disabled={!canSendMessage}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 dark:disabled:from-gray-600 dark:disabled:to-gray-700 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
          >
            {isSending ? (
              <RefreshCw className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IncidentChat;
