'use client';

import { useState, useEffect, FormEvent, ReactElement, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type ProfileType = 'company' | 'job-seeker' | 'facilitator';
type AuthMode = 'login' | 'signup';

const profileTypeLabels: Record<ProfileType, string> = {
  'company': 'Компания',
  'job-seeker': 'Соискатель',
  'facilitator': 'Образовательное учреждение'
};

interface ProfileOptionData {
  type: ProfileType;
  title: string;
  description: string;
  icon: ReactElement;
}

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  
  // Initialize authMode from query param if available
  const initialMode = searchParams.get('mode');
  const [selectedProfileType, setSelectedProfileType] = useState<ProfileType | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>(
    (initialMode === 'login' || initialMode === 'signup') ? initialMode : 'login'
  );
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const authenticatedUser = localStorage.getItem('prommeAuthUser');
    if (authenticatedUser) {
      console.log('User already authenticated, redirecting to main page');
      router.push('/');
    }
  }, [router]);

  const profileOptions: ProfileOptionData[] = [
    {
      type: 'company',
      title: 'Компания',
      description: 'Для работодателей и компаний',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 21H21M5 21V7L13 3V21M19 21V11L13 7M9 9H10M9 13H10M9 17H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      type: 'job-seeker',
      title: 'Соискатель',
      description: 'Для поиска работы',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      type: 'facilitator',
      title: 'Образовательное учреждение',
      description: 'Для подготовки специалистов',
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14L21 9L12 4L3 9L12 14ZM12 14L18.16 10.53C18.71 11.66 19 12.92 19 14.24C19 15.56 18.71 16.82 18.16 17.95M12 14L5.84 10.53C5.29 11.66 5 12.92 5 14.24C5 15.56 5.29 16.82 5.84 17.95M12 14V22.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  const handleProfileSelect = (profileType: ProfileType) => {
    setSelectedProfileType(profileType);
  };

  const handleBackToProfiles = () => {
    setSelectedProfileType(null);
    setAuthMode('login');
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!selectedProfileType) {
        alert('Пожалуйста, выберите тип профиля');
        handleBackToProfiles();
        return;
      }

      const userEmail = loginEmail.trim();
      const userPassword = loginPassword;

      if (!userEmail || !userPassword) {
        alert('Пожалуйста, заполните все поля');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        alert('Пожалуйста, введите корректный email');
        return;
      }

      const storedUsers = JSON.parse(localStorage.getItem('prommeUsers') || '[]');
      const existingUser = storedUsers.find(
        (user: any) => user.email === userEmail && user.profileType === selectedProfileType
      );

      if (!existingUser) {
        alert('Пользователь с таким email не найден для выбранного типа профиля. Пожалуйста, зарегистрируйтесь.');
        setAuthMode('signup');
        return;
      }

      if (existingUser.password !== userPassword) {
        alert('Неверный пароль');
        return;
      }

      const authenticatedUserData = {
        name: existingUser.name,
        email: existingUser.email,
        profileType: existingUser.profileType,
        profileTypeLabel: profileTypeLabels[existingUser.profileType as ProfileType],
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe
      };

      localStorage.setItem('prommeAuthUser', JSON.stringify(authenticatedUserData));
      sessionStorage.removeItem('aiChatShown');
      sessionStorage.setItem('freshLogin', 'true');

      console.log('Login successful:', authenticatedUserData);
      alert(`Добро пожаловать, ${existingUser.name}!`);
      router.push(redirectTo);
    } catch (error) {
      console.error('Login error:', error);
      alert('Произошла ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!selectedProfileType) {
        alert('Пожалуйста, выберите тип профиля');
        handleBackToProfiles();
        return;
      }

      const userName = signupName.trim();
      const userEmail = signupEmail.trim();
      const userPassword = signupPassword;
      const userPasswordConfirm = signupPasswordConfirm;

      if (!userName || !userEmail || !userPassword || !userPasswordConfirm) {
        alert('Пожалуйста, заполните все поля');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userEmail)) {
        alert('Пожалуйста, введите корректный email');
        return;
      }

      if (userPassword.length < 6) {
        alert('Пароль должен содержать минимум 6 символов');
        return;
      }

      if (userPassword !== userPasswordConfirm) {
        alert('Пароли не совпадают');
        return;
      }

      if (!agreeTerms) {
        alert('Пожалуйста, согласитесь с условиями использования');
        return;
      }

      const storedUsers = JSON.parse(localStorage.getItem('prommeUsers') || '[]');
      const existingUser = storedUsers.find(
        (user: any) => user.email === userEmail && user.profileType === selectedProfileType
      );

      if (existingUser) {
        alert('Пользователь с таким email уже существует для выбранного типа профиля. Попробуйте войти.');
        setAuthMode('login');
        return;
      }

      const newUser = {
        name: userName,
        email: userEmail,
        password: userPassword,
        profileType: selectedProfileType,
        profileTypeLabel: profileTypeLabels[selectedProfileType],
        registrationDate: new Date().toISOString()
      };

      storedUsers.push(newUser);
      localStorage.setItem('prommeUsers', JSON.stringify(storedUsers));

      const authenticatedUserData = {
        name: newUser.name,
        email: newUser.email,
        profileType: newUser.profileType,
        profileTypeLabel: newUser.profileTypeLabel,
        loginTime: new Date().toISOString(),
        rememberMe: true
      };

      localStorage.setItem('prommeAuthUser', JSON.stringify(authenticatedUserData));
      sessionStorage.removeItem('aiChatShown');
      sessionStorage.setItem('freshLogin', 'true');

      console.log('Registration successful:', authenticatedUserData);
      alert(`Регистрация успешна! Добро пожаловать, ${userName}!`);
      router.push(redirectTo);
    } catch (error) {
      console.error('Signup error:', error);
      alert('Произошла ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF8C42] via-[#FF6B35] to-[#E94397] flex items-center justify-center p-5 relative overflow-x-hidden overflow-y-auto">
      {/* Decorative background shapes */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#FF6B35]/30 to-[#E94397]/20 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] rotate-[-15deg] animate-[float_20s_ease-in-out_infinite]" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-[#9B59B6]/30 to-[#E94397]/20 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] rotate-[25deg] animate-[float_25s_ease-in-out_infinite_reverse]" />

      <div className="relative z-10 w-full max-w-[500px] max-h-[95vh] overflow-y-auto mx-auto">
        <div className="bg-white rounded-[32px] p-12 shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideUp_0.6s_ease-out]">
          {/* Header */}
          <div className="text-center mb-6">
            <svg className="text-[#FF6B35] mb-4 mx-auto" width="120" height="22" viewBox="0 0 186 33" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.61 32V0.949997H12.715C19.555 0.949997 23.74 5.045 23.74 10.895C23.74 17.78 19.285 21.515 11.905 21.515H5.92V32H0.61ZM5.92 17.285H12.4C16.315 17.285 18.385 15.035 18.385 11.12C18.385 7.34 16.225 5.27 12.445 5.27H5.92V17.285ZM25.3424 32V0.949997H39.5174C45.9524 0.949997 49.6874 3.875 49.6874 9.23C49.6874 13.1 47.7074 15.665 43.7474 16.97C47.4824 17.69 49.0574 19.58 49.1924 23.045L49.4174 28.67C49.4624 30.065 49.7774 31.19 50.2724 32H44.9174C44.3324 31.1 44.1524 30.155 44.1074 28.67L43.9724 23.945C43.8374 20.705 42.5774 19.085 39.0224 19.085H30.6524V32H25.3424ZM30.6524 15.08H39.2024C42.3974 15.08 44.2424 13.235 44.2424 9.815C44.2424 6.62 42.3974 5 38.6624 5H30.6524V15.08ZM65.1903 32.315C56.4153 32.315 50.9703 26.15 50.9703 16.565C50.9703 6.98 56.7303 0.634999 65.5053 0.634999C73.9203 0.634999 79.6803 6.44 79.6803 16.295C79.6803 25.925 73.5603 32.315 65.1903 32.315ZM65.2803 27.995C70.9953 27.995 74.0553 23.675 74.0553 16.34C74.0553 9.095 70.9053 4.955 65.3253 4.955C59.9253 4.955 56.5953 9.185 56.5953 16.34C56.5953 23.585 59.7453 27.995 65.2803 27.995ZM81.487 32V0.949997H88.867L94.447 16.97C95.932 21.335 97.057 24.8 97.732 27.365C98.407 24.89 99.487 21.47 100.927 17.195L106.462 0.949997H113.752V32H108.622V19.85C108.622 14.585 108.712 10.13 108.847 6.485C108.262 8.555 107.182 11.885 105.607 16.475L100.207 32H94.987L89.227 15.98C88.192 13.055 87.202 9.905 86.212 6.53C86.347 10.13 86.437 14.585 86.437 19.94V32H81.487ZM116.766 32V0.949997H124.146L129.726 16.97C131.211 21.335 132.336 24.8 133.011 27.365C133.686 24.89 134.766 21.47 136.206 17.195L141.741 0.949997H149.031V32H143.901V19.85C143.901 14.585 143.991 10.13 144.126 6.485C143.541 8.555 142.461 11.885 140.886 16.475L135.486 32H130.266L124.506 15.98C123.471 13.055 122.481 9.905 121.491 6.53C121.626 10.13 121.716 14.585 121.716 19.94V32H116.766ZM152.046 32V0.949997H173.556V5.27H157.356V14H170.946V18.185H157.356V27.68H174.321V32H152.046Z" fill="currentColor"/>
            </svg>
            <h1 className="text-[28px] font-bold text-black mb-2">Добро пожаловать</h1>
            <p className="text-sm text-[#999] m-0">Выберите тип профиля для продолжения</p>
          </div>

          {/* Profile Selection Screen */}
          {!selectedProfileType && (
            <div className="animate-[fadeIn_0.4s_ease-in]">
              <h2 className="text-center text-xl font-bold text-black mb-5">Выберите тип профиля</h2>
              <div className="flex flex-col gap-3">
                {profileOptions.map((option) => (
                  <button
                    key={option.type}
                    onClick={() => handleProfileSelect(option.type)}
                    className="flex flex-col items-center p-5 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] border-[3px] border-transparent rounded-2xl cursor-pointer transition-all duration-300 text-center hover:border-[#FF6B35] hover:bg-gradient-to-br hover:from-white hover:to-[#FAFAFA] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(255,107,53,0.2)] active:-translate-y-0.5"
                  >
                    <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] rounded-full mb-3 text-white">
                      {option.icon}
                    </div>
                    <h3 className="text-[17px] font-bold text-black mb-1">{option.title}</h3>
                    <p className="text-[13px] text-[#666] m-0">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Auth Form Section */}
          {selectedProfileType && (
            <div className="animate-[fadeIn_0.4s_ease-in]">
              <button
                onClick={handleBackToProfiles}
                className="flex items-center gap-2 bg-transparent border-none text-[#FF6B35] text-base font-semibold cursor-pointer mb-6 p-2 rounded-lg transition-all duration-300 hover:bg-[#FF6B35]/10 hover:-translate-x-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Назад</span>
              </button>

              <div className="flex items-center justify-center py-3 px-6 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] text-white rounded-[50px] text-sm font-semibold mb-6 text-center">
                {profileTypeLabels[selectedProfileType]}
              </div>

              {/* Auth Tabs */}
              <div className="flex gap-3 mb-8 bg-[#F5F5F5] rounded-[50px] p-1.5">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-3.5 px-6 rounded-[50px] text-base font-semibold cursor-pointer transition-all duration-300 border-none ${
                    authMode === 'login'
                      ? 'bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] text-white shadow-[0_4px_15px_rgba(255,107,53,0.3)]'
                      : 'bg-transparent text-[#666] hover:bg-[#FF6B35]/10 hover:text-[#FF6B35]'
                  }`}
                >
                  Вход
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`flex-1 py-3.5 px-6 rounded-[50px] text-base font-semibold cursor-pointer transition-all duration-300 border-none ${
                    authMode === 'signup'
                      ? 'bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] text-white shadow-[0_4px_15px_rgba(255,107,53,0.3)]'
                      : 'bg-transparent text-[#666] hover:bg-[#FF6B35]/10 hover:text-[#FF6B35]'
                  }`}
                >
                  Регистрация
                </button>
              </div>

              {/* Login Form */}
              {authMode === 'login' && (
                <form onSubmit={handleLogin} className="animate-[fadeIn_0.4s_ease-in]">
                  <div className="mb-6">
                    <label htmlFor="loginEmail" className="block text-sm font-semibold text-[#34374a] mb-2">Email</label>
                    <input
                      type="email"
                      id="loginEmail"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full py-4 px-5 border-2 border-[#E5E5E5] rounded-xl text-base text-[#34374a] transition-all duration-300 bg-[#FAFAFA] font-[Verdana,Arial,sans-serif] focus:outline-none focus:border-[#FF6B35] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,107,53,0.1)] placeholder:text-[#A0A0A0]"
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="loginPassword" className="block text-sm font-semibold text-[#34374a] mb-2">Пароль</label>
                    <input
                      type="password"
                      id="loginPassword"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full py-4 px-5 border-2 border-[#E5E5E5] rounded-xl text-base text-[#34374a] transition-all duration-300 bg-[#FAFAFA] font-[Verdana,Arial,sans-serif] focus:outline-none focus:border-[#FF6B35] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,107,53,0.1)] placeholder:text-[#A0A0A0]"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-5 h-5 cursor-pointer accent-[#FF6B35]"
                    />
                    <label htmlFor="rememberMe" className="text-sm text-[#666] m-0 cursor-pointer select-none">Запомнить меня</label>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-[18px] px-6 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 shadow-[0_8px_24px_rgba(255,107,53,0.3)] mb-4 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,107,53,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Загрузка...' : 'Войти'}
                  </button>
                  <a href="#" className="block text-center text-sm text-[#FF6B35] no-underline font-semibold transition-colors duration-300 hover:text-[#FF8C42] hover:underline">
                    Забыли пароль?
                  </a>
                </form>
              )}

              {/* Signup Form */}
              {authMode === 'signup' && (
                <form onSubmit={handleSignup} className="animate-[fadeIn_0.4s_ease-in]">
                  <div className="mb-6">
                    <label htmlFor="signupName" className="block text-sm font-semibold text-[#34374a] mb-2">Полное имя</label>
                    <input
                      type="text"
                      id="signupName"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full py-4 px-5 border-2 border-[#E5E5E5] rounded-xl text-base text-[#34374a] transition-all duration-300 bg-[#FAFAFA] font-[Verdana,Arial,sans-serif] focus:outline-none focus:border-[#FF6B35] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,107,53,0.1)] placeholder:text-[#A0A0A0]"
                      placeholder="Иван Иванов"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="signupEmail" className="block text-sm font-semibold text-[#34374a] mb-2">Email</label>
                    <input
                      type="email"
                      id="signupEmail"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full py-4 px-5 border-2 border-[#E5E5E5] rounded-xl text-base text-[#34374a] transition-all duration-300 bg-[#FAFAFA] font-[Verdana,Arial,sans-serif] focus:outline-none focus:border-[#FF6B35] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,107,53,0.1)] placeholder:text-[#A0A0A0]"
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="signupPassword" className="block text-sm font-semibold text-[#34374a] mb-2">Пароль</label>
                    <input
                      type="password"
                      id="signupPassword"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full py-4 px-5 border-2 border-[#E5E5E5] rounded-xl text-base text-[#34374a] transition-all duration-300 bg-[#FAFAFA] font-[Verdana,Arial,sans-serif] focus:outline-none focus:border-[#FF6B35] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,107,53,0.1)] placeholder:text-[#A0A0A0]"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="signupPasswordConfirm" className="block text-sm font-semibold text-[#34374a] mb-2">Подтвердите пароль</label>
                    <input
                      type="password"
                      id="signupPasswordConfirm"
                      value={signupPasswordConfirm}
                      onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                      className="w-full py-4 px-5 border-2 border-[#E5E5E5] rounded-xl text-base text-[#34374a] transition-all duration-300 bg-[#FAFAFA] font-[Verdana,Arial,sans-serif] focus:outline-none focus:border-[#FF6B35] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,107,53,0.1)] placeholder:text-[#A0A0A0]"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-5 h-5 cursor-pointer accent-[#FF6B35]"
                      required
                    />
                    <label htmlFor="agreeTerms" className="text-sm text-[#666] m-0 cursor-pointer select-none">
                      Я согласен с <a href="#" className="text-[#FF6B35] no-underline font-semibold transition-colors duration-300 hover:text-[#FF8C42] hover:underline">условиями использования</a>
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-[18px] px-6 bg-gradient-to-br from-[#FF8C42] to-[#FF6B35] text-white border-none rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 shadow-[0_8px_24px_rgba(255,107,53,0.3)] mb-4 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,107,53,0.4)] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(-15deg);
          }
          50% {
            transform: translateY(-30px) rotate(-10deg);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#FF8C42] via-[#FF6B35] to-[#E94397] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="mt-4 text-white font-semibold">Загрузка...</p>
        </div>
      </div>
    }>
      <AuthPageContent />
    </Suspense>
  );
}



