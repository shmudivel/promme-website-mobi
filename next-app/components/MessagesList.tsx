'use client';

import { useState } from 'react';
import { Conversation, MessageParticipant } from '@/types';

interface MessagesListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  currentUserId: string;
  onSelectConversation: (conversationId: string) => void;
}

export default function MessagesList({ 
  conversations, 
  selectedConversationId, 
  currentUserId,
  onSelectConversation 
}: MessagesListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);
    const searchLower = searchQuery.toLowerCase();
    return (
      otherParticipant?.name.toLowerCase().includes(searchLower) ||
      otherParticipant?.company?.toLowerCase().includes(searchLower) ||
      conversation.lastMessage?.content.toLowerCase().includes(searchLower)
    );
  });

  const getOtherParticipant = (conversation: Conversation): MessageParticipant | undefined => {
    return conversation.participants.find(p => p.id !== currentUserId);
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins}м`;
    if (diffHours < 24) return `${diffHours}ч`;
    if (diffDays < 7) return `${diffDays}д`;
    
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Сообщения</h2>
        
        {/* Search Bar */}
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          <input
            type="text"
            placeholder="Поиск сообщений..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange/50"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <svg 
              className="w-16 h-16 mx-auto text-gray-300 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
            <p className="text-gray-600 text-sm">
              {searchQuery ? 'Ничего не найдено' : 'Нет сообщений'}
            </p>
          </div>
        ) : (
          <div>
            {filteredConversations.map(conversation => {
              const otherParticipant = getOtherParticipant(conversation);
              if (!otherParticipant) return null;

              const isSelected = conversation.id === selectedConversationId;
              const hasUnread = conversation.unreadCount > 0;

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation.id)}
                  className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                    isSelected ? 'bg-primary-orange/5 border-l-4 border-l-primary-orange' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${
                      otherParticipant.avatar 
                        ? 'bg-gray-200' 
                        : 'bg-gradient-to-br from-primary-orange to-primary-pink'
                    }`}>
                      {otherParticipant.avatar ? (
                        <img 
                          src={otherParticipant.avatar} 
                          alt={otherParticipant.name} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        getInitials(otherParticipant.name)
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between mb-1">
                        <h3 className={`font-semibold truncate ${hasUnread ? 'text-gray-900' : 'text-gray-700'}`}>
                          {otherParticipant.name}
                        </h3>
                        {conversation.lastMessage && (
                          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                            {formatTimestamp(conversation.lastMessage.timestamp)}
                          </span>
                        )}
                      </div>
                      
                      {otherParticipant.company && (
                        <p className="text-xs text-gray-500 mb-1">{otherParticipant.company}</p>
                      )}
                      
                      {conversation.vacancyTitle && (
                        <p className="text-xs text-primary-purple mb-1 truncate">
                          📋 {conversation.vacancyTitle}
                        </p>
                      )}
                      
                      {conversation.lastMessage && (
                        <div className="flex items-center justify-between">
                          <p className={`text-sm truncate ${hasUnread ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                            {conversation.lastMessage.content}
                          </p>
                          {hasUnread && (
                            <span className="ml-2 flex-shrink-0 w-5 h-5 bg-primary-orange rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}


