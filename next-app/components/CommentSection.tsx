'use client';

import { useState } from 'react';

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  content: string;
  created_at: string;
  likes_count: number;
  is_liked?: boolean;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  commentsCount: number;
  onAddComment?: (content: string) => void;
}

export default function CommentSection({ postId, comments, commentsCount, onAddComment }: CommentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins}м`;
    if (diffHours < 24) return `${diffHours}ч`;
    if (diffDays < 7) return `${diffDays}д`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    
    // Create new comment
    const comment: Comment = {
      id: `comment-${Date.now()}`,
      author: {
        name: 'Вы',
        avatar: undefined,
      },
      content: newComment,
      created_at: new Date().toISOString(),
      likes_count: 0,
      is_liked: false,
    };

    // Add to local state
    setLocalComments([comment, ...localComments]);
    setNewComment('');
    setIsSubmitting(false);
    
    // Call parent callback if provided
    if (onAddComment) {
      onAddComment(newComment);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-gray-100">
      {/* Comment Input */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-orange to-primary-pink flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            Я
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Напишите комментарий..."
              className="w-full px-4 py-2 border border-gray-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-purple-light focus:border-transparent text-sm"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
            {newComment.trim() && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="mt-2 px-4 py-1.5 bg-primary-purple-dark text-white rounded-full text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Отправка...' : 'Отправить'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comments List */}
      {localComments.length > 0 && (
        <div className="px-4 pb-4">
          {!isExpanded && localComments.length > 2 && (
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm text-primary-purple-dark font-medium mb-3 hover:underline"
            >
              Показать все {commentsCount + localComments.length - comments.length} комментариев
            </button>
          )}
          
          <div className="space-y-3">
            {(isExpanded ? localComments : localComments.slice(0, 2)).map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-purple-light to-primary-pink flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 overflow-hidden">
                  {comment.author.avatar ? (
                    <img src={comment.author.avatar} alt={comment.author.name} className="w-full h-full object-cover" />
                  ) : (
                    comment.author.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 rounded-2xl px-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm text-gray-900">{comment.author.name}</p>
                      {comment.author.role && (
                        <p className="text-xs text-gray-500">• {comment.author.role}</p>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">{comment.content}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1 px-4">
                    <button className="text-xs text-gray-500 hover:text-primary-pink transition-colors font-medium">
                      Нравится{comment.likes_count > 0 ? ` (${comment.likes_count})` : ''}
                    </button>
                    <button className="text-xs text-gray-500 hover:text-primary-purple-dark transition-colors font-medium">
                      Ответить
                    </button>
                    <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isExpanded && localComments.length > 2 && (
            <button
              onClick={() => setIsExpanded(false)}
              className="text-sm text-gray-500 font-medium mt-3 hover:underline"
            >
              Скрыть комментарии
            </button>
          )}
        </div>
      )}
    </div>
  );
}

