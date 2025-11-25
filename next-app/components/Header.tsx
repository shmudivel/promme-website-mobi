'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AuthenticatedUser {
  name: string;
  email: string;
  profileType: string;
  profileTypeLabel: string;
  loginTime: string;
  rememberMe: boolean;
}

export default function Header() {
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthenticatedUser();
    
    // Listen for storage changes to update auth state in real-time
    const handleStorageChange = () => {
      checkAuthenticatedUser();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also check periodically in case localStorage changed in the same tab
    const intervalId = setInterval(checkAuthenticatedUser, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  function checkAuthenticatedUser() {
    try {
      const storedAuthUser = localStorage.getItem('prommeAuthUser');
      if (storedAuthUser) {
        const parsedAuthUser: AuthenticatedUser = JSON.parse(storedAuthUser);
        setAuthenticatedUser(parsedAuthUser);
      } else {
        setAuthenticatedUser(null);
      }
    } catch (error) {
      console.error('Error checking authenticated user:', error);
      setAuthenticatedUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('prommeAuthUser');
    sessionStorage.removeItem('aiChatShown');
    sessionStorage.removeItem('freshLogin');
    setAuthenticatedUser(null);
    window.location.href = '/';
  }

  return (
    <header className="fixed left-0 right-0 top-0 z-[1000] overflow-hidden bg-gradient-to-r from-primary-orange via-primary-gold to-primary-pink shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-transform will-change-transform">
      {/* Decorative background shapes */}
      <div className="pointer-events-none absolute left-[-10%] top-[-50%] h-[500px] w-[500px] rounded-full bg-white/10" />
      <div className="pointer-events-none absolute bottom-[-50%] right-[-5%] h-[400px] w-[400px] rounded-full bg-white/8" />
      
      <nav className="relative z-10 py-4">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-all hover:scale-105 flex-shrink-0">
            <svg width="186" height="33" viewBox="0 0 186 33" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[28px] sm:h-[33px] w-auto text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
              <path d="M0.61 32V0.949997H12.715C19.555 0.949997 23.74 5.045 23.74 10.895C23.74 17.78 19.285 21.515 11.905 21.515H5.92V32H0.61ZM5.92 17.285H12.4C16.315 17.285 18.385 15.035 18.385 11.12C18.385 7.34 16.225 5.27 12.445 5.27H5.92V17.285ZM25.3424 32V0.949997H39.5174C45.9524 0.949997 49.6874 3.875 49.6874 9.23C49.6874 13.1 47.7074 15.665 43.7474 16.97C47.4824 17.69 49.0574 19.58 49.1924 23.045L49.4174 28.67C49.4624 30.065 49.7774 31.19 50.2724 32H44.9174C44.3324 31.1 44.1524 30.155 44.1074 28.67L43.9724 23.945C43.8374 20.705 42.5774 19.085 39.0224 19.085H30.6524V32H25.3424ZM30.6524 15.08H39.2024C42.3974 15.08 44.2424 13.235 44.2424 9.815C44.2424 6.62 42.3974 5 38.6624 5H30.6524V15.08ZM65.1903 32.315C56.4153 32.315 50.9703 26.15 50.9703 16.565C50.9703 6.98 56.7303 0.634999 65.5053 0.634999C73.9203 0.634999 79.6803 6.44 79.6803 16.295C79.6803 25.925 73.5603 32.315 65.1903 32.315ZM65.2803 27.995C70.9953 27.995 74.0553 23.675 74.0553 16.34C74.0553 9.095 70.9053 4.955 65.3253 4.955C59.9253 4.955 56.5953 9.185 56.5953 16.34C56.5953 23.585 59.7453 27.995 65.2803 27.995ZM81.487 32V0.949997H88.867L94.447 16.97C95.932 21.335 97.057 24.8 97.732 27.365C98.407 24.89 99.487 21.47 100.927 17.195L106.462 0.949997H113.752V32H108.622V19.85C108.622 14.585 108.712 10.13 108.847 6.485C108.262 8.555 107.182 11.885 105.607 16.475L100.207 32H94.987L89.227 15.98C88.192 13.055 87.202 9.905 86.212 6.53C86.347 10.13 86.437 14.585 86.437 19.94V32H81.487ZM116.766 32V0.949997H124.146L129.726 16.97C131.211 21.335 132.336 24.8 133.011 27.365C133.686 24.89 134.766 21.47 136.206 17.195L141.741 0.949997H149.031V32H143.901V19.85C143.901 14.585 143.991 10.13 144.126 6.485C143.541 8.555 142.461 11.885 140.886 16.475L135.486 32H130.266L124.506 15.98C123.471 13.055 122.481 9.905 121.491 6.53C121.626 10.13 121.716 14.585 121.716 19.94V32H116.766ZM152.046 32V0.949997H173.556V5.27H157.356V14H170.946V18.185H157.356V27.68H174.321V32H152.046Z" fill="currentColor"/>
            </svg>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {!isLoading && (
              <>
                {authenticatedUser ? (
                  <div className="flex items-center gap-1.5 sm:gap-3 rounded-[50px] border border-white/30 bg-white/20 px-2 sm:px-5 py-1.5 sm:py-2 backdrop-blur-sm">
                    <Link
                      href="/profile"
                      className="max-w-[60px] sm:max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap text-[13px] sm:text-[15px] font-semibold text-white transition-opacity hover:underline hover:opacity-80"
                    >
                      {authenticatedUser.name || 'Пользователь'}
                    </Link>
                    <span className="hidden sm:inline text-xs text-white/70">({authenticatedUser.profileTypeLabel})</span>
                    <button
                      onClick={handleLogout}
                      className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center transition-opacity hover:opacity-70"
                      aria-label="Выйти"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white sm:w-5 sm:h-5">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="rounded-[50px] border-2 border-white/30 bg-white/20 px-4 sm:px-6 py-2 sm:py-2.5 text-[13px] sm:text-[15px] font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/30"
                  >
                    Вход
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

