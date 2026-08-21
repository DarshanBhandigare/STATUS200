import { PortfolioContent, ThemeSettings } from '@/types/portfolio';

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  accentColor: '#10b981',
  fontStyle: 'inter',
  darkMode: true,
};

export const EMPTY_PORTFOLIO_CONTENT: PortfolioContent = {
  personal: {
    fullName: '',
    title: '',
    avatarUrl: '',
    location: '',
    email: '',
    phone: '',
    introduction: '',
  },
  about: {
    bio: '',
  },
  skills: [],
  education: [],
  projects: [],
  experience: [],
  certifications: [],
  achievements: [],
  socialLinks: {},
  resume: {},
};
