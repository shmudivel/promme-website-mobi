'use client';

import { useState } from 'react';
import VacancyCard from '@/components/VacancyCard';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Все' },
    { id: 'engineering', name: 'Инженерия' },
    { id: 'production', name: 'Производство' },
    { id: 'logistics', name: 'Логистика' },
    { id: 'management', name: 'Управление' },
  ];

  // Sample vacancies for demonstration
  const sampleVacancies = [
    {
      id: '1',
      title: 'Инженер-технолог',
      company: 'АО "Промышленная компания"',
      location: 'Индустриальный парк "Север"',
      salary_min: 80000,
      salary_max: 120000,
      description: 'Требуется опытный инженер-технолог для работы на современном производстве.',
      employment_type: 'full-time' as const,
      experience_years: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Оператор станков с ЧПУ',
      company: 'ООО "ТехМаш"',
      location: 'Индустриальный парк "Запад"',
      salary_min: 60000,
      salary_max: 80000,
      description: 'Ищем оператора станков с ЧПУ с опытом работы от 1 года.',
      employment_type: 'full-time' as const,
      experience_years: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const filteredVacancies = sampleVacancies.filter(vacancy => {
    const matchesSearch = vacancy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vacancy.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Поиск вакансий</h1>
          
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Должность, компания, навык..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange focus:border-transparent"
            />
            <svg 
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto mt-4 pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-orange text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {searchQuery && (
          <p className="text-sm text-gray-600 mb-4">
            Найдено вакансий: <span className="font-semibold">{filteredVacancies.length}</span>
          </p>
        )}

        {/* Vacancy Cards */}
        <div className="space-y-4">
          {filteredVacancies.length > 0 ? (
            filteredVacancies.map(vacancy => (
              <VacancyCard key={vacancy.id} vacancy={vacancy} />
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'Вакансии не найдены' : 'Начните поиск'}
              </h3>
              <p className="text-gray-600 text-sm">
                {searchQuery 
                  ? 'Попробуйте изменить запрос или фильтры'
                  : 'Введите должность или название компании'}
              </p>
            </div>
          )}
        </div>

        {/* Coming Soon Notice */}
        {filteredVacancies.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Расширенный поиск в разработке</h4>
                <p className="text-sm text-blue-700">
                  Скоро будут доступны фильтры по зарплате, опыту работы, типу занятости и другим параметрам.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

