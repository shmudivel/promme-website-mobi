'use client';

import { useState } from 'react';
import CommentSection, { Comment } from './CommentSection';

export interface ResumeCardData {
  id: string;
  user: {
    name: string;
    photo?: string;
    position: string;
    location?: string;
  };
  summary: string;
  experience_years?: number;
  skills?: string[];
  education?: string;
  employment_type?: string;
  salary_expectation?: string;
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  created_at: string;
}

interface ResumeCardProps {
  resume: ResumeCardData;
}

export default function ResumeCard({ resume }: ResumeCardProps) {
  const [isLiked, setIsLiked] = useState(resume.is_liked || false);
  const [likesCount, setLikesCount] = useState(resume.likes_count);
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
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start gap-4">
          {/* User Photo */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-purple-light to-primary-pink flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 overflow-hidden shadow-md">
            {resume.user.photo ? (
              <img src={resume.user.photo} alt={resume.user.name} className="w-full h-full object-cover" />
            ) : (
              resume.user.name.charAt(0).toUpperCase()
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{resume.user.name}</h3>
            <p className="text-base text-primary-purple-dark font-semibold mb-2">{resume.user.position}</p>
            
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              {resume.user.location && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span>{resume.user.location}</span>
                </div>
              )}
              {resume.experience_years !== undefined && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/>
                  </svg>
                  <span>{resume.experience_years} лет опыта</span>
                </div>
              )}
              {resume.employment_type && (
                <div className="px-3 py-1 bg-purple-50 text-primary-purple-dark rounded-full text-xs font-medium">
                  {resume.employment_type}
                </div>
              )}
            </div>
          </div>

          {/* Available Badge */}
          <div className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Активно ищу
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Summary */}
        <p className="text-gray-700 mb-4">{resume.summary}</p>

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Ключевые навыки</h4>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-gradient-to-r from-primary-purple-light/20 to-primary-pink/20 text-primary-purple-dark rounded-lg text-sm font-medium border border-purple-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Образование</h4>
            <p className="text-sm text-gray-600">{resume.education}</p>
          </div>
        )}

        {/* Salary Expectation */}
        {resume.salary_expectation && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Желаемая зарплата</h4>
            <p className="text-base text-primary-purple-dark font-semibold">{resume.salary_expectation}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button className="flex-1 px-4 py-2.5 bg-primary-purple-dark text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm">
            Пригласить на собеседование
          </button>
          <button className="flex-1 px-4 py-2.5 border-2 border-primary-purple-dark text-primary-purple-dark rounded-lg hover:bg-purple-50 transition-colors font-semibold text-sm">
            Сохранить резюме
          </button>
        </div>
      </div>

      {/* Engagement */}
      <div className="px-6 pb-4 flex items-center justify-between border-t border-gray-100 pt-4">
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
            <span className="text-sm font-medium">{resume.comments_count}</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-600 hover:text-primary-orange transition-colors group">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-sm font-medium">Поделиться</span>
          </button>
        </div>
        
        <span className="text-xs text-gray-400">{formatDate(resume.created_at)}</span>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={resume.id}
          comments={comments}
          commentsCount={resume.comments_count}
          onAddComment={(content) => {
            console.log('New comment:', content);
          }}
        />
      )}
    </article>
  );
}

