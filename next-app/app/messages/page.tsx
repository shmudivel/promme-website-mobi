'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Conversation, Message } from '@/types';
import MessagesList from '@/components/MessagesList';
import ChatInterface from '@/components/ChatInterface';
import ChatModal from '@/components/ChatModal';

interface AuthenticatedUser {
  name: string;
  email: string;
  profileType: string;
  profileTypeLabel: string;
}

// Mock data generator
const generateMockConversations = (user: AuthenticatedUser): Conversation[] => {
  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  const mockConversations: Conversation[] = [
    {
      id: 'conv_1',
      participants: [
        { id: user.email, name: user.name, role: 'Соискатель' },
        { id: 'company_1', name: 'АО "Промышленная компания"', company: 'АО "Промышленная компания"', role: 'Работодатель' },
      ],
      lastMessage: {
        content: 'Спасибо за ваш отклик на вакансию инженера. Мы рассмотрим вашу заявку в ближайшее время.',
        timestamp: twoHoursAgo.toISOString(),
        senderId: 'company_1',
      },
      unreadCount: 1,
      updatedAt: twoHoursAgo.toISOString(),
      vacancyId: 'vac_1',
      vacancyTitle: 'Инженер-технолог',
    },
    {
      id: 'conv_2',
      participants: [
        { id: user.email, name: user.name, role: 'Соискатель' },
        { id: 'company_2', name: 'ООО "ТехЗавод"', company: 'ООО "ТехЗавод"', role: 'Работодатель' },
      ],
      lastMessage: {
        content: 'Добрый день! Мы рассмотрели ваше резюме и готовы пригласить вас на собеседование.',
        timestamp: oneDayAgo.toISOString(),
        senderId: 'company_2',
      },
      unreadCount: 2,
      updatedAt: oneDayAgo.toISOString(),
      vacancyId: 'vac_2',
      vacancyTitle: 'Оператор станков с ЧПУ',
    },
    {
      id: 'conv_3',
      participants: [
        { id: user.email, name: user.name, role: 'Соискатель' },
        { id: 'company_3', name: 'ПАО "ПромРесурс"', company: 'ПАО "ПромРесурс"', role: 'Работодатель' },
      ],
      lastMessage: {
        content: 'Приглашаем вас на собеседование в среду, 29 ноября, в 14:00. Подтвердите, пожалуйста, ваше участие.',
        timestamp: threeDaysAgo.toISOString(),
        senderId: 'company_3',
      },
      unreadCount: 0,
      updatedAt: threeDaysAgo.toISOString(),
      vacancyId: 'vac_3',
      vacancyTitle: 'Электрик промышленного предприятия',
    },
  ];

  // Generate mock messages for each conversation
  mockConversations.forEach(conv => {
    const messages = generateMockMessages(conv, user.email);
    localStorage.setItem(`prommeMessages_${conv.id}`, JSON.stringify(messages));
  });

  return mockConversations;
};

const generateMockMessages = (conversation: Conversation, userEmail: string): Message[] => {
  const companyId = conversation.participants.find(p => p.id !== userEmail)?.id || '';
  const baseTime = new Date(conversation.updatedAt).getTime();
  
  const messageTemplates = [
    {
      senderId: userEmail,
      content: `Здравствуйте! Я откликнулся на вакансию "${conversation.vacancyTitle}". Буду рад обсудить детали.`,
      offsetMs: -5 * 24 * 60 * 60 * 1000, // 5 days ago
    },
    {
      senderId: companyId,
      content: 'Добрый день! Благодарим за ваш отклик. Мы ознакомились с вашим резюме.',
      offsetMs: -4 * 24 * 60 * 60 * 1000, // 4 days ago
    },
    {
      senderId: companyId,
      content: 'Расскажите, пожалуйста, подробнее о вашем опыте работы в промышленном секторе.',
      offsetMs: -4 * 24 * 60 * 60 * 1000 + 300000, // 4 days ago + 5 min
    },
    {
      senderId: userEmail,
      content: 'Конечно! У меня 5 лет опыта работы на производстве. Работал с различным оборудованием и имею опыт в оптимизации производственных процессов.',
      offsetMs: -3 * 24 * 60 * 60 * 1000, // 3 days ago
    },
    {
      senderId: companyId,
      content: 'Отлично! Какие сертификаты и дополнительное образование у вас есть?',
      offsetMs: -3 * 24 * 60 * 60 * 1000 + 600000, // 3 days ago + 10 min
    },
    {
      senderId: userEmail,
      content: 'Имею диплом о высшем техническом образовании, сертификаты по охране труда и технике безопасности. Также проходил курсы повышения квалификации.',
      offsetMs: -2 * 24 * 60 * 60 * 1000, // 2 days ago
    },
    {
      senderId: companyId,
      content: conversation.lastMessage?.content || 'Спасибо за информацию!',
      offsetMs: 0, // now
    },
  ];

  const messages: Message[] = messageTemplates.map((template, index) => ({
    id: `msg_${conversation.id}_${index}`,
    conversationId: conversation.id,
    senderId: template.senderId,
    content: template.content,
    timestamp: new Date(baseTime + template.offsetMs).toISOString(),
    isRead: conversation.unreadCount === 0 || template.senderId === userEmail,
  }));

  return messages;
};

function MessagesPageContent() {
  const searchParams = useSearchParams();
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  // Load authenticated user
  useEffect(() => {
    const storedAuthUser = localStorage.getItem('prommeAuthUser');
    if (storedAuthUser) {
      const user = JSON.parse(storedAuthUser);
      setAuthenticatedUser(user);
    }
  }, []);

  // Load conversations from localStorage
  useEffect(() => {
    if (!authenticatedUser) return;

    const conversationsKey = `prommeConversations_${authenticatedUser.email}`;
    const storedConversations = localStorage.getItem(conversationsKey);
    
    if (storedConversations) {
      const loadedConversations = JSON.parse(storedConversations);
      setConversations(loadedConversations);
    } else {
      // Generate mock conversations for demo
      const mockConversations = generateMockConversations(authenticatedUser);
      setConversations(mockConversations);
      localStorage.setItem(conversationsKey, JSON.stringify(mockConversations));
    }
  }, [authenticatedUser]);

  // Check for conversation ID from URL (after application)
  useEffect(() => {
    const conversationId = searchParams.get('conversation');
    if (conversationId && conversations.length > 0) {
      setSelectedConversationId(conversationId);
    }
  }, [searchParams, conversations]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversationId || !authenticatedUser) return;

    const messagesKey = `prommeMessages_${selectedConversationId}`;
    const storedMessages = localStorage.getItem(messagesKey);
    
    if (storedMessages) {
      const loadedMessages = JSON.parse(storedMessages);
      setMessages(loadedMessages);
      
      // Mark messages as read
      markMessagesAsRead(selectedConversationId, loadedMessages);
    }
  }, [selectedConversationId, authenticatedUser]);

  const markMessagesAsRead = (conversationId: string, conversationMessages: Message[]) => {
    if (!authenticatedUser) return;

    const updatedMessages = conversationMessages.map(msg => 
      msg.senderId !== authenticatedUser.email ? { ...msg, isRead: true } : msg
    );
    
    // Save updated messages
    const messagesKey = `prommeMessages_${conversationId}`;
    localStorage.setItem(messagesKey, JSON.stringify(updatedMessages));
    setMessages(updatedMessages);

    // Update conversation unread count
    const conversationsKey = `prommeConversations_${authenticatedUser.email}`;
    const updatedConversations = conversations.map(conv =>
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    );
    setConversations(updatedConversations);
    localStorage.setItem(conversationsKey, JSON.stringify(updatedConversations));
  };

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setShowChatModal(true);
  };

  const handleSendMessage = (content: string) => {
    if (!authenticatedUser || !selectedConversationId) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConversationId,
      senderId: authenticatedUser.email,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Add message to state
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // Save to localStorage
    const messagesKey = `prommeMessages_${selectedConversationId}`;
    localStorage.setItem(messagesKey, JSON.stringify(updatedMessages));

    // Update conversation last message
    const conversationsKey = `prommeConversations_${authenticatedUser.email}`;
    const updatedConversations = conversations.map(conv =>
      conv.id === selectedConversationId
        ? {
            ...conv,
            lastMessage: {
              content,
              timestamp: newMessage.timestamp,
              senderId: newMessage.senderId,
            },
            updatedAt: newMessage.timestamp,
          }
        : conv
    );
    setConversations(updatedConversations);
    localStorage.setItem(conversationsKey, JSON.stringify(updatedConversations));

    // Simulate company response (for demo)
    simulateCompanyResponse();
  };

  const simulateCompanyResponse = () => {
    if (!authenticatedUser || !selectedConversationId) return;

    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        'Спасибо за ваше сообщение! Мы рассмотрим вашу заявку в ближайшее время.',
        'Здравствуйте! Наш HR-специалист свяжется с вами в течение 2-3 рабочих дней.',
        'Добрый день! Мы получили ваше сообщение и готовы обсудить детали.',
        'Отлично! Давайте назначим время для собеседования. Когда вам удобно?',
        'Благодарим за интерес к нашей компании! Какие вопросы вас интересуют?',
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      const selectedConversation = conversations.find(c => c.id === selectedConversationId);
      const otherParticipant = selectedConversation?.participants.find(p => p.id !== authenticatedUser.email);

      if (!otherParticipant) return;

      const companyMessage: Message = {
        id: `msg_${Date.now()}_company`,
        conversationId: selectedConversationId,
        senderId: otherParticipant.id,
        content: randomResponse,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      const updatedMessages = [...messages, companyMessage];
      setMessages(prev => [...prev, companyMessage]);
      setIsTyping(false);

      // Save to localStorage
      const messagesKey = `prommeMessages_${selectedConversationId}`;
      localStorage.setItem(messagesKey, JSON.stringify(updatedMessages));

      // Update conversation
      const conversationsKey = `prommeConversations_${authenticatedUser.email}`;
      const updatedConversations = conversations.map(conv =>
        conv.id === selectedConversationId
          ? {
              ...conv,
              lastMessage: {
                content: randomResponse,
                timestamp: companyMessage.timestamp,
                senderId: companyMessage.senderId,
              },
              updatedAt: companyMessage.timestamp,
              unreadCount: conv.unreadCount + 1,
            }
          : conv
      );
      setConversations(updatedConversations);
      localStorage.setItem(conversationsKey, JSON.stringify(updatedConversations));
    }, 2000);
  };

  const handleCloseChatModal = () => {
    setShowChatModal(false);
  };

  if (!authenticatedUser) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Войдите, чтобы просмотреть сообщения</h2>
          <p className="text-gray-600 mb-6">Для доступа к сообщениям необходимо авторизоваться</p>
          <a
            href="/auth"
            className="inline-block bg-primary-orange text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            Войти
          </a>
        </div>
      </div>
    );
  }

  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;

  return (
    <>
      <div className="h-screen flex flex-col md:flex-row bg-gray-50">
        {/* Desktop: Split View */}
        <div className="hidden md:flex md:w-[350px] md:flex-shrink-0">
          <MessagesList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            currentUserId={authenticatedUser.email}
            onSelectConversation={handleSelectConversation}
          />
        </div>

        <div className="hidden md:flex md:flex-1">
          <ChatInterface
            conversation={selectedConversation}
            messages={messages}
            currentUserId={authenticatedUser.email}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </div>

        {/* Mobile: Messages List Only */}
        <div className="md:hidden flex-1 flex flex-col">
          <MessagesList
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            currentUserId={authenticatedUser.email}
            onSelectConversation={handleSelectConversation}
          />
        </div>
      </div>

      {/* Mobile: Chat Modal */}
      {showChatModal && selectedConversation && (
        <ChatModal
          conversation={selectedConversation}
          messages={messages}
          currentUserId={authenticatedUser.email}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
          onClose={handleCloseChatModal}
        />
      )}
    </>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-orange"></div>
          <p className="mt-4 text-gray-600">Загрузка сообщений...</p>
        </div>
      </div>
    }>
      <MessagesPageContent />
    </Suspense>
  );
}

