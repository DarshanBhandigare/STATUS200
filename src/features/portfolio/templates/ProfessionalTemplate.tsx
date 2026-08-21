import React from 'react';
import {
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Globe,
  Download,
  Briefcase,
  Award,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/common/SocialIcons';
import { PortfolioContent, ThemeSettings } from '@/types/portfolio';

interface TemplateProps {
  content: PortfolioContent;
  theme: ThemeSettings;
  isPublic?: boolean;
}
export const ProfessionalTemplate: React.FC<TemplateProps> = ({ content, theme, isPublic = false }) => {
  const personal = content?.personal || { fullName: '', title: '', avatarUrl: '', location: '', email: '', phone: '', introduction: '' };
  const about = content?.about || { bio: '' };
  const skills = content?.skills || [];
  const education = content?.education || [];
  const projects = content?.projects || [];
  const experience = content?.experience || [];
  const certifications = content?.certifications || [];
  const achievements = content?.achievements || [];
  const socialLinks = content?.socialLinks || {};
  const resume = content?.resume || { url: '', filename: '' };

  const accentHex = theme?.accentColor || '#0284c7';
  const isLight = !theme.darkMode;

  const bgClass = isLight ? 'bg-slate-100 text-slate-900' : 'bg-slate-950 text-slate-100';
  const paperClass = isLight
    ? 'bg-white border-slate-300 text-slate-800 shadow-xl'
    : 'bg-slate-900 border-slate-800 text-slate-200 shadow-2xl';
  const sidebarBg = isLight ? 'bg-slate-50 border-r border-slate-200' : 'bg-slate-950/60 border-r border-slate-800/80';
  const subtextClass = isLight ? 'text-slate-600' : 'text-slate-400';

  return (
    <div className={`min-h-full w-full py-8 sm:py-12 px-4 transition-colors duration-200 ${bgClass}`}>
      <div className="max-w-5xl mx-auto space-y-4">
        {/* Quick action bar */}
        <div className="flex items-center justify-between px-2 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: accentHex }}>
            <FileText className="w-4 h-4" />
            <span>Executive Resume View</span>
          </div>

          <div className="flex items-center gap-2">
            {!isPublic && resume?.url && (
              <a
                href={resume.url}
                download={resume.filename || `${personal.fullName || 'developer'}_Resume.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-transform hover:scale-105"
                style={{ backgroundColor: accentHex }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Resume</span>
              </a>
            )}
          </div>
        </div>

        {/* Paper Document Layout */}
        <div className={`resume-print-root rounded-2xl border ${paperClass} overflow-hidden grid grid-cols-1 md:grid-cols-12 print:border-none print:shadow-none`}>
          {/* Left Column / Profile & Metadata (4 cols) */}
          <div className={`md:col-span-4 p-6 sm:p-8 space-y-8 ${sidebarBg}`}>
            {/* Avatar & Name */}
            <div className="space-y-4 text-center md:text-left">
              {personal.avatarUrl ? (
                <img
                  src={personal.avatarUrl}
                  alt={personal.fullName}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover mx-auto md:mx-0 border-2 shadow-md"
                  style={{ borderColor: accentHex }}
                />
              ) : (
                <div
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl flex items-center justify-center font-bold text-3xl mx-auto md:mx-0 border-2 bg-slate-800"
                  style={{ borderColor: accentHex, color: accentHex }}
                >
                  {personal.fullName ? personal.fullName.charAt(0).toUpperCase() : 'P'}
                </div>
              )}

              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                  {personal.fullName || 'Candidate Name'}
                </h1>
                <p className="text-xs font-semibold mt-1" style={{ color: accentHex }}>
                  {personal.title || 'Software Engineering Candidate'}
                </p>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
              <h2 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Contact Info
              </h2>

              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-slate-500" />
                  <span className="truncate">{personal.email}</span>
                </a>
              )}

              {personal.phone && (
                <div className="flex items-center gap-2.5 text-slate-400">
                  <Phone className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>{personal.phone}</span>
                </div>
              )}

              {personal.location && (
                <div className="flex items-center gap-2.5 text-slate-400">
                  <MapPin className="w-4 h-4 shrink-0 text-slate-500" />
                  <span>{personal.location}</span>
                </div>
              )}
            </div>

            {/* Social profiles */}
            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
              <h2 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                Profiles & Portfolios
              </h2>

              {socialLinks?.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <GithubIcon className="w-4 h-4 text-slate-500" />
                  <span>GitHub</span>
                </a>
              )}

              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4 text-slate-500" />
                  <span>LinkedIn</span>
                </a>
              )}

              {socialLinks?.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <TwitterIcon className="w-4 h-4 text-slate-500" />
                  <span>Twitter / X</span>
                </a>
              )}

              {socialLinks?.website && (
                <a
                  href={socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4 text-slate-500" />
                  <span>Personal Site</span>
                </a>
              )}
            </div>

            {/* Core Skills */}
            {skills.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <h2 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Technical Skills
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] border border-slate-700/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education Summary */}
            {education.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
                <h2 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Education
                </h2>
                {education.map((edu, idx) => (
                  <div key={edu.id || idx} className="space-y-1">
                    <p className="font-semibold text-white">
                      {edu.degree} in {edu.field}
                    </p>
                    <p className="text-slate-400">{edu.institution}</p>
                    <p className="text-[10px] text-slate-500">
                      {edu.startDate} â€” {edu.endDate}
                    </p>
                    {edu.description && (
                      <p className="text-[11px] text-slate-400 pt-0.5">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column / Main Body Content (8 cols) */}
          <div className="md:col-span-8 p-6 sm:p-8 md:p-10 space-y-8">
            {/* Executive Bio */}
            {(about?.bio || personal.introduction) && (
              <section className="space-y-2.5">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-1 border-b"
                  style={{ color: accentHex, borderColor: `${accentHex}40` }}
                >
                  Professional Summary
                </h2>
                <p className={`text-xs sm:text-sm leading-relaxed ${subtextClass}`}>
                  {about?.bio || personal.introduction}
                </p>
              </section>
            )}

            {/* Professional Experience */}
            {experience.length > 0 && (
              <section className="space-y-4">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-1 border-b flex items-center justify-between"
                  style={{ color: accentHex, borderColor: `${accentHex}40` }}
                >
                  <span>Work & Engineering Experience</span>
                  <Briefcase className="w-4 h-4" />
                </h2>

                <div className="space-y-5">
                  {experience.map((exp, idx) => (
                    <div key={exp.id || idx} className="space-y-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <div>
                          <h3 className="font-bold text-sm text-white">{exp.role}</h3>
                          <p className="text-xs font-semibold" style={{ color: accentHex }}>
                            {exp.company}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          {exp.startDate} â€” {exp.endDate || 'Present'}
                        </span>
                      </div>

                      <p className={`text-xs leading-relaxed whitespace-pre-line ${subtextClass}`}>
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Software Projects */}
            {projects.length > 0 && (
              <section className="space-y-4">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-1 border-b flex items-center justify-between"
                  style={{ color: accentHex, borderColor: `${accentHex}40` }}
                >
                  <span>Key Software Projects</span>
                  <CheckCircle2 className="w-4 h-4" />
                </h2>

                <div className="space-y-4">
                  {projects.map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-sm text-white">{proj.name}</h3>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {proj.technologies?.map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 text-slate-400 hover:text-white transition-colors"
                              title="Source Code"
                            >
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          )}
                          {proj.liveUrl && (
                            <a
                              href={proj.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:text-white transition-colors"
                              style={{ color: accentHex }}
                              title="Live Application"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>

                      <p className={`text-xs leading-relaxed ${subtextClass}`}>{proj.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications & Honors */}
            {(certifications.length > 0 || achievements.length > 0) && (
              <section className="space-y-4">
                <h2
                  className="text-xs font-bold uppercase tracking-wider pb-1 border-b flex items-center justify-between"
                  style={{ color: accentHex, borderColor: `${accentHex}40` }}
                >
                  <span>Certifications & Honors</span>
                  <Award className="w-4 h-4" />
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {certifications.map((cert, idx) => (
                    <div key={cert.id || idx} className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs space-y-0.5">
                      <p className="font-semibold text-white">{cert.name}</p>
                      <p className="text-slate-400 text-[11px]">{cert.issuer} {cert.date ? `â€¢ ${cert.date}` : ''}</p>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] flex items-center gap-1 hover:underline pt-0.5"
                          style={{ color: accentHex }}
                        >
                          <ExternalLink className="w-3 h-3" /> Verify Certificate
                        </a>
                      )}
                    </div>
                  ))}

                  {achievements.map((ach, idx) => (
                    <div key={ach.id || idx} className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-xs space-y-0.5">
                      <p className="font-semibold text-white">{ach.title}</p>
                      <p className={`text-[11px] ${subtextClass}`}>{ach.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


