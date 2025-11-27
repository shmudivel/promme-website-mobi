'use client';

import { useState, useEffect } from 'react';
import { FeedPost as FeedPostType } from '@/types';
import CommentSection, { Comment } from './CommentSection';

interface FeedPostProps {
  post: FeedPostType;
}

export default function FeedPost({ post }: FeedPostProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    if (post.embed_html && post.embed_html.includes('tiktok.com')) {
      // Remove any existing TikTok scripts to force a re-scan/reload
      const existingScripts = document.querySelectorAll('script[src="https://www.tiktok.com/embed.js"]');
      existingScripts.forEach(script => script.remove());

      const script = document.createElement('script');
      script.src = "https://www.tiktok.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [post.embed_html]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}м назад`;
    if (diffHours < 24) return `${diffHours}ч назад`;
    if (diffDays < 7) return `${diffDays}д назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      {/* Header */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-orange to-primary-pink flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
          {post.author.avatar ? (
            <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
          ) : (
            post.author.name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
          <p className="text-sm text-gray-500">
            {post.author.role && `${post.author.role} ${post.author.company ? `в ${post.author.company}` : ''}`}
            {!post.author.role && post.author.company}
          </p>
          <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
      </div>

      {/* Event Card */}
      {post.event && (
        <div className="mx-4 mb-3 p-4 bg-gradient-to-br from-primary-purple-light/20 to-primary-pink/20 rounded-xl border border-primary-purple-light/30">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-primary-purple-dark rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{post.event.title}</h4>
              <p className="text-sm text-gray-600 mb-1">📅 {new Date(post.event.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-sm text-gray-600 mb-1">📍 {post.event.location}</p>
              <p className="text-sm text-primary-purple-dark font-medium">{post.event.attendees_count} участников</p>
            </div>
            <button className="px-4 py-2 bg-primary-purple-dark text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold">
              Участвовать
            </button>
          </div>
        </div>
      )}

      {/* Vacancy Card */}
      {post.vacancy && (
        <div className="mx-4 mb-3 p-4 bg-gradient-to-br from-primary-orange-light/20 to-primary-pink/20 rounded-xl border border-primary-orange/30">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-primary-orange rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-1">{post.vacancy.title}</h4>
              <p className="text-sm text-gray-600 mb-1">🏢 {post.vacancy.company}</p>
              <p className="text-sm text-gray-600 mb-1">📍 {post.vacancy.location}</p>
              {post.vacancy.salary && (
                <p className="text-sm text-primary-orange font-medium">{post.vacancy.salary}</p>
              )}
            </div>
            <button className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold">
              Откликнуться
            </button>
          </div>
        </div>
      )}

      {/* Media */}
      {/* Custom Embed (TikTok etc) */}
      {post.embed_html && (
        <div className="w-full overflow-hidden bg-gray-50">
          <div 
            className="tiktok-embed-container flex justify-center" 
            dangerouslySetInnerHTML={{ __html: post.embed_html }} 
          />
        </div>
      )}

      {/* Native Video */}
      {post.video && !post.embed_html && (
        <div className="w-full aspect-[9/16] max-h-[600px] bg-black flex items-center justify-center overflow-hidden">
          <video 
            src={post.video} 
            className="w-full h-full object-contain" 
            controls 
            playsInline 
            loop
            muted
            autoPlay
          />
        </div>
      )}

      {post.images && post.images.length > 0 && (
        <div className={`grid gap-1 ${post.images.length === 1 ? 'grid-cols-1' : post.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2'}`}>
          {post.images.slice(0, 4).map((image, index) => (
            <div key={index} className="relative aspect-square overflow-hidden bg-gray-100">
              <img src={image} alt={`Post image ${index + 1}`} className="w-full h-full object-cover" />
              {index === 3 && post.images!.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-semibold">
                  +{post.images!.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
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
            <span className="text-sm font-medium">{post.comments_count}</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-600 hover:text-primary-orange transition-colors group">
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span className="text-sm font-medium">{post.shares_count}</span>
          </button>
        </div>
        
        <button className="text-gray-600 hover:text-primary-purple-dark transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          comments={comments}
          commentsCount={post.comments_count}
          onAddComment={(content) => {
            console.log('New comment:', content);
          }}
        />
      )}
    </article>
  );
}

