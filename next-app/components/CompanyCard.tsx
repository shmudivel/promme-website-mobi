'use client';

import { useState } from 'react';
import CommentSection, { Comment } from './CommentSection';

export interface CompanyCardData {
  id: string;
  name: string;
  logo?: string;
  description: string;
  industry?: string;
  location?: string;
  employees_count?: number;
  vacancies_count?: number;
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  created_at: string;
}

interface CompanyCardProps {
  company: CompanyCardData;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  const [isLiked, setIsLiked] = useState(company.is_liked || false);
  const [likesCount, setLikesCount] = useState(company.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const diffDays = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (diffDays < 7) return `${diffDays}д назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      {/* Header Banner */}
      <div className="h-24 bg-gradient-to-br from-primary-orange-light via-primary-orange to-primary-pink"></div>
      
      {/* Company Info */}
      <div className="px-6 pb-4">
        {/* Logo */}
        <div className="relative -mt-12 mb-4">
          <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-orange to-primary-pink flex items-center justify-center text-white text-2xl font-bold">
                {company.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Company Details */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{company.name}</h3>
          {company.industry && (
            <p className="text-sm text-primary-orange font-medium mb-2">{company.industry}</p>
          )}
          <p className="text-gray-700 mb-3">{company.description}</p>
          
          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {company.location && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>{company.location}</span>
              </div>
            )}
            {company.employees_count && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                <span>{company.employees_count.toLocaleString()} сотрудников</span>
              </div>
            )}
            {company.vacancies_count && company.vacancies_count > 0 && (
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                </svg>
                <span className="text-primary-orange font-medium">{company.vacancies_count} открытых вакансий</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pb-4 border-b border-gray-100">
          <button className="flex-1 px-4 py-2.5 bg-primary-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold text-sm">
            Посмотреть вакансии
          </button>
          <button className="flex-1 px-4 py-2.5 border-2 border-primary-orange text-primary-orange rounded-lg hover:bg-orange-50 transition-colors font-semibold text-sm">
            Подписаться
          </button>
        </div>

        {/* Engagement */}
        <div className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLike}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-pink transition-colors group"
            >
              <svg className={`w-6 h-6 transition-all ${isLiked ? 'fill-primary-pink text-primary-pink scale-110' : 'fill-none group-hover:scale-110'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className={`text-sm font-medium ${isLiked ? 'text-primary-pink' : ''}`}>{likesCount}</span>
            </button>
            
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 text-gray-600 hover:text-primary-purple-dark transition-colors group"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium">{company.comments_count}</span>
            </button>
            
            <button className="flex items-center gap-2 text-gray-600 hover:text-primary-orange transition-colors group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="text-sm font-medium">Поделиться</span>
            </button>
          </div>
          
          <span className="text-xs text-gray-400">{formatDate(company.created_at)}</span>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={company.id}
          comments={comments}
          commentsCount={company.comments_count}
          onAddComment={(content) => {
            console.log('New comment:', content);
          }}
        />
      )}
    </article>
  );
}

