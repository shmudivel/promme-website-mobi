'use client';

import { useState, useEffect, ReactElement } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AuthenticatedUser {
  name: string;
  email: string;
  profileType: string;
  profileTypeLabel: string;
  loginTime: string;
  rememberMe: boolean;
}

interface NavItem {
  name: string;
  path: string;
  isAIChat?: boolean;
  icon: (active: boolean) => ReactElement;
}

export default function BottomNav() {
  const pathname = usePathname();
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthenticatedUser | null>(null);

  useEffect(() => {
    const storedAuthUser = localStorage.getItem('prommeAuthUser');
    if (storedAuthUser) {
      setAuthenticatedUser(JSON.parse(storedAuthUser));
    }

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem('prommeAuthUser');
      setAuthenticatedUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener('storage', handleStorageChange);
    const intervalId = setInterval(() => {
      const updatedUser = localStorage.getItem('prommeAuthUser');
      setAuthenticatedUser(updatedUser ? JSON.parse(updatedUser) : null);
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);

  const isActive = (path: string) => pathname === path;

  const navItems = [
    {
      name: 'Главная',
      path: '/',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 transition-colors ${active ? 'text-primary-orange' : 'text-gray-600'}`}
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 0 : 2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: 'Поиск',
      path: '/search',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 transition-colors ${active ? 'text-primary-orange' : 'text-gray-600'}`}
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
      ),
    },
    {
      name: 'AI Chat',
      path: '#',
      isAIChat: true,
      icon: (active: boolean) => (
        <div className="relative flex items-center justify-center w-14 h-14 -mt-6 rounded-full bg-gradient-to-br from-primary-purple via-primary-pink to-primary-orange shadow-lg">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white">
            <span className="text-xl font-bold bg-gradient-to-br from-primary-purple to-primary-orange bg-clip-text text-transparent">
              AI
            </span>
          </div>
        </div>
      ),
    },
    {
      name: 'Сообщения',
      path: '/messages',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 transition-colors ${active ? 'text-primary-orange' : 'text-gray-600'}`}
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 0 : 2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      name: 'Профиль',
      path: authenticatedUser ? '/profile' : '/auth',
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 transition-colors ${active ? 'text-primary-orange' : 'text-gray-600'}`}
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={active ? 0 : 2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  const handleAIChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Trigger AI Chat - look for existing AI Chat button and click it
    const aiChatButton = document.querySelector('button[aria-label="AI Chat"]') as HTMLButtonElement;
    if (aiChatButton) {
      aiChatButton.click();
    } else {
      // Fallback: dispatch custom event to open AI chat
      window.dispatchEvent(new CustomEvent('openAIChat'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('prommeAuthUser');
    sessionStorage.removeItem('aiChatShown');
    sessionStorage.removeItem('freshLogin');
    setAuthenticatedUser(null);
    window.location.href = '/';
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] md:hidden">
      <div className="flex items-center justify-around h-16 px-2 relative">
        {navItems.map((item, index) => {
          const active = isActive(item.path);
          const isMiddle = item.isAIChat;
          
          if (isMiddle) {
            return (
              <button
                key={item.path}
                onClick={handleAIChatClick}
                className="relative flex flex-col items-center justify-center flex-1 h-full transition-all"
                aria-label="Open AI Chat"
              >
                <div>{item.icon(false)}</div>
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`relative flex flex-col items-center justify-center flex-1 h-full transition-all ${
                active ? 'text-primary-orange' : 'text-gray-600'
              } hover:bg-gray-50 active:bg-gray-100`}
            >
              <div className="mb-1">{item.icon(active)}</div>
              <span
                className={`text-xs font-medium transition-colors ${
                  active ? 'text-primary-orange' : 'text-gray-600'
                }`}
              >
                {item.name}
              </span>
              {active && !isMiddle && (
                <div className="absolute bottom-0 w-12 h-1 bg-primary-orange rounded-t-full" />
              )}
            </Link>
          );
        })}
        
        {/* Logout Button - Only visible when logged in */}
        {authenticatedUser && (
          <button
            onClick={handleLogout}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
            aria-label="Выйти"
            title="Выйти"
          >
            <svg 
              className="w-4 h-4 text-red-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
              />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
}

