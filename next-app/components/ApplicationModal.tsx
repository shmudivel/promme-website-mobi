'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Vacancy, Application } from '@/types';

interface ApplicationModalProps {
  vacancy: Vacancy;
  onClose: () => void;
  onSubmit: () => void;
}

export default function ApplicationModal({ vacancy, onClose, onSubmit }: ApplicationModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Get user profile data
    const storedAuthUser = localStorage.getItem('prommeAuthUser');
    if (storedAuthUser) {
      const authUser = JSON.parse(storedAuthUser);
      const profileKey = `prommeProfile_${authUser.email}_${authUser.profileType}`;
      const storedProfile = localStorage.getItem(profileKey);
      
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setUserProfile({ ...authUser, ...profile });
      } else {
        setUserProfile(authUser);
      }
    }
  }, []);

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate submission delay
    setTimeout(() => {
      // Get stored auth user
      const storedAuthUser = localStorage.getItem('prommeAuthUser');
      if (!storedAuthUser) return;

      const authUser = JSON.parse(storedAuthUser);
      
      // Get user profile
      const profileKey = `prommeProfile_${authUser.email}_${authUser.profileType}`;
      const storedProfile = localStorage.getItem(profileKey);
      const profile = storedProfile ? JSON.parse(storedProfile) : {};

      // Create application
      const application: Application = {
        id: `app_${Date.now()}`,
        vacancy_id: vacancy.id,
        vacancy_title: vacancy.title,
        vacancy_company: vacancy.company,
        applicant_id: authUser.email,
        applicant_name: profile.fullName || authUser.name,
        applicant_email: profile.email || authUser.email,
        applicant_position: profile.position || 'Соискатель',
        applicant_location: profile.location,
        resume: {
          summary: profile.about || 'Профиль не заполнен',
          experience_years: profile.experience ? parseInt(profile.experience) : undefined,
          skills: profile.skills ? profile.skills.split(',').map((s: string) => s.trim()) : [],
          education: profile.education,
          salary_expectation: profile.salaryExpectation,
        },
        status: 'pending',
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Save to user's applications
      const userApplicationsKey = `prommeApplications_${authUser.email}`;
      const existingApplications = localStorage.getItem(userApplicationsKey);
      const applications = existingApplications ? JSON.parse(existingApplications) : [];
      applications.push(application);
      localStorage.setItem(userApplicationsKey, JSON.stringify(applications));

      // Save to company's applications inbox (for demo)
      const companyInboxKey = `prommeCompanyInbox_${vacancy.company}`;
      const companyApplications = localStorage.getItem(companyInboxKey);
      const companyApps = companyApplications ? JSON.parse(companyApplications) : [];
      companyApps.push(application);
      localStorage.setItem(companyInboxKey, JSON.stringify(companyApps));

      setIsSubmitting(false);
      setIsSuccess(true);

      // Create conversation for messaging
      createConversation(authUser, vacancy, application);

      // Close modal after success and redirect to messages
      setTimeout(() => {
        onSubmit();
        // Redirect to messages page with new conversation
        const conversationId = `conv_${vacancy.company}_${Date.now()}`;
        router.push(`/messages?conversation=${conversationId}`);
      }, 2000);
    }, 1500);
  };

  const createConversation = (authUser: any, vacancy: Vacancy, application: Application) => {
    const conversationId = `conv_${vacancy.company}_${Date.now()}`;
    const conversationsKey = `prommeConversations_${authUser.email}`;
    const messagesKey = `prommeMessages_${conversationId}`;

    // Create conversation
    const conversation = {
      id: conversationId,
      participants: [
        {
          id: authUser.email,
          name: application.applicant_name,
          role: 'Соискатель',
        },
        {
          id: `company_${vacancy.company}`,
          name: vacancy.company,
          company: vacancy.company,
          role: 'Работодатель',
        },
      ],
      lastMessage: {
        content: `Здравствуйте! Я откликнулся на вакансию "${vacancy.title}". Буду рад обсудить детали.`,
        timestamp: new Date().toISOString(),
        senderId: authUser.email,
      },
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
      vacancyId: vacancy.id,
      vacancyTitle: vacancy.title,
    };

    // Create first message
    const firstMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: authUser.email,
      content: `Здравствуйте! Я откликнулся на вакансию "${vacancy.title}". Буду рад обсудить детали.`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    // Save conversation
    const existingConversations = localStorage.getItem(conversationsKey);
    const conversations = existingConversations ? JSON.parse(existingConversations) : [];
    conversations.unshift(conversation);
    localStorage.setItem(conversationsKey, JSON.stringify(conversations));

    // Save first message
    localStorage.setItem(messagesKey, JSON.stringify([firstMessage]));
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-text mb-3">Успешно отправлено!</h2>
          <p className="text-text-light text-lg mb-2">Ваше резюме получено работодателем</p>
          <p className="text-text-light text-sm">Ожидайте ответа от компании {vacancy.company}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-purple-dark to-primary-purple p-6 rounded-t-3xl">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Подтверждение отклика</h2>
              <p className="text-white/90">{vacancy.title} • {vacancy.company}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* User Info */}
          {userProfile && (
            <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
              <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Ваши данные
              </h3>
              <div className="space-y-2 text-text-light">
                <p><span className="font-semibold">Имя:</span> {userProfile.fullName || userProfile.name}</p>
                <p><span className="font-semibold">Email:</span> {userProfile.email}</p>
                {userProfile.phone && <p><span className="font-semibold">Телефон:</span> {userProfile.phone}</p>}
                {userProfile.location && <p><span className="font-semibold">Город:</span> {userProfile.location}</p>}
              </div>
            </div>
          )}

          {/* Resume Info */}
          <div className="mb-6 p-6 bg-orange-50 rounded-2xl">
            <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-orange" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Резюме будет автоматически прикреплено
            </h3>
            <p className="text-text-light text-sm">
              Ваше резюме из профиля будет отправлено работодателю вместе с откликом.
              {!userProfile?.about && (
                <span className="block mt-2 text-amber-600 font-medium">
                  ⚠️ Рекомендуем заполнить профиль для лучших результатов
                </span>
              )}
            </p>
          </div>

          {/* What happens next */}
          <div className="mb-8 p-6 bg-blue-50 rounded-2xl">
            <h3 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Что дальше?
            </h3>
            <ul className="space-y-2 text-text-light text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">1.</span>
                <span>Ваше резюме будет отправлено в компанию {vacancy.company}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Работодатель рассмотрит вашу заявку в течение 3-5 рабочих дней</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">3.</span>
                <span>При заинтересованности компания свяжется с вами напрямую</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">4.</span>
                <span>Статус отклика можно отслеживать в вашем профиле</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 border-2 border-gray-300 text-text font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-primary-orange to-primary-pink text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Отправка...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 8L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Отправить отклик
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

