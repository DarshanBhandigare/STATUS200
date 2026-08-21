export const SECTION_KEYWORDS = {
  summary: ['summary', 'profile', 'objective', 'about', 'about me', 'professional summary', 'professional profile'],
  projects: ['projects', 'project', 'selected projects', 'featured projects', 'personal projects', 'hackathons', 'hackathon projects', 'key projects'],
  experience: ['experience', 'work experience', 'professional experience', 'employment', 'work history', 'internship'],
  education: ['education', 'academics', 'academic background', 'qualifications'],
  skills: ['skills', 'technical skills', 'tech stack', 'technologies', 'tools'],
  certifications: ['certifications', 'certificates', 'licenses'],
  achievements: ['achievements', 'awards', 'honors', 'accomplishments'],
} as const;

export const SKILL_KEYWORDS = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Go', 'Rust', 'SQL', 'Dart',
  'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI',
  'HTML', 'CSS', 'Tailwind CSS', 'Tailwind', 'Bootstrap', 'Redux', 'Zustand', 'GraphQL', 'REST APIs', 'WebSockets',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase', 'Prisma', 'Algolia',
  'Docker', 'AWS', 'Git', 'GitHub', 'CI/CD', 'Linux', 'Figma', 'Canvas API', 'Jest', 'Cypress', 'Postman',
  'Vercel', 'Netlify', 'Framer Motion', 'Material UI', 'OpenAI', 'Gemini', 'GitHub Actions',
] as const;

export const PROJECT_VERB_KEYWORDS = [
  'built',
  'developed',
  'designed',
  'engineered',
  'implemented',
  'created',
  'launched',
  'deployed',
  'shipped',
  'led',
] as const;

export const UI_SKILL_SUGGESTIONS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'Next.js',
  'Python',
  'PostgreSQL',
  'Docker',
  'AWS',
  'Tailwind CSS',
  'GraphQL',
  'Redis',
  'Git & GitHub',
  'REST APIs',
  'MongoDB',
  'Go',
  'Kubernetes',
  'Java',
] as const;
