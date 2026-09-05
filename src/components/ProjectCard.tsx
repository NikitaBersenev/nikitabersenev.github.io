import React from 'react';
import {
  Star,
  GitFork,
  ExternalLink,
  BookOpen,
  Calendar,
  FolderGit2,
  FileCode,
} from 'lucide-react';
import { Github } from './Icons';
import { GitHubRepo } from '@/lib/github';
import { formatNumber, formatTimeAgo } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface ProjectCardProps {
  repo: GitHubRepo;
  onOpenDetails: (repo: GitHubRepo) => void;
  isFeatured?: boolean;
}

// Color map for primary language dots
const languageColors: Record<string, string> = {
  TypeScript: 'bg-blue-500',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-emerald-500',
  Go: 'bg-cyan-500',
  Rust: 'bg-orange-600',
  HTML: 'bg-red-500',
  CSS: 'bg-indigo-500',
  Java: 'bg-amber-700',
  'C++': 'bg-pink-600',
  C: 'bg-slate-500',
  PHP: 'bg-purple-500',
  Ruby: 'bg-red-600',
  Astro: 'bg-orange-500',
};

export function ProjectCard({ repo, onOpenDetails, isFeatured }: ProjectCardProps) {
  const langColor = (repo.language && languageColors[repo.language]) || 'bg-primary';

  return (
    <Card className="group flex flex-col justify-between hover:border-primary/50 hover:shadow-xl transition-all duration-300 relative overflow-hidden bg-card/90 backdrop-blur-sm">
      {/* Featured ribbon if pinned */}
      {isFeatured && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-l from-primary to-cyan-500 text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
            Featured
          </div>
        </div>
      )}

      <div>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-primary shrink-0 group-hover:bg-primary/10 transition-colors">
                <FolderGit2 className="h-4 w-4" />
              </div>
              <CardTitle className="text-base sm:text-lg group-hover:text-primary transition-colors truncate">
                <button
                  onClick={() => onOpenDetails(repo)}
                  className="text-left hover:underline truncate"
                  title={repo.name}
                >
                  {repo.name}
                </button>
              </CardTitle>
            </div>

            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors p-1"
              title="Open GitHub Repository"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>

          <CardDescription className="mt-2 text-xs sm:text-sm line-clamp-3 min-h-[3rem]">
            {repo.description || 'No description provided for this repository.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-3">
          {/* Topics */}
          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {repo.topics.slice(0, 4).map((topic) => (
                <span
                  key={topic}
                  className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted/80 text-muted-foreground border border-border/40"
                >
                  {topic}
                </span>
              ))}
              {repo.topics.length > 4 && (
                <span className="text-[10px] text-muted-foreground self-center">
                  +{repo.topics.length - 4}
                </span>
              )}
            </div>
          )}

          {/* Repo metrics */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/50">
            {repo.language && (
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <span className={`w-2.5 h-2.5 rounded-full ${langColor}`} />
                <span>{repo.language}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{formatNumber(repo.stargazers_count)}</span>
            </div>

            <div className="flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-cyan-500" />
              <span>{formatNumber(repo.forks_count)}</span>
            </div>

            <div className="flex items-center gap-1 ml-auto text-[11px]">
              <Calendar className="w-3 h-3" />
              <span>{formatTimeAgo(repo.pushed_at || repo.updated_at)}</span>
            </div>
          </div>
        </CardContent>
      </div>

      {/* Card Footer Actions */}
      <CardFooter className="pt-3 border-t border-border/60 flex items-center justify-between gap-2 bg-muted/10">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onOpenDetails(repo)}
          className="flex-1 text-xs gap-1.5 font-medium"
        >
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          View README & Docs
        </Button>

        {repo.homepage && (
          <a
            href={repo.homepage}
            target="_blank"
            rel="noreferrer"
            className="inline-flex"
            title="Live Demo"
          >
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
