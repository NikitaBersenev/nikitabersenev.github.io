import React, { useState, useEffect, useMemo } from 'react';
import {
  FolderGit2,
  Filter,
  Search,
  Loader2,
  RefreshCw,
  Sparkles,
  SlidersHorizontal,
  Code2,
} from 'lucide-react';
import { siteConfig } from './config';
import { GitHubService, GitHubRepo, GitHubUser, RateLimitInfo } from './lib/github';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectQuickSwitcher } from './components/ProjectQuickSwitcher';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { BlogSection } from './components/BlogSection';
import { AboutSection } from './components/AboutSection';
import { SettingsModal } from './components/SettingsModal';
import { Footer } from './components/Footer';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';

export function App() {
  const [username, setUsername] = useState<string>(() =>
    GitHubService.getSavedUsername(siteConfig.githubUsername)
  );
  const [userProfile, setUserProfile] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [rateLimit, setRateLimit] = useState<RateLimitInfo | null>(null);

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<'projects' | 'blog' | 'about'>('projects');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'name'>('stars');

  // Modal & Quick Switcher
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [quickSwitcherIndex, setQuickSwitcherIndex] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Dark mode (default to true)
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme_dark');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('theme_dark', String(isDark));
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Fetch GitHub Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [profile, fetchedRepos, rate] = await Promise.all([
        GitHubService.getUserProfile(username),
        GitHubService.getUserRepos(username),
        GitHubService.getRateLimit(),
      ]);

      setUserProfile(profile);
      setRepos(fetchedRepos);
      setRateLimit(rate);
      setQuickSwitcherIndex(0);
    } catch (err) {
      console.error('Failed to load GitHub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [username]);

  // Extract unique languages for filter pill buttons
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((r) => {
      if (r.language) langs.add(r.language);
    });
    return Array.from(langs).sort();
  }, [repos]);

  // Filter and sort repos
  const filteredRepos = useMemo(() => {
    let list = repos.filter((r) => {
      // Strictly ignore private repositories
      if (r.private) return false;

      // Excluded repos filter
      if (siteConfig.excludedRepos.includes(r.name)) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesDesc = r.description?.toLowerCase().includes(q) || false;
        const matchesTopic = r.topics?.some((t) => t.toLowerCase().includes(q)) || false;
        const matchesLang = r.language?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesDesc && !matchesTopic && !matchesLang) {
          return false;
        }
      }

      // Language filter
      if (selectedLanguage !== 'all' && r.language !== selectedLanguage) {
        return false;
      }

      return true;
    });

    // Sort repos
    list.sort((a, b) => {
      // Prioritize featured repos from config first
      const isAFeatured = siteConfig.featuredRepos.includes(a.name);
      const isBFeatured = siteConfig.featuredRepos.includes(b.name);
      if (isAFeatured && !isBFeatured) return -1;
      if (!isAFeatured && isBFeatured) return 1;

      if (sortBy === 'stars') {
        return (b.stargazers_count || 0) - (a.stargazers_count || 0);
      }
      if (sortBy === 'updated') {
        return (
          new Date(b.pushed_at || b.updated_at).getTime() -
          new Date(a.pushed_at || a.updated_at).getTime()
        );
      }
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [repos, searchQuery, selectedLanguage, sortBy]);

  const handleOpenDetails = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Header / Navbar */}
      <Navbar
        currentUsername={username}
        userProfile={userProfile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isDark={isDark}
        setIsDark={setIsDark}
        remainingRateLimit={rateLimit?.remaining}
      />

      {/* Hero Profile Banner */}
      <Hero
        userProfile={userProfile}
        repos={repos}
        currentUsername={username}
        onBrowseProjects={() => {
          setActiveTab('projects');
          const el = document.getElementById('projects-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onReadBlog={() => {
          setActiveTab('blog');
          const el = document.getElementById('main-content');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="container mx-auto px-4 sm:px-6 flex-1 py-8">
        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <section id="projects-section" className="space-y-8">
            {/* Quick Project Switcher Carousel (Arrow & Hotkey flipping) */}
            {!loading && filteredRepos.length > 0 && (
              <ProjectQuickSwitcher
                repos={filteredRepos}
                selectedIndex={quickSwitcherIndex}
                onSelectIndex={(idx) => setQuickSwitcherIndex(idx)}
                onOpenDetails={handleOpenDetails}
              />
            )}

            {/* Filter & Sort Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/60">
              {/* Language Pills */}
              <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setSelectedLanguage('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedLanguage === 'all'
                      ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                      : 'bg-muted/80 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  All ({repos.length})
                </button>
                {availableLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                        : 'bg-muted/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown & Refresh */}
              <div className="flex items-center gap-2.5 self-end md:self-auto">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 border border-border/80 rounded-lg p-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 ml-1 text-primary" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-none text-foreground font-medium text-xs focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="stars" className="bg-background">Most Stars</option>
                    <option value="updated" className="bg-background">Recently Updated</option>
                    <option value="name" className="bg-background">Alphabetical</option>
                  </select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={loadData}
                  disabled={loading}
                  className="h-8 w-8 p-0"
                  title="Refresh Repositories"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Repositories Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                <Loader2 className="w-9 h-9 animate-spin text-primary" />
                <p className="text-sm font-mono">Loading repositories from GitHub API...</p>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-border rounded-2xl p-8">
                <FolderGit2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                <h3 className="text-lg font-bold text-foreground mb-1">No repositories found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                  {searchQuery
                    ? `No projects matching "${searchQuery}". Try adjusting your search term or language filter.`
                    : 'No public repositories found for this user.'}
                </p>
                {searchQuery && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLanguage('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRepos.map((repo) => (
                  <ProjectCard
                    key={repo.id}
                    repo={repo}
                    onOpenDetails={handleOpenDetails}
                    isFeatured={siteConfig.featuredRepos.includes(repo.name)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* BLOG TAB */}
        {activeTab === 'blog' && <BlogSection posts={siteConfig.blogPosts} />}

        {/* ABOUT & SKILLS TAB */}
        {activeTab === 'about' && <AboutSection />}
      </main>

      {/* Project Detail Modal (README, Screenshots, Docs, Stats) */}
      <ProjectDetailModal
        repo={selectedRepo}
        allRepos={filteredRepos.length > 0 ? filteredRepos : repos}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSelectRepo={(newRepo) => setSelectedRepo(newRepo)}
      />

      {/* GitHub Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUsername={username}
        onSaveUsername={(newUsername) => setUsername(newUsername)}
        onReload={loadData}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
