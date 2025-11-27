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

  const demoVideos = [
    'https://wqixabfppisqznzjqnoo.supabase.co/storage/v1/object/public/avatars/5_company.mp4',
    'https://wqixabfppisqznzjqnoo.supabase.co/storage/v1/object/public/avatars/6_company.mp4',
    'https://wqixabfppisqznzjqnoo.supabase.co/storage/v1/object/public/avatars/3_study_facility.mp4',
    'https://wqixabfppisqznzjqnoo.supabase.co/storage/v1/object/public/avatars/4_study_facility.mp4',
    'https://wqixabfppisqznzjqnoo.supabase.co/storage/v1/object/public/avatars/1js.mp4',
    'https://wqixabfppisqznzjqnoo.supabase.co/storage/v1/object/public/avatars/2js.mp4'
  ];

  // TikTok Embed Code
  const tikTokEmbed = `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@russion.cyber.girl/video/7300659757721996552" data-video-id="7300659757721996552" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@russion.cyber.girl" href="https://www.tiktok.com/@russion.cyber.girl?refer=embed">@russion.cyber.girl</a> <p>Собеседование на бетонный завод </p> <a target="_blank" title="♬ оригинальный звук - Айтишник из деревни" href="https://www.tiktok.com/music/оригинальный-звук-7300659813632051970?refer=embed">♬ оригинальный звук - Айтишник из деревни</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>`;

  const tikTokEmbed2 = `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@trueprogramming/video/7063729267221302529" data-video-id="7063729267221302529" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@trueprogramming" href="https://www.tiktok.com/@trueprogramming?refer=embed">@trueprogramming</a> Автоматизация производства <a title="производство" target="_blank" href="https://www.tiktok.com/tag/%D0%BF%D1%80%D0%BE%D0%B8%D0%B7%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%BE?refer=embed">#производство</a> <a title="автоматизация" target="_blank" href="https://www.tiktok.com/tag/%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D1%8F?refer=embed">#автоматизация</a> <a title="робот" target="_blank" href="https://www.tiktok.com/tag/%D1%80%D0%BE%D0%B1%D0%BE%D1%82?refer=embed">#робот</a> <a title="россия" target="_blank" href="https://www.tiktok.com/tag/%D1%80%D0%BE%D1%81%D1%81%D0%B8%D1%8F?refer=embed">#россия</a> <a title="код" target="_blank" href="https://www.tiktok.com/tag/%D0%BA%D0%BE%D0%B4?refer=embed">#код</a> <a target="_blank" title="♬ Lofi - Domknowz" href="https://www.tiktok.com/music/Lofi-6799585653702019073?refer=embed">♬ Lofi - Domknowz</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>`;

  const tikTokEmbed3 = `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@alimbek_ulan/video/7421394428113227014" data-video-id="7421394428113227014" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@alimbek_ulan" href="https://www.tiktok.com/@alimbek_ulan?refer=embed">@alimbek_ulan</a> У Changan также имеется свой R&#38;D центр, где проходят разные исследования и разработки. И как же без собственного полигона, где проходят тесты все автомобили. Мы посетили все эти места, посмотрели, как работают люди, как меняются технологий, и появляются новые идеи и разработки, чтобы сделать жизнь людей более комфортной. Спасибо Changan Kazakhstan и Astana Motors за такую возможность увидеть всё вживую. Основной автомобильный бренд Changan: Changan (Чанань, Чанъань) Суббренды: AVATR, DEEPAL, NEVO, KAICHENG. Поделись и подпишись, чтобы узнавать что-то интересное от Алимбек Улан. <a title="alimbekulan" target="_blank" href="https://www.tiktok.com/tag/alimbekulan?refer=embed">#alimbekulan</a> <a title="changan" target="_blank" href="https://www.tiktok.com/tag/changan?refer=embed">#changan</a> <a target="_blank" title="♬ оригинальный звук - Alimbek Ulan" href="https://www.tiktok.com/music/оригинальный-звук-7421394479297284870?refer=embed">♬ оригинальный звук - Alimbek Ulan</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>`;

  const tikTokEmbed4 = `<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@izmetro/video/7463385854904388872" data-video-id="7463385854904388872" style="max-width: 605px;min-width: 325px;" > <section> <a target="_blank" title="@izmetro" href="https://www.tiktok.com/@izmetro?refer=embed">@izmetro</a> Девчонка за токарным станком?! А чего, такое сейчас встречается все чаще. Елена Гончарова уже несколько лет трудится оператором станка с ЧПУ. Почему нет? Завод современный, зарплата хорошая, куча современных плюшек, а своим ответственным отношением к работе она заслужила уважение у коллег-мужчин. Смотрим новый репортаж из Ленинградской области, с завода ЦКБМ Машиностроительного дивизиона Росатома. Елена, спасибо за ролик! Ты - крутая и харизматичная девушка.  Из метро🏴‍☠️ <a title="izmetro" target="_blank" href="https://www.tiktok.com/tag/izmetro?refer=embed">#izmetro</a> <a title="изметро" target="_blank" href="https://www.tiktok.com/tag/%D0%B8%D0%B7%D0%BC%D0%B5%D1%82%D1%80%D0%BE?refer=embed">#изметро</a> <a target="_blank" title="♬ оригинальный звук - Izmetro" href="https://www.tiktok.com/music/оригинальный-звук-7463385903139326737?refer=embed">♬ оригинальный звук - Izmetro</a> </section> </blockquote> <script async src="https://www.tiktok.com/embed.js"></script>`;

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

    // Specific TikTok Post 4 (at the top)
    if (index === 0) {
      post.content = 'Женщины в промышленности! 👩‍🏭 #равенство #карьера';
      post.embed_html = tikTokEmbed4;
    }
    // Specific TikTok Post 1
    else if (index === 2) {
      post.content = 'Интересное видео о работе на заводе! 😂 #юмор #производство';
      post.embed_html = tikTokEmbed;
    }
    // Specific TikTok Post 2
    else if (index === 5) {
      post.content = 'Автоматизация производства в действии! 🤖 #технологии #будущее';
      post.embed_html = tikTokEmbed2;
      post.images = undefined; // Clear default images if any
    }
    // Specific TikTok Post 3
    else if (index === 8) {
      post.content = 'Исследования и разработки в Changan! 🚗 #автопром #технологии';
      post.embed_html = tikTokEmbed3;
      post.images = undefined; // Clear default images if any
    }
    // Supabase Videos (Indices 1, 3, 4, 6, 7, 9)
    else {
      // Map remaining indices to video array indices 0-5
      const videoMap: { [key: number]: number } = { 1: 0, 3: 1, 4: 2, 6: 3, 7: 4, 9: 5 };
      const videoIndex = videoMap[index];
      
      if (videoIndex !== undefined) {
        post.video = demoVideos[videoIndex];
        post.content = index % 2 === 0
          ? 'Автоматизация производства - будущее промышленности! Внедряем новые робототехнические комплексы. #промышленность #автоматизация'
          : 'Наши инженеры контролируют каждый этап производства. Качество - наш главный приоритет! 🏭 #производство #качество';
        post.images = undefined;
      }
      // Fallback to images for any other indices (if count > 10)
      else if (index % 5 === 0) {
        post.images = [`https://picsum.photos/seed/${index}/800/600`];
      } else if (index % 7 === 0) {
        post.images = [
          `https://picsum.photos/seed/${index}a/800/600`,
          `https://picsum.photos/seed/${index}b/800/600`,
        ];
      }
    }

    // Add event details for event posts

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
      {/* PROMME Logo Bar */}
      <div className="fixed left-0 right-0 top-0 md:top-20 z-[999] overflow-hidden bg-gradient-to-r from-primary-orange via-primary-gold to-primary-pink shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
        {/* Decorative background shapes */}
        <div className="pointer-events-none absolute left-[-10%] top-[-50%] h-[500px] w-[500px] rounded-full bg-white/10" />
        <div className="pointer-events-none absolute bottom-[-50%] right-[-5%] h-[400px] w-[400px] rounded-full bg-white/8" />
        
        <div className="relative z-10 py-4">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4">
            <svg width="186" height="33" viewBox="0 0 186 33" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-[40px] w-auto text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
              <path d="M0.61 32V0.949997H12.715C19.555 0.949997 23.74 5.045 23.74 10.895C23.74 17.78 19.285 21.515 11.905 21.515H5.92V32H0.61ZM5.92 17.285H12.4C16.315 17.285 18.385 15.035 18.385 11.12C18.385 7.34 16.225 5.27 12.445 5.27H5.92V17.285ZM25.3424 32V0.949997H39.5174C45.9524 0.949997 49.6874 3.875 49.6874 9.23C49.6874 13.1 47.7074 15.665 43.7474 16.97C47.4824 17.69 49.0574 19.58 49.1924 23.045L49.4174 28.67C49.4624 30.065 49.7774 31.19 50.2724 32H44.9174C44.3324 31.1 44.1524 30.155 44.1074 28.67L43.9724 23.945C43.8374 20.705 42.5774 19.085 39.0224 19.085H30.6524V32H25.3424ZM30.6524 15.08H39.2024C42.3974 15.08 44.2424 13.235 44.2424 9.815C44.2424 6.62 42.3974 5 38.6624 5H30.6524V15.08ZM65.1903 32.315C56.4153 32.315 50.9703 26.15 50.9703 16.565C50.9703 6.98 56.7303 0.634999 65.5053 0.634999C73.9203 0.634999 79.6803 6.44 79.6803 16.295C79.6803 25.925 73.5603 32.315 65.1903 32.315ZM65.2803 27.995C70.9953 27.995 74.0553 23.675 74.0553 16.34C74.0553 9.095 70.9053 4.955 65.3253 4.955C59.9253 4.955 56.5953 9.185 56.5953 16.34C56.5953 23.585 59.7453 27.995 65.2803 27.995ZM81.487 32V0.949997H88.867L94.447 16.97C95.932 21.335 97.057 24.8 97.732 27.365C98.407 24.89 99.487 21.47 100.927 17.195L106.462 0.949997H113.752V32H108.622V19.85C108.622 14.585 108.712 10.13 108.847 6.485C108.262 8.555 107.182 11.885 105.607 16.475L100.207 32H94.987L89.227 15.98C88.192 13.055 87.202 9.905 86.212 6.53C86.347 10.13 86.437 14.585 86.437 19.94V32H81.487ZM116.766 32V0.949997H124.146L129.726 16.97C131.211 21.335 132.336 24.8 133.011 27.365C133.686 24.89 134.766 21.47 136.206 17.195L141.741 0.949997H149.031V32H143.901V19.85C143.901 14.585 143.991 10.13 144.126 6.485C143.541 8.555 142.461 11.885 140.886 16.475L135.486 32H130.266L124.506 15.98C123.471 13.055 122.481 9.905 121.491 6.53C121.626 10.13 121.716 14.585 121.716 19.94V32H116.766ZM152.046 32V0.949997H173.556V5.27H157.356V14H170.946V18.185H157.356V27.68H174.321V32H152.046Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        {/* Refresh Indicator */}
        {isRefreshing && (
          <div className="fixed top-36 left-1/2 -translate-x-1/2 z-50 bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-3">
            <div className="w-5 h-5 border-3 border-primary-orange border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-700">Обновление...</span>
          </div>
        )}

        {/* Create Post Card Removed - Replaced by FAB */}

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
              <div className="w-2 h-2 bg-primary-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
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

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => openModal('post')}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all hover:scale-105 active:scale-95"
        aria-label="Создать публикацию"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

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

