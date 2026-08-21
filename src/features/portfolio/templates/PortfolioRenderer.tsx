import React from 'react';
import { Portfolio, PortfolioContent, ThemeSettings, TemplateId } from '@/types/portfolio';
import { TerminalTemplate } from './TerminalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';
import { DEFAULT_THEME_SETTINGS, EMPTY_PORTFOLIO_CONTENT } from '@/features/portfolio/defaults';

interface PortfolioRendererProps {
  portfolio?: Portfolio;
  content: PortfolioContent;
  theme: ThemeSettings;
  template: TemplateId;
  isPublic?: boolean;
}

export const PortfolioRenderer: React.FC<PortfolioRendererProps> = ({
  content,
  theme,
  template,
  isPublic = false,
}) => {
  const safeTheme = theme ?? DEFAULT_THEME_SETTINGS;
  const safeContent = content ?? EMPTY_PORTFOLIO_CONTENT;

  const getFontFamilyClass = (fontStyle?: string) => {
    switch (fontStyle) {
      case 'plus-jakarta':
        return 'font-sans';
      case 'mono':
        return 'font-mono';
      case 'serif':
        return 'font-serif';
      case 'inter':
      default:
        return 'font-sans';
    }
  };

  const fontClass = getFontFamilyClass(safeTheme.fontStyle);

  const renderSelectedTemplate = () => {
    switch (template) {
      case 'minimal':
        return <TerminalTemplate content={safeContent} theme={safeTheme} isPublic={isPublic} />;
      case 'modern':
        return <ModernTemplate content={safeContent} theme={safeTheme} isPublic={isPublic} />;
      case 'professional':
        return <ProfessionalTemplate content={safeContent} theme={safeTheme} isPublic={isPublic} />;
      default:
        return <TerminalTemplate content={safeContent} theme={safeTheme} isPublic={isPublic} />;
    }
  };

  return (
    <div
      className={`portfolio-rendered ${
        safeTheme.darkMode ? 'portfolio-rendered-dark' : 'portfolio-rendered-light'
      } w-full min-h-full ${fontClass}`}
      style={
        {
          '--accent-color': safeTheme.accentColor,
        } as React.CSSProperties
      }
    >
      {renderSelectedTemplate()}
    </div>
  );
};
