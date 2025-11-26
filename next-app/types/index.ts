// Database Types
export interface User {
  id: string;
  email: string;
  name: string;
  profile_type: 'job-seeker' | 'company' | 'facilitator';
  profile_data?: ProfileData;
  profile_photo?: string;
  profile_video?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileData {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  experience?: number;
  education?: string;
  skills?: string;
  about?: string;
}

export interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  description: string;
  requirements?: string;
  benefits?: string;
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience_years?: number;
  created_at: string;
  updated_at: string;
  company_id?: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  logo?: string;
  website?: string;
  industry?: string;
  size?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface IndustrialPark {
  id: string;
  name: string;
  description?: string;
  location: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  area?: number;
  companies_count?: number;
  created_at: string;
  updated_at: string;
}

// Social Feed Types
export interface FeedPost {
  id: string;
  type: 'post' | 'event' | 'vacancy' | 'news';
  author: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
    company?: string;
  };
  content: string;
  images?: string[];
  video?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked?: boolean;
  created_at: string;
  event?: {
    title: string;
    date: string;
    location: string;
    attendees_count: number;
  };
  vacancy?: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary?: string;
  };
}

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

