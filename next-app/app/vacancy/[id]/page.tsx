'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Vacancy, Application } from '@/types';
import ApplicationModal from '@/components/ApplicationModal';

// Mock vacancy data (same as VacanciesSection)
const mockVacancies: Vacancy[] = [
  {
    id: '1',
    title: 'Инженер-программист',
    company: 'ТехноПром',
    location: 'Сынково I',
    salary_min: 80000,
    salary_max: 120000,
    description: 'Мы ищем опытного инженера-программиста для разработки программного обеспечения для промышленного оборудования. Вы будете работать над созданием систем управления и мониторинга для современного производственного оборудования.',
    requirements: '• Высшее техническое образование\n• Опыт работы от 3 лет в промышленной автоматизации\n• Знание C++, Python\n• Опыт работы с PLC контроллерами\n• Понимание принципов работы промышленного оборудования',
    benefits: '• Конкурентная заработная плата\n• Медицинское страхование\n• Корпоративное обучение\n• Современное рабочее место\n• Возможность карьерного роста',
    employment_type: 'full-time',
    experience_years: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Специалист по качеству',
    company: 'ПромКонтроль',
    location: 'Коледино',
    salary_min: 60000,
    salary_max: 90000,
    description: 'В нашу команду требуется специалист по контролю качества продукции. Вы будете отвечать за проведение проверок, составление отчетов и обеспечение соответствия продукции стандартам качества.',
    requirements: '• Высшее образование (техническое или инженерное)\n• Опыт работы от 2 лет в области контроля качества\n• Знание ISO 9001\n• Внимательность к деталям\n• Умение работать с измерительным оборудованием',
    benefits: '• Стабильная компания\n• Официальное трудоустройство\n• Социальный пакет\n• Обучение и развитие\n• График 5/2',
    employment_type: 'full-time',
    experience_years: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Оператор станков с ЧПУ',
    company: 'МеталлоОбработка',
    location: 'Сынково I',
    salary_min: 55000,
    salary_max: 75000,
    description: 'Приглашаем оператора станков с ЧПУ для работы на современном высокотехнологичном оборудовании. Работа в стабильной производственной компании с возможностью профессионального развития.',
    requirements: '• Опыт работы на станках с ЧПУ от 1 года\n• Умение читать чертежи\n• Знание G-кодов\n• Ответственность и внимательность\n• Готовность к сменному графику',
    benefits: '• Достойная заработная плата\n• Премии по результатам работы\n• Бесплатное питание\n• Корпоративный транспорт\n• Обучение на рабочем месте',
    employment_type: 'full-time',
    experience_years: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Логист',
    company: 'ЛогистикПро',
    location: 'Коледино',
    salary_min: 50000,
    salary_max: 70000,
    description: 'Ищем логиста для управления складской логистикой и координации поставок. Вы будете отвечать за оптимизацию складских операций и взаимодействие с поставщиками.',
    requirements: '• Опыт работы логистом от 1 года\n• Знание 1С: WMS\n• Умение работать с большим объемом документов\n• Организаторские способности\n• Внимательность',
    benefits: '• Официальное трудоустройство\n• Социальный пакет\n• Дружный коллектив\n• Удобный график работы\n• Возможность роста',
    employment_type: 'full-time',
    experience_years: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Технолог производства',
    company: 'ИнноПром',
    location: 'Сынково I',
    salary_min: 70000,
    salary_max: 100000,
    description: 'Требуется технолог производства для разработки и оптимизации технологических процессов. Работа в современной производственной компании с инновационными подходами.',
    requirements: '• Высшее техническое образование\n• Опыт работы технологом от 2 лет\n• Знание САПР систем\n• Понимание производственных процессов\n• Аналитические способности',
    benefits: '• Интересные задачи\n• Конкурентная зарплата\n• Медицинская страховка\n• Профессиональное развитие\n• Современное оборудование',
    employment_type: 'full-time',
    experience_years: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '6',
    title: 'Электрик',
    company: 'ЭлектроСервис',
    location: 'Коледино',
    salary_min: 45000,
    salary_max: 65000,
    description: 'В команду требуется электрик для обслуживания электрооборудования производственных помещений. Работа в стабильной компании с полным социальным пакетом.',
    requirements: '• Профильное образование\n• Опыт работы электриком от 1 года\n• Группа допуска не ниже III\n• Знание правил ТБ\n• Ответственность',
    benefits: '• Стабильная зарплата\n• Полный соцпакет\n• Спецодежда\n• Обучение за счет компании\n• График 5/2',
    employment_type: 'full-time',
    experience_years: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function VacancyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vacancyId = params.id as string;
  const [vacancy, setVacancy] = useState<Vacancy | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Find vacancy
    const foundVacancy = mockVacancies.find(v => v.id === vacancyId);
    setVacancy(foundVacancy || null);

    // Check authentication
    const storedAuthUser = localStorage.getItem('prommeAuthUser');
    setIsAuthenticated(!!storedAuthUser);

    // Check if user has already applied
    if (storedAuthUser) {
      const authUser = JSON.parse(storedAuthUser);
      const applicationsKey = `prommeApplications_${authUser.email}`;
      const applications = localStorage.getItem(applicationsKey);
      
      if (applications) {
        const parsedApplications = JSON.parse(applications);
        const alreadyApplied = parsedApplications.some(
          (app: Application) => app.vacancy_id === vacancyId
        );
        setHasApplied(alreadyApplied);
      }
    }
  }, [vacancyId]);

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = () => {
    setHasApplied(true);
    setShowApplicationModal(false);
  };

  if (!vacancy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF8C42] via-[#FF6B35] to-[#E94397] py-20 px-4 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Вакансия не найдена</h1>
          <Link href="/" className="text-xl underline hover:no-underline">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const formattedSalaryRange = vacancy.salary_min && vacancy.salary_max 
    ? `${vacancy.salary_min.toLocaleString('ru-RU')} - ${vacancy.salary_max.toLocaleString('ru-RU')} ₽`
    : vacancy.salary_min
    ? `от ${vacancy.salary_min.toLocaleString('ru-RU')} ₽`
    : 'Не указана';

  const employmentTypeLabel: Record<string, string> = {
    'full-time': 'Полная занятость',
    'part-time': 'Частичная занятость',
    'contract': 'Контракт',
    'internship': 'Стажировка'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF8C42] via-[#FF6B35] to-[#E94397] py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 mb-6 text-white hover:underline"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Назад к вакансиям
        </Link>

        {/* Vacancy Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-purple-dark to-primary-purple p-8 text-white">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{vacancy.title}</h1>
                <p className="text-xl text-white/90 mb-3">{vacancy.company}</p>
                <div className="flex items-center gap-2 text-white/80">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>{vacancy.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 rounded-2xl px-6 py-3 backdrop-blur-sm">
                  <p className="text-3xl font-bold">{formattedSalaryRange}</p>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                {employmentTypeLabel[vacancy.employment_type] || vacancy.employment_type}
              </span>
              {vacancy.experience_years !== undefined && (
                <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                  Опыт: {vacancy.experience_years === 0 ? 'Без опыта' : `${vacancy.experience_years}+ лет`}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Description */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-orange" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Описание вакансии
              </h2>
              <p className="text-text-light leading-relaxed text-lg">{vacancy.description}</p>
            </section>

            {/* Requirements */}
            {vacancy.requirements && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary-purple" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Требования
                </h2>
                <div className="bg-purple-50 rounded-2xl p-6">
                  <pre className="text-text-light leading-relaxed text-lg whitespace-pre-wrap font-sans">{vacancy.requirements}</pre>
                </div>
              </section>
            )}

            {/* Benefits */}
            {vacancy.benefits && (
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-text mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-primary-pink" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Мы предлагаем
                </h2>
                <div className="bg-pink-50 rounded-2xl p-6">
                  <pre className="text-text-light leading-relaxed text-lg whitespace-pre-wrap font-sans">{vacancy.benefits}</pre>
                </div>
              </section>
            )}

            {/* Apply Button */}
            <div className="flex gap-4 pt-6 border-t border-gray-200">
              {hasApplied ? (
                <div className="flex-1 bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <svg className="w-8 h-8 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="text-2xl font-bold text-green-700">Вы уже откликнулись!</p>
                  </div>
                  <p className="text-green-600">Ваше резюме отправлено работодателю. Ожидайте ответа.</p>
                </div>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="flex-1 bg-gradient-to-r from-primary-orange to-primary-pink text-white rounded-2xl px-8 py-6 text-xl font-bold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12V19C21 19.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Откликнуться на вакансию
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <ApplicationModal
          vacancy={vacancy}
          onClose={() => setShowApplicationModal(false)}
          onSubmit={handleApplicationSubmit}
        />
      )}
    </div>
  );
}

