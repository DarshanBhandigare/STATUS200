export interface DatabaseProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  headline: string | null;
  custom_domain: string | null;
  is_pro: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabasePortfolio {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  template: string;
  theme_settings: Record<string, any>;
  content: Record<string, any>;
  is_published: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}
