'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AIChat from '@/components/AIChat';
import { Application } from '@/types';

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  education: string;
  experience: string;
  skills: string;
  languages: string;
  about: string;
}

interface AuthenticatedUser {
  name: string;
  email: string;
  profileType: string;
  profileTypeLabel: string;
}

interface AvatarData {
  photoUrl: string;
  videoUrl: string;
  generatedAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null);
  const [avatarData, setAvatarData] = useState<AvatarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLoadProfile();
  }, []);

  const checkAuthAndLoadProfile = () => {
    try {
      // Check authentication
      const storedAuthUser = localStorage.getItem('prommeAuthUser');
      if (!storedAuthUser) {
        router.push('/auth?redirectTo=%2Fprofile');
        // Keep loading state true during redirect
        return;
      }

      const authUser: AuthenticatedUser = JSON.parse(storedAuthUser);
      setAuthenticatedUser(authUser);

      // Load profile data
      const profileKey = `prommeProfile_${authUser.email}_${authUser.profileType}`;
      const storedProfile = localStorage.getItem(profileKey);
      
      if (storedProfile) {
        const profile: ProfileFormData = JSON.parse(storedProfile);
        setProfileData(profile);
      }

      // Load avatar data
      const avatarKey = `prommeAvatar_${authUser.email}_${authUser.profileType}`;
      const storedAvatar = localStorage.getItem(avatarKey);
      
      if (storedAvatar) {
        const avatar: AvatarData = JSON.parse(storedAvatar);
        setAvatarData(avatar);
      } else if (storedProfile) {
        // Profile exists but no avatar - suggest avatar creation
        // Check if already shown this session
        const avatarSuggestionShown = sessionStorage.getItem('avatarSuggestionShown');

        if (!avatarSuggestionShown) {
          // Set trigger flag - AIChat will poll for this
          sessionStorage.setItem('triggerAvatarSuggestion', 'true');
          sessionStorage.setItem('triggerAvatarTimestamp', Date.now().toString());
        }
      } else {
        // No profile yet - trigger AI chat for profile creation
        const profileCreationShown = sessionStorage.getItem('profileCreationShown');
        
        if (!profileCreationShown) {
          sessionStorage.setItem('freshLogin', 'true');
          sessionStorage.setItem('profileCreationShown', 'true');
          window.dispatchEvent(new Event('profileCreationReady'));
        }
      }
      
      // Only set loading to false after successfully loading data
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading profile:', error);
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    // Reopen AI Chat or navigate to edit page
    router.push('/?edit=true');
  };

  const handleCreateAvatar = () => {
    sessionStorage.setItem('triggerAvatarSuggestion', 'true');
    window.location.reload();
  };

  const handleCreatePost = () => {
    alert('📝 Функция создания поста находится в разработке!\n\nСкоро вы сможете:\n• Публиковать новости\n• Делиться достижениями\n• Размещать объявления');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF8C42] via-[#FF6B35] to-[#E94397] flex items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!authenticatedUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF8C42] via-[#FF6B35] to-[#E94397] py-20 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Video Avatar Section */}
        {avatarData && (
          <div className="mb-6 rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-purple">
                <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h2 className="text-2xl font-bold text-text">Видео-Аватар</h2>
              <span className="ml-auto rounded-full bg-gradient-to-r from-green-400 to-green-500 px-3 py-1 text-xs font-semibold text-white">
                ✨ AI
              </span>
            </div>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
              <video
                className="h-full w-full object-cover"
                controls
                autoPlay
                loop
                muted
                poster={avatarData.photoUrl}
              >
                <source src={avatarData.videoUrl} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
            </div>
            <p className="mt-3 text-center text-sm text-text-light">
              Видео-аватар создан {new Date(avatarData.generatedAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
        )}

        {/* Header Card */}
        <div className="mb-6 rounded-3xl bg-white p-4 sm:p-8 shadow-2xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
                {profileData?.fullName || authenticatedUser.name}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center rounded-full bg-gradient-to-r from-primary-orange to-primary-orange-light px-4 py-1.5 text-sm font-semibold text-white">
                  {authenticatedUser.profileTypeLabel}
                </span>
                {profileData?.location && (
                  <span className="flex items-center gap-1 text-text-light">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {profileData.location}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={handleCreatePost}
                className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all hover:shadow-lg"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="hidden sm:inline">Создать пост</span>
                <span className="sm:hidden">Пост</span>
              </button>
              {!avatarData && authenticatedUser?.profileType === 'job-seeker' && (
                <button
                  onClick={handleCreateAvatar}
                  className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-primary-pink to-primary-purple px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all hover:shadow-lg"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                    <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="hidden sm:inline">Создать видео-аватар</span>
                  <span className="sm:hidden">Аватар</span>
                </button>
              )}
              <button
                onClick={handleEditProfile}
                className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-gradient-to-r from-primary-purple-dark to-primary-purple px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white transition-all hover:shadow-lg"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                  <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="hidden sm:inline">Редактировать</span>
                <span className="sm:hidden">Изменить</span>
              </button>
              <Link
                href="/"
                className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-gray-100 px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-text transition-all hover:bg-gray-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="hidden sm:inline">На главную</span>
                <span className="sm:hidden">Главная</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        {profileData ? (
          authenticatedUser?.profileType === 'job-seeker' ? (
            <JobSeekerProfile profileData={profileData} />
          ) : authenticatedUser?.profileType === 'company' ? (
            <CompanyProfile profileData={profileData} authenticatedUser={authenticatedUser} />
          ) : (
            <FacilitatorProfile profileData={profileData} authenticatedUser={authenticatedUser} />
          )
        ) : (
          <EmptyProfileState handleEditProfile={handleEditProfile} profileType={authenticatedUser?.profileType} />
        )}

      </div>
      <AIChat />
    </div>
  );
}

// Profile Layout Components
function JobSeekerProfile({ profileData }: { profileData: ProfileFormData }) {
  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <div className="rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-orange">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Фото профиля
        </h2>
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-orange via-primary-pink to-primary-purple flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {profileData.fullName?.charAt(0).toUpperCase() || '?'}
          </div>
          <p className="text-sm text-gray-500 text-center">
            📸 Загрузка фото находится в разработке
          </p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-orange">
            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Контактная информация
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <ProfileField icon={<MailIcon />} label="Email" value={profileData.email} />
          <ProfileField icon={<PhoneIcon />} label="Телефон" value={profileData.phone} />
          <ProfileField icon={<CalendarIcon />} label="Дата рождения" value={profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString('ru-RU') : ''} />
          <ProfileField icon={<LocationIcon />} label="Город" value={profileData.location} />
        </div>
      </div>

      {/* Education */}
      {profileData.education && (
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-purple">
              <path d="M12 14L21 9L12 4L3 9L12 14ZM12 14L18.16 10.53C18.71 11.66 19 12.92 19 14.24C19 15.56 18.71 16.82 18.16 17.95M12 14L5.84 10.53C5.29 11.66 5 12.92 5 14.24C5 15.56 5.29 16.82 5.84 17.95M12 14V22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Образование
          </h2>
          <p className="text-text leading-relaxed">{profileData.education}</p>
        </div>
      )}

      {/* Work Experience */}
      {profileData.experience && (
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-gold">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Опыт работы
          </h2>
          <p className="text-text leading-relaxed">{profileData.experience}</p>
        </div>
      )}

      {/* Skills */}
      {profileData.skills && (
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-pink">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Профессиональные навыки
          </h2>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.split(',').map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-gradient-to-r from-primary-orange/10 to-primary-pink/10 px-4 py-2 text-sm font-medium text-text border border-primary-orange/20"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages & About */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Languages */}
        {profileData.languages && (
          <div className="rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-text">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-purple">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Языки
            </h2>
            <p className="text-text">{profileData.languages}</p>
          </div>
        )}

        {/* About */}
        {profileData.about && (
          <div className="rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-text">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-gold">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              О себе
            </h2>
            <p className="text-text leading-relaxed">{profileData.about}</p>
          </div>
        )}
      </div>

      {/* My Applications */}
      <MyApplicationsSection />
    </div>
  );
}

// My Applications Section Component
function MyApplicationsSection() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    // Load user applications
    const storedAuthUser = localStorage.getItem('prommeAuthUser');
    if (storedAuthUser) {
      const authUser = JSON.parse(storedAuthUser);
      const applicationsKey = `prommeApplications_${authUser.email}`;
      const storedApplications = localStorage.getItem(applicationsKey);
      
      if (storedApplications) {
        const parsedApplications = JSON.parse(storedApplications);
        setApplications(parsedApplications.reverse()); // Show newest first
      }
    }
  }, []);

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'pending': 'На рассмотрении',
      'reviewed': 'Просмотрено',
      'interview': 'Приглашение на собеседование',
      'rejected': 'Отклонено',
      'accepted': 'Принято'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'reviewed': 'bg-blue-100 text-blue-700 border-blue-200',
      'interview': 'bg-purple-100 text-purple-700 border-purple-200',
      'rejected': 'bg-red-100 text-red-700 border-red-200',
      'accepted': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-2xl">
      <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-orange">
          <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Мои отклики
      </h2>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-50 mb-4">
            <svg className="w-10 h-10 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" />
            </svg>
          </div>
          <p className="text-text-light text-lg mb-2">У вас пока нет откликов на вакансии</p>
          <p className="text-text-light text-sm mb-6">Начните искать работу мечты!</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink px-6 py-3 font-semibold text-white transition-all hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Смотреть вакансии
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="border-2 border-gray-100 rounded-2xl p-6 hover:border-primary-orange/30 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <Link href={`/vacancy/${application.vacancy_id}`} className="hover:underline">
                    <h3 className="text-xl font-bold text-text mb-1">{application.vacancy_title}</h3>
                  </Link>
                  <p className="text-text-light mb-2">{application.vacancy_company}</p>
                  <p className="text-sm text-gray-500">Откликнулись: {formatDate(application.applied_at)}</p>
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(application.status)} whitespace-nowrap`}>
                  {getStatusLabel(application.status)}
                </div>
              </div>

              {/* Resume attached indicator */}
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                <svg className="w-5 h-5 text-primary-purple flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Резюме прикреплено к отклику</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CompanyProfile({ profileData, authenticatedUser }: { profileData: ProfileFormData; authenticatedUser: AuthenticatedUser }) {
  return (
    <div className="space-y-6">
      {/* Company Logo */}
      <div className="rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-orange">
            <path d="M3 21H21M5 21V7L13 3V21M19 21V11L13 7M9 9H10M9 13H10M9 17H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Логотип компании
        </h2>
        <div className="flex flex-col items-center gap-4">
          <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-primary-purple via-primary-pink to-primary-orange flex items-center justify-center text-white text-5xl font-bold shadow-lg">
            {profileData.fullName?.charAt(0).toUpperCase() || authenticatedUser.name.charAt(0).toUpperCase()}
          </div>
          <p className="text-sm text-gray-500 text-center">
            🏢 Загрузка логотипа находится в разработке
          </p>
        </div>
      </div>

      {/* Company Information */}
      <div className="rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-purple">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Информация о компании
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <ProfileField icon={<CompanyNameIcon />} label="Название компании" value={profileData.fullName || authenticatedUser.name} />
          <ProfileField icon={<MailIcon />} label="Email" value={profileData.email} />
          <ProfileField icon={<PhoneIcon />} label="Телефон" value={profileData.phone} />
          <ProfileField icon={<LocationIcon />} label="Местоположение" value={profileData.location} />
        </div>
      </div>

      {/* Company Description */}
      {profileData.about && (
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-gold">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            О компании
          </h2>
          <p className="text-text leading-relaxed">{profileData.about}</p>
        </div>
      )}

      {/* Industry & Expertise */}
      {profileData.skills && (
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-pink">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Отрасли и специализация
          </h2>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.split(',').map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-gradient-to-r from-primary-purple/10 to-primary-pink/10 px-4 py-2 text-sm font-medium text-text border border-primary-purple/20"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Applications Inbox */}
      <CompanyApplicationsInbox companyName={profileData.fullName || authenticatedUser.name} />
    </div>
  );
}

// Company Applications Inbox Component
function CompanyApplicationsInbox({ companyName }: { companyName: string }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [expandedApplication, setExpandedApplication] = useState<string | null>(null);

  useEffect(() => {
    // Load company applications
    const companyInboxKey = `prommeCompanyInbox_${companyName}`;
    const storedApplications = localStorage.getItem(companyInboxKey);
    
    if (storedApplications) {
      const parsedApplications = JSON.parse(storedApplications);
      setApplications(parsedApplications.reverse()); // Show newest first
    }
  }, [companyName]);

  const handleMessageCandidate = (applicantName: string) => {
    alert(`💬 Функция прямого обмена сообщениями находится в разработке!\n\nСкоро вы сможете:\n• Отправлять сообщения кандидатам\n• Назначать собеседования\n• Обсуждать детали вакансии\n\nКандидат: ${applicantName}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-2xl">
      <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-orange">
          <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Входящие отклики
        {applications.length > 0 && (
          <span className="ml-2 inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-orange text-white text-sm font-bold">
            {applications.length}
          </span>
        )}
      </h2>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-50 mb-4">
            <svg className="w-10 h-10 text-primary-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" />
            </svg>
          </div>
          <p className="text-text-light text-lg mb-2">Пока нет откликов на ваши вакансии</p>
          <p className="text-text-light text-sm">Когда кандидаты откликнутся, они появятся здесь</p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((application) => (
            <div key={application.id} className="border-2 border-gray-100 rounded-2xl p-6 hover:border-primary-orange/30 transition-colors">
              {/* Applicant Header */}
              <div className="flex items-start gap-4 mb-4">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-purple-light to-primary-pink flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-md">
                  {application.applicant_photo ? (
                    <img src={application.applicant_photo} alt={application.applicant_name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    application.applicant_name.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Applicant Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-text mb-1">{application.applicant_name}</h3>
                  <p className="text-base text-primary-purple-dark font-semibold mb-2">{application.applicant_position}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" />
                        <path d="M22 6L12 13L2 6" fill="white"/>
                      </svg>
                      <span>{application.applicant_email}</span>
                    </div>
                    {application.applicant_location && (
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        <span>{application.applicant_location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Application Date */}
                <div className="text-right">
                  <p className="text-xs text-gray-500">{formatDate(application.applied_at)}</p>
                </div>
              </div>

              {/* Vacancy Applied For */}
              <div className="mb-4 p-4 bg-purple-50 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Отклик на вакансию:</p>
                <p className="text-lg font-bold text-primary-purple-dark">{application.vacancy_title}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => handleMessageCandidate(application.applicant_name)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-purple-dark to-primary-purple text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.418 16.97 20 12 20C10.54 20 9.15 19.71 7.89 19.18L3 20L4.18 16.14C3.46 14.87 3 13.47 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Написать кандидату
                </button>
                <button
                  onClick={() => setExpandedApplication(expandedApplication === application.id ? null : application.id)}
                  className="flex-1 px-4 py-3 border-2 border-primary-orange text-primary-orange rounded-xl hover:bg-orange-50 transition-all font-semibold text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {expandedApplication === application.id ? 'Скрыть резюме' : 'Посмотреть резюме'}
                </button>
              </div>

              {/* Expandable Resume Section */}
              {expandedApplication === application.id && (
                <div className="mt-4 p-6 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl border-2 border-orange-100 space-y-4">
                  <h4 className="text-lg font-bold text-text mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary-orange" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Резюме кандидата
                  </h4>

                  {/* Summary */}
                  {application.resume.summary && (
                    <div>
                      <p className="text-sm font-semibold text-text mb-1">О себе:</p>
                      <p className="text-text-light">{application.resume.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {application.resume.experience_years !== undefined && (
                    <div>
                      <p className="text-sm font-semibold text-text mb-1">Опыт работы:</p>
                      <p className="text-text-light">{application.resume.experience_years} лет</p>
                    </div>
                  )}

                  {/* Skills */}
                  {application.resume.skills && application.resume.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-text mb-2">Навыки:</p>
                      <div className="flex flex-wrap gap-2">
                        {application.resume.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1.5 bg-white text-primary-purple-dark rounded-lg text-sm font-medium border border-purple-100"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {application.resume.education && (
                    <div>
                      <p className="text-sm font-semibold text-text mb-1">Образование:</p>
                      <p className="text-text-light">{application.resume.education}</p>
                    </div>
                  )}

                  {/* Salary Expectation */}
                  {application.resume.salary_expectation && (
                    <div>
                      <p className="text-sm font-semibold text-text mb-1">Желаемая зарплата:</p>
                      <p className="text-lg font-bold text-primary-orange">{application.resume.salary_expectation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FacilitatorProfile({ profileData, authenticatedUser }: { profileData: ProfileFormData; authenticatedUser: AuthenticatedUser }) {
  return (
    <div className="space-y-6">
      {/* Institution Logo */}
      <div className="rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-purple">
            <path d="M12 14L21 9L12 4L3 9L12 14ZM12 14L18.16 10.53C18.71 11.66 19 12.92 19 14.24C19 15.56 18.71 16.82 18.16 17.95M12 14L5.84 10.53C5.29 11.66 5 12.92 5 14.24C5 15.56 5.29 16.82 5.84 17.95M12 14V22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Логотип учреждения
        </h2>
        <div className="flex flex-col items-center gap-4">
          <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-primary-purple to-primary-gold flex items-center justify-center text-white text-5xl font-bold shadow-lg">
            {profileData.fullName?.charAt(0).toUpperCase() || authenticatedUser.name.charAt(0).toUpperCase()}
          </div>
          <p className="text-sm text-gray-500 text-center">
            🎓 Загрузка логотипа находится в разработке
          </p>
        </div>
      </div>

      {/* Institution Information */}
      <div className="rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-gold">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Информация об учреждении
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <ProfileField icon={<CompanyNameIcon />} label="Название учреждения" value={profileData.fullName || authenticatedUser.name} />
          <ProfileField icon={<MailIcon />} label="Email" value={profileData.email} />
          <ProfileField icon={<PhoneIcon />} label="Телефон" value={profileData.phone} />
          <ProfileField icon={<LocationIcon />} label="Адрес" value={profileData.location} />
        </div>
      </div>

      {/* About Institution */}
      {profileData.about && (
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-orange">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Об учреждении
          </h2>
          <p className="text-text leading-relaxed">{profileData.about}</p>
        </div>
      )}

      {/* Programs & Specializations */}
      {profileData.skills && (
        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-pink">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Программы обучения
          </h2>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.split(',').map((skill, index) => (
              <span
                key={index}
                className="rounded-full bg-gradient-to-r from-primary-purple/10 to-primary-gold/10 px-4 py-2 text-sm font-medium text-text border border-primary-purple/20"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Students Section */}
      <div className="rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-text">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-purple">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Студенты и выпускники
        </h2>
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-50 mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">База студентов находится в разработке</p>
          <p className="text-sm text-gray-500">Скоро будет доступна информация о студентах и выпускниках</p>
        </div>
      </div>
    </div>
  );
}

function EmptyProfileState({ handleEditProfile, profileType }: { handleEditProfile: () => void; profileType?: string }) {
  const getEmptyStateText = () => {
    switch (profileType) {
      case 'company':
        return {
          title: 'Профиль компании не заполнен',
          description: 'Создайте профиль вашей компании для публикации вакансий',
          buttonText: 'Создать профиль компании'
        };
      case 'facilitator':
        return {
          title: 'Профиль учреждения не заполнен',
          description: 'Создайте профиль вашего образовательного учреждения',
          buttonText: 'Создать профиль учреждения'
        };
      default:
        return {
          title: 'Профиль не заполнен',
          description: 'У вас пока нет сохраненной информации профиля',
          buttonText: 'Заполнить профиль'
        };
    }
  };

  const emptyState = getEmptyStateText();

  return (
    <div className="rounded-3xl bg-white p-12 text-center shadow-2xl">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6 text-gray-300">
        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <h3 className="mb-3 text-2xl font-bold text-text">{emptyState.title}</h3>
      <p className="mb-6 text-text-light">{emptyState.description}</p>
      <button
        onClick={handleEditProfile}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink px-8 py-3 font-semibold text-white transition-all hover:shadow-lg"
      >
        {emptyState.buttonText}
      </button>
    </div>
  );
}

// Helper Components
function ProfileField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  if (!value) return null;
  
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-orange/10 to-primary-pink/10 text-primary-orange">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-text-light">{label}</p>
        <p className="text-base font-medium text-text">{value}</p>
      </div>
    </div>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 16.92V19.92C22 20.4 21.96 20.87 21.88 21.32C21.33 25.18 18.24 28.07 14.38 28.57C13.93 28.65 13.46 28.69 12.98 28.69H11.02C6.02 28.69 2 24.67 2 19.67V16.67C2 12.25 5.58 8.67 10 8.67C14.42 8.67 18 12.25 18 16.67V17.67C18 18.77 18.9 19.67 20 19.67C21.1 19.67 22 18.77 22 17.67V16.92Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.5 9.5C16.881 9.5 18 8.381 18 7C18 5.619 16.881 4.5 15.5 4.5C14.119 4.5 13 5.619 13 7C13 8.381 14.119 9.5 15.5 9.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CompanyNameIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 21H21M5 21V7L13 3V21M19 21V11L13 7M9 9H10M9 13H10M9 17H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

