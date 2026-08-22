import { Portfolio, PortfolioContent } from '../../types/portfolio';

export const DEMO_PORTFOLIO_CONTENT: PortfolioContent = {
  personal: {
    fullName: 'Alex Morgan',
    username: 'alex',
    title: 'Full Stack & Cloud Developer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    location: 'San Francisco, CA (Open to Remote)',
    email: 'alex.morgan.dev@example.com',
    phone: '+1 (555) 234-5678',
    introduction:
      'Computer Science senior at XYZ University passionate about high-concurrency backend systems, modern React frontends, and developer tooling. Actively seeking Summer 2026 Software Engineering internships.',
  },
  about: {
    bio: 'I am a 4th-year Computer Science student with 2+ years of hands-on experience building full-stack web applications and cloud-native services. I love solving algorithmic challenges, contributing to open-source developer tooling, and designing frictionless user experiences. Outside of coding, I lead our university hackathon tech team and mentor first-year engineering students.',
  },
  skills: [
    'React',
    'TypeScript',
    'Node.js',
    'Next.js',
    'Python',
    'PostgreSQL',
    'Supabase',
    'Docker',
    'Tailwind CSS',
    'Redis',
    'GraphQL',
    'Git & CI/CD',
    'REST APIs',
    'AWS (S3/EC2)',
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'XYZ University Institute of Technology',
      degree: 'Bachelor of Science',
      field: 'Computer Science & Engineering',
      startDate: '2022',
      endDate: '2026 (Expected)',
      description:
        'GPA: 3.85 / 4.0. Relevant coursework: Data Structures & Algorithms, Distributed Systems, Database Management, Operating Systems, Web Engineering.',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'PulseFlow - Real-Time Systems Monitor',
      description:
        'A high-performance observability dashboard built for microservices. Features real-time WebSocket metrics streaming, CPU/memory threshold alerting, and customizable incident log graphs.',
      technologies: ['TypeScript', 'React', 'Node.js', 'WebSockets', 'Tailwind CSS', 'Redis'],
      githubUrl: 'https://github.com/example/pulseflow',
      liveUrl: 'https://pulseflow-demo.example.com',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 'proj-2',
      name: 'AlgoCanvas - Algorithm Visualizer',
      description:
        'Interactive learning tool that visualizes pathfinding (A*, Dijkstra) and sorting algorithms step-by-step with customizable execution speed and grid obstacle painting.',
      technologies: ['React', 'TypeScript', 'Canvas API', 'Tailwind CSS', 'Zustand'],
      githubUrl: 'https://github.com/example/algocanvas',
      liveUrl: 'https://algocanvas-demo.example.com',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      featured: true,
    },
    {
      id: 'proj-3',
      name: 'QuickDocs - Instant Markdown Knowledgebase',
      description:
        'Blazing-fast documentation search and publishing engine with full-text fuzzy search, instant syntax highlighting, and automated table-of-contents generation.',
      technologies: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Algolia'],
      githubUrl: 'https://github.com/example/quickdocs',
      liveUrl: 'https://quickdocs-demo.example.com',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      featured: false,
    },
  ],
  experience: [
    {
      id: 'exp-1',
      company: 'Apex Cloud Solutions',
      role: 'Software Engineering Intern',
      startDate: 'Jun 2025',
      endDate: 'Aug 2025',
      description:
        'Engineered scalable REST endpoints in Node.js handling 50k+ daily requests. Optimized SQL query performance by 35% through indexing and connection pooling. Integrated automated end-to-end testing with GitHub Actions.',
    },
    {
      id: 'exp-2',
      company: 'XYZ University Tech Club',
      role: 'Frontend Lead & Core Maintainer',
      startDate: 'Sep 2024',
      endDate: 'Present',
      description:
        'Lead a team of 6 student developers in building the official collegiate hackathon registration and team-matching portal used by 1,200+ attendees.',
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: 'Jan 2025',
      credentialUrl: 'https://aws.amazon.com/verification',
    },
    {
      id: 'cert-2',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Meta / Coursera',
      date: 'Nov 2024',
      credentialUrl: 'https://coursera.org/verify/demo',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: '1st Place Winner - HackTheNorth Collegiate Track',
      description:
        'Built an AI-assisted accessible code review terminal assistant within 36 hours among 120 participating student teams.',
      date: 'Oct 2025',
    },
    {
      id: 'ach-2',
      title: "Dean's Honor List (4 Consecutive Semesters)",
      description: 'Recognized for top 5% academic performance in School of Computing.',
      date: '2023 - 2025',
    },
  ],
  socialLinks: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://x.com',
    website: 'https://example.dev',
    other: '',
  },
  resume: {
    url: 'https://example.com/alex-morgan-resume.pdf',
    filename: 'Alex_Morgan_Resume_2026.pdf',
  },
};

export const DEMO_PORTFOLIOS: Portfolio[] = [
  {
    id: 'demo-portfolio-1',
    userId: 'demo-user-id',
    title: 'Alex Morgan - Software Engineer 2026',
    slug: 'alex-morgan',
    template: 'minimal',
    themeSettings: {
      accentColor: '#10b981', // emerald
      fontStyle: 'inter',
      darkMode: true,
    },
    content: DEMO_PORTFOLIO_CONTENT,
    isPublished: true,
    viewsCount: 142,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-portfolio-2',
    userId: 'demo-user-id',
    title: 'Alex Morgan - Creative Frontend & UI',
    slug: 'alex-frontend',
    template: 'modern',
    themeSettings: {
      accentColor: '#6366f1', // indigo
      fontStyle: 'plus-jakarta',
      darkMode: true,
    },
    content: {
      ...DEMO_PORTFOLIO_CONTENT,
      personal: {
        ...DEMO_PORTFOLIO_CONTENT.personal,
        title: 'Frontend Engineer & UI Designer',
      },
    },
    isPublished: false,
    viewsCount: 18,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];
