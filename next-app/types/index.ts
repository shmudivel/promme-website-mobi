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

