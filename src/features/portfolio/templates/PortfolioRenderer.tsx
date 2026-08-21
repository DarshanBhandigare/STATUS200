import React from 'react';
import { Portfolio, PortfolioContent, ThemeSettings, TemplateId } from '@/types/portfolio';
import { TerminalTemplate } from './TerminalTemplate';
import { ModernTemplate } from './ModernTemplate';
import { ProfessionalTemplate } from './ProfessionalTemplate';

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

  const fontClass = getFontFamilyClass(theme.fontStyle);

  const renderSelectedTemplate = () => {
    switch (template) {
      case 'minimal':
        return <TerminalTemplate content={content} theme={theme} isPublic={isPublic} />;
      case 'modern':
        return <ModernTemplate content={content} theme={theme} isPublic={isPublic} />;
      case 'professional':
        return <ProfessionalTemplate content={content} theme={theme} isPublic={isPublic} />;
      default:
        return <TerminalTemplate content={content} theme={theme} isPublic={isPublic} />;
    }
  };

  return (
    <div
      className={`portfolio-rendered ${
        theme.darkMode ? 'portfolio-rendered-dark' : 'portfolio-rendered-light'
      } w-full min-h-full ${fontClass}`}
      style={
        {
          '--accent-color': theme.accentColor,
        } as React.CSSProperties
      }
    >
      {renderSelectedTemplate()}
    </div>
  );
};
