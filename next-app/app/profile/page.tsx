'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AIChat from '@/components/AIChat';

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
        router.push('/auth');
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
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
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
              {!avatarData && (
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
          <div className="space-y-6">
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
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-12 text-center shadow-2xl">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-6 text-gray-300">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h3 className="mb-3 text-2xl font-bold text-text">Профиль не заполнен</h3>
            <p className="mb-6 text-text-light">У вас пока нет сохраненной информации профиля</p>
            <button
              onClick={handleEditProfile}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink px-8 py-3 font-semibold text-white transition-all hover:shadow-lg"
            >
              Заполнить профиль
            </button>
          </div>
        )}
      </div>
      <AIChat />
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

