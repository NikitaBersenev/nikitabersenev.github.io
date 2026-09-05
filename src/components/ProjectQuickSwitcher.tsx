import React, { useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  GitFork,
  ExternalLink,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { GitHubRepo } from '@/lib/github';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { formatNumber } from '@/lib/utils';

interface ProjectQuickSwitcherProps {
  repos: GitHubRepo[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  onOpenDetails: (repo: GitHubRepo) => void;
}

export function ProjectQuickSwitcher({
  repos,
  selectedIndex,
  onSelectIndex,
  onOpenDetails,
}: ProjectQuickSwitcherProps) {
  if (repos.length === 0) return null;

  const currentRepo = repos[selectedIndex] || repos[0];

  const handlePrev = () => {
    onSelectIndex((selectedIndex - 1 + repos.length) % repos.length);
  };

  const handleNext = () => {
    onSelectIndex((selectedIndex + 1) % repos.length);
  };

  // Keyboard navigation support: Left / Right arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'k') {
        handlePrev();
      } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'j') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, repos.length]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-card via-card to-primary/5 p-4 sm:p-6 shadow-lg mb-10">
      {/* Top indicator & navigation controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-xs sm:text-sm font-semibold text-foreground uppercase tracking-wider">
            Quick Project Carousel
          </span>
          <Badge variant="outline" className="font-mono text-xs ml-1">
            {selectedIndex + 1} / {repos.length}
          </Badge>
        </div>

        {/* Hotkey tip & arrows */}
        <div className="flex items-center gap-2">
          <span className="hidden md:inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px]">←</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px]">→</kbd>
            to switch
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            className="h-8 w-8 p-0"
            title="Previous project (Left Arrow / K)"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            className="h-8 w-8 p-0"
            title="Next project (Right Arrow / J)"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main active project preview showcase */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <h3
              onClick={() => onOpenDetails(currentRepo)}
              className="text-xl sm:text-2xl font-bold tracking-tight text-foreground hover:text-primary cursor-pointer transition-colors"
            >
              {currentRepo.name}
            </h3>

            {currentRepo.language && (
              <Badge variant="secondary" className="font-mono text-xs">
                {currentRepo.language}
              </Badge>
            )}

            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {formatNumber(currentRepo.stargazers_count)}
              </span>
              <span className="flex items-center gap-1">
                <GitFork className="w-3.5 h-3.5 text-cyan-500" />
                {formatNumber(currentRepo.forks_count)}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-2 max-w-3xl mb-4">
            {currentRepo.description || 'No description provided for this repository.'}
          </p>

          {/* Topics */}
          {currentRepo.topics && currentRepo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {currentRepo.topics.slice(0, 5).map((topic) => (
                <span
                  key={topic}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50"
                >
                  #{topic}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0">
          {currentRepo.homepage && (
            <a
              href={currentRepo.homepage}
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ExternalLink className="w-3.5 h-3.5" />
                Live Demo
              </Button>
            </a>
          )}

          <Button
            size="sm"
            onClick={() => onOpenDetails(currentRepo)}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-md font-semibold text-xs sm:text-sm"
          >
            <BookOpen className="w-4 h-4" />
            Inspect Project (README & Docs)
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Mini thumbnail strip for instant jumping */}
      <div className="mt-5 pt-4 border-t border-border/50 overflow-x-auto pb-1 flex items-center gap-2 scrollbar-none">
        {repos.map((repo, idx) => (
          <button
            key={repo.id}
            onClick={() => onSelectIndex(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              idx === selectedIndex
                ? 'bg-primary text-primary-foreground shadow-sm font-semibold scale-105'
                : 'bg-muted/70 text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
            {repo.name}
          </button>
        ))}
      </div>
    </div>
  );
}
