import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { GithubIcon, TwitterIcon, LinkedinIcon } from '@/components/common/SocialIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-glow">
                <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="font-display font-bold text-lg text-white">Status 200</span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              The modern portfolio builder designed specifically for computer science students, junior developers, and tech interns. Build and publish a recruiter-ready portfolio in minutes without coding.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-md hover:bg-slate-900"
                aria-label="Status 200 on GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-md hover:bg-slate-900"
                aria-label="Status 200 on Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-md hover:bg-slate-900"
                aria-label="Status 200 on LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-200 mb-3">
              Product
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-slate-200 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-slate-200 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-slate-200 transition-colors">
                  Templates
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-slate-200 transition-colors">
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Templates */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-200 mb-3">
              Templates
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#templates" className="hover:text-slate-200 transition-colors">
                  Minimal Terminal
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-slate-200 transition-colors">
                  Modern Visual
                </a>
              </li>
              <li>
                <a href="#templates" className="hover:text-slate-200 transition-colors">
                  Professional Recruiter
                </a>
              </li>
              <li>
                <span className="text-slate-500 italic">More templates coming soon</span>
              </li>
            </ul>
          </div>

          {/* Legal / Company */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-200 mb-3">
              Legal & About
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/login" className="hover:text-slate-200 transition-colors">
                  Account Sign In
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-slate-200 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Status 200. Crafted for future engineers & developers.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with precision for students worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
