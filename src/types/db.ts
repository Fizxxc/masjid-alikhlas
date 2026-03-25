export type ThemeMode = 'light' | 'dark' | 'system';
export type Role = 'user' | 'admin';
export type ReportStatus = 'baru' | 'diproses' | 'selesai';

export type Profile = {
  id: string;
  email?: string | null;
  full_name: string | null;
  address: string | null;
  avatar_url: string | null;
  role: Role;
  notifications_enabled: boolean;
  theme: ThemeMode;
  created_at: string;
  updated_at: string;
};

export type Slide = {
  id: string;
  title: string | null;
  image_url: string;
  cta_label: string | null;
  cta_link: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  is_pinned: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ReportItem = {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
  status: ReportStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

export type MosqueSettings = {
  id: string;
  mosque_name: string;
  address: string | null;
  latitude: number;
  longitude: number;
  city_name: string;
  province_name: string;
  about: string | null;
  updated_at: string;
};
