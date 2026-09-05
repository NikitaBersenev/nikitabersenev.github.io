import React from 'react';
import {
  Send,
  Mail,
  MapPin,
  Star,
  GitFork,
  BookOpen,
  FolderGit2,
  Sparkles,
} from 'lucide-react';
import { Github, Twitter, Linkedin } from './Icons';
import { siteConfig } from '@/config';
import { GitHubUser, GitHubRepo } from '@/lib/github';
import { formatNumber } from '@/lib/utils';
import { Button } from './ui/button';

interface HeroProps {
  userProfile: GitHubUser | null;
  repos: GitHubRepo[];
  currentUsername: string;
  onBrowseProjects: () => void;
  onReadBlog: () => void;
  onOpenSettings: () => void;
}

export function Hero({
  userProfile,
  repos,
  currentUsername,
  onBrowseProjects,
  onReadBlog,
  onOpenSettings,
}: HeroProps) {
  // Aggregate stats from repos
  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);

  const displayName = userProfile?.name || siteConfig.name;
  const displayBio = userProfile?.bio || siteConfig.bio;
  const displayAvatar =
    userProfile?.avatar_url ||
    siteConfig.avatarUrl ||
    `https://github.com/${currentUsername}.png`;
  const displayLocation = userProfile?.location || siteConfig.location;

  return (
    <section className="relative overflow-hidden pt-10 pb-8 sm:pt-14 sm:pb-12 border-b border-border/60 bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background glowing gradient accents */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Avatar with gradient border */}
          <div className="relative group shrink-0">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary to-cyan-500 opacity-60 blur-sm group-hover:opacity-100 transition duration-300" />
            <img
              src={displayAvatar}
              alt={displayName}
              className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-2 border-background shadow-xl"
              onError={(e) => {
                // fallback if broken avatar URL
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  displayName
                )}&background=0284c7&color=fff&size=200`;
              }}
            />
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1 border-2 border-background shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground">
                {displayName}
              </h1>
              <span className="text-muted-foreground font-mono text-sm sm:text-base font-medium">
                @{currentUsername}
              </span>
            </div>

            <p className="text-primary font-medium text-sm sm:text-base mb-3">
              {siteConfig.tagline}
            </p>

            <p className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed mb-4">
              {displayBio}
            </p>

            {/* Location & Social Icons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs sm:text-sm text-muted-foreground mb-6">
              {displayLocation && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {displayLocation}
                </span>
              )}
              {siteConfig.email && (
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-primary" />
                  {siteConfig.email}
                </a>
              )}
              {siteConfig.socials.github && (
                <a
                  href={userProfile?.html_url || siteConfig.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Github className="w-3.5 h-3.5" />
                  GitHub
                </a>
              )}
              {siteConfig.socials.telegram && (
                <a
                  href={siteConfig.socials.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Telegram
                </a>
              )}
              {siteConfig.socials.twitter && (
                <a
                  href={siteConfig.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Twitter className="w-3.5 h-3.5" />
                  Twitter
                </a>
              )}
              {siteConfig.socials.linkedin && (
                <a
                  href={siteConfig.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5" />
                  LinkedIn
                </a>
              )}
            </div>

            {/* Quick Metrics Bar & Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-3 bg-muted/60 border border-border/80 rounded-xl px-3.5 py-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <FolderGit2 className="w-4 h-4 text-primary" />
                  <span>{repos.length}</span>
                  <span className="text-muted-foreground font-normal">repos</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{formatNumber(totalStars)}</span>
                  <span className="text-muted-foreground font-normal">stars</span>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <GitFork className="w-4 h-4 text-cyan-500" />
                  <span>{formatNumber(totalForks)}</span>
                  <span className="text-muted-foreground font-normal">forks</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" onClick={onBrowseProjects} className="gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5" />
                  Explore Projects
                </Button>
                <Button variant="outline" size="sm" onClick={onReadBlog} className="gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Read Blog
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
