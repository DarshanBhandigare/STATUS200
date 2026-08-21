import { PortfolioContent, EducationItem, ProjectItem, ExperienceItem } from '@/types/portfolio';

export interface ParsedResumeData {
  personal?: Partial<PortfolioContent['personal']>;
  about?: Partial<PortfolioContent['about']>;
  skills?: string[];
  education?: EducationItem[];
  projects?: ProjectItem[];
  experience?: ExperienceItem[];
}

/**
 * Clean and extract plain text from an ArrayBuffer / Uint8Array of a PDF file
 * uses standard PDF stream and text object decoding without heavy server dependencies.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Read as latin1/binary string to parse PDF text operators like (text) Tj, [(text)] TJ
  let binaryStr = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binaryStr += String.fromCharCode.apply(null, Array.from(chunk));
  }

  const extractedChunks: string[] = [];

  // Match Tj operators: (some text) Tj
  const tjRegex = /\(([^)]+)\)\s*Tj/g;
  let match: RegExpExecArray | null;
  while ((match = tjRegex.exec(binaryStr)) !== null) {
    const clean = cleanPdfString(match[1]);
    if (clean) extractedChunks.push(clean);
  }

  // Match TJ array operators: [(some) 10 (text)] TJ
  const tjArrayRegex = /\[(.*?)\]\s*TJ/g;
  while ((match = tjArrayRegex.exec(binaryStr)) !== null) {
    const inner = match[1];
    const itemRegex = /\(([^)]+)\)/g;
    let subMatch: RegExpExecArray | null;
    let line = '';
    while ((subMatch = itemRegex.exec(inner)) !== null) {
      line += cleanPdfString(subMatch[1]) + ' ';
    }
    if (line.trim()) extractedChunks.push(line.trim());
  }

  // Fallback: search for standard text blocks if minimal text found
  if (extractedChunks.length < 5) {
    // Attempt standard stream plain text extraction
    const plainTextMatches = binaryStr.match(/[A-Za-z0-9@.,:\-+/()#\s]{4,}/g) || [];
    const validLines = plainTextMatches
      .map((s) => s.trim())
      .filter((s) => s.length > 5 && !s.startsWith('/Font') && !s.startsWith('/Type') && !s.includes('obj') && !s.includes('endobj'));
    
    return validLines.join('\n');
  }

  return extractedChunks.join('\n');
}

function cleanPdfString(str: string): string {
  return str
    .replace(/\\([()\\])/g, '$1')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\\t/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Intelligent parser that maps extracted raw resume text into structured Portfolio content
 */
export function parseResumeText(rawText: string): ParsedResumeData {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const result: ParsedResumeData = {
    personal: {},
    about: {},
    skills: [],
    education: [],
    projects: [],
    experience: [],
  };

  const fullText = lines.join(' \n ');

  // 1. Email extraction
  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) {
    result.personal!.email = emailMatch[0];
  }

  // 2. Phone extraction
  const phoneMatch = fullText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (phoneMatch) {
    result.personal!.phone = phoneMatch[0];
  }

  // 3. Name candidate: Usually in the top 3 lines
  for (let i = 0; i < Math.min(lines.length, 4); i++) {
    const line = lines[i];
    // Reject lines that look like emails, urls, or resume header titles
    if (
      line.length > 2 &&
      line.length < 40 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !/curriculum|vitae|resume|portfolio|page\s*\d/i.test(line) &&
      /^[A-Za-z\s.'-]+$/.test(line)
    ) {
      result.personal!.fullName = line;
      break;
    }
  }

  // 4. Headline / Title detection
  const titleKeywords = [
    'Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
    'Full Stack Engineer', 'Cloud Developer', 'DevOps Engineer', 'Web Developer',
    'Mobile App Developer', 'Android Developer', 'iOS Developer', 'Data Scientist',
    'Machine Learning Engineer', 'UI/UX Designer', 'Computer Science Student',
  ];

  for (const kw of titleKeywords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    if (regex.test(fullText)) {
      result.personal!.title = kw;
      break;
    }
  }

  // 5. Skills extraction from common technology dictionary
  const knownSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Go', 'Rust', 'PHP', 'Ruby',
    'React', 'React Native', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Nest.js',
    'HTML5', 'CSS3', 'Tailwind CSS', 'Bootstrap', 'Sass', 'Redux', 'Zustand', 'GraphQL', 'REST APIs',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Supabase', 'Firebase', 'Prisma',
    'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure', 'Git', 'GitHub', 'CI/CD', 'Linux',
    'FastAPI', 'Django', 'Flask', 'Spring Boot', 'Kafka', 'WebSockets', 'Jest', 'Cypress'
  ];

  const foundSkills = new Set<string>();
  for (const skill of knownSkills) {
    // Escaped skill for regex
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|\\b|[,/|•])${escaped}(?:$|\\b|[,/|•])`, 'i');
    if (regex.test(fullText)) {
      foundSkills.add(skill);
    }
  }

  if (foundSkills.size > 0) {
    result.skills = Array.from(foundSkills);
  }

  // 6. Bio / Summary
  const summaryMatches = fullText.match(/(?:summary|about\s*me|profile|objective)[\s:]*\n?([^]+?)(?=\n\s*(?:skills|education|experience|projects|work))/i);
  if (summaryMatches && summaryMatches[1]) {
    const cleanBio = summaryMatches[1].trim().slice(0, 350);
    if (cleanBio.length > 20) {
      result.about = { bio: cleanBio };
      result.personal!.introduction = cleanBio;
    }
  }

  return result;
}
