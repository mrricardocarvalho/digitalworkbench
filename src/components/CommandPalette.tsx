import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../utils/analytics';
import './CommandPalette.css';

interface CommandPaletteProps {
  onShowPerformanceDashboard?: () => void;
  onShowAuditDashboard?: () => void;
  onShowErrorMonitoring?: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ onShowPerformanceDashboard, onShowAuditDashboard, onShowErrorMonitoring }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { trackUserJourney, getWebVitals, checkPerformanceBudget } = useAnalytics();

  // Toggle with ctrl+k (Windows) or cmd+k (Mac)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((open) => !open);
        
        // Track command palette usage
        if (!open) {
          trackUserJourney('command_palette_opened', {
            trigger: 'keyboard_shortcut',
            page: window.location.pathname
          });
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [trackUserJourney, open]);

  const runCommand = React.useCallback((command: () => void, commandName: string) => {
    setOpen(false);
    
    // Track command execution
    trackUserJourney('command_executed', {
      command: commandName,
      page: window.location.pathname
    });
    
    command();
  }, [trackUserJourney]);

  const showPerformanceInfo = () => {
    const vitals = getWebVitals();
    const budget = checkPerformanceBudget();
    
    console.group('🚀 Performance Metrics');
    console.log('Web Vitals:', vitals);
    console.log('Performance Budget:', budget);
    console.log('Overall Status:', budget.passing ? '✅ Passing' : '⚠️ Needs Attention');
    if (budget.violations.length > 0) {
      console.warn('Violations:', budget.violations);
    }
    console.groupEnd();
    
    alert(`Performance Status: ${budget.passing ? '✅ Passing' : '⚠️ Needs Attention'}\n\nCheck console for detailed metrics.`);
  };

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
      <Command.Input placeholder="Type a command or search..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Navigation">
          <Command.Item onSelect={() => runCommand(() => navigate('/'), 'navigate_home')}>
            🏠 Home
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => navigate('/resume'), 'navigate_resume')}>
            📄 Resume
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => navigate('/projects'), 'navigate_projects')}>
            💼 Projects
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => navigate('/insights'), 'navigate_insights')}>
            📝 Articles & Insights
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => navigate('/search'), 'navigate_search')}>
            🔍 Search
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Go To">
           <Command.Item onSelect={() => runCommand(() => navigate('/#projects'), 'scroll_to_projects')}>
            📁 Projects Section
          </Command.Item>
           <Command.Item onSelect={() => runCommand(() => navigate('/#insights'), 'scroll_to_insights')}>
            💡 Insights Section
          </Command.Item>
           <Command.Item onSelect={() => runCommand(() => navigate('/#contact'), 'scroll_to_contact')}>
            📧 Contact Section
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Performance & Analytics">
          <Command.Item onSelect={() => runCommand(() => {
            if (onShowPerformanceDashboard) {
              onShowPerformanceDashboard();
            }
          }, 'show_performance_dashboard')}>
            📊 Performance Dashboard
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => {
            if (onShowAuditDashboard) {
              onShowAuditDashboard();
            }
          }, 'show_audit_dashboard')}>
            🔍 SEO & Accessibility Audit
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => {
            if (onShowErrorMonitoring) {
              onShowErrorMonitoring();
            }
          }, 'show_error_monitoring')}>
            🚨 Error Monitoring
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => showPerformanceInfo(), 'show_performance_info')}>
            ⚡ Quick Performance Check
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => {
            trackUserJourney('manual_performance_tracking', {
              page: window.location.pathname,
              trigger: 'command_palette'
            });
            console.log('Performance tracking event sent');
          }, 'track_performance')}>
            📈 Track Current Page
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Actions">
          <Command.Item onSelect={() => runCommand(() => window.open('mailto:ricardo.sampaio@gmail.com'), 'send_email')}>
            ✉️ Send Email
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => window.open('https://www.linkedin.com/in/ricardo-carvalho-05741519'), 'open_linkedin')}>
            💼 LinkedIn Profile
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => window.open('https://github.com/mrricardocarvalho'), 'open_github')}>
            🐱 GitHub Profile
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => {
            const scrollTop = document.querySelector('.scroll-to-top') as HTMLButtonElement;
            if (scrollTop) scrollTop.click();
          }, 'scroll_to_top')}>
            ⬆️ Scroll to Top
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Theme">
          <Command.Item onSelect={() => runCommand(() => {
            const toggleButton = document.querySelector('[data-theme-toggle]') as HTMLButtonElement;
            if (toggleButton) toggleButton.click();
          }, 'toggle_theme')}>
            🌙 Toggle Theme
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Developer Tools">
          <Command.Item onSelect={() => runCommand(() => {
            console.clear();
            console.log('🧹 Console cleared');
          }, 'clear_console')}>
            🧹 Clear Console
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            console.log('📋 URL copied:', url);
          }, 'copy_url')}>
            📋 Copy Current URL
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => {
            window.open(window.location.href + '?debug=true', '_blank');
          }, 'open_debug_mode')}>
            🐛 Open in Debug Mode
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
};

export default CommandPalette;