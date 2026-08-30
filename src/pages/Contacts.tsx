import React from 'react';
import { FaGithub, FaTelegram } from 'react-icons/fa';
import { FiMapPin, FiGlobe } from 'react-icons/fi';

export const Contacts: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Contact Information</h1>
        <p className="text-sm text-gray-400 mt-1">Get in touch directly or view social profiles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="https://t.me/lewyngal"
          target="_blank"
          rel="noreferrer"
          className="linear-card p-6 space-y-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <FaTelegram className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-mono">Telegram</div>
            <div className="text-base font-semibold text-white group-hover:text-cyan-300">@lewyngal</div>
          </div>
        </a>

        <a
          href="https://github.com/NikitaBersenev"
          target="_blank"
          rel="noreferrer"
          className="linear-card p-6 space-y-3 group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FaGithub className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-mono">GitHub</div>
            <div className="text-base font-semibold text-white group-hover:text-indigo-300">NikitaBersenev</div>
          </div>
        </a>

        <div className="linear-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <FiGlobe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-mono">GitHub Page</div>
            <div className="text-base font-semibold text-white">nikitabersenev.github.io</div>
          </div>
        </div>

        <div className="linear-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FiMapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-mono">Location</div>
            <div className="text-base font-semibold text-white">Public Repositories</div>
          </div>
        </div>
      </div>
    </div>
  );
};
