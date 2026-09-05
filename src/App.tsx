import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import {
  fixReadmeUrls,
  getLanguages,
  getReadme,
  getRepo,
  getRepos,
  type GitHubRepo,
} from './lib/github';

const USERNAME = 'NikitaBersenev';
const HIDDEN_REPOS = new Set(['nikitabersenev.github.io']);

const THEMES = [
  ['dark', 'Dark Minimal'],
  ['grunge', '90s Grunge'],
  ['swiss', 'Swiss'],
  ['geist', 'Geist'],
  ['claude', 'Claude'],
] as const;

type ThemeName = (typeof THEMES)[number][0];

function Layout({ children }: { children: React.ReactNode }) {
  return <main className="page">{children}</main>;
}

function ProjectsPage() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    getRepos(USERNAME)
      .then((items) => setRepos(items.filter((repo) => !HIDDEN_REPOS.has(repo.name))))
      .catch(() => setError('Не удалось загрузить проекты с GitHub.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <h1>projects</h1>
      {loading && <p>loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <ul className="project-list">
          {repos.map((repo) => (
            <li key={repo.id}>
              <Link to={`/project/${encodeURIComponent(repo.name)}`}>{repo.name}</Link>
              {repo.language && <span className="meta"> — {repo.language}</span>}
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
}

function ProjectPage() {
  const { name = '' } = useParams();
  const repoName = decodeURIComponent(name);
  const [repo, setRepo] = useState<GitHubRepo | null>(null);
  const [readme, setReadme] = useState('');
  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    getRepo(USERNAME, repoName)
      .then(async (repoData) => {
        const [readmeData, languageData] = await Promise.all([
          getReadme(USERNAME, repoName, repoData.default_branch),
          getLanguages(USERNAME, repoName),
        ]);
        if (cancelled) return;
        setRepo(repoData);
        setReadme(readmeData);
        setLanguages(languageData);
      })
      .catch(() => !cancelled && setError('Проект не найден или GitHub API недоступен.'))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [repoName]);
  const languageRows = useMemo(() => {
    const total = Object.values(languages).reduce((sum, value) => sum + value, 0);
    if (!total) return [];
    return Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .map(([language, bytes]) => [language, Math.round((bytes / total) * 100)] as const);
  }, [languages]);

  if (loading) {
    return (
      <Layout>
        <Link to="/">← projects</Link>
        <p>loading...</p>
      </Layout>
    );
  }

  if (error || !repo) {
    return (
      <Layout>
        <Link to="/">← projects</Link>
        <p>{error || 'Проект не найден.'}</p>
      </Layout>
    );
  }

  const renderedReadme = fixReadmeUrls(readme, USERNAME, repo.name, repo.default_branch);
  return (
    <Layout>
      <nav className="back-link">
        <Link to="/">← projects</Link>
      </nav>

      <h1>{repo.name}</h1>
      {repo.description && <p>{repo.description}</p>}

      <dl className="stats">
        <div><dt>stars</dt><dd>{repo.stargazers_count}</dd></div>
        <div><dt>forks</dt><dd>{repo.forks_count}</dd></div>
        <div><dt>issues</dt><dd>{repo.open_issues_count}</dd></div>
        <div><dt>updated</dt><dd>{new Date(repo.pushed_at).toLocaleDateString('ru-RU')}</dd></div>
        {repo.license?.spdx_id && <div><dt>license</dt><dd>{repo.license.spdx_id}</dd></div>}
      </dl>

      {languageRows.length > 0 && (
        <section className="languages" aria-label="Languages">
          <h2>languages</h2>
          <p>{languageRows.map(([lang, percent]) => `${lang} ${percent}%`).join(' · ')}</p>
        </section>
      )}
      <p>
        <a href={repo.html_url} target="_blank" rel="noreferrer">github ↗</a>
      </p>

      <hr />

      <article className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            a: ({ href, ...props }) => {
              const resolved = href && !/^(https?:|mailto:|#)/.test(href)
                ? `https://github.com/${USERNAME}/${repo.name}/blob/${repo.default_branch}/${href.replace(/^\.\//, '')}`
                : href;
              return <a {...props} href={resolved} target="_blank" rel="noreferrer" />;
            },
          }}
        >
          {renderedReadme}
        </ReactMarkdown>
      </article>
    </Layout>
  );
}

export function App() {
  const [theme, setTheme] = useState<ThemeName>(() => {
    const saved = localStorage.getItem('projects_theme') as ThemeName | null;
    return THEMES.some(([value]) => value === saved) ? saved! : 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('projects_theme', theme);
  }, [theme]);

  return (
    <>
      <label className="theme-picker">
        <span>theme</span>
        <select value={theme} onChange={(event) => setTheme(event.target.value as ThemeName)}>
          {THEMES.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>

      <Routes>
        <Route path="/" element={<ProjectsPage />} />
        <Route path="/project/:name" element={<ProjectPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
