import React from 'react';
import { Sparkles } from 'lucide-react';
import { Github } from './Icons';
import { siteConfig } from '@/config';

export function Footer() {
  return (
    <footer className="border-t border-border/70 py-8 sm:py-10 bg-muted/20 text-xs text-muted-foreground mt-16">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span>
            {siteConfig.name} • Built with React, Tailwind CSS & shadcn/ui
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            Ready for <strong className="text-foreground">GitHub Pages</strong>
          </span>
          <span>•</span>
          <a
            href={siteConfig.socials.github || 'https://github.com'}
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
