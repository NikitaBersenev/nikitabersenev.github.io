import React, { useEffect, useState } from 'react';
import { fetchUserRepos, Repository } from '../github';
import { FiStar, FiGitBranch, FiExternalLink, FiSearch, FiCode, FiLayers } from 'react-icons/fi';
import { FaGithub } from 'react-icons/fa';

export const Projects: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'sources' | 'forks'>('all');

  useEffect(() => {
    fetchUserRepos()
      .then((data) => {
        setRepos(data);
        if (data.length > 0) {
          setSelectedRepo(data[0]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredRepos = repos.filter((repo) => {
    const matchesSearch =
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (repo.language && repo.language.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedFilter === 'sources') return matchesSearch && !repo.fork;
    if (selectedFilter === 'forks') return matchesSearch && repo.fork;
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="linear-badge linear-badge-purple">
              <FiLayers className="w-3.5 h-3.5" /> Public Repositories
            </span>
            <span className="text-xs text-gray-400 font-mono">github.com/NikitaBersenev</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Repository Workspace
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Explore, filter, and inspect public repositories with linear interactive detail switching.
          </p>
        </div>

        {/* Filter / Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filter repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white/[0.04] border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="flex rounded-lg bg-white/[0.04] p-1 border border-white/10 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                selectedFilter === 'all' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              All ({repos.length})
            </button>
            <button
              onClick={() => setSelectedFilter('sources')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                selectedFilter === 'sources' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sources
            </button>
            <button
              onClick={() => setSelectedFilter('forks')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                selectedFilter === 'forks' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Forks
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-mono">Fetching public GitHub repositories...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Panel: Repository Switcher List */}
          <div className="lg:col-span-5 space-y-3 max-h-[75vh] overflow-y-auto pr-2">
            {filteredRepos.length === 0 ? (
              <div className="p-8 text-center linear-card text-gray-400 text-sm">
                No repositories match your query.
              </div>
            ) : (
              filteredRepos.map((repo) => {
                const isSelected = selectedRepo?.id === repo.id;
                return (
                  <div
                    key={repo.id}
                    onClick={() => setSelectedRepo(repo)}
                    className={`p-4 linear-card cursor-pointer transition-all ${
                      isSelected ? 'linear-card-active bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FaGithub className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-gray-400'}`} />
                        <h3 className="font-semibold text-white text-sm truncate max-w-[200px]">
                          {repo.name}
                        </h3>
                        {repo.fork && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-gray-400 font-mono">
                            fork
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-1 text-amber-400">
                            <FiStar className="w-3.5 h-3.5 fill-amber-400/20" />
                            {repo.stargazers_count}
                          </span>
                        )}
                        <span className="text-[11px] text-gray-500">
                          {new Date(repo.updated_at).toLocaleDateString('ru-RU', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-2 line-clamp-2 leading-relaxed">
                      {repo.description || 'No description provided.'}
                    </p>

                    <div className="flex items-center justify-between mt-3 text-xs pt-2 border-t border-white/[0.06]">
                      <span className="flex items-center gap-1.5 text-gray-400 font-mono text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 inline-block"></span>
                        {repo.language || 'Code'}
                      </span>

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium text-[11px]"
                      >
                        GitHub <FiExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Panel: Selected Repository Main Details */}
          <div className="lg:col-span-7 sticky top-24">
            {selectedRepo ? (
              <div className="linear-card p-6 md:p-8 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header detail */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-indigo-400">{selectedRepo.full_name}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-white/10 text-gray-300">
                        {selectedRepo.visibility}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                      {selectedRepo.name}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={selectedRepo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="linear-btn linear-btn-primary"
                    >
                      <FaGithub className="w-4 h-4" /> Open Repository
                    </a>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                    About Project
                  </h4>
                  <p className="text-sm text-gray-300 leading-relaxed bg-white/[0.02] p-4 rounded-lg border border-white/5">
                    {selectedRepo.description || 'This repository does not have a detailed description yet.'}
                  </p>
                </div>

                {/* Tech & Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                      <FiCode className="w-3.5 h-3.5 text-indigo-400" /> Language
                    </div>
                    <span className="text-sm font-semibold text-white font-mono">
                      {selectedRepo.language || 'Markdown / Misc'}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                      <FiStar className="w-3.5 h-3.5 text-amber-400" /> Stars
                    </div>
                    <span className="text-sm font-semibold text-white font-mono">
                      {selectedRepo.stargazers_count}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                      <FiGitBranch className="w-3.5 h-3.5 text-cyan-400" /> Default Branch
                    </div>
                    <span className="text-sm font-semibold text-white font-mono">
                      {selectedRepo.default_branch}
                    </span>
                  </div>
                </div>

                {/* Quick GitHub Links */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3 text-xs">
                  <a
                    href={`${selectedRepo.html_url}/commits`}
                    target="_blank"
                    rel="noreferrer"
                    className="linear-btn text-gray-300 hover:text-white"
                  >
                    View Commits
                  </a>
                  <a
                    href={`${selectedRepo.html_url}/issues`}
                    target="_blank"
                    rel="noreferrer"
                    className="linear-btn text-gray-300 hover:text-white"
                  >
                    Issues
                  </a>
                  {selectedRepo.name.endsWith('.github.io') && (
                    <a
                      href={`https://${selectedRepo.name}`}
                      target="_blank"
                      rel="noreferrer"
                      className="linear-btn text-cyan-300 border-cyan-500/30 hover:border-cyan-400"
                    >
                      Visit Published Site <FiExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-12 text-center linear-card text-gray-400">
                Select a repository from the left panel to inspect details.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
