import {
  PortfolioContent,
  EducationItem,
  ProjectItem,
  ExperienceItem,
  CertificationItem,
  AchievementItem,
} from '@/types/portfolio';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfWorkerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { SECTION_KEYWORDS as RESUME_SECTION_KEYWORDS, SKILL_KEYWORDS as RESUME_SKILL_KEYWORDS, PROJECT_VERB_KEYWORDS as RESUME_PROJECT_VERBS } from '@/lib/resumeKeywords';

export interface ParsedResumeData {
  personal?: Partial<PortfolioContent['personal']>;
  about?: Partial<PortfolioContent['about']>;
  skills?: string[];
  education?: EducationItem[];
  projects?: ProjectItem[];
  experience?: ExperienceItem[];
  certifications?: CertificationItem[];
  achievements?: AchievementItem[];
  socialLinks?: Partial<PortfolioContent['socialLinks']>;
}

// -----------------------------------------------------------------------------
// PDF text extraction
// -----------------------------------------------------------------------------

const GARBAGE_PATTERNS = [
  /^endstream/i,
  /^endobj/i,
  /^stream$/i,
  /^xref/i,
  /^startxref/,
  /\/Filter\s*\/FlateDecode/i,
  /\/Length\s+\d+/i,
  /\/StructParent/i,
  /FlateDecode/,
  /\/Subtype\s*\/Link/i,
  /\/Annots/,
  /\/BBox/,
  /\/StructTreeRoot/,
  /\/MarkInfo/,
  /iLovePDF/,
  /\/ModDate/,
  /^[A-Za-z0-9+/=]{30,}$/,
  /[^\x20-\x7E\n]{3,}/,
  /\b(obj|endobj|stream|endstream|xref|trailer|startxref)\b/,
  /\/O\s*\/Layout/,
  /\/O\s*\/List/,
  /\/Placement\s*\/Block/,
  /\/ProcSet/,
  /\/Resources/,
  /\/ExtGState/,
  /\/Font/,
  /StructParents/,
  /\/Contents/,
  /\/Group\s*\/Tabs/,
  /^\s*[0-9a-fA-F]{4,}\s*[0-9a-fA-F]{4,}/,
];

let pdfWorkerConfigured = false;

function isGarbageLine(line: string): boolean {
  return GARBAGE_PATTERNS.some((pattern) => pattern.test(line));
}

function cleanPdfString(str: string): string {
  return str
    .replace(/\\([()\\])/g, '$1')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '')
    .replace(/\\t/g, ' ')
    .replace(/\\(\d{1,3})/g, (_, oct) => {
      const code = parseInt(oct, 8);
      return code >= 32 && code < 127 ? String.fromCharCode(code) : ' ';
    })
    .trim();
}

function cleanExtractedText(raw: string): string {
  const lines = raw.split('\n').map((line) => line.trim()).filter(Boolean);
  return lines
    .filter((line) => {
      if (isGarbageLine(line)) return false;
      const alphaRatio = (line.match(/[A-Za-z]/g) || []).length / Math.max(line.length, 1);
      if (line.length > 20 && alphaRatio < 0.3) return false;
      return true;
    })
    .join('\n');
}

const WEBSITE_SECTION_KEYWORDS = RESUME_SECTION_KEYWORDS;

const MATCH_SKILL_KEYWORDS = RESUME_SKILL_KEYWORDS;

const PROJECT_VERB_KEYWORDS = RESUME_PROJECT_VERBS;

function normalizeLine(line: string): string {
  return line.replace(/\s+/g, ' ').trim();
}

function normalizeHeading(line: string): string {
  return normalizeLine(line).toLowerCase().replace(/[:\-–]+$/, '');
}

function isLikelySectionHeading(line: string): boolean {
  const normalized = normalizeHeading(line);
  if (!normalized || normalized.length > 60) return false;

  for (const values of Object.values(WEBSITE_SECTION_KEYWORDS)) {
    if (values.some((keyword) => normalized === keyword || normalized.startsWith(`${keyword} `) || normalized.includes(keyword))) {
      return true;
    }
  }

  return /^[A-Z][A-Z\s/&-]{2,}$/.test(line.trim()) || /^[A-Za-z][A-Za-z\s/&-]{2,}$/.test(line.trim()) && /[:\-]$/.test(line.trim());
}

type ResumeSections = {
  preamble: string[];
  summary: string[];
  projects: string[];
  experience: string[];
  education: string[];
  skills: string[];
  certifications: string[];
  achievements: string[];
  other: string[];
};

function detectSectionKey(line: string): keyof ResumeSections | null {
  const normalized = normalizeHeading(line);
  if (!normalized) return null;

  for (const [key, values] of Object.entries(WEBSITE_SECTION_KEYWORDS) as Array<[keyof ResumeSections, readonly string[]]>) {
    if (values.some((keyword) => normalized === keyword || normalized.startsWith(`${keyword} `) || normalized.includes(keyword))) {
      return key;
    }
  }

  return null;
}

function splitResumeSections(rawText: string): ResumeSections {
  const sections: ResumeSections = {
    preamble: [],
    summary: [],
    projects: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    achievements: [],
    other: [],
  };

  let current: keyof ResumeSections = 'preamble';
  for (const rawLine of rawText.split(/\r?\n/)) {
    const line = normalizeLine(rawLine);
    if (!line) continue;

    const sectionKey = detectSectionKey(line);
    if (sectionKey) {
      current = sectionKey;
      continue;
    }

    sections[current].push(line);
  }

  return sections;
}

function splitIntoBlocks(lines: string[]): string[][] {
  const blocks: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (!normalizeLine(line)) {
      if (current.length > 0) {
        blocks.push(current);
        current = [];
      }
      continue;
    }
    current.push(normalizeLine(line));
  }

  if (current.length > 0) blocks.push(current);
  return blocks;
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.map((v) => normalizeLine(v)).filter(Boolean)));
}

function extractUrls(text: string): string[] {
  return uniqueStrings((text.match(/https?:\/\/[^\s)]+/gi) || []).map((url) => url.replace(/[.,;]+$/, '')));
}

function extractSkillsFromText(text: string): string[] {
  const found = new Set<string>();
  for (const skill of MATCH_SKILL_KEYWORDS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?:^|\\b|[,/|•·\\s])${escaped}(?:$|\\b|[,/|•·\\s])`, 'i');
    if (regex.test(text)) {
      found.add(skill === 'Tailwind' ? 'Tailwind CSS' : skill);
    }
  }
  return Array.from(found);
}

function looksLikeContactLine(line: string): boolean {
  return /@|https?:\/\/|github\.com|linkedin\.com|\+?\d[\d\s().-]{6,}/i.test(line);
}

function buildSummaryFromSections(sections: ResumeSections, rawLines: string[]): string {
  const summaryLines = sections.summary.filter((line) => !isLikelySectionHeading(line) && !looksLikeContactLine(line));
  if (summaryLines.length > 0) {
    return normalizeLine(summaryLines.join(' ')).slice(0, 420);
  }

  const preamble: string[] = [];
  for (const line of sections.preamble.slice(0, 8)) {
    if (looksLikeContactLine(line)) continue;
    if (isLikelySectionHeading(line)) continue;
    if (line.length < 18) continue;
    preamble.push(line);
  }

  if (preamble.length === 0) {
    const beforeFirstHeading: string[] = [];
    for (const line of rawLines) {
      const cleaned = normalizeLine(line);
      if (!cleaned) continue;
      if (detectSectionKey(cleaned)) break;
      if (looksLikeContactLine(cleaned)) continue;
      if (cleaned.length < 18) continue;
      beforeFirstHeading.push(cleaned);
    }
    return normalizeLine(beforeFirstHeading.slice(0, 3).join(' ')).slice(0, 420);
  }

  return normalizeLine(preamble.slice(0, 3).join(' ')).slice(0, 420);
}

function buildProjectName(block: string[], urls: string[]): string {
  for (const line of block) {
    const cleaned = line.replace(/^[\-*•\d.)\s]+/, '').trim();
    if (!cleaned || looksLikeContactLine(cleaned) || isLikelySectionHeading(cleaned)) continue;
    if (cleaned.length > 90) continue;
    if (/^(github|live|demo|repo|link|project|source)\s*[:\-]/i.test(cleaned)) continue;
    if (/https?:\/\//i.test(cleaned)) continue;
    const title = cleaned.split(/\s+[-–:|]\s+/)[0].trim();
    if (title.length >= 3) return title;
  }

  const repoUrl = urls.find((url) => /github\.com/i.test(url));
  if (repoUrl) {
    const parts = repoUrl.split('/').filter(Boolean);
    const slug = parts[parts.length - 1]?.replace(/\.git$/i, '') || '';
    if (slug) {
      return slug
        .replace(/[-_]+/g, ' ')
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
  }

  return '';
}

function buildProjectDescription(block: string[], name: string): string {
  const filtered = block
    .map((line) => line.replace(/^[\-*•\d.)\s]+/, '').trim())
    .filter((line) => {
      if (!line) return false;
      if (line === name) return false;
      if (looksLikeContactLine(line)) return false;
      if (/^(github|live|demo|repo|link|source|tech|technologies|stack|built with)\s*[:\-]/i.test(line)) return false;
      return true;
    });

  return normalizeLine(filtered.join(' ')).slice(0, 520);
}

function buildProjectItem(block: string[], index: number): ProjectItem | null {
  const raw = block.join(' ');
  const urls = extractUrls(raw);
  const skills = extractSkillsFromText(raw);
  const name = buildProjectName(block, urls) || `Project ${index + 1}`;
  const description = buildProjectDescription(block, name);
  const githubUrl = urls.find((url) => /github\.com/i.test(url)) || '';
  const liveUrl = urls.find((url) => !/github\.com/i.test(url)) || '';

  if (!description && skills.length === 0 && urls.length === 0) {
    return null;
  }

  return {
    id: `proj_kw_${Date.now()}_${index}`,
    name,
    description: description || `${name} project`,
    technologies: uniqueStrings(skills),
    githubUrl,
    liveUrl,
    imageUrl: '',
    featured: index < 2,
  };
}

function extractProjectsFromSections(sectionLines: string[], rawText: string): ProjectItem[] {
  const sectionBlocks = splitIntoBlocks(sectionLines);
  const sectionProjects = sectionBlocks
    .map((block, index) => buildProjectItem(block, index))
    .filter((item): item is ProjectItem => Boolean(item));

  if (sectionProjects.length > 0) return sectionProjects;

  const allBlocks = splitIntoBlocks(rawText.split(/\r?\n/));
  return allBlocks
    .filter((block) => {
      const text = block.join(' ').toLowerCase();
      const skillHits = extractSkillsFromText(text).length;
      return PROJECT_VERB_KEYWORDS.some((verb) => text.includes(verb)) || /github\.com|live\s*demo|project|built|developed|engineered|implemented/i.test(text) || skillHits >= 2;
    })
    .map((block, index) => buildProjectItem(block, index))
    .filter((item): item is ProjectItem => Boolean(item));
}

function extractHeuristicResumeData(rawText: string, fileName?: string): ParsedResumeData {
  const rawLines = rawText.split(/\r?\n/).map((line) => normalizeLine(line)).filter(Boolean);
  const sections = splitResumeSections(rawText);
  const summary = buildSummaryFromSections(sections, rawLines);
  const projects = extractProjectsFromSections(sections.projects, rawText);
  const skills = uniqueStrings([
    ...extractSkillsFromText(rawText),
    ...extractSkillsFromText(sections.skills.join(' ')),
  ]);

  const personal: Partial<PortfolioContent['personal']> = {};
  if (summary) {
    personal.introduction = summary;
  }

  if (!personal.fullName && fileName) {
    const guessed = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ').trim();
    if (guessed) personal.fullName = guessed;
  }

  return {
    personal,
    about: summary ? { bio: summary } : {},
    skills,
    projects,
  };
}

function mergeResumeData(base: ParsedResumeData, extra: ParsedResumeData): ParsedResumeData {
  const mergedSkills = uniqueStrings([...(base.skills || []), ...(extra.skills || [])]);
  const mergedProjects = (base.projects && base.projects.length > 0 ? base.projects : extra.projects) || [];
  const mergedEducation = (base.education && base.education.length > 0 ? base.education : extra.education) || [];
  const mergedExperience = (base.experience && base.experience.length > 0 ? base.experience : extra.experience) || [];
  const mergedCertifications = (base.certifications && base.certifications.length > 0 ? base.certifications : extra.certifications) || [];
  const mergedAchievements = (base.achievements && base.achievements.length > 0 ? base.achievements : extra.achievements) || [];

  return {
    personal: { ...(extra.personal || {}), ...(base.personal || {}) },
    about: {
      ...(extra.about || {}),
      ...(base.about || {}),
      bio: base.about?.bio || extra.about?.bio || base.personal?.introduction || extra.personal?.introduction || '',
    },
    skills: mergedSkills,
    education: mergedEducation,
    projects: mergedProjects,
    experience: mergedExperience,
    certifications: mergedCertifications,
    achievements: mergedAchievements,
    socialLinks: { ...(extra.socialLinks || {}), ...(base.socialLinks || {}) },
  };
}

async function extractTextWithPdfJs(file: File): Promise<string> {
  if (!pdfWorkerConfigured) {
    GlobalWorkerOptions.workerSrc = pdfWorkerSrc;
    pdfWorkerConfigured = true;
  }

  const data = new Uint8Array(await file.arrayBuffer());
  const loadingTask = getDocument({
    data,
    useWorkerFetch: false,
    disableFontFace: true,
  });

  const pdf = await loadingTask.promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const items = textContent.items as Array<{ str?: string; hasEOL?: boolean }>;
    const pageLines: string[] = [];
    let currentLine = '';

    for (const item of items) {
      const text = (item.str || '').replace(/\s+/g, ' ').trim();
      if (!text) continue;

      currentLine = currentLine ? `${currentLine} ${text}` : text;
      if (item.hasEOL) {
        pageLines.push(currentLine);
        currentLine = '';
      }
    }

    if (currentLine) pageLines.push(currentLine);
    if (pageLines.length > 0) pages.push(pageLines.join('\n'));
  }

  return cleanExtractedText(pages.join('\n'));
}

export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const extracted = await extractTextWithPdfJs(file);
    if (extracted.split('\n').length >= 4 || extracted.length >= 200) {
      return extracted;
    }
  } catch (err) {
    console.warn('[ResumeParser] PDF.js text extraction failed, falling back to raw scan:', err);
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  let binaryStr = '';
  const chunkSize = 16384;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
    binaryStr += String.fromCharCode.apply(null, Array.from(chunk));
  }

  const chunks: string[] = [];

  const tjRegex = /\(([^)\\]*(?:\\.[^)\\]*)*)\)\s*(?:Tj|'|")/g;
  let match: RegExpExecArray | null;
  while ((match = tjRegex.exec(binaryStr)) !== null) {
    const text = cleanPdfString(match[1]);
    if (text && text.length > 1) chunks.push(text);
  }

  const tjArrayRegex = /\[([^\]]{1,500})\]\s*TJ/gi;
  while ((match = tjArrayRegex.exec(binaryStr)) !== null) {
    const inner = match[1];
    const itemRegex = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g;
    let subMatch: RegExpExecArray | null;
    let line = '';
    while ((subMatch = itemRegex.exec(inner)) !== null) {
      const part = cleanPdfString(subMatch[1]);
      if (part) line += `${part} `;
    }
    if (line.trim().length > 1) chunks.push(line.trim());
  }

  return cleanExtractedText(chunks.join('\n'));
}

// -----------------------------------------------------------------------------
// Gemini parsing
// -----------------------------------------------------------------------------

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const RESUME_PROMPT = `You are an expert resume parser. Extract ALL information from the following resume text and return a valid JSON object with this EXACT structure (use empty arrays [] for missing sections, do NOT add any extra keys):

{
  "personal": {
    "fullName": "",
    "email": "",
    "phone": "",
    "title": "",
    "location": "",
    "introduction": ""
  },
  "about": {
    "bio": ""
  },
  "skills": ["skill1", "skill2"],
  "education": [
    {
      "id": "edu_1",
      "institution": "",
      "degree": "",
      "field": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "experience": [
    {
      "id": "exp_1",
      "company": "",
      "role": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "projects": [
    {
      "id": "proj_1",
      "name": "",
      "description": "",
      "technologies": ["tech1"],
      "githubUrl": "",
      "liveUrl": "",
      "imageUrl": "",
      "featured": true
    }
  ],
  "certifications": [
    {
      "id": "cert_1",
      "name": "",
      "issuer": "",
      "date": "",
      "credentialUrl": ""
    }
  ],
  "achievements": [
    {
      "id": "ach_1",
      "title": "",
      "description": "",
      "date": ""
    }
  ],
  "socialLinks": {
    "github": "",
    "linkedin": "",
    "twitter": "",
    "website": ""
  }
}

Rules:
- Extract ONLY what's present in the resume text
- For skills: extract individual technology/skill names as separate strings
- For dates: use the format found in resume (e.g. "Jun 2025" or "2025")
- imageUrl should always be "" (empty)
- Set "featured": true for first 2 projects only
- Generate unique IDs like edu_1, exp_1, proj_1, cert_1, ach_1
- If the resume contains a summary, profile, objective, or about section, place it in "about.bio" and also in "personal.introduction"
- If the resume contains a headline or role title near the name, place it in "personal.title"
- Do not omit project descriptions, technologies, or URLs when they are present
- Return ONLY the JSON object, no markdown, no explanation

RESUME TEXT:
`;

function extractJsonCandidate(text: string): string {
  const trimmed = text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim().replace(/^\uFEFF/, '');
  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');

  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

function normalizeResumeData(data: any): ParsedResumeData {
  const parsed: ParsedResumeData = {
    personal: data?.personal || {},
    about: data?.about || {},
    skills: Array.isArray(data?.skills) ? data.skills : [],
    education: Array.isArray(data?.education) ? data.education : [],
    projects: Array.isArray(data?.projects) ? data.projects : [],
    experience: Array.isArray(data?.experience) ? data.experience : [],
    certifications: Array.isArray(data?.certifications) ? data.certifications : [],
    achievements: Array.isArray(data?.achievements) ? data.achievements : [],
    socialLinks: data?.socialLinks || {},
  };

  const summaryText =
    parsed.about?.bio ||
    data?.summary ||
    data?.professionalSummary ||
    data?.profile ||
    data?.objective ||
    data?.overview ||
    '';

  if (summaryText) {
    parsed.about = { ...(parsed.about || {}), bio: summaryText };
    parsed.personal = { ...(parsed.personal || {}), introduction: parsed.personal?.introduction || summaryText };
  }

  const titleText =
    parsed.personal?.title ||
    data?.headline ||
    data?.role ||
    data?.profession ||
    data?.designation ||
    '';

  if (titleText) {
    parsed.personal = { ...(parsed.personal || {}), title: titleText };
  }

  return parsed;
}

async function parseWithGemini(rawText: string, fileName?: string): Promise<ParsedResumeData> {
  const response = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: RESUME_PROMPT + rawText }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const json = await response.json();
  const text = (json?.candidates?.[0]?.content?.parts || [])
    .map((part: { text?: string }) => part.text || '')
    .join('\n')
    .trim();
  const cleaned = extractJsonCandidate(text);
  const parsed = normalizeResumeData(JSON.parse(cleaned));

  const ts = Date.now();
  if (parsed.education) {
    parsed.education = parsed.education.map((item: EducationItem, i: number) => ({
      ...item,
      id: item.id || `edu_${ts}_${i}`,
    }));
  }
  if (parsed.experience) {
    parsed.experience = parsed.experience.map((item: ExperienceItem, i: number) => ({
      ...item,
      id: item.id || `exp_${ts}_${i}`,
    }));
  }
  if (parsed.projects) {
    parsed.projects = parsed.projects.map((item: ProjectItem, i: number) => ({
      ...item,
      id: item.id || `proj_${ts}_${i}`,
      imageUrl: '',
      featured: i < 2,
    }));
  }
  if (parsed.certifications) {
    parsed.certifications = parsed.certifications.map((item: CertificationItem, i: number) => ({
      ...item,
      id: item.id || `cert_${ts}_${i}`,
    }));
  }
  if (parsed.achievements) {
    parsed.achievements = parsed.achievements.map((item: AchievementItem, i: number) => ({
      ...item,
      id: item.id || `ach_${ts}_${i}`,
    }));
  }

  if (parsed.about?.bio && !parsed.personal?.introduction) {
    parsed.personal = { ...(parsed.personal || {}), introduction: parsed.about.bio };
  }

  return mergeResumeData(parsed as ParsedResumeData, extractHeuristicResumeData(rawText, fileName));
}

// -----------------------------------------------------------------------------
// Regex fallback parser
// -----------------------------------------------------------------------------

export function parseResumeText(rawText: string, fileName?: string): ParsedResumeData {
  const lines = rawText.split('\n').map((line) => line.trim()).filter(Boolean);
  const fullText = lines.join('\n');

  const result: ParsedResumeData = {
    personal: {},
    about: {},
    skills: [],
    education: [],
    projects: [],
    experience: [],
    certifications: [],
    achievements: [],
    socialLinks: {},
  };

  const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) result.personal!.email = emailMatch[0].trim();

  const indiaPhone = fullText.match(/(?:\+?91[-\s]?)?([6-9]\d{9})/);
  if (indiaPhone) result.personal!.phone = indiaPhone[0].trim();

  const githubMatch = fullText.match(/github\.com\/([a-zA-Z0-9_.-]+)/i);
  if (githubMatch && githubMatch[1]?.length > 1) {
    result.socialLinks!.github = `https://github.com/${githubMatch[1]}`;
  }
  const linkedinMatch = fullText.match(/linkedin\.com\/in\/([a-zA-Z0-9_.-]+)/i);
  if (linkedinMatch && linkedinMatch[1]?.length > 1) {
    result.socialLinks!.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;
  }

  let foundName = '';
  for (let i = 0; i < Math.min(lines.length, 6); i += 1) {
    const line = lines[i];
    if (
      line.length >= 3 &&
      line.length <= 45 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !/\d/.test(line) &&
      !/resume|portfolio|skills|experience|education/i.test(line) &&
      /^[A-Za-z\s.'\-]+$/.test(line)
    ) {
      foundName = line.trim();
      break;
    }
  }

  if (!foundName && fileName) {
    foundName = fileName
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  if (foundName) result.personal!.fullName = foundName;
  result.personal!.title = 'Software Developer';

  const SKILL_LIST = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Go', 'Rust', 'SQL', 'Dart',
    'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI',
    'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Redux', 'Zustand', 'GraphQL', 'REST APIs', 'WebSockets',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Supabase', 'Firebase', 'Prisma', 'Algolia',
    'Docker', 'AWS', 'Git', 'GitHub', 'CI/CD', 'Linux', 'Figma', 'Canvas API',
  ];

  const foundSkills = new Set<string>();
  for (const skill of SKILL_LIST) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (new RegExp(`(?:^|\\b|[,|/•·\\s])${escaped}(?:$|\\b|[,|/•·\\s])`, 'i').test(fullText)) {
      foundSkills.add(skill);
    }
  }
  if (foundSkills.size > 0) result.skills = Array.from(foundSkills);

  return mergeResumeData(result, extractHeuristicResumeData(rawText, fileName));
}

// -----------------------------------------------------------------------------
// Main export
// -----------------------------------------------------------------------------

export async function parseResumeWithAI(rawText: string, fileName?: string): Promise<ParsedResumeData> {
  if (GEMINI_API_KEY && rawText.trim().length > 30) {
    try {
      console.log('[ResumeParser] Using Gemini AI for parsing...');
      const result = await parseWithGemini(rawText, fileName);
      console.log('[ResumeParser] Gemini parsed successfully:', result);
      return result;
    } catch (err) {
      console.warn('[ResumeParser] Gemini failed, falling back to regex:', err);
    }
  }

  return mergeResumeData(parseResumeText(rawText, fileName), extractHeuristicResumeData(rawText, fileName));
}








