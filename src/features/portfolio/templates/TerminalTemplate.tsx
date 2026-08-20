import React, { useState } from 'react';
import {
  MapPin,
  ExternalLink,
  Globe,
  Download,
  Copy,
  Check,
  Calendar,
  Mail,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/common/SocialIcons';
import { PortfolioContent, ThemeSettings } from '@/types/portfolio';

interface TemplateProps {
  content: PortfolioContent;
  theme: ThemeSettings;
  isPublic?: boolean;
}

export const TerminalTemplate: React.FC<TemplateProps> = ({ content, theme }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'projects' | 'experience' | 'skills' | 'education'>('all');
  const [copiedEmail, setCopiedEmail] = useState(false);

  const { personal, about, skills, education, projects, experience, certifications, achievements, socialLinks, resume } = content;

  const accentHex = theme.accentColor || '#10b981';

  // Dynamic terminal username derived from custom username or user's full name
  const username = personal.username?.trim()
    ? personal.username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '')
    : personal.fullName
    ? personal.fullName.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '') || 'dev'
    : 'dev';
  const promptPrefix = `${username}@status200:~$`;

  const copyEmail = () => {
    if (personal.email) {
      navigator.clipboard.writeText(personal.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    }
  };

  const isLight = !theme.darkMode;
  const bgClass = isLight ? 'bg-slate-50 text-slate-900' : 'bg-[#0a0e17] text-slate-200';
  const cardBg = isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/70 border-slate-800/80';
  const termHeaderBg = isLight ? 'bg-slate-200/80 border-slate-300' : 'bg-slate-950/80 border-slate-800';

  return (
    <div className={`min-h-full w-full font-mono transition-colors duration-200 ${bgClass}`}>
      {/* Top Terminal App Window Bar */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Terminal Container */}
        <div className={`rounded-2xl border ${cardBg} overflow-hidden shadow-2xl backdrop-blur-xl`}>
          {/* Terminal Window Chrome */}
          <div className={`px-4 py-3 border-b flex items-center justify-between ${termHeaderBg}`}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:opacity-80 transition-opacity" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:opacity-80 transition-opacity" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:opacity-80 transition-opacity" />
              <span className="text-xs text-slate-400 ml-2 font-mono hidden sm:inline">
                status200@terminal: ~/{username}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-[11px]">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accentHex }} />
                <span>status: open_for_work</span>
              </span>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 sm:p-8 md:p-10 space-y-8">
            {/* Command: whoami */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span style={{ color: accentHex }}>{promptPrefix}</span>
                <span className="text-slate-200">whoami --verbose</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/60">
                <div className="flex items-start gap-4">
                  {personal.avatarUrl ? (
                    <img
                      src={personal.avatarUrl}
                      alt={personal.fullName}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 shadow-lg shrink-0"
                      style={{ borderColor: accentHex }}
                    />
                  ) : (
                    <div
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center font-bold text-2xl border-2 shrink-0 bg-slate-800"
                      style={{ borderColor: accentHex, color: accentHex }}
                    >
                      {personal.fullName ? personal.fullName.charAt(0).toUpperCase() : 'D'}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white">
                      {personal.fullName || 'Developer Name'}
                    </h1>
                    <p className="text-sm font-medium" style={{ color: accentHex }}>
                      {personal.title || 'Full Stack Engineer'}
                    </p>
                    {personal.location && (
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {personal.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick actions & Socials */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {resume?.url && (
                    <a
                      href={resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all hover:scale-105"
                    >
                      <Download className="w-3.5 h-3.5" style={{ color: accentHex }} />
                      <span>Resume.pdf</span>
                    </a>
                  )}

                  {personal.email && (
                    <a
                      href={`mailto:${personal.email}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-950 transition-all shadow-glow hover:opacity-95 hover:scale-105"
                      style={{ backgroundColor: accentHex }}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Contact Me</span>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Introduction & Elevator Pitch */}
            {(personal.introduction || about?.bio) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span style={{ color: accentHex }}>{promptPrefix}</span>
                  <span className="text-slate-200">cat ./bio.txt</span>
                </div>
                <div className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed font-sans ${cardBg}`}>
                  <p className="text-slate-300 whitespace-pre-line">
                    {about?.bio || personal.introduction}
                  </p>
                </div>
              </div>
            )}

            {/* Interactive Section Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'all'
                    ? 'text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
                style={activeTab === 'all' ? { backgroundColor: accentHex } : {}}
              >
                * [ALL]
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'projects'
                    ? 'text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
                style={activeTab === 'projects' ? { backgroundColor: accentHex } : {}}
              >
                01. Projects ({projects.length})
              </button>
              <button
                onClick={() => setActiveTab('experience')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'experience'
                    ? 'text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
                style={activeTab === 'experience' ? { backgroundColor: accentHex } : {}}
              >
                02. Experience ({experience.length})
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'skills'
                    ? 'text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
                style={activeTab === 'skills' ? { backgroundColor: accentHex } : {}}
              >
                03. Skills ({skills.length})
              </button>
              <button
                onClick={() => setActiveTab('education')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'education'
                    ? 'text-slate-950 font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
                style={activeTab === 'education' ? { backgroundColor: accentHex } : {}}
              >
                04. Education
              </button>
            </div>

            {/* Technical Skills Section */}
            {(activeTab === 'all' || activeTab === 'skills') && skills.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span style={{ color: accentHex }}>{promptPrefix}</span>
                  <span className="text-slate-200">cat ./skills.json</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/90 text-slate-200 border border-slate-700/80 hover:border-slate-500 transition-colors"
                    >
                      <span style={{ color: accentHex }}>&gt;</span> {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {(activeTab === 'all' || activeTab === 'projects') && projects.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span style={{ color: accentHex }}>{promptPrefix}</span>
                  <span className="text-slate-200">ls -la ./projects/</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className={`p-5 rounded-xl border ${cardBg} hover:border-slate-600 transition-all flex flex-col justify-between space-y-4 group`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold font-sans text-white group-hover:text-emerald-400 transition-colors">
                            {proj.name}
                          </h3>
                          {proj.featured && (
                            <span
                              className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border"
                              style={{ color: accentHex, borderColor: `${accentHex}40`, backgroundColor: `${accentHex}15` }}
                            >
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-sans text-slate-400 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      {/* Project Image Preview if present */}
                      {proj.imageUrl && (
                        <div className="w-full h-36 rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                          <img
                            src={proj.imageUrl}
                            alt={proj.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}

                      {/* Tech stack pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies?.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80 text-xs">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                            <span>Repository</span>
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:underline transition-colors ml-auto"
                            style={{ color: accentHex }}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Live Demo</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Section */}
            {(activeTab === 'all' || activeTab === 'experience') && experience.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span style={{ color: accentHex }}>{promptPrefix}</span>
                  <span className="text-slate-200">git log --stat --oneline ./work-history</span>
                </div>

                <div className="space-y-3">
                  {experience.map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-2`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h4 className="text-sm font-bold font-sans text-white">
                            {exp.role}
                          </h4>
                          <p className="text-xs font-semibold" style={{ color: accentHex }}>
                            @ {exp.company}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {exp.startDate} — {exp.endDate || 'Present'}
                        </span>
                      </div>

                      <p className="text-xs font-sans text-slate-300 leading-relaxed whitespace-pre-line">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {(activeTab === 'all' || activeTab === 'education') && education.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span style={{ color: accentHex }}>{promptPrefix}</span>
                  <span className="text-slate-200">cat ./academic-records.txt</span>
                </div>

                <div className="space-y-3">
                  {education.map((edu, idx) => (
                    <div
                      key={edu.id || idx}
                      className={`p-4 sm:p-5 rounded-xl border ${cardBg} space-y-1.5`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h4 className="text-sm font-bold font-sans text-white">
                            {edu.degree} in {edu.field}
                          </h4>
                          <p className="text-xs text-slate-300">{edu.institution}</p>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {edu.startDate} — {edu.endDate}
                        </span>
                      </div>
                      {edu.description && (
                        <p className="text-xs font-sans text-slate-400 leading-relaxed">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications & Achievements */}
            {activeTab === 'all' && (certifications.length > 0 || achievements.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span style={{ color: accentHex }}>{promptPrefix}</span>
                      <span className="text-slate-200">cat ./certs.md</span>
                    </div>
                    <div className="space-y-2">
                      {certifications.map((cert, idx) => (
                        <div key={cert.id || idx} className={`p-3 rounded-lg border ${cardBg} text-xs space-y-1`}>
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-white">{cert.name}</span>
                            {cert.date && <span className="text-[10px] text-slate-400">{cert.date}</span>}
                          </div>
                          <p className="text-slate-400 text-[11px]">{cert.issuer}</p>
                          {cert.credentialUrl && (
                            <a
                              href={cert.credentialUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] flex items-center gap-1 hover:underline"
                              style={{ color: accentHex }}
                            >
                              <ExternalLink className="w-3 h-3" /> Verify Credential
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {achievements.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span style={{ color: accentHex }}>{promptPrefix}</span>
                      <span className="text-slate-200">cat ./awards.md</span>
                    </div>
                    <div className="space-y-2">
                      {achievements.map((ach, idx) => (
                        <div key={ach.id || idx} className={`p-3 rounded-lg border ${cardBg} text-xs space-y-1`}>
                          <div className="flex items-start justify-between">
                            <span className="font-semibold text-white">{ach.title}</span>
                            {ach.date && <span className="text-[10px] text-slate-400">{ach.date}</span>}
                          </div>
                          <p className="text-slate-400 text-[11px] font-sans">{ach.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Social Links & Footer Command */}
            <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-4 text-slate-400">
                {socialLinks?.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <GithubIcon className="w-4 h-4" /> GitHub
                  </a>
                )}
                {socialLinks?.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <LinkedinIcon className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {socialLinks?.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <TwitterIcon className="w-4 h-4" /> Twitter
                  </a>
                )}
                {socialLinks?.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" /> Website
                  </a>
                )}
              </div>

              {personal.email && (
                <button
                  onClick={copyEmail}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Email copied to clipboard!' : personal.email}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
