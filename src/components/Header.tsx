import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGithub, FaTelegram } from 'react-icons/fa';
import { FiCommand, FiGrid, FiFolder, FiMail } from 'react-icons/fi';

export const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Overview', icon: <FiGrid className="w-4 h-4" /> },
    { path: '/projects', label: 'Repositories', icon: <FiFolder className="w-4 h-4" /> },
    { path: '/contacts', label: 'Contact', icon: <FiMail className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[#08090a]/80 border-b border-white/10 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <img
                src="/src/assets/logo.jpg"
                alt="Nikita Bersenev"
                className="w-full h-full object-cover rounded-[7px]"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Nikita Bersenev
              </span>
              <span className="text-[11px] text-gray-400 font-mono">
                nikitabersenev.github.io
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-white/10">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white shadow-sm border border-white/15'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions & Social Links */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10 text-[11px] font-mono text-gray-400">
            <FiCommand className="w-3 h-3 text-indigo-400" />
            <span>K</span>
            <span className="text-[10px] text-gray-500 ml-1">Quick Switcher</span>
          </div>

          <a
            href="https://github.com/NikitaBersenev"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
            title="GitHub Profile"
          >
            <FaGithub className="w-4 h-4" />
          </a>

          <a
            href="https://t.me/lewyngal"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
            title="Telegram"
          >
            <FaTelegram className="w-4 h-4" />
          </a>

          <a
            href="https://github.com/NikitaBersenev/nikitabersenev.github.io"
            target="_blank"
            rel="noreferrer"
            className="linear-btn linear-btn-primary text-xs !py-1.5 !px-3"
          >
            GitHub Pages
          </a>
        </div>
      </div>
    </header>
  );
};
