'use client';

import { useState, useEffect, useRef } from 'react';
import { Conversation, Message, MessageParticipant } from '@/types';

interface ChatInterfaceProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  isTyping?: boolean;
}

export default function ChatInterface({ 
  conversation, 
  messages, 
  currentUserId,
  onSendMessage,
  isTyping = false
}: ChatInterfaceProps) {
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    
    onSendMessage(messageInput.trim());
    setMessageInput('');
  };

  const getOtherParticipant = (): MessageParticipant | undefined => {
    if (!conversation) return undefined;
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

  const formatMessageTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    } else {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    }
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = '';

    messages.forEach(message => {
      const messageDate = new Date(message.timestamp).toDateString();
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: message.timestamp, messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  };

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
        <div className="text-center max-w-md">
          <svg 
            className="w-20 h-20 mx-auto text-gray-300 mb-4" 
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">Выберите диалог</h3>
          <p className="text-gray-600">Выберите беседу из списка, чтобы начать общение</p>
        </div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();
  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        {otherParticipant && (
          <>
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

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 truncate">{otherParticipant.name}</h2>
              {otherParticipant.company && (
                <p className="text-sm text-gray-600 truncate">{otherParticipant.company}</p>
              )}
              {conversation.vacancyTitle && (
                <p className="text-xs text-primary-purple truncate">📋 {conversation.vacancyTitle}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Видеозвонок (в разработке)"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Date Separator */}
            <div className="flex items-center justify-center my-4">
              <span className="bg-white px-4 py-1 rounded-full text-xs text-gray-500 font-medium shadow-sm">
                {formatMessageDate(group.date)}
              </span>
            </div>

            {/* Messages */}
            {group.messages.map((message, messageIndex) => {
              const isCurrentUser = message.senderId === currentUserId;
              const showAvatar = !isCurrentUser && (
                messageIndex === 0 || 
                group.messages[messageIndex - 1].senderId !== message.senderId
              );

              return (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 mb-2 ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 flex-shrink-0">
                    {showAvatar && otherParticipant && (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
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
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[70%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-primary-orange to-primary-pink text-white'
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    
                    {/* Timestamp and Read Receipt */}
                    <div className={`flex items-center gap-1 mt-1 px-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-gray-500">{formatMessageTime(message.timestamp)}</span>
                      {isCurrentUser && (
                        <svg 
                          className={`w-4 h-4 ${message.isRead ? 'text-primary-orange' : 'text-gray-400'}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          {message.isRead && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13l4 4L23 7" />
                          )}
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && otherParticipant && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 flex-shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
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
            </div>
            <div className="bg-white px-4 py-3 rounded-2xl border border-gray-200">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
            title="Прикрепить файл (в разработке)"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange/50"
          />

          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="p-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>

        {/* Feature notice */}
        <p className="text-xs text-gray-500 text-center mt-2">
          📎 Вложения, 📹 видеозвонки и ❤️ реакции скоро будут доступны
        </p>
      </div>
    </div>
  );
}

