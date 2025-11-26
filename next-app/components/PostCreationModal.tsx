'use client';

import { useState, useRef } from 'react';

interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (post: {
    content: string;
    images?: string[];
    type: 'post' | 'event' | 'vacancy';
    eventDetails?: {
      title: string;
      date: string;
      location: string;
    };
    vacancyDetails?: {
      title: string;
      location: string;
      salary?: string;
    };
  }) => void;
  postType?: 'post' | 'event' | 'vacancy';
}

export default function PostCreationModal({ isOpen, onClose, onSubmit, postType = 'post' }: PostCreationModalProps) {
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [type, setType] = useState<'post' | 'event' | 'vacancy'>(postType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Event fields
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');

  // Vacancy fields
  const [vacancyTitle, setVacancyTitle] = useState('');
  const [vacancyLocation, setVacancyLocation] = useState('');
  const [vacancySalary, setVacancySalary] = useState('');

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        if (newImages.length === files.length) {
          setImages([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!content.trim()) return;

    setIsSubmitting(true);

    const postData: any = {
      content,
      images: images.length > 0 ? images : undefined,
      type,
    };

    if (type === 'event' && eventTitle) {
      postData.eventDetails = {
        title: eventTitle,
        date: eventDate,
        location: eventLocation,
      };
    }

    if (type === 'vacancy' && vacancyTitle) {
      postData.vacancyDetails = {
        title: vacancyTitle,
        location: vacancyLocation,
        salary: vacancySalary || undefined,
      };
    }

    onSubmit(postData);
    
    // Reset form
    setContent('');
    setImages([]);
    setEventTitle('');
    setEventDate('');
    setEventLocation('');
    setVacancyTitle('');
    setVacancyLocation('');
    setVacancySalary('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {type === 'post' && 'Создать публикацию'}
            {type === 'event' && 'Создать событие'}
            {type === 'vacancy' && 'Опубликовать вакансию'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Author Info */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-orange to-primary-pink flex items-center justify-center text-white font-semibold text-lg">
              Я
            </div>
            <div>
              <p className="font-semibold text-gray-900">Вы</p>
              <p className="text-sm text-gray-500">Публикация для всех</p>
            </div>
          </div>

          {/* Post Type Selector */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setType('post')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === 'post'
                  ? 'bg-primary-orange text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📝 Пост
            </button>
            <button
              onClick={() => setType('event')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === 'event'
                  ? 'bg-primary-purple-dark text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              📅 Событие
            </button>
            <button
              onClick={() => setType('vacancy')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === 'vacancy'
                  ? 'bg-primary-pink text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              💼 Вакансия
            </button>
          </div>

          {/* Main Text Area */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              type === 'post'
                ? 'Поделитесь новостью или мыслями...'
                : type === 'event'
                ? 'Расскажите о мероприятии...'
                : 'Опишите вакансию...'
            }
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-purple-light focus:border-transparent text-base"
            rows={6}
          />

          {/* Event Fields */}
          {type === 'event' && (
            <div className="mt-4 space-y-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название события</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Например: День открытых дверей"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата и время</label>
                <input
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple-light"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Место проведения</label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Например: Индустриальный парк Сынково I"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-purple-light"
                />
              </div>
            </div>
          )}

          {/* Vacancy Fields */}
          {type === 'vacancy' && (
            <div className="mt-4 space-y-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Должность</label>
                <input
                  type="text"
                  value={vacancyTitle}
                  onChange={(e) => setVacancyTitle(e.target.value)}
                  placeholder="Например: Инженер-технолог"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Локация</label>
                <input
                  type="text"
                  value={vacancyLocation}
                  onChange={(e) => setVacancyLocation(e.target.value)}
                  placeholder="Например: Коледино"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Зарплата (опционально)</label>
                <input
                  type="text"
                  value={vacancySalary}
                  onChange={(e) => setVacancySalary(e.target.value)}
                  placeholder="Например: 80,000 - 120,000 ₽"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange"
                />
              </div>
            </div>
          )}

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Media Upload */}
          <div className="mt-4 flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 text-primary-orange hover:bg-orange-50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">Добавить фото</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {content.length} / 5000 символов
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-orange to-primary-pink text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Публикация...' : 'Опубликовать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

