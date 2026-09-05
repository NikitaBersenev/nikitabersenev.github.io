import React from 'react';
import {
  Code2,
  FolderGit2,
  BookOpen,
  Settings,
  Sun,
  Moon,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Github } from './Icons';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { GitHubUser } from '@/lib/github';

interface NavbarProps {
  currentUsername: string;
  userProfile: GitHubUser | null;
  activeTab: 'projects' | 'blog' | 'about';
  setActiveTab: (tab: 'projects' | 'blog' | 'about') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenSettings: () => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  remainingRateLimit?: number | null;
}

export function Navbar({
  currentUsername,
  userProfile,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenSettings,
  isDark,
  setIsDark,
  remainingRateLimit,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => setActiveTab('projects')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary transition-all group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-base sm:text-lg flex items-center gap-1.5">
                DevPortfolio
                <span className="text-primary font-mono text-xs font-semibold px-1.5 py-0.5 rounded bg-primary/10">
                  v2.0
                </span>
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'projects'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              Projects
            </button>
            <button
              onClick={() => setActiveTab('blog')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'blog'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Blog
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'about'
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              About & Skills
            </button>
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search for projects */}
          {activeTab === 'projects' && (
            <div className="relative hidden sm:block w-44 lg:w-60">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search repos or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 text-xs"
              />
            </div>
          )}

          {/* Active GitHub User Badge & Settings Trigger */}
          <button
            onClick={onOpenSettings}
            title="Configure GitHub Username & API Token"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/80 bg-card hover:bg-muted/60 text-xs font-mono transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline font-semibold">@{currentUsername}</span>
            <Settings className="w-3.5 h-3.5 text-muted-foreground ml-1" />
          </button>

          {/* GitHub Rate Limit Indicator */}
          {remainingRateLimit !== undefined && remainingRateLimit !== null && (
            <div className="hidden xl:block">
              <Badge variant="outline" className="text-[11px] font-mono py-0.5">
                API: {remainingRateLimit} reqs left
              </Badge>
            </div>
          )}

          {/* Direct GitHub Profile Link */}
          <a
            href={userProfile?.html_url || `https://github.com/${currentUsername}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-card hover:bg-muted text-foreground transition-colors"
            title="Open GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Theme Switcher */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-lg h-9 w-9 text-muted-foreground hover:text-foreground"
            title="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile sub-bar for search */}
      {activeTab === 'projects' && (
        <div className="sm:hidden px-4 py-2 border-t border-border/40 bg-muted/20">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search projects or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 text-xs w-full"
            />
          </div>
        </div>
      )}
    </header>
  );
}
