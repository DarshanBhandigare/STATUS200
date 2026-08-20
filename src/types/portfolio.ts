export type TemplateId = 'minimal' | 'modern' | 'professional';

export type FontStyle = 'inter' | 'plus-jakarta' | 'mono' | 'serif';

export interface ThemeSettings {
  accentColor: string; // Hex color e.g. #10b981
  fontStyle: FontStyle;
  darkMode: boolean;
}

export interface PersonalInfo {
  fullName: string;
  username?: string;
  title: string;
  avatarUrl: string;
  location: string;
  email: string;
  phone: string;
  introduction: string;
}

export interface AboutInfo {
  bio: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  credentialUrl: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  other?: string;
}

export interface ResumeInfo {
  url?: string;
  filename?: string;
}

export interface PortfolioContent {
  personal: PersonalInfo;
  about: AboutInfo;
  skills: string[];
  education: EducationItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  socialLinks: SocialLinks;
  resume: ResumeInfo;
}

export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  slug: string;
  template: TemplateId;
  themeSettings: ThemeSettings;
  content: PortfolioContent;
  isPublished: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateDefinition {
  id: TemplateId;
  name: string;
  description: string;
  thumbnail: string;
  tag: string;
}
