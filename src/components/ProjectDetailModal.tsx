import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import {
  ExternalLink,
  Star,
  GitFork,
  BookOpen,
  Image as ImageIcon,
  FolderTree,
  BarChart3,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Clock,
  Loader2,
  FolderOpen,
  Info,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Github } from './Icons';
import {
  GitHubRepo,
  GitHubService,
  GitHubDocFile,
} from '@/lib/github';
import { formatNumber, formatDate, formatTimeAgo } from '@/lib/utils';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent } from './ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface ProjectDetailModalProps {
  repo: GitHubRepo | null;
  allRepos: GitHubRepo[];
  isOpen: boolean;
  onClose: () => void;
  onSelectRepo: (repo: GitHubRepo) => void;
}

export function ProjectDetailModal({
  repo,
  allRepos,
  isOpen,
  onClose,
  onSelectRepo,
}: ProjectDetailModalProps) {
  if (!repo) return null;

  const [activeTab, setActiveTab] = useState<'readme' | 'screenshots' | 'docs' | 'insights'>('readme');
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [loadingReadme, setLoadingReadme] = useState<boolean>(true);
  
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [loadingScreenshots, setLoadingScreenshots] = useState<boolean>(true);
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<string | null>(null);

  const [docsFiles, setDocsFiles] = useState<GitHubDocFile[]>([]);
  const [selectedDocFile, setSelectedDocFile] = useState<GitHubDocFile | null>(null);
  const [selectedDocContent, setSelectedDocContent] = useState<string>('');
  const [loadingDocs, setLoadingDocs] = useState<boolean>(false);

  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [copiedClone, setCopiedClone] = useState(false);

  // Find index in allRepos for Next/Previous switching
  const currentIndex = allRepos.findIndex((r) => r.id === repo.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectRepo(allRepos[currentIndex - 1]);
    } else {
      onSelectRepo(allRepos[allRepos.length - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < allRepos.length - 1) {
      onSelectRepo(allRepos[currentIndex + 1]);
    } else {
      onSelectRepo(allRepos[0]);
    }
  };

  // Keyboard navigation within modal: ArrowLeft / ArrowRight to switch repo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || selectedLightboxImage) return;
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, allRepos, selectedLightboxImage]);

  // Load repository details when repo changes
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setLoadingReadme(true);
      setLoadingScreenshots(true);
      setLoadingDocs(true);
      setSelectedDocFile(null);
      setSelectedDocContent('');

      // 1. Fetch README
      const rawReadme = await GitHubService.getRepoReadme(
        repo!.owner.login,
        repo!.name,
        repo!.default_branch
      );
      if (isCancelled) return;

      // Fix relative image links so they resolve properly
      const processedReadme = GitHubService.fixReadmeRelativeUrls(
        rawReadme,
        repo!.owner.login,
        repo!.name,
        repo!.default_branch
      );
      setReadmeContent(processedReadme);
      setLoadingReadme(false);

      // 2. Fetch Screenshots (from README + repo folders)
      const detectedImages = await GitHubService.getRepoScreenshots(
        repo!.owner.login,
        repo!.name,
        repo!.default_branch,
        rawReadme
      );
      if (isCancelled) return;
      setScreenshots(detectedImages);
      setLoadingScreenshots(false);

      // 3. Fetch Docs Files
      const docs = await GitHubService.getRepoDocs(repo!.owner.login, repo!.name);
      if (isCancelled) return;
      setDocsFiles(docs);
      setLoadingDocs(false);

      // If docs exist, auto-select first file
      if (docs.length > 0 && docs[0].download_url) {
        setSelectedDocFile(docs[0]);
        const content = await GitHubService.getFileContent(docs[0].download_url);
        if (!isCancelled) setSelectedDocContent(content);
      }

      // 4. Fetch Languages
      const langs = await GitHubService.getRepoLanguages(repo!.owner.login, repo!.name);
      if (!isCancelled) setLanguages(langs);
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [repo?.id]);

  // Handle clicking a doc file
  const handleSelectDoc = async (file: GitHubDocFile) => {
    setSelectedDocFile(file);
    if (file.download_url) {
      setSelectedDocContent('Loading documentation...');
      const content = await GitHubService.getFileContent(file.download_url);
      setSelectedDocContent(content);
    }
  };

  const handleCopyClone = () => {
    navigator.clipboard.writeText(`git clone ${repo.html_url}.git`);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  // Language percentage calculations
  const totalLangBytes = Object.values(languages).reduce((a, b) => a + b, 0);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      {/* Modal Header */}
      <DialogHeader onClose={onClose}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-2">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <span>{repo.name}</span>
                {repo.license && (
                  <Badge variant="outline" className="text-[11px] font-mono">
                    {repo.license.spdx_id || repo.license.name}
                  </Badge>
                )}
              </DialogTitle>
            </div>
            <DialogDescription className="truncate max-w-xl">
              {repo.description || 'No description provided.'}
            </DialogDescription>
          </div>

          {/* Switcher Arrows & Quick Repo Jump */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center border border-border/80 rounded-lg p-0.5 bg-background">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrev}
                className="h-7 w-7 p-0 rounded-md"
                title="Previous repository (←)"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-[11px] font-mono px-2 text-muted-foreground select-none">
                {currentIndex + 1} / {allRepos.length}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                className="h-7 w-7 p-0 rounded-md"
                title="Next repository (→)"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-mono">
                <Github className="w-3.5 h-3.5" />
                GitHub
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </Button>
            </a>

            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex"
              >
                <Button size="sm" className="h-8 gap-1.5 text-xs font-semibold">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Live Demo
                </Button>
              </a>
            )}
          </div>
        </div>
      </DialogHeader>

      {/* Tabs Navigation */}
      <div className="border-b border-border/70 px-6 pt-3 bg-muted/10 shrink-0">
        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
          <TabsList className="bg-muted/70 p-1">
            <TabsTrigger value="readme" className="gap-1.5 text-xs sm:text-sm">
              <BookOpen className="w-3.5 h-3.5" />
              README.md
            </TabsTrigger>
            <TabsTrigger value="screenshots" className="gap-1.5 text-xs sm:text-sm">
              <ImageIcon className="w-3.5 h-3.5" />
              Screenshots ({screenshots.length})
            </TabsTrigger>
            <TabsTrigger value="docs" className="gap-1.5 text-xs sm:text-sm">
              <FolderTree className="w-3.5 h-3.5" />
              Docs Folder ({docsFiles.length})
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-1.5 text-xs sm:text-sm">
              <BarChart3 className="w-3.5 h-3.5" />
              Tech Stack & Stats
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Modal Content */}
      <DialogContent className="p-0">
        {/* TAB 1: README */}
        {activeTab === 'readme' && (
          <div className="p-6">
            {loadingReadme ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-mono">Fetching README.md from GitHub...</p>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="font-mono font-semibold">README.md</span>
                    <span>• branch: {repo.default_branch}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(readmeContent);
                      alert('README copied to clipboard!');
                    }}
                    className="h-7 text-xs gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy Markdown
                  </Button>
                </div>

                <div className="markdown-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  >
                    {readmeContent}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SCREENSHOTS & MEDIA */}
        {activeTab === 'screenshots' && (
          <div className="p-6">
            {loadingScreenshots ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-mono">Scanning repository for screenshots...</p>
              </div>
            ) : screenshots.length === 0 ? (
              <div className="text-center py-16 px-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">
                  No Screenshots Detected
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  Add images inside your repository in a <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">screenshots/</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">assets/</code> folder, or embed them directly in your <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">README.md</code>, and they will automatically show up here.
                </p>
                {repo.homepage && (
                  <a href={repo.homepage} target="_blank" rel="noreferrer">
                    <Button size="sm" className="gap-1.5">
                      <ExternalLink className="w-4 h-4" />
                      Visit Live Demo
                    </Button>
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-xs text-muted-foreground font-mono">
                  Found {screenshots.length} media asset{screenshots.length > 1 ? 's' : ''} in repository. Click any image to expand.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {screenshots.map((src, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedLightboxImage(src)}
                      className="group relative rounded-xl border border-border/70 overflow-hidden bg-card/60 hover:border-primary/50 transition-all cursor-pointer shadow-sm hover:shadow-md aspect-video flex items-center justify-center"
                    >
                      <img
                        src={src}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <span className="flex items-center gap-1.5 text-xs font-semibold bg-black/70 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                          <Maximize2 className="w-3.5 h-3.5" />
                          View Fullsize
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DOCS FOLDER EXPLORER */}
        {activeTab === 'docs' && (
          <div className="p-6">
            {loadingDocs ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm font-mono">Checking repository for /docs directory...</p>
              </div>
            ) : docsFiles.length === 0 ? (
              <div className="text-center py-16 px-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                  <FolderOpen className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">
                  No Documentation Folder Found
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To view documentation here, create a <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">/docs</code> folder in your repository with markdown (<code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">.md</code>) files. The portfolio will automatically index and display them in an interactive tree view.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[400px]">
                {/* File list sidebar */}
                <div className="md:col-span-4 border border-border/80 rounded-xl p-3 bg-muted/20">
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-2 py-1 mb-2 flex items-center gap-1.5">
                    <FolderTree className="w-3.5 h-3.5 text-primary" />
                    Documentation Files
                  </div>
                  <div className="space-y-1">
                    {docsFiles.map((file) => (
                      <button
                        key={file.path}
                        onClick={() => handleSelectDoc(file)}
                        className={`w-full flex items-center gap-2 text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-colors ${
                          selectedDocFile?.path === file.path
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'hover:bg-muted text-foreground/80'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Doc viewer area */}
                <div className="md:col-span-8 border border-border/80 rounded-xl p-5 bg-card/60 overflow-y-auto max-h-[600px]">
                  {selectedDocFile ? (
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-border/60 text-xs text-muted-foreground">
                        <span className="font-mono font-medium text-foreground">
                          {selectedDocFile.path}
                        </span>
                        {selectedDocFile.download_url && (
                          <a
                            href={selectedDocFile.download_url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-primary transition-colors inline-flex items-center gap-1"
                          >
                            Raw <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <div className="markdown-body">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                        >
                          {selectedDocContent}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-xs font-mono">
                      Select a documentation file from the list to view its contents.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: INSIGHTS & STATS */}
        {activeTab === 'insights' && (
          <div className="p-6 space-y-6 max-w-4xl mx-auto">
            {/* Quick Clone Snippet */}
            <div className="border border-border/80 rounded-xl p-4 bg-muted/20">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Clone Repository
              </h4>
              <div className="flex items-center gap-2 bg-slate-950 text-slate-200 px-3 py-2 rounded-lg font-mono text-xs overflow-x-auto">
                <span className="text-emerald-400 select-none">$</span>
                <span className="flex-1">git clone {repo.html_url}.git</span>
                <button
                  onClick={handleCopyClone}
                  className="p-1 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
                  title="Copy clone command"
                >
                  {copiedClone ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Language Breakdown */}
            <div className="border border-border/80 rounded-xl p-5 bg-card">
              <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary" />
                Language Breakdown
              </h4>

              {totalLangBytes > 0 ? (
                <div>
                  {/* Multi-color progress bar */}
                  <div className="h-3 w-full rounded-full overflow-hidden flex bg-muted mb-4">
                    {Object.entries(languages).map(([lang, bytes], i) => {
                      const pct = ((bytes / totalLangBytes) * 100).toFixed(1);
                      const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-cyan-500', 'bg-purple-500', 'bg-pink-500'];
                      const color = colors[i % colors.length];
                      return (
                        <div
                          key={lang}
                          style={{ width: `${pct}%` }}
                          className={`${color} h-full`}
                          title={`${lang}: ${pct}%`}
                        />
                      );
                    })}
                  </div>

                  {/* Language list */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(languages).map(([lang, bytes], i) => {
                      const pct = ((bytes / totalLangBytes) * 100).toFixed(1);
                      const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-cyan-500', 'bg-purple-500', 'bg-pink-500'];
                      const color = colors[i % colors.length];
                      return (
                        <div key={lang} className="flex items-center gap-2 text-xs">
                          <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                          <span className="font-medium text-foreground">{lang}</span>
                          <span className="text-muted-foreground ml-auto font-mono">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Primary language: <span className="font-semibold text-foreground">{repo.language || 'Not specified'}</span>
                </p>
              )}
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="border border-border/80 rounded-xl p-4 bg-muted/20 text-center">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500 mx-auto mb-1" />
                <div className="text-lg font-bold font-mono">{formatNumber(repo.stargazers_count)}</div>
                <div className="text-[11px] text-muted-foreground">Stars</div>
              </div>

              <div className="border border-border/80 rounded-xl p-4 bg-muted/20 text-center">
                <GitFork className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
                <div className="text-lg font-bold font-mono">{formatNumber(repo.forks_count)}</div>
                <div className="text-[11px] text-muted-foreground">Forks</div>
              </div>

              <div className="border border-border/80 rounded-xl p-4 bg-muted/20 text-center">
                <Clock className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <div className="text-sm font-bold font-mono truncate">
                  {formatTimeAgo(repo.pushed_at || repo.updated_at)}
                </div>
                <div className="text-[11px] text-muted-foreground">Last Pushed</div>
              </div>

              <div className="border border-border/80 rounded-xl p-4 bg-muted/20 text-center">
                <Info className="w-5 h-5 text-purple-500 mx-auto mb-1" />
                <div className="text-lg font-bold font-mono">{repo.open_issues_count}</div>
                <div className="text-[11px] text-muted-foreground">Open Issues</div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>

      {/* Lightbox Modal for Fullscreen Screenshots */}
      {selectedLightboxImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedLightboxImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setSelectedLightboxImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 font-mono text-sm flex items-center gap-1"
            >
              Close (ESC)
            </button>
            <img
              src={selectedLightboxImage}
              alt="Fullscreen preview"
              className="max-h-[85vh] max-w-full rounded-xl border border-white/20 shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </Dialog>
  );
}
