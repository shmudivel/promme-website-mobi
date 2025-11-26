'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Vacancy, Application } from '@/types';
import ApplicationModal from './ApplicationModal';

interface VacancyCardProps {
  vacancy: Vacancy;
}

export default function VacancyCard({ vacancy }: VacancyCardProps) {
  const router = useRouter();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
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
          (app: Application) => app.vacancy_id === vacancy.id
        );
        setHasApplied(alreadyApplied);
      }
    }
  }, [vacancy.id]);

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

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  return (
    <>
      <div className="group flex flex-col gap-3 rounded-[20px] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] max-md:p-6 relative">
        {/* Already Applied Badge */}
        {hasApplied && (
          <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Откликнулись
          </div>
        )}

        {/* Company Name */}
        <p className="mb-0 text-[15px] font-normal text-gray-600">{vacancy.company}</p>
        
        {/* Job Title */}
        <Link href={`/vacancy/${vacancy.id}`}>
          <h3 className="mb-2 text-[22px] font-bold leading-[1.3] text-text transition-colors group-hover:text-primary-orange max-md:text-xl cursor-pointer">
            {vacancy.title}
          </h3>
        </Link>
        
        {/* Salary */}
        <div className="mb-2">
          <span className="bg-gradient-to-r from-primary-orange-light to-primary-orange bg-clip-text text-[22px] font-bold text-transparent max-md:text-xl">
            {formattedSalaryRange}
          </span>
        </div>
        
        {/* Location */}
        <p className="mb-5 text-[15px] text-gray-600">{vacancy.location}</p>
        
        {/* Employment Type & Experience */}
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-text">
            {employmentTypeLabel[vacancy.employment_type] || vacancy.employment_type}
          </span>
          {vacancy.experience_years !== undefined && (
            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-text">
              Опыт: {vacancy.experience_years === 0 ? 'Без опыта' : `${vacancy.experience_years}+ лет`}
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="mt-4 flex gap-3 flex-wrap">
          <Link 
            href={`/vacancy/${vacancy.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-purple-dark px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <span>Подробнее</span>
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          
          {!hasApplied && (
            <button
              onClick={handleApplyClick}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-orange to-primary-pink px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span>Откликнуться</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 8L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
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
    </>
  );
}

