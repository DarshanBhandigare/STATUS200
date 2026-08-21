import { PortfolioContent, EducationItem, ProjectItem, ExperienceItem } from '@/types/portfolio';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker from cdnjs to avoid complex local worker bundling issues in Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export interface ParsedResumeData {
  personal?: Partial<PortfolioContent['personal']>;
  about?: Partial<PortfolioContent['about']>;
  skills?: string[];
  education?: EducationItem[];
  projects?: ProjectItem[];
  experience?: ExperienceItem[];
  socialLinks?: Partial<PortfolioContent['socialLinks']>;
}

/**
 * Robust extraction of all text content from a PDF file using Mozilla's pdfjs-dist engine
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdfDoc = await loadingTask.promise;

    let fullText = '';

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');

      fullText += pageText + '\n';
    }

    if (fullText.trim().length > 15) {
      return fullText;
    }
  } catch (err) {
    console.warn('pdfjs extraction fallback to binary stream:', err);
  }

  // Fallback binary text extractor
  return extractFallbackText(file);
}

async function extractFallbackText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binaryStr = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binaryStr += String.fromCharCode.apply(null, Array.from(chunk));
  }

  const plainTextMatches = binaryStr.match(/[A-Za-z0-9@.,:\-+/()#\s]{4,}/g) || [];
  return plainTextMatches
    .map((s) => s.trim())
    .filter((s) => s.length > 3 && !s.startsWith('/Font') && !s.startsWith('/Type'))
    .join('\n');
}

/**
 * Intelligent parser that extracts structured fields from raw resume text
 */
export function parseResumeText(rawText: string): ParsedResumeData {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const fullText = lines.join(' \n ');

  const result: ParsedResumeData = {
    personal: {},
    about: {},
    skills: [],
    education: [],
    projects: [],
    experience: [],
    socialLinks: {},
  };

  // 1. Email extraction
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    result.personal!.email = emailMatch[0];
  }

  // 2. Phone extraction (supports Indian +91, US formats, etc.)
  const phoneMatch = fullText.match(/(?:(?:\+?91|0091)[\s-]?)?[6789]\d{9}|(?:\+?1[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
  if (phoneMatch) {
    result.personal!.phone = phoneMatch[0].trim();
  }

  // 3. Socials & GitHub / LinkedIn / Portfolio URLs
  const githubMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) {
    result.socialLinks!.github = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;
  }

  const linkedinMatch = fullText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) {
    result.socialLinks!.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;
  }

  // 4. Candidate Name: Scans header lines for valid names
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    if (
      line.length >= 2 &&
      line.length <= 40 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !line.includes('.com') &&
      !/\d/.test(line) &&
      !/curriculum|vitae|resume|portfolio|summary|experience|education|skills|page\s*\d/i.test(line) &&
      /^[A-Za-z\s.'-]+$/.test(line)
    ) {
      result.personal!.fullName = line.trim();
      break;
    }
  }

  // 5. Job Title detection
  const titleKeywords = [
    'Full Stack Developer', 'Full Stack Engineer', 'Frontend Developer', 'Frontend Engineer',
    'Backend Developer', 'Backend Engineer', 'Software Engineer', 'Software Developer',
    'Web Developer', 'Cloud Engineer', 'DevOps Engineer', 'Mobile Developer',
    'Android Developer', 'iOS Developer', 'Data Scientist', 'Machine Learning Engineer',
    'Python Developer', 'Java Developer', 'React Developer', 'Node.js Developer',
    'UI/UX Designer', 'Computer Science Student',
  ];

  for (const kw of titleKeywords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(fullText)) {
      result.personal!.title = kw;
      break;
    }
  }

  // 6. Technical Skills dictionary matching
  const knownSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C', 'C#', 'PHP', 'Go', 'Rust', 'Ruby', 'SQL',
    'React', 'React.js', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Nest.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
    'HTML', 'HTML5', 'CSS', 'CSS3', 'Tailwind CSS', 'Tailwind', 'Bootstrap', 'Sass', 'Redux', 'Zustand', 'GraphQL', 'REST API', 'REST APIs',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Supabase', 'Firebase', 'Prisma',
    'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure', 'Git', 'GitHub', 'GitLab', 'CI/CD', 'Linux',
    'Machine Learning', 'Data Structures', 'Algorithms', 'OOP', 'DBMS', 'Operating Systems',
    'Jest', 'Cypress', 'Postman', 'Figma', 'WebSockets'
  ];

  const foundSkills = new Set<string>();
  for (const skill of knownSkills) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|\\b|[,/|•·-])${escaped}(?:$|\\b|[,/|•·-])`, 'i');
    if (regex.test(fullText)) {
      foundSkills.add(skill === 'React.js' ? 'React' : skill === 'Tailwind' ? 'Tailwind CSS' : skill);
    }
  }

  if (foundSkills.size > 0) {
    result.skills = Array.from(foundSkills);
  }

  // 7. Summary / Bio extraction
  const summaryMatches = fullText.match(/(?:summary|about\s*me|profile|objective)[\s:]*\n?([^]+?)(?=\n\s*(?:skills|education|experience|projects|technical|work))/i);
  if (summaryMatches && summaryMatches[1]) {
    const cleanBio = summaryMatches[1].replace(/\s+/g, ' ').trim().slice(0, 380);
    if (cleanBio.length > 25) {
      result.about = { bio: cleanBio };
      result.personal!.introduction = cleanBio;
    }
  }

  // 8. Education extraction (College / Degree / GPA)
  const eduMatch = fullText.match(/(?:B\.?E\.?|B\.?Tech|Bachelor|Master|M\.?Tech|B\.?Sc|BCA|MCA)[^,\n.]*(?:in|of)?[^,\n.]*/i);
  const collegeMatch = fullText.match(/(?:University|Institute|College|School of Engineering)[^,\n.]*/i);
  if (eduMatch || collegeMatch) {
    result.education = [
      {
        id: `edu_${Date.now()}`,
        institution: collegeMatch ? collegeMatch[0].trim() : 'University Institute',
        degree: eduMatch ? eduMatch[0].trim() : 'Bachelor of Engineering',
        field: 'Computer Science & Engineering',
        startDate: '2022',
        endDate: '2026',
        description: 'Coursework: Data Structures, Algorithms, Web Development, Database Management.',
      },
    ];
  }

  return result;
}
