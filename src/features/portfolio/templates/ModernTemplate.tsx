import React from 'react';
import {
  Sparkles,
  MapPin,
  Mail,
  ExternalLink,
  Globe,
  Download,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Send,
  Code2,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '@/components/common/SocialIcons';
import { PortfolioContent, ThemeSettings } from '@/types/portfolio';

interface TemplateProps {
  content: PortfolioContent;
  theme: ThemeSettings;
  isPublic?: boolean;
}
export const ModernTemplate: React.FC<TemplateProps> = ({ content, theme, isPublic = false }) => {
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

  const accentHex = theme?.accentColor || '#6366f1';
  const isLight = !theme.darkMode;

  const bgClass = isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100';
  const cardClass = isLight
    ? 'bg-white/80 border-slate-200/80 shadow-md backdrop-blur-md hover:border-slate-300'
    : 'bg-slate-900/60 border-slate-800/80 shadow-xl backdrop-blur-md hover:border-slate-700/80';
  const subtextClass = isLight ? 'text-slate-600' : 'text-slate-400';

  return (
    <div className={`min-h-full w-full relative transition-colors duration-200 ${bgClass}`}>
      {/* Radiant Glow ambient backgrounds */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] blur-[140px] opacity-25 pointer-events-none -z-10 rounded-full"
        style={{ backgroundColor: accentHex }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section */}
        <section className="relative pt-6 sm:pt-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-6 flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md"
              style={{
                backgroundColor: `${accentHex}15`,
                borderColor: `${accentHex}30`,
                color: accentHex,
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available for Full-Time & Internship Roles</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display leading-tight">
                Hi, I'm{' '}
                <span
                  className="bg-clip-text text-transparent bg-gradient-to-r"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${accentHex}, #38bdf8, #818cf8)`,
                  }}
                >
                  {personal.fullName || 'Alex Morgan'}
                </span>
              </h1>
              <p className="text-lg sm:text-xl font-medium text-slate-300">
                {personal.title || 'Full Stack Engineer & Cloud Architect'}
              </p>
            </div>

            <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${subtextClass}`}>
              {about?.bio || personal.introduction}
            </p>

            {/* Quick Location & Email Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs">
              {personal.location && (
                <span className={`flex items-center gap-1.5 ${subtextClass}`}>
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {personal.location}
                </span>
              )}
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className={`flex items-center gap-1.5 hover:underline ${subtextClass}`}
                >
                  <Mail className="w-4 h-4 text-slate-400" />
                  {personal.email}
                </a>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {personal.email && (
                <a
                  href={`mailto:${personal.email}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: accentHex }}
                >
                  <Send className="w-4 h-4" />
                  <span>Get in Touch</span>
                </a>
              )}

              {!isPublic && resume?.url && (
                <a
                  href={resume.url}
                  download={resume.filename || `${personal.fullName || 'developer'}_Resume.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all hover:scale-105"
                >
                  <Download className="w-4 h-4" style={{ color: accentHex }} />
                  <span>Download Resume</span>
                </a>
              )}

              {/* Social icons */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                {socialLinks?.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    aria-label="GitHub Profile"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {socialLinks?.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                {socialLinks?.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    aria-label="Twitter Profile"
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                )}
                {socialLinks?.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    aria-label="Personal Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Avatar Hero Card */}
          <div className="relative group shrink-0">
            <div
              className="absolute inset-0 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"
              style={{ backgroundColor: accentHex }}
            />
            {personal.avatarUrl ? (
              <img
                src={personal.avatarUrl}
                alt={personal.fullName}
                className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl object-cover border-4 border-slate-800/80 shadow-2xl"
              />
            ) : (
              <div
                className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-3xl flex items-center justify-center font-bold text-5xl bg-slate-900 border-4 border-slate-800 shadow-2xl"
                style={{ color: accentHex }}
              >
                {personal.fullName ? personal.fullName.charAt(0).toUpperCase() : 'A'}
              </div>
            )}
          </div>
        </section>

        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5" style={{ color: accentHex }} />
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">Technical Arsenal</h2>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900/80 text-slate-200 border border-slate-800/90 hover:border-slate-600 transition-all hover:scale-105 flex items-center gap-1.5 shadow-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentHex }} />
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects Section */}
        {projects.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">Featured Work & Projects</h2>
                <p className={`text-xs sm:text-sm ${subtextClass}`}>
                  Production applications, developer tooling, and distributed systems.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj, idx) => (
                <div
                  key={proj.id || idx}
                  className={`rounded-2xl border ${cardClass} overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1.5`}
                >
                  {/* Image container */}
                  <div className="relative h-44 w-full bg-slate-950/80 overflow-hidden">
                    {proj.imageUrl ? (
                      <img
                        src={proj.imageUrl}
                        alt={proj.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 space-y-1 p-4 bg-gradient-to-br from-slate-900 to-slate-950">
                        <Code2 className="w-8 h-8 opacity-40" />
                        <span className="text-xs">{proj.name}</span>
                      </div>
                    )}

                    {proj.featured && (
                      <div className="absolute top-3 right-3">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-md"
                          style={{ backgroundColor: accentHex }}
                        >
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-base text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {proj.name}
                      </h3>
                      <p className={`text-xs leading-relaxed line-clamp-3 ${subtextClass}`}>
                        {proj.description}
                      </p>
                    </div>

                    {/* Tech stack */}
                    <div className="space-y-3 pt-2 border-t border-slate-800/80">
                      <div className="flex flex-wrap gap-1.5">
                        {proj.technologies?.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Links */}
                      <div className="flex items-center justify-between pt-2">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                            <span>Source Code</span>
                          </a>
                        )}

                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold hover:underline ml-auto"
                            style={{ color: accentHex }}
                          >
                            <span>Live App</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience & Education Section (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Experience Column */}
          {experience.length > 0 && (
            <section className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" style={{ color: accentHex }} />
                <h2 className="text-xl sm:text-2xl font-bold font-display text-white">Experience</h2>
              </div>

              <div className="space-y-4 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
                {experience.map((exp, idx) => (
                  <div key={exp.id || idx} className="relative pl-9 group">
                    <div
                      className="absolute left-2 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 transition-transform group-hover:scale-125"
                      style={{ backgroundColor: accentHex }}
                    />

                    <div className={`p-5 rounded-2xl border ${cardClass} space-y-2`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div>
                          <h3 className="font-bold text-sm text-white">{exp.role}</h3>
                          <p className="text-xs font-semibold" style={{ color: accentHex }}>
                            {exp.company}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {exp.startDate} â€” {exp.endDate || 'Present'}
                        </span>
                      </div>

                      <p className={`text-xs leading-relaxed whitespace-pre-line ${subtextClass}`}>
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education & Certs Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Education */}
            {education.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" style={{ color: accentHex }} />
                  <h2 className="text-xl font-bold font-display text-white">Education</h2>
                </div>

                <div className="space-y-3">
                  {education.map((edu, idx) => (
                    <div key={edu.id || idx} className={`p-4 rounded-xl border ${cardClass} space-y-1`}>
                      <h3 className="font-bold text-sm text-white">
                        {edu.degree} in {edu.field}
                      </h3>
                      <p className="text-xs text-slate-300">{edu.institution}</p>
                      <p className="text-[11px] text-slate-500">
                        {edu.startDate} â€” {edu.endDate}
                      </p>
                      {edu.description && (
                        <p className={`text-xs pt-1 ${subtextClass}`}>{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications & Achievements */}
            {(certifications.length > 0 || achievements.length > 0) && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" style={{ color: accentHex }} />
                  <h2 className="text-xl font-bold font-display text-white">Honors & Certs</h2>
                </div>

                <div className="space-y-2.5">
                  {certifications.map((cert, idx) => (
                    <div key={cert.id || idx} className={`p-3.5 rounded-xl border ${cardClass} space-y-1`}>
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-xs text-white">{cert.name}</span>
                        {cert.date && <span className="text-[10px] text-slate-500">{cert.date}</span>}
                      </div>
                      <p className="text-[11px] text-slate-400">{cert.issuer}</p>
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] flex items-center gap-1 hover:underline"
                          style={{ color: accentHex }}
                        >
                          <ExternalLink className="w-3 h-3" /> Verify Link
                        </a>
                      )}
                    </div>
                  ))}

                  {achievements.map((ach, idx) => (
                    <div key={ach.id || idx} className={`p-3.5 rounded-xl border ${cardClass} space-y-1`}>
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-xs text-white">{ach.title}</span>
                        {ach.date && <span className="text-[10px] text-slate-500">{ach.date}</span>}
                      </div>
                      <p className={`text-xs ${subtextClass}`}>{ach.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer Contact Banner */}
        <section className={`p-8 rounded-3xl border ${cardClass} text-center space-y-4 shadow-2xl`}>
          <h2 className="text-2xl font-bold font-display text-white">Let's build something remarkable together.</h2>
          <p className={`text-sm max-w-md mx-auto ${subtextClass}`}>
            Currently available for engineering positions, contract roles, and open-source collaborations.
          </p>
          <div className="pt-2">
            {personal.email && (
              <a
                href={`mailto:${personal.email}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-sm text-white shadow-xl hover:opacity-95 transition-all hover:scale-105"
                style={{ backgroundColor: accentHex }}
              >
                <Mail className="w-4 h-4" />
                <span>Send a Message</span>
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};


