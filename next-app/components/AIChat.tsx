'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

type MessageType = 'ai' | 'user';
type ViewMode = 'chat' | 'form';

interface ChatMessage {
  id: string;
  type: MessageType;
  content: string;
  timestamp: Date;
}

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
  // Company-specific fields
  industry?: string;
  foundedYear?: string;
  employeeCount?: string;
  projectsCount?: string;
  // Facilitator-specific fields
  studentCount?: string;
  coursesCount?: string;
  campusCount?: string;
}

export default function AIChat() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [showAvatarSuggestion, setShowAvatarSuggestion] = useState(false);
  const [showAuthButtons, setShowAuthButtons] = useState(false);
  const [isCreatingAvatar, setIsCreatingAvatar] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  // Track if we've processed avatar suggestion this session
  const avatarSuggestionProcessedRef = useRef(false);
  const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);
  const [profileFormData, setProfileFormData] = useState<ProfileFormData>({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    location: '',
    education: '',
    experience: '',
    skills: '',
    languages: '',
    about: ''
  });

  // Auto-open modal on fresh login or avatar suggestion
  useEffect(() => {
    const checkFreshLogin = () => {
      const isFreshLogin = sessionStorage.getItem('freshLogin');
      const aiChatShown = sessionStorage.getItem('aiChatShown');

      if (isFreshLogin === 'true' && aiChatShown !== 'true') {
        setIsModalOpen(true);
        sessionStorage.setItem('aiChatShown', 'true');
        sessionStorage.removeItem('freshLogin');
        initializeChat();
      }
    };

    // Listen for custom event to open AI chat from bottom nav
    const handleOpenAIChat = () => {
      setIsModalOpen(true);
      if (chatMessages.length === 0) {
        initializeChat();
      }
    };
    
    window.addEventListener('openAIChat', handleOpenAIChat);

    const checkAvatarSuggestion = (): boolean => {
      // Don't process if already handled in this component lifecycle
      if (avatarSuggestionProcessedRef.current) {
        return false;
      }

      const triggerAvatar = sessionStorage.getItem('triggerAvatarSuggestion');
      const timestamp = sessionStorage.getItem('triggerAvatarTimestamp');

      if (triggerAvatar === 'true' && timestamp) {
        const triggerTime = parseInt(timestamp, 10);
        const now = Date.now();

        // Only process if trigger is recent (within last 5 seconds)
        if (now - triggerTime < 5000) {
          try {
            setIsModalOpen(true);
            suggestVideoAvatar();

            // Mark as processed
            avatarSuggestionProcessedRef.current = true;

            // Clear trigger flags
            sessionStorage.removeItem('triggerAvatarSuggestion');
            sessionStorage.removeItem('triggerAvatarTimestamp');

            // Set session flag - show only once per session
            sessionStorage.setItem('avatarSuggestionShown', 'true');

            return true;
          } catch (error) {
            console.error('Failed to open avatar suggestion:', error);
            return false;
          }
        } else {
          // Clear stale trigger (older than 5 seconds)
          sessionStorage.removeItem('triggerAvatarSuggestion');
          sessionStorage.removeItem('triggerAvatarTimestamp');
        }
      }
      return false;
    };

    // Check immediately on mount - PRIORITY ORDER MATTERS!
    // Avatar suggestion has higher priority than profile creation
    const avatarOpened = checkAvatarSuggestion();

    // Only check fresh login if avatar didn't trigger
    if (!avatarOpened) {
      checkFreshLogin();
    }

    // Set up polling to catch avatar trigger if not opened immediately
    let pollInterval: NodeJS.Timeout | null = null;
    let pollCount = 0;
    const MAX_POLLS = 20; // Poll for 2 seconds max (20 × 100ms)

    if (!avatarOpened) {
      pollInterval = setInterval(() => {
        pollCount++;

        const opened = checkAvatarSuggestion();

        // Stop polling if opened or max polls reached
        if (opened || pollCount >= MAX_POLLS) {
          if (pollInterval) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        }
      }, 100);
    }

    // Listen for profile creation events (keep existing)
    const handleProfileCreation = () => {
      setTimeout(() => {
        checkFreshLogin();
      }, 100);
    };

    window.addEventListener('profileCreationReady', handleProfileCreation);

    // Cleanup
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      window.removeEventListener('profileCreationReady', handleProfileCreation);
      window.removeEventListener('openAIChat', handleOpenAIChat);
    };
  }, [chatMessages.length]);

  // Pre-fill email and name from authenticated user
  useEffect(() => {
    if (isModalOpen) {
      const storedAuthUser = localStorage.getItem('prommeAuthUser');
      if (storedAuthUser) {
        const authUser = JSON.parse(storedAuthUser);
        setAuthenticatedUser(authUser);
        setProfileFormData(prev => ({
          ...prev,
          fullName: authUser.name || '',
          email: authUser.email || ''
        }));
      }
    }
  }, [isModalOpen]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const initializeChat = () => {
    // Check if user is authenticated
    const authenticatedUser = localStorage.getItem('prommeAuthUser');
    
    if (authenticatedUser) {
      const user = JSON.parse(authenticatedUser);
      const isCompany = user.profileType === 'company';
      const isFacilitator = user.profileType === 'facilitator';
      
      let welcomeContent = 'Привет! 👋 Я PROMME AI Ассистент. Я помогу вам заполнить профиль.\n\nХотите, чтобы я помог заполнить ваш профиль автоматически? Вы можете загрузить резюме (PDF, DOCX, TXT) или просто написать о себе, и я заполню форму за вас!';

      if (isCompany) {
        welcomeContent = 'Привет! 👋 Я PROMME AI Ассистент. Я помогу вам заполнить профиль компании.\n\nХотите, чтобы я помог заполнить профиль автоматически? Вы можете загрузить описание компании, презентацию или просто написать о ней, и я заполню форму за вас!';
      } else if (isFacilitator) {
        welcomeContent = 'Привет! 👋 Я PROMME AI Ассистент. Я помогу вам заполнить профиль учебного заведения.\n\nХотите, чтобы я помог заполнить профиль автоматически? Вы можете загрузить описание учреждения, список программ или просто написать о нем, и я заполню форму за вас!';
      }
      
      // Authenticated user - show profile assistance
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: welcomeContent,
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
      setShowQuickReplies(true);
    } else {
      // Non-authenticated user - show welcome and prompt to sign in
      initializeWelcomeChat();
    }
  };

  const initializeWelcomeChat = () => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: 'Привет! 👋 Я PROMME AI Ассистент.\n\nЧтобы я мог помочь вам найти работу и заполнить профиль, пожалуйста, войдите в систему или зарегистрируйтесь.',
      timestamp: new Date()
    };
    setChatMessages([welcomeMessage]);
    setShowQuickReplies(false);
    // We'll use a separate state for auth buttons
    setShowAuthButtons(true);
  };

  const addAIMessage = (content: string, delay: number = 1000) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, delay);
  };

  const addUserMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const suggestVideoAvatar = () => {
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: 'Отлично! 🎉 Ваш профиль выглядит замечательно!\n\nХотите создать видео-аватар для вашего профиля? 🎥✨\n\nВидео-аватар сделает ваш профиль более живым и привлекательным. Просто загрузите ваше фото, и я создам профессиональный видео-аватар!',
      timestamp: new Date()
    };
    setChatMessages([welcomeMessage]);
    setShowAvatarSuggestion(true);
    setShowQuickReplies(false);
  };

  const handleAvatarYesClick = () => {
    addUserMessage('Да, создайте видео-аватар!');
    setShowAvatarSuggestion(false);
    addAIMessage('Отлично! 📸 Загрузите ваше фото (лучше всего фото лица в хорошем качестве), и я создам видео-аватар.', 1000);
    setTimeout(() => {
      setShowUploadOptions(true);
    }, 1500);
  };

  const handleAvatarNoClick = () => {
    addUserMessage('Нет, спасибо. Может быть позже.');
    setShowAvatarSuggestion(false);
    addAIMessage('Хорошо! 😊 Вы всегда можете создать видео-аватар позже через профиль.', 1000);
    setTimeout(() => {
      setIsModalOpen(false);
    }, 2500);
  };

  const handleYesClick = () => {
    const isCompany = authenticatedUser?.profileType === 'company';
    const isFacilitator = authenticatedUser?.profileType === 'facilitator';
    
    addUserMessage('Да, помогите заполнить профиль!');
    setShowQuickReplies(false);
    
    let responseMessage = 'Отлично! 🎉 Вы можете загрузить ваше резюме или просто написать о себе в чат. Я извлеку всю необходимую информацию и заполню профиль автоматически.';

    if (isCompany) {
      responseMessage = 'Отлично! 🎉 Вы можете загрузить информацию о компании или просто написать о ней в чат. Я извлеку всю необходимую информацию и заполню профиль автоматически.';
    } else if (isFacilitator) {
      responseMessage = 'Отлично! 🎉 Вы можете загрузить информацию об учебном заведении или просто написать о нем в чат. Я извлеку всю необходимую информацию и заполню профиль автоматически.';
    }
      
    addAIMessage(responseMessage, 1000);
    setTimeout(() => {
      setShowUploadOptions(true);
    }, 1500);
  };

  const handleNoClick = () => {
    addUserMessage('Нет, спасибо. Я заполню сам.');
    setShowQuickReplies(false);
    addAIMessage('Хорошо! 😊 Если передумаете, просто напишите мне. Я всегда готов помочь!', 1000);
    setTimeout(() => {
      sessionStorage.setItem('aiChatShown', 'true');
    }, 2000);
  };

  const handleLoginClick = () => {
    addUserMessage('Войти в систему');
    setShowAuthButtons(false);
    addAIMessage('Отлично! Перенаправляю вас на страницу входа...', 500);
    setTimeout(() => {
      router.push('/auth');
    }, 1500);
  };

  const handleSignupClick = () => {
    addUserMessage('Зарегистрироваться');
    setShowAuthButtons(false);
    addAIMessage('Отлично! Перенаправляю вас на страницу регистрации...', 500);
    setTimeout(() => {
      router.push('/auth?mode=signup');
    }, 1500);
  };

  const simulateAIProcessing = (inputText: string): Partial<ProfileFormData> => {
    // Simulate AI parsing - extract information from text
    const processedData: Partial<ProfileFormData> = {};
    
    const lowerText = inputText.toLowerCase();
    
    // Extract Full Name (ФИО)
    const nameMatch = inputText.match(/(?:фио|имя|name)[:\s]*([А-ЯЁа-яё\s]+)(?:\n|$)/i);
    if (nameMatch) {
      processedData.fullName = nameMatch[1].trim();
    }
    
    // Extract Date of Birth
    const dobMatch = inputText.match(/(?:дата рождения|date of birth)[:\s]*(\d{2}\.\d{2}\.\d{4})/i);
    if (dobMatch) {
      // Convert DD.MM.YYYY to YYYY-MM-DD for HTML date input
      const parts = dobMatch[1].split('.');
      if (parts.length === 3) {
        processedData.dateOfBirth = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    
    // Extract Phone
    const phoneMatch = inputText.match(/(?:телефон|phone)[:\s]*(\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{2}[-.\s]?\d{2})/i);
    if (phoneMatch) {
      processedData.phone = phoneMatch[1].trim();
    } else {
      // Fallback general phone pattern
      const phoneMatch2 = inputText.match(/\+?\d{1,3}[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{2}[-.\s]?\d{2}/);
      if (phoneMatch2) {
        processedData.phone = phoneMatch2[0];
      }
    }
    
    // Extract Location/City
    const locationMatch = inputText.match(/(?:город|city|location)[:\s]*([А-ЯЁа-яёA-Za-z\s-]+)(?:\n|$)/i);
    if (locationMatch) {
      processedData.location = locationMatch[1].trim();
    }
    
    // Extract Education - look for educational institution and specialty
    const educationSection = inputText.match(/(?:образование|education)([\s\S]*?)(?:профессиональные навыки|опыт работы|сертификаты|$)/i);
    if (educationSection) {
      const eduText = educationSection[1].trim();
      const lines = eduText.split('\n').filter(line => line.trim() && !line.includes('---')).slice(0, 4);
      processedData.education = lines.join(', ').substring(0, 200);
    }
    
    // Extract Work Experience - compile from experience section
    const experienceSection = inputText.match(/(?:опыт работы|work experience)([\s\S]*?)(?:образование|профессиональные навыки|$)/i);
    if (experienceSection) {
      const expText = experienceSection[1].trim();
      const lines = expText.split('\n').filter(line => line.trim() && !line.includes('---'));
      const positions = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Check if line looks like a job title (uppercase or bold)
        if (line && (line === line.toUpperCase() || line.length < 50) && !line.startsWith('•')) {
          positions.push(line);
          if (positions.length >= 3) break; // Get top 3 positions
        }
      }
      
      if (positions.length > 0) {
        processedData.experience = positions.join('; ').substring(0, 300);
      } else {
        // Fallback - get first few lines
        processedData.experience = lines.slice(0, 5).join('; ').substring(0, 300);
      }
    }
    
    // Extract Skills
    const skillsSection = inputText.match(/(?:профессиональные навыки|навыки|skills)([\s\S]*?)(?:сертификаты|дополнительная информация|рекомендации|$)/i);
    if (skillsSection) {
      const skillsText = skillsSection[1].trim();
      const skillLines = skillsText.split('\n')
        .filter(line => line.trim() && !line.includes('---') && line.startsWith('•'))
        .map(line => line.replace('•', '').trim())
        .slice(0, 8); // Get first 8 skills
      
      if (skillLines.length > 0) {
        processedData.skills = skillLines.join(', ');
      }
    }
    
    // Extract Languages (if mentioned)
    const langMatch = inputText.match(/(?:языки|languages)[:\s]*([^\n]+)/i);
    if (langMatch) {
      processedData.languages = langMatch[1].trim();
    } else {
      // Default to Russian if no languages specified
      processedData.languages = 'Русский';
    }
    
    // Create a summary for "About" section
    const summaryParts = [];
    
    // Extract years of experience
    const yearsMatch = inputText.match(/опыт работы[:\s]*(\d+)\s*(?:лет|года|год)/i);
    if (yearsMatch) {
      summaryParts.push(`Опыт работы: ${yearsMatch[1]} лет`);
    }
    
    // Extract goal/objective
    const goalMatch = inputText.match(/(?:цель|objective)[:\s]*([^\n]+)/i);
    if (goalMatch) {
      summaryParts.push(goalMatch[1].trim());
    }
    
    // Extract additional info
    const additionalSection = inputText.match(/(?:дополнительная информация)([\s\S]*?)(?:рекомендации|$)/i);
    if (additionalSection) {
      const additionalLines = additionalSection[1].split('\n')
        .filter(line => line.trim() && !line.includes('---') && line.startsWith('•'))
        .map(line => line.replace('•', '').trim())
        .slice(0, 3);
      summaryParts.push(...additionalLines);
    }
    
    if (summaryParts.length > 0) {
      processedData.about = summaryParts.join('. ');
    }
    
    return processedData;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    addUserMessage(`📎 Загружен файл: ${file.name}`);
    setShowUploadOptions(false);
    setIsTyping(true);
    
    try {
      // Check if this is an image file for avatar creation
      const isImageFile = file.type.startsWith('image/');

      // Get user profile type for demo detection (shared by both avatar and text file blocks)
      const storedAuthUser = localStorage.getItem('prommeAuthUser');
      const userProfileType = storedAuthUser ? JSON.parse(storedAuthUser).profileType : null;

      if (isImageFile && chatMessages.some(msg => msg.content.includes('видео-аватар'))) {
        // This is an avatar photo upload
        console.log('Avatar photo uploaded:', file.name);
        setIsCreatingAvatar(true);
        
        // Create object URL for the image
        const imageUrl = URL.createObjectURL(file);

        // Demo Logic for Video Selection
        let videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'; // Default

        if (userProfileType === 'company') {
          // Company demo videos
          if (file.name.includes('5')) {
            videoUrl = 'https://wqixabfppisqznzjqnoo.supabase.co/storage/v1/object/public/avatars/5_company.mp4';
          } else if (file.name.includes('6')) {
            videoUrl = 'https://wqixabfppisqznzjqnoo.supabase.co/storage/v1/object/public/avatars/6_company.mp4';
          }
        } else if (userProfileType === 'facilitator') {
          // Facilitator demo videos
          if (file.name.includes('3')) {
            videoUrl = 'https://wqixabfppisqznzjqnoo.supabase.co/storage/v1/object/public/avatars/3_study_facility.mp4';
          } else if (file.name.includes('4')) {
            videoUrl = 'https://wqixabfppisqznzjqnoo.supabase.co/storage/v1/object/public/avatars/4_study_facility.mp4';
          }
        } else {
          // Job seeker demo videos
          if (file.name.includes('1')) {
            videoUrl = 'https://wqixabfppisqznzjqnoo.supabase.co/storage/v1/object/public/avatars/1js.mp4';
          } else if (file.name.includes('2')) {
            videoUrl = 'https://wqixabfppisqznzjqnoo.supabase.co/storage/v1/object/public/avatars/2js.mp4';
          }
        }

        addAIMessage('Получил ваше фото! 📸 Начинаю создание видео-аватара...', 500);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        addAIMessage('Обрабатываю изображение... 🎨', 2500);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        addAIMessage('Генерирую видео с помощью AI... 🎬', 4500);
        
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Save avatar data (reusing storedAuthUser from line 470)
        if (storedAuthUser) {
          const authUser = JSON.parse(storedAuthUser);
          const avatarKey = `prommeAvatar_${authUser.email}_${authUser.profileType}`;
          
          const avatarData = {
            photoUrl: imageUrl,
            videoUrl: videoUrl,
            generatedAt: new Date().toISOString()
          };
          
          localStorage.setItem(avatarKey, JSON.stringify(avatarData));

          // Save to Supabase
          try {
              const { error } = await supabase
                  .from('profiles')
                  .upsert({ 
                      email: authUser.email,
                      avatar_video_url: videoUrl,
                      updated_at: new Date().toISOString()
                  }, { onConflict: 'email' });

              if (error) {
                  console.error('Error saving to Supabase:', error);
              } else {
                  console.log('Saved video URL to Supabase:', videoUrl);
              }
          } catch (err) {
              console.error('Supabase connection error:', err);
          }
        }
        
        addAIMessage('Готово! ✅ Ваш видео-аватар успешно создан! Перенаправляю на страницу профиля...', 7500);

        setTimeout(() => {
          setIsCreatingAvatar(false);
          setIsModalOpen(false);
          router.push(`/profile?refresh=${Date.now()}`);
        }, 9000);
      } else {
        // This is a resume file
        const fileText = await file.text();
        console.log('File uploaded:', file.name);
        
        addAIMessage('Анализирую ваш файл... ⏳', 500);
        
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        let extractedData: Partial<ProfileFormData> = {};

        // Edge case: Warn if company uploads job seeker file
        if ((file.name.includes('1') || file.name.includes('2')) && userProfileType === 'company') {
          addAIMessage('⚠️ Этот файл предназначен для профиля соискателя. Для компаний используйте файлы 5_company.txt или 6_company.txt', 2000);
          setIsTyping(false);
          return;
        }

        // Edge case: Warn if job seeker uploads company file
        if ((file.name.includes('5') || file.name.includes('6')) && userProfileType !== 'company' && userProfileType !== 'facilitator') {
          addAIMessage('⚠️ Этот файл предназначен для профиля компании. Для соискателей используйте файлы 1.txt или 2.txt', 2000);
          setIsTyping(false);
          return;
        }

        // Edge case: Warn if facilitator uploads company/job seeker file (or vice versa logic if needed)
        if ((file.name.includes('3') || file.name.includes('4')) && userProfileType !== 'facilitator') {
           addAIMessage('⚠️ Этот файл предназначен для профиля учебного заведения.', 2000);
           setIsTyping(false);
           return;
        }

        // Demo Logic for Resume parsing
        if (file.name.includes('1')) {
             extractedData = {
                fullName: 'Алексей Викторович Соколов',
                email: 'a.sokolov.teach@example.com',
                phone: '+7 (777) 123-45-67',
                location: 'Алматы, Казахстан',
                education: 'Магистр технических наук, Информационные системы, КазНУ им. аль-Фараби, 2017\nБакалавр компьютерных наук, Программная инженерия, КазНУ им. аль-Фараби, 2015',
                experience: 'Старший преподаватель программирования, Образовательная IT-платформа (2020 — н.в.)\nIT-преподаватель, Частная IT-школа (2017 — 2020)',
                skills: 'Python, JavaScript/TypeScript, SQL, Алгоритмы и структуры данных, Full Stack Development, Педагогические методики',
                languages: 'Русский (родной), Английский (B2-C1), Казахский (базовый)',
                about: 'Опытный IT-преподаватель со специализацией в разработке авторских методик обучения программированию. Трансформирую сложные технические концепции в увлекательный образовательный процесс. Миссия — показать студентам, что изучение технологий может быть естественным и вдохновляющим.'
            };
        } else if (file.name.includes('2')) {
             extractedData = {
                fullName: 'Карпов Дмитрий Владимирович',
                email: 'd.karpov.driver@mail.kz',
                phone: '+7 (705) 234-56-78',
                location: 'Алматы, Казахстан',
                dateOfBirth: '1984-03-15',
                education: 'Алматинский колледж транспорта и коммуникаций, Организация перевозок и управление на автомобильном транспорте, 2013',
                experience: 'Водитель международных рейсов, ТОО "АзияТрансЛогистик" (2021 – 2024)\nВодитель городских маршрутов, АО "АлматыАвтотранс" (2018 – 2021)\nВодитель междугородних перевозок, ИП "Степной Экспресс" (2014 – 2018)',
                skills: 'Водительские категории B, C, D, E; Тахографы и GPS; ПДД СНГ и Европы; Перевозка опасных грузов (ADR); Таможенное оформление (CMR, TIR)',
                languages: 'Казахский (родной), Русский (свободно), Английский (базовый)',
                about: 'Опытный водитель-профессионал с 10-летним стажем безаварийного вождения. Специализируюсь на международных и междугородних перевозках. Ответственный, пунктуальный, без вредных привычек. Готов к длительным командировкам.'
            };
        } else if (file.name.includes('5') && userProfileType === 'company') {
            // Company 5: ГеоСтройПроект
            extractedData = {
                fullName: 'ООО "ГеоСтройПроект"',
                email: 'info@geostroy.kz',
                phone: '+7 (727) 350-12-45',
                location: 'Алматы, Казахстан',
                industry: 'Геологоразведка и инженерные изыскания',
                foundedYear: '2004',
                employeeCount: '120+',
                projectsCount: '4500+',
                skills: 'Геологоразведочные работы, Бурение скважин, Инженерно-геологические изыскания, Лабораторные исследования, Геофизические методы, Экологический мониторинг',
                experience: '20 лет успешной работы на рынке геологоразведки',
                about: 'Ведущая компания в области геологоразведки и инженерных изысканий. За 20 лет работы реализовано более 4500 проектов по всему Казахстану. Обладаем современной технической базой, собственной аккредитованной лабораторией и командой из 120+ высококвалифицированных специалистов. Выполняем полный комплекс работ: от предварительных исследований до комплексных геологических изысканий для крупных инфраструктурных объектов.'
            };
        } else if (file.name.includes('6') && userProfileType === 'company') {
            // Company 6: ТеплоИзолПром
            extractedData = {
                fullName: 'ООО "ТеплоИзолПром"',
                email: 'sales@teploizol.kz',
                phone: '+7 (727) 245-67-89',
                location: 'Алматы, Казахстан',
                industry: 'Производство и монтаж теплоизоляции',
                foundedYear: '2009',
                employeeCount: '85',
                projectsCount: '2000+',
                skills: 'Промышленная изоляция трубопроводов, Энергосберегающие решения, Системы утепления фасадов, Огнезащита конструкций, Холодильная изоляция, Акустическая изоляция',
                experience: '15 лет опыта в производстве и монтаже теплоизоляции',
                about: 'Производственная компания, специализирующаяся на комплексных решениях в области теплоизоляции. Собственное производство современных теплоизоляционных материалов. За 15 лет работы выполнено более 2000 объектов, смонтировано 350+ км промышленной изоляции. Работаем с ведущими предприятиями нефтегазовой, химической и энергетической отраслей. Предоставляем полный цикл услуг: от разработки технических решений до монтажа и гарантийного обслуживания.'
            };
        } else if (file.name.includes('3') && userProfileType === 'facilitator') {
            // Facilitator 3: Аграрный Университет
            extractedData = {
                fullName: 'Аграрный Университет Юга России',
                email: 'info@agrouni.ru',
                phone: '+7 (861) 222-33-44',
                location: 'Краснодар, Россия',
                foundedYear: '1955',
                studentCount: '15000+',
                coursesCount: '45',
                campusCount: '12',
                skills: 'Цифровое сельское хозяйство, Биотехнологии и генетика, Сити-фермерство, Агроробототехника, Ветеринария, Агрономия',
                about: 'Современный центр высшего аграрного образования, который объединяет классические научные фундаментальные знания и передовые технологические решения для агропромышленного комплекса. Университет готовит специалистов нового поколения, способных работать с высокотехнологичным оборудованием, цифровыми системами и инновационными агротехнологиями. Мы сочетаем фундаментальные аграрные дисциплины с практико-ориентированным подходом.'
            };
        } else if (file.name.includes('4') && userProfileType === 'facilitator') {
            // Facilitator 4: Технолаб Промбудущее
            extractedData = {
                fullName: 'Технолаб Промбудущее',
                email: 'admissions@technolab.ru',
                phone: '+7 (495) 555-66-77',
                location: 'Москва, Россия',
                foundedYear: '2018',
                studentCount: '850',
                coursesCount: '12',
                campusCount: '2',
                skills: 'Промышленная автоматизация, Мехатроника, Робототехника, ЧПУ программирование, Промышленный дизайн, Аддитивные технологии',
                about: 'Образовательная площадка, специализирующаяся на подготовке высококвалифицированных специалистов для промышленных предприятий. Под руководством Алексея Семенова, мы предлагаем уникальный образовательный опыт, где 80% времени уделяется практике. Наши студенты погружаются в реальную производственную среду, работая с современным оборудованием и решая актуальные задачи отрасли.'
            };
        } else {
            extractedData = simulateAIProcessing(fileText);
        }
        
        setProfileFormData(prev => ({ ...prev, ...extractedData }));
        
        addAIMessage('Отлично! ✨ Я извлек информацию из вашего резюме и заполнил профиль. Сейчас покажу форму для проверки и редактирования.', 3500);
        
        setTimeout(() => {
          setViewMode('form');
        }, 5000);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      addAIMessage('Упс! 😔 Не удалось прочитать файл. Попробуйте еще раз.', 3000);
      setTimeout(() => {
        setShowUploadOptions(true);
      }, 3500);
    } finally {
      setIsTyping(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    
    const userText = textInput;
    addUserMessage(userText);
    setTextInput('');
    setShowUploadOptions(false);
    setIsTyping(true);
    
    try {
      addAIMessage('Понял! 👍 Анализирую вашу информацию...', 500);
      
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const extractedData = simulateAIProcessing(userText);
      setProfileFormData(prev => ({ ...prev, ...extractedData }));
      
      addAIMessage('Отлично! ✨ Я обработал вашу информацию и заполнил профиль. Давайте проверим и отредактируем при необходимости.', 2500);
      
      setTimeout(() => {
        setViewMode('form');
      }, 4000);
    } catch (error) {
      console.error('Error processing text:', error);
      addAIMessage('Произошла ошибка при обработке. Попробуйте еще раз.', 2000);
      setTimeout(() => {
        setShowUploadOptions(true);
      }, 2500);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleTextSubmit();
    }
  };

  const handleFormChange = (field: keyof ProfileFormData, value: string) => {
    setProfileFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    try {
      const storedAuthUser = localStorage.getItem('prommeAuthUser');
      if (!storedAuthUser) {
        alert('Пожалуйста, войдите в систему');
        return;
      }
      
      const authUser = JSON.parse(storedAuthUser);
      
      // Save profile data to localStorage
      const profileKey = `prommeProfile_${authUser.email}_${authUser.profileType}`;
      localStorage.setItem(profileKey, JSON.stringify(profileFormData));
      
      // Close modal and redirect to profile page
      setIsModalOpen(false);
      setViewMode('chat');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/profile');
      }, 300);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Ошибка при сохранении профиля');
    }
  };

  return (
    <>
      {/* Floating AI Chat Button - Hidden on mobile since it's in bottom nav */}
      <button
        onClick={() => {
          setIsModalOpen(true);
          if (chatMessages.length === 0) {
            initializeChat();
          }
        }}
        className="fixed bottom-8 right-8 z-50 hidden md:flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-primary-purple to-primary-orange shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all hover:scale-110 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]"
        aria-label="AI Chat"
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Purple chat bubble (left/back) */}
          <path d="M8 12C8 9.79086 9.79086 8 12 8H24C26.2091 8 28 9.79086 28 12V24C28 26.2091 26.2091 28 24 28H16L10 34V28H12C9.79086 28 8 26.2091 8 24V12Z" fill="#8B5FD8"/>
          
          {/* Orange chat bubble (right/front) */}
          <path d="M20 18C20 15.7909 21.7909 14 24 14H36C38.2091 14 40 15.7909 40 18V30C40 32.2091 38.2091 34 36 34H28L22 40V34H24C21.7909 34 20 32.2091 20 30V18Z" fill="#FF6B35"/>
          
          {/* AI Text on orange bubble */}
          <text x="30" y="27" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif">AI</text>
        </svg>
      </button>

      {/* AI Chat Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget && viewMode !== 'form') {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="relative w-full max-w-[500px] h-[80vh] rounded-3xl bg-white shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 p-4 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-purple to-primary-orange">
                  <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 12C8 9.79086 9.79086 8 12 8H24C26.2091 8 28 9.79086 28 12V24C28 26.2091 26.2091 28 24 28H16L10 34V28H12C9.79086 28 8 26.2091 8 24V12Z" fill="#8B5FD8"/>
                    <path d="M20 18C20 15.7909 21.7909 14 24 14H36C38.2091 14 40 15.7909 40 18V30C40 32.2091 38.2091 34 36 34H28L22 40V34H24C21.7909 34 20 32.2091 20 30V18Z" fill="#FF6B35"/>
                    <text x="30" y="27" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Arial, sans-serif">AI</text>
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-text">PROMME AI Ассистент</h3>
                  <p className="text-xs text-text-light">Здесь, чтобы помочь вам</p>
                </div>
              </div>
              
              {/* Header Actions */}
              <div className="flex items-center gap-2">
                {viewMode === 'form' && (
                  <button
                    onClick={() => setViewMode('chat')}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-gray-200"
                    aria-label="Back to chat"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-gray-200"
                  aria-label="Close AI Chat"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {viewMode === 'chat' ? (
              <>
                {/* Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      {/* Avatar */}
                      {message.type === 'ai' && (
                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-purple to-primary-orange text-xs font-bold text-white">
                          AI
                        </div>
                      )}
                      
                      {/* Message Bubble */}
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                          message.type === 'ai'
                            ? 'bg-gray-100 text-text'
                            : 'bg-gradient-to-r from-primary-orange to-primary-orange-light text-white'
                        }`}
                      >
                        <p className="whitespace-pre-line text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-purple to-primary-orange text-xs font-bold text-white">
                        AI
                      </div>
                      <div className="rounded-2xl bg-gray-100 px-4 py-3">
                        <div className="flex gap-1">
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quick Reply Buttons */}
                  {showQuickReplies && !isTyping && (
                    <div className="flex flex-col gap-2 px-11">
                      <button
                        onClick={handleYesClick}
                        className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-orange-light to-primary-orange px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Да, помогите заполнить
                      </button>
                      <button
                        onClick={handleNoClick}
                        className="flex items-center justify-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-text transition-all hover:bg-gray-200"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Нет, спасибо
                      </button>
                    </div>
                  )}

                  {/* Avatar Suggestion Buttons */}
                  {showAvatarSuggestion && !isTyping && (
                    <div className="flex flex-col gap-2 px-11">
                      <button
                        onClick={handleAvatarYesClick}
                        className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-purple-dark to-primary-purple px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Да, создать видео-аватар!
                      </button>
                      <button
                        onClick={handleAvatarNoClick}
                        className="flex items-center justify-center gap-2 rounded-full bg-gray-100 px-5 py-2.5 text-sm font-semibold text-text transition-all hover:bg-gray-200"
                      >
                        Может быть позже
                      </button>
                    </div>
                  )}

                  {/* Auth Buttons for Non-Authenticated Users */}
                  {showAuthButtons && !isTyping && (
                    <div className="flex flex-col gap-2 px-11">
                      <button
                        onClick={handleLoginClick}
                        className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-orange-light to-primary-orange px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Да, войти
                      </button>
                      <button
                        onClick={handleSignupClick}
                        className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-purple-dark to-primary-purple px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M20 8V14M23 11H17M12.5 7C12.5 8.933 10.933 10.5 9 10.5C7.067 10.5 5.5 8.933 5.5 7C5.5 5.067 7.067 3.5 9 3.5C10.933 3.5 12.5 5.067 12.5 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Зарегистрироваться
                      </button>
                    </div>
                  )}

                  {/* Upload Options */}
                  {showUploadOptions && !isTyping && !isCreatingAvatar && (
                    <div className="px-11 space-y-3">
                      {/* File Upload Option */}
                      <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition-colors hover:border-primary-orange hover:bg-orange-50">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <label className="relative cursor-pointer rounded-full bg-primary-purple-dark px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-purple-700 active:scale-95">
                          <span className="pointer-events-none">
                            {chatMessages.some(msg => msg.content.includes('видео-аватар')) ? '📸 Загрузить фото' : '📎 Загрузить файл'}
                          </span>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            accept={chatMessages.some(msg => msg.content.includes('видео-аватар')) ? 'image/*' : '.pdf,.doc,.docx,.txt'}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </label>
                        <span className="text-xs text-text-light">
                          {chatMessages.some(msg => msg.content.includes('видео-аватар')) ? 'JPG, PNG, JPEG' : 'PDF, DOC, DOCX, TXT'}
                        </span>
                      </div>

                      {!chatMessages.some(msg => msg.content.includes('видео-аватар')) && (
                        <>
                          {/* Divider */}
                          <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                              <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative bg-white px-3 text-xs font-semibold text-text-light">ИЛИ</div>
                          </div>

                          {/* Text Input Message */}
                          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-center">
                            <p className="text-sm text-blue-800 font-medium">💬 Напишите о себе в чате ниже</p>
                            <p className="text-xs text-blue-600 mt-1">Введите информацию о себе в поле ввода</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input Area */}
                <div className="border-t border-gray-100 p-4 flex-shrink-0">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Напишите о себе..."
                      className="flex-1 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                    />
                    <button
                      type="submit"
                      disabled={!textInput.trim() || isTyping}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary-orange-light to-primary-orange text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <>
                {/* Form View - Auto-filled Profile Form */}
                <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-purple to-primary-orange text-xs font-bold text-white">
                      AI
                    </div>
                    <div className="flex-1 rounded-2xl bg-green-50 border border-green-200 p-4">
                      <p className="font-semibold text-green-800">✨ Готово! Я заполнил форму на основе вашей информации.</p>
                      <p className="text-sm text-green-700 mt-1">Проверьте и отредактируйте данные при необходимости.</p>
                    </div>
                  </div>

                  {/* Profile Form Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-semibold text-text">
                        {authenticatedUser?.profileType === 'company' ? 'Название компании *' : 'Полное имя *'}
                      </label>
                      <input
                        type="text"
                        value={profileFormData.fullName}
                        onChange={(e) => handleFormChange('fullName', e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                        placeholder={authenticatedUser?.profileType === 'company' ? 'ООО "Название"' : 'Иван Иванов'}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-text">Email *</label>
                      <input
                        type="email"
                        value={profileFormData.email}
                        onChange={(e) => handleFormChange('email', e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-text">Телефон</label>
                      <input
                        type="tel"
                        value={profileFormData.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                        placeholder="+7 (999) 123-45-67"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-text">Дата рождения</label>
                      <input
                        type="date"
                        value={profileFormData.dateOfBirth}
                        onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-text">Город</label>
                      <input
                        type="text"
                        value={profileFormData.location}
                        onChange={(e) => handleFormChange('location', e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                        placeholder="Москва"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-text">Образование</label>
                      <textarea
                        value={profileFormData.education}
                        onChange={(e) => handleFormChange('education', e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                        placeholder="МГУ, Факультет программирования, 2020"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-text">
                        {authenticatedUser?.profileType === 'company' ? 'Опыт компании' : 'Опыт работы'}
                      </label>
                      <textarea
                        value={profileFormData.experience}
                        onChange={(e) => handleFormChange('experience', e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                        placeholder={authenticatedUser?.profileType === 'company' ? '10 лет на рынке...' : 'Senior Developer в компании X, 5 лет опыта...'}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-text">
                        {authenticatedUser?.profileType === 'company' ? 'Услуги и специализация' : 'Навыки'}
                      </label>
                      <textarea
                        value={profileFormData.skills}
                        onChange={(e) => handleFormChange('skills', e.target.value)}
                        rows={2}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                        placeholder={authenticatedUser?.profileType === 'company' ? 'Производство, Монтаж, Консалтинг' : 'JavaScript, React, Node.js, Python'}
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-text">Языки</label>
                      <input
                        type="text"
                        value={profileFormData.languages}
                        onChange={(e) => handleFormChange('languages', e.target.value)}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                        placeholder="Русский (родной), Английский (B2)"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-text">О себе</label>
                      <textarea
                        value={profileFormData.about}
                        onChange={(e) => handleFormChange('about', e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                        placeholder="Расскажите о себе..."
                      />
                    </div>

                    {/* Company-Specific Fields */}
                    {authenticatedUser?.profileType === 'company' && (
                      <>
                        <div>
                          <label className="mb-1 block text-sm font-semibold text-text">Отрасль</label>
                          <input
                            type="text"
                            value={profileFormData.industry || ''}
                            onChange={(e) => handleFormChange('industry', e.target.value)}
                            className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                            placeholder="Например: Геологоразведка и инженерные изыскания"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="mb-1 block text-sm font-semibold text-text">Год основания</label>
                            <input
                              type="text"
                              value={profileFormData.foundedYear || ''}
                              onChange={(e) => handleFormChange('foundedYear', e.target.value)}
                              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                              placeholder="2004"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-semibold text-text">Количество сотрудников</label>
                            <input
                              type="text"
                              value={profileFormData.employeeCount || ''}
                              onChange={(e) => handleFormChange('employeeCount', e.target.value)}
                              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                              placeholder="50+"
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-semibold text-text">Реализовано проектов</label>
                            <input
                              type="text"
                              value={profileFormData.projectsCount || ''}
                              onChange={(e) => handleFormChange('projectsCount', e.target.value)}
                              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-3 text-text outline-none transition-colors focus:border-primary-orange focus:ring-2 focus:ring-primary-orange/20"
                              placeholder="1000+"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Save Button - Fixed at bottom */}
              <div className="border-t border-gray-100 p-4 flex-shrink-0">
                <button
                  onClick={handleSaveProfile}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-base font-bold text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17 21V13H7V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 3V8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Сохранить профиль
                </button>
              </div>
            </>
          )}
          </div>
        </div>
      )}
    </>
  );
}

