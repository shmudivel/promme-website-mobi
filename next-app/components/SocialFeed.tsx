'use client';

import { useState, useEffect, useRef } from 'react';
import { FeedPost as FeedPostType } from '@/types';
import FeedPost from './FeedPost';
import PostCreationModal from './PostCreationModal';
import CompanyCard, { CompanyCardData } from './CompanyCard';
import ResumeCard, { ResumeCardData } from './ResumeCard';

type FeedItem = FeedPostType | (CompanyCardData & { itemType: 'company' }) | (ResumeCardData & { itemType: 'resume' });

// Mock data generator
const generateMockPosts = (count: number, startIndex: number): FeedPostType[] => {
  const posts: FeedPostType[] = [];
  const types: Array<'post' | 'event' | 'vacancy' | 'news'> = ['post', 'event', 'vacancy', 'news'];
  const companies = ['ПромСтрой', 'ТехноИндустрия', 'МеталлЗавод', 'ЭнергоПром', 'АвтоКомплект'];
  const authors = [
    { name: 'Анна Петрова', role: 'HR-менеджер', company: 'ПромСтрой' },
    { name: 'Иван Смирнов', role: 'Директор по развитию', company: 'ТехноИндустрия' },
    { name: 'Мария Кузнецова', role: 'Рекрутер', company: 'МеталлЗавод' },
    { name: 'Дмитрий Волков', role: 'CEO', company: 'ЭнергоПром' },
    { name: 'Елена Соколова', role: 'Менеджер по персоналу', company: 'АвтоКомплект' },
  ];

  const contents = [
    'Рады объявить о расширении нашей команды! Мы открыли новый производственный цех в индустриальном парке Сынково I. Ищем талантливых специалистов для работы на современном оборудовании. 🏭',
    'Сегодня провели успешный день открытых дверей для соискателей. Было приятно познакомиться с такими мотивированными кандидатами! Спасибо всем, кто пришел 🙌',
    'Поздравляем нашу команду с успешным завершением проекта по модернизации производственных линий! Гордимся нашими сотрудниками 💪',
    'Запускаем новую программу стажировок для молодых специалистов. Это отличная возможность начать карьеру в промышленности с перспективой дальнейшего трудоустройства! 🎓',
    'Делимся отличными новостями: наш завод получил сертификат качества международного образца! Это результат слаженной работы всей команды 🏆',
    'Организуем бесплатный мастер-класс по современным технологиям производства. Приглашаем всех заинтересованных специалистов! 📚',
  ];

  const eventTitles = [
    'День карьеры в индустриальном парке',
    'Мастер-класс по автоматизации производства',
    'Ярмарка вакансий "Работа рядом с домом"',
    'Конференция "Будущее промышленности"',
    'Тренинг по охране труда',
  ];

  const vacancyTitles = [
    'Инженер-технолог',
    'Оператор станков с ЧПУ',
    'Мастер участка',
    'Контролер качества',
    'Слесарь-ремонтник',
    'Логист',
    'Специалист по снабжению',
  ];

  for (let i = 0; i < count; i++) {
    const index = startIndex + i;
    const type = types[index % types.length];
    const author = authors[index % authors.length];
    const content = contents[index % contents.length];

    const post: FeedPostType = {
      id: `post-${index}`,
      type,
      author: {
        id: `author-${index % authors.length}`,
        name: author.name,
        role: author.role,
        company: author.company,
      },
      content,
      likes_count: Math.floor(Math.random() * 150) + 10,
      comments_count: Math.floor(Math.random() * 50) + 1,
      shares_count: Math.floor(Math.random() * 30),
      is_liked: Math.random() > 0.7,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // Add event details for event posts
    if (type === 'event' && index % 3 === 0) {
      post.event = {
        title: eventTitles[index % eventTitles.length],
        date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: index % 2 === 0 ? 'Индустриальный парк Сынково I' : 'Индустриальный парк Коледино',
        attendees_count: Math.floor(Math.random() * 200) + 20,
      };
    }

    // Add vacancy details for vacancy posts
    if (type === 'vacancy' && index % 4 === 0) {
      const salaryMin = Math.floor(Math.random() * 50000) + 50000;
      const salaryMax = salaryMin + Math.floor(Math.random() * 50000) + 20000;
      post.vacancy = {
        id: `vacancy-${index}`,
        title: vacancyTitles[index % vacancyTitles.length],
        company: companies[index % companies.length],
        location: index % 2 === 0 ? 'Сынково I' : 'Коледино',
        salary: `${salaryMin.toLocaleString()} - ${salaryMax.toLocaleString()} ₽`,
      };
    }

    // Add images for some posts
    if (index % 5 === 0) {
      post.images = [`https://picsum.photos/seed/${index}/800/600`];
    } else if (index % 7 === 0) {
      post.images = [
        `https://picsum.photos/seed/${index}a/800/600`,
        `https://picsum.photos/seed/${index}b/800/600`,
      ];
    }

    posts.push(post);
  }

  return posts;
};

export default function SocialFeed() {
  const [posts, setPosts] = useState<FeedPostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPostType, setModalPostType] = useState<'post' | 'event' | 'vacancy'>('post');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [filterType, setFilterType] = useState<'all' | 'post' | 'event' | 'vacancy' | 'company' | 'resume'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const pageRef = useRef(0);
  const observerTarget = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const feedContainerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const pullDistance = useRef(0);

  // Initial load
  useEffect(() => {
    const initialPosts = generateMockPosts(10, 0);
    setPosts(initialPosts);
    pageRef.current = 1;
  }, []);

  const loadMore = () => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPosts = generateMockPosts(10, pageRef.current * 10);
      setPosts((prev) => [...prev, ...newPosts]);
      pageRef.current += 1;
      setLoading(false);
      loadingRef.current = false;
      
      // Stop loading after 50 posts for demo
      if (pageRef.current * 10 >= 50) {
        setHasMore(false);
      }
    }, 1000);
  };

  const handleRefresh = () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      const freshPosts = generateMockPosts(10, 0);
      setPosts(freshPosts);
      pageRef.current = 1;
      setHasMore(true);
      setIsRefreshing(false);
    }, 1000);
  };

  const handleCreatePost = (postData: any) => {
    const newPost: FeedPostType = {
      id: `post-new-${Date.now()}`,
      type: postData.type,
      author: {
        id: 'current-user',
        name: 'Вы',
        role: 'Пользователь',
      },
      content: postData.content,
      images: postData.images,
      likes_count: 0,
      comments_count: 0,
      shares_count: 0,
      is_liked: false,
      created_at: new Date().toISOString(),
    };

    if (postData.eventDetails) {
      newPost.event = {
        title: postData.eventDetails.title,
        date: postData.eventDetails.date,
        location: postData.eventDetails.location,
        attendees_count: 0,
      };
    }

    if (postData.vacancyDetails) {
      newPost.vacancy = {
        id: `vacancy-new-${Date.now()}`,
        title: postData.vacancyDetails.title,
        company: 'Ваша компания',
        location: postData.vacancyDetails.location,
        salary: postData.vacancyDetails.salary,
      };
    }

    setPosts([newPost, ...posts]);
  };

  const openModal = (type: 'post' | 'event' | 'vacancy') => {
    setModalPostType(type);
    setIsModalOpen(true);
  };

  // Pull to refresh
  useEffect(() => {
    const container = feedContainerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      if (scrollTop === 0 && currentY > touchStartY.current) {
        pullDistance.current = currentY - touchStartY.current;
        
        if (pullDistance.current > 80 && !isRefreshing) {
          handleRefresh();
        }
      }
    };

    const handleTouchEnd = () => {
      touchStartY.current = 0;
      pullDistance.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isRefreshing]);

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter(post => {
      if (filterType === 'all') return true;
      return post.type === filterType;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return b.likes_count - a.likes_count;
      }
    });

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore]);

  return (
    <div ref={feedContainerRef} className="min-h-screen bg-gray-50 pt-20 pb-24">
      <div className="max-w-2xl mx-auto px-4">
        {/* Refresh Indicator */}
        {isRefreshing && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-3">
            <div className="w-5 h-5 border-3 border-primary-purple-dark border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-700">Обновление...</span>
          </div>
        )}

        {/* Filter and Sort Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Лента</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-primary-purple-dark hover:bg-purple-50 p-2 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
          </div>
          
          {showFilters && (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Сортировка</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('recent')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'recent'
                        ? 'bg-primary-purple-dark text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Последние
                  </button>
                  <button
                    onClick={() => setSortBy('popular')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      sortBy === 'popular'
                        ? 'bg-primary-purple-dark text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Популярные
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-600 mb-2 block">Тип контента</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['all', 'post', 'event', 'vacancy'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        filterType === type
                          ? 'bg-primary-orange text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {type === 'all' && 'Все'}
                      {type === 'post' && 'Посты'}
                      {type === 'event' && 'События'}
                      {type === 'vacancy' && 'Вакансии'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create Post Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-orange to-primary-pink flex items-center justify-center text-white font-semibold text-lg">
              Я
            </div>
            <button 
              onClick={() => openModal('post')}
              className="flex-1 text-left px-4 py-3 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Поделитесь новостью или событием...
            </button>
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            <button 
              onClick={() => openModal('post')}
              className="flex items-center gap-2 text-primary-orange hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Фото</span>
            </button>
            <button 
              onClick={() => openModal('event')}
              className="flex items-center gap-2 text-primary-purple-dark hover:bg-purple-50 px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Событие</span>
            </button>
            <button 
              onClick={() => openModal('vacancy')}
              className="flex items-center gap-2 text-primary-pink hover:bg-pink-50 px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Вакансия</span>
            </button>
          </div>
        </div>

        {/* Feed Posts */}
        <div className="space-y-4">
          {filteredAndSortedPosts.map((post) => (
            <FeedPost key={post.id} post={post} />
          ))}
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary-orange rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary-purple-dark rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary-pink rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {/* Intersection Observer Target */}
        {hasMore && <div ref={observerTarget} className="h-20"></div>}

        {/* End of Feed */}
        {!hasMore && (
          <div className="text-center py-8 text-gray-500">
            <p>Вы просмотрели все публикации</p>
          </div>
        )}
      </div>

      {/* Post Creation Modal */}
      <PostCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreatePost}
        postType={modalPostType}
      />
    </div>
  );
}

