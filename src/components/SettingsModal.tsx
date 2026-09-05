import React, { useState } from 'react';
import { Settings, Key, User, Trash2, Check, RefreshCw, ExternalLink, ShieldAlert } from 'lucide-react';
import { GitHubService } from '@/lib/github';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername: string;
  onSaveUsername: (username: string) => void;
  onReload: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  currentUsername,
  onSaveUsername,
  onReload,
}: SettingsModalProps) {
  const [usernameInput, setUsernameInput] = useState(currentUsername);
  const [tokenInput, setTokenInput] = useState(GitHubService.getToken());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    const trimmedUser = usernameInput.trim();
    if (trimmedUser) {
      GitHubService.setSavedUsername(trimmedUser);
      onSaveUsername(trimmedUser);
    }
    GitHubService.setToken(tokenInput.trim());
    GitHubService.clearCache();

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
      onReload();
    }, 800);
  };

  const handleClearCache = () => {
    GitHubService.clearCache();
    alert('Local GitHub API cache cleared successfully.');
    onReload();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="max-w-md">
      <DialogHeader onClose={onClose}>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Settings className="w-4 h-4" />
          </div>
          <div>
            <DialogTitle className="text-lg font-bold">GitHub Settings</DialogTitle>
            <DialogDescription>
              Configure the GitHub username and API rate limits.
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <DialogContent className="space-y-4 py-4">
        {/* GitHub Username input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            GitHub Username
          </label>
          <Input
            type="text"
            placeholder="e.g. your-github-username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            className="font-mono text-xs"
          />
          <p className="text-[11px] text-muted-foreground">
            The site will pull public repositories, READMEs, and stats for this account.
          </p>
        </div>

        {/* GitHub Personal Access Token */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-foreground flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-primary" />
              Personal Access Token (Optional)
            </span>
            <a
              href="https://github.com/settings/tokens/new?description=DevPortfolio+Viewer&scopes=public_repo"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-primary hover:underline inline-flex items-center gap-0.5"
            >
              Generate token <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </label>
          <Input
            type="password"
            placeholder="ghp_xxxxxxxxxxxx..."
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="font-mono text-xs"
          />
          <div className="rounded-lg bg-muted/40 p-2.5 text-[11px] text-muted-foreground border border-border/50">
            <div className="flex items-start gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Why add a token?</strong> Unauthenticated GitHub requests are capped at 60/hr. Adding a personal token increases your limit to 5,000/hr. Your token stays strictly in your browser's <code className="text-xs font-mono">localStorage</code>.
              </span>
            </div>
          </div>
        </div>

        {/* Cache management */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-foreground">Local API Cache</div>
            <div className="text-[11px] text-muted-foreground">
              Clear cached repository and README payloads.
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearCache}
            className="text-xs h-8 gap-1 text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </Button>
        </div>
      </DialogContent>

      <DialogFooter>
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={savedSuccess}
          className="gap-1.5"
        >
          {savedSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Saved!
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              Save & Refresh
            </>
          )}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
