'use client';

import { Conversation, Message } from '@/types';
import ChatInterface from './ChatInterface';

interface ChatModalProps {
  conversation: Conversation | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  isTyping?: boolean;
  onClose: () => void;
}

export default function ChatModal({ 
  conversation, 
  messages, 
  currentUserId,
  onSendMessage,
  isTyping = false,
  onClose
}: ChatModalProps) {
  if (!conversation) return null;

  const otherParticipant = conversation.participants.find(p => p.id !== currentUserId);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col md:hidden">
      {/* Mobile Header with Back Button */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Назад"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {otherParticipant && (
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-gray-900 truncate">{otherParticipant.name}</h2>
            {otherParticipant.company && (
              <p className="text-xs text-gray-600 truncate">{otherParticipant.company}</p>
            )}
          </div>
        )}
      </div>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          conversation={conversation}
          messages={messages}
          currentUserId={currentUserId}
          onSendMessage={onSendMessage}
          isTyping={isTyping}
        />
      </div>
    </div>
  );
}

