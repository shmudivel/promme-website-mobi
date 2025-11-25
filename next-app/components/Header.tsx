'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { User } from '@/types';

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        // Fetch user profile from database
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (profile) {
          setUser(profile);
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <svg width="140" height="25" viewBox="0 0 186 33" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-900">
              <path d="M0.61 32V0.949997H12.715C19.555 0.949997 23.74 5.045 23.74 10.895C23.74 17.78 19.285 21.515 11.905 21.515H5.92V32H0.61ZM5.92 17.285H12.4C16.315 17.285 18.385 15.035 18.385 11.12C18.385 7.34 16.225 5.27 12.445 5.27H5.92V17.285ZM25.3424 32V0.949997H39.5174C45.9524 0.949997 49.6874 3.875 49.6874 9.23C49.6874 13.1 47.7074 15.665 43.7474 16.97C47.4824 17.69 49.0574 19.58 49.1924 23.045L49.4174 28.67C49.4624 30.065 49.7774 31.19 50.2724 32H44.9174C44.3324 31.1 44.1524 30.155 44.1074 28.67L43.9724 23.945C43.8374 20.705 42.5774 19.085 39.0224 19.085H30.6524V32H25.3424ZM30.6524 15.08H39.2024C42.3974 15.08 44.2424 13.235 44.2424 9.815C44.2424 6.62 42.3974 5 38.6624 5H30.6524V15.08ZM65.1903 32.315C56.4153 32.315 50.9703 26.15 50.9703 16.565C50.9703 6.98 56.7303 0.634999 65.5053 0.634999C73.9203 0.634999 79.6803 6.44 79.6803 16.295C79.6803 25.925 73.5603 32.315 65.1903 32.315ZM65.2803 27.995C70.9953 27.995 74.0553 23.675 74.0553 16.34C74.0553 9.095 70.9053 4.955 65.3253 4.955C59.9253 4.955 56.5953 9.185 56.5953 16.34C56.5953 23.585 59.7453 27.995 65.2803 27.995ZM81.487 32V0.949997H88.867L94.447 16.97C95.932 21.335 97.057 24.8 97.732 27.365C98.407 24.89 99.487 21.47 100.927 17.195L106.462 0.949997H113.752V32H108.622V19.85C108.622 14.585 108.712 10.13 108.847 6.485C108.262 8.555 107.182 11.885 105.607 16.475L100.207 32H94.987L89.227 15.98C88.192 13.055 87.202 9.905 86.212 6.53C86.347 10.13 86.437 14.585 86.437 19.94V32H81.487ZM116.766 32V0.949997H124.146L129.726 16.97C131.211 21.335 132.336 24.8 133.011 27.365C133.686 24.89 134.766 21.47 136.206 17.195L141.741 0.949997H149.031V32H143.901V19.85C143.901 14.585 143.991 10.13 144.126 6.485C143.541 8.555 142.461 11.885 140.886 16.475L135.486 32H130.266L124.506 15.98C123.471 13.055 122.481 9.905 121.491 6.53C121.626 10.13 121.716 14.585 121.716 19.94V32H116.766ZM152.046 32V0.949997H173.556V5.27H157.356V14H170.946V18.185H157.356V27.68H174.321V32H152.046Z" fill="currentColor"/>
            </svg>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link 
                      href="/profile" 
                      className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
                    >
                      {user.name || 'Профиль'}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Выйти"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:shadow-lg transition-all"
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

