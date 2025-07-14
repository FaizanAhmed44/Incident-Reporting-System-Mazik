import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'employee' | 'support' | 'admin';
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface IncidentChatProps {
  ticketId: string;
}

const IncidentChat: React.FC<IncidentChatProps> = ({ ticketId }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'support-001',
      senderName: 'Sarah Johnson',
      senderRole: 'support',
      message: 'Hello! I\'ve received your incident report and I\'m looking into the email server issue. Can you tell me if this is affecting your entire team or just your account?',
      timestamp: '2024-01-18T10:30:00Z',
      isRead: true
    },
    {
      id: '2',
      senderId: 'emp-001',
      senderName: 'John Doe',
      senderRole: 'employee',
      message: 'Hi Sarah, thanks for the quick response! It seems to be affecting our entire sales team. We haven\'t been able to send or receive emails since around 9 AM this morning.',
      timestamp: '2024-01-18T10:35:00Z',
      isRead: true
    },
    {
      id: '3',
      senderId: 'support-001',
      senderName: 'Sarah Johnson',
      senderRole: 'support',
      message: 'Thank you for that information. I\'ve escalated this to our server team and they\'re working on it now. I\'ll keep you updated on the progress. Expected resolution time is within the next 2 hours.',
      timestamp: '2024-01-18T10:40:00Z',
      isRead: true
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate support team response (only if user is employee)
    if (user.role === 'employee') {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          const supportResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            senderId: 'support-001',
            senderName: 'Sarah Johnson',
            senderRole: 'support',
            message: 'Thanks for the update! I\'ll look into this right away.',
            timestamp: new Date().toISOString(),
            isRead: false
          };
          setMessages(prev => [...prev, supportResponse]);
          setIsTyping(false);
        }, 2000);
      }, 1000);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'support': return 'bg-blue-500';
      case 'admin': return 'bg-red-500';
      case 'employee': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'support': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'admin': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'employee': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Incident Chat</h3>
            <p className="text-blue-100 text-sm">Ticket #{ticketId}</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
      >
        {messages.map((message, index) => {
          const showDate = index === 0 || 
            formatDate(messages[index - 1].timestamp) !== formatDate(message.timestamp);
          
          return (
            <div key={message.id}>
              {/* Date Separator */}
              {showDate && (
                <div className="flex items-center justify-center my-4">
                  <div className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                </div>
              )}

              {/* Message */}
              <div className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md ${message.senderId === user?.id ? 'order-2' : 'order-1'}`}>
                  {/* Sender Info */}
                  {message.senderId !== user?.id && (
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-6 h-6 rounded-full ${getRoleColor(message.senderRole)} flex items-center justify-center`}>
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {message.senderName}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(message.senderRole)}`}>
                        {message.senderRole}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.senderId === user?.id
                      ? 'bg-blue-600 text-white rounded-br-md'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-bl-md'
                  }`}>
                    <p className="text-sm leading-relaxed">{message.message}</p>
                  </div>

                  {/* Timestamp */}
                  <div className={`flex items-center space-x-1 mt-1 ${
                    message.senderId === user?.id ? 'justify-end' : 'justify-start'
                  }`}>
                    <Clock className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="max-w-xs lg:max-w-md">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Sarah Johnson
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                  support
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              maxLength={500}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
          {newMessage.length}/500 characters
        </div>
      </div>
    </div>
  );
};

export default IncidentChat;