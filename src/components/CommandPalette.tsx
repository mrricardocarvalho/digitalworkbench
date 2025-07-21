import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import './CommandPalette.css';

const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Toggle with cmd+k
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu">
      <Command.Input placeholder="Type a command or search..." />
      <Command.List>
        <Command.Empty>No results found.</Command.Empty>

        <Command.Group heading="Navigation">
          <Command.Item onSelect={() => runCommand(() => navigate('/'))}>
            Home
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => navigate('/resume'))}>
            Resume
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Go To">
           <Command.Item onSelect={() => runCommand(() => navigate('/#projects'))}>
            Projects
          </Command.Item>
           <Command.Item onSelect={() => runCommand(() => navigate('/#insights'))}>
            Articles & Insights
          </Command.Item>
           <Command.Item onSelect={() => runCommand(() => navigate('/#contact'))}>
            Contact
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Actions">
          <Command.Item onSelect={() => runCommand(() => window.open('mailto:ricardo@example.com'))}>
            Send Email
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => window.open('https://linkedin.com/in/ricardocarvalho'))}>
            LinkedIn Profile
          </Command.Item>
          <Command.Item onSelect={() => runCommand(() => window.open('https://github.com/ricardocarvalho'))}>
            GitHub Profile
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Theme">
          <Command.Item onSelect={() => runCommand(() => {
            const toggleButton = document.querySelector('[data-theme-toggle]') as HTMLButtonElement;
            if (toggleButton) toggleButton.click();
          })}>
            Toggle Theme
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
};

export default CommandPalette;