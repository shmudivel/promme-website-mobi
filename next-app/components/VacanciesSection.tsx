'use client';

import { useState } from 'react';
import VacancyCard from './VacancyCard';
import { Vacancy } from '@/types';

// Mock data for demonstration - will be replaced with API calls later
const mockVacancies: Vacancy[] = [
  {
    id: '1',
    title: 'Инженер-программист',
    company: 'ТехноПром',
    location: 'Сынково I',
    salary_min: 80000,
    salary_max: 120000,
    description: 'Разработка программного обеспечения для промышленного оборудования',
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
    description: 'Контроль качества продукции',
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
    description: 'Работа на современном оборудовании',
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
    description: 'Управление складской логистикой',
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
    description: 'Разработка технологических процессов',
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
    description: 'Обслуживание электрооборудования',
    employment_type: 'full-time',
    experience_years: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function VacanciesSection() {
  const [displayedVacanciesCount, setDisplayedVacanciesCount] = useState(6);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const filteredVacancies = selectedLocation
    ? mockVacancies.filter(vacancy => vacancy.location === selectedLocation)
    : mockVacancies;

  const displayedVacancies = filteredVacancies.slice(0, displayedVacanciesCount);
  const hasMore = displayedVacanciesCount < filteredVacancies.length;

  const loadMore = () => {
    setDisplayedVacanciesCount(prev => Math.min(prev + 6, filteredVacancies.length));
  };

  return (
    <section id="vacancies" className="bg-white px-5 py-20">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-4xl font-bold text-text max-md:text-3xl">
            Актуальные вакансии
          </h2>
          <p className="text-xl text-text-light">
            Найдите работу своей мечты в промышленном секторе
          </p>
        </div>

        {/* Location Filters */}
        <div className="mb-8 flex justify-center gap-3 max-sm:flex-col max-sm:items-center">
          <button
            onClick={() => setSelectedLocation(null)}
            className={`rounded-full px-6 py-3 font-medium transition-all ${
              selectedLocation === null
                ? 'bg-primary-purple-dark text-white shadow-lg'
                : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
          >
            Все вакансии ({mockVacancies.length})
          </button>
          <button
            onClick={() => setSelectedLocation('Сынково I')}
            className={`rounded-full px-6 py-3 font-medium transition-all ${
              selectedLocation === 'Сынково I'
                ? 'bg-primary-purple-dark text-white shadow-lg'
                : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
          >
            Сынково I ({mockVacancies.filter(v => v.location === 'Сынково I').length})
          </button>
          <button
            onClick={() => setSelectedLocation('Коледино')}
            className={`rounded-full px-6 py-3 font-medium transition-all ${
              selectedLocation === 'Коледино'
                ? 'bg-primary-purple-dark text-white shadow-lg'
                : 'bg-gray-100 text-text hover:bg-gray-200'
            }`}
          >
            Коледино ({mockVacancies.filter(v => v.location === 'Коледино').length})
          </button>
        </div>

        {/* Vacancies Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedVacancies.map(vacancy => (
            <VacancyCard key={vacancy.id} vacancy={vacancy} />
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              className="rounded-full bg-gradient-to-r from-primary-orange-light to-primary-orange px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              Показать ещё вакансии
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

