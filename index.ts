export type CategoryType = "activity" | "project";

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  created_at: string;
}

export interface CategoryRef {
  id: string;
  name: string;
}

export interface Profile {
  id: number;
  name: string;
  tagline: string | null;
  description: string | null;
  history: string | null;
  vision: string | null;
  mission: string | null;
  goals: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  instagram: string | null;
  youtube: string | null;
  tiktok: string | null;
  hero_image_url: string | null;
}

export interface Activity {
  id: string;
  title: string;
  date: string;
  location: string | null;
  category_id: string | null;
  description: string | null;
  cover_url: string | null;
  video_url: string | null;
  created_at: string;
  category?: CategoryRef | null;
}

export interface Project {
  id: string;
  title: string;
  description: string | null;
  creator: string;
  published_at: string;
  category_id: string | null;
  image_url: string | null;
  video_url: string | null;
  link_url: string | null;
  is_featured: boolean;
  created_at: string;
  category?: CategoryRef | null;
}

export type MediaType = "image" | "video";

export interface GalleryItem {
  id: string;
  title: string;
  media_type: MediaType;
  url: string;
  activity_id: string | null;
  created_at: string;
  activity?: { id: string; title: string } | null;
}

export interface Achievement {
  id: string;
  title: string;
  competition: string;
  level: string;
  date: string;
  description: string | null;
  image_url: string | null;
  certificate_url: string | null;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  division: string | null;
  bio: string | null;
  photo_url: string | null;
  instagram: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface SiteStats {
  activities: number;
  projects: number;
  gallery: number;
  achievements: number;
  members: number;
}
