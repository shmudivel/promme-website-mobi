import { Vacancy } from '@/types';
import Link from 'next/link';

interface VacancyCardProps {
  vacancy: Vacancy;
}

export default function VacancyCard({ vacancy }: VacancyCardProps) {
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
    <Link href={`/vacancy/${vacancy.id}`}>
      <div className="group flex flex-col gap-3 rounded-[20px] bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] max-md:p-6">
        {/* Company Name */}
        <p className="mb-0 text-[15px] font-normal text-gray-600">{vacancy.company}</p>
        
        {/* Job Title */}
        <h3 className="mb-2 text-[22px] font-bold leading-[1.3] text-text transition-colors group-hover:text-primary-orange max-md:text-xl">
          {vacancy.title}
        </h3>
        
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
        
        {/* View Details Button */}
        <button className="mt-4 inline-flex items-center justify-center gap-2 self-start rounded-full bg-primary-purple-dark px-6 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg">
          <span>Подробнее</span>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </Link>
  );
}

