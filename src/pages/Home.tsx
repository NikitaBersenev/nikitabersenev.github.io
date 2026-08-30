import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchUserRepos, Repository } from '../github';
import { FiArrowRight, FiGithub, FiLayers, FiCode, FiZap } from 'react-icons/fi';
import { FaGithub, FaTelegram } from 'react-icons/fa';

export const Home: React.FC = () => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRepos()
      .then((data) => setRepos(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative text-center py-12 md:py-20 max-w-4xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono mb-2">
          <FiZap className="w-3.5 h-3.5 text-indigo-400" />
          <span>https://nikitabersenev.github.io</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Crafting software & <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
            Open Source Projects
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Welcome! Interactive hub for public GitHub repositories with quick switching, repository details, clean dark mode UI inspired by Linear.app.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/projects" className="linear-btn linear-btn-primary text-sm !py-2.5 !px-5">
            Explore Repositories <FiArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://github.com/NikitaBersenev"
            target="_blank"
            rel="noreferrer"
            className="linear-btn text-sm !py-2.5 !px-5"
          >
            <FaGithub className="w-4 h-4" /> GitHub Profile
          </a>
        </div>
      </section>

      {/* Public Repositories Interactive Preview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FiLayers className="text-indigo-400" /> Public GitHub Repositories
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Direct access to source code and active developments
            </p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            View All ({repos.length}) <FiArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500 text-sm font-mono">
            Loading public repositories...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.slice(0, 6).map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="linear-card p-5 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-indigo-400 group-hover:text-indigo-300">
                      {repo.name}
                    </span>
                    <FiGithub className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {repo.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-400 font-mono">
                  <span className="flex items-center gap-1">
                    <FiCode className="text-indigo-400" /> {repo.language || 'Code'}
                  </span>
                  <span>{new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* Connect Banner */}
      <section className="linear-card p-8 text-center space-y-4 max-w-3xl mx-auto border-indigo-500/20 bg-indigo-950/10">
        <h3 className="text-xl font-bold text-white">Let's Connect</h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          Feel free to reach out via GitHub or Telegram for collaboration and discussion.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <a
            href="https://t.me/lewyngal"
            target="_blank"
            rel="noreferrer"
            className="linear-btn text-xs"
          >
            <FaTelegram className="w-4 h-4 text-cyan-400" /> Telegram (@lewyngal)
          </a>
          <a
            href="https://github.com/NikitaBersenev"
            target="_blank"
            rel="noreferrer"
            className="linear-btn text-xs"
          >
            <FaGithub className="w-4 h-4" /> GitHub (@NikitaBersenev)
          </a>
        </div>
      </section>
    </div>
  );
};
