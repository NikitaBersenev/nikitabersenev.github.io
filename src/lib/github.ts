export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  private: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  default_branch: string;
  license?: { name: string; spdx_id: string } | null;
}

const API = 'https://api.github.com';
const headers: HeadersInit = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};
async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API}${path}`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function getRepos(username: string): Promise<GitHubRepo[]> {
  const repos = await request<GitHubRepo[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`
  );
  return repos.filter((repo) => !repo.private && !repo.fork);
}

export async function getRepo(username: string, name: string): Promise<GitHubRepo> {
  return request<GitHubRepo>(
    `/repos/${encodeURIComponent(username)}/${encodeURIComponent(name)}`
  );
}

export async function getLanguages(
  username: string,
  name: string
): Promise<Record<string, number>> {
  return request<Record<string, number>>(
    `/repos/${encodeURIComponent(username)}/${encodeURIComponent(name)}/languages`
  );
}
export async function getReadme(
  username: string,
  name: string,
  defaultBranch = 'main'
): Promise<string> {
  const response = await fetch(
    `${API}/repos/${encodeURIComponent(username)}/${encodeURIComponent(name)}/readme`,
    { headers: { ...headers, Accept: 'application/vnd.github.raw+json' } }
  );

  if (response.status === 404) {
    return `# ${name}\n\nREADME.md not found.`;
  }
  if (!response.ok) {
    const raw = await fetch(
      `https://raw.githubusercontent.com/${username}/${name}/${defaultBranch}/README.md`
    );
    if (raw.ok) return raw.text();
    throw new Error(`README: ${response.status}`);
  }
  return response.text();
}

export function fixReadmeUrls(
  markdown: string,
  username: string,
  name: string,
  branch: string
): string {
  const rawBase = `https://raw.githubusercontent.com/${username}/${name}/${branch}/`;
  let result = markdown.replace(
    /!\[(.*?)\]\((?!https?:\/\/|data:|\/\/)(.*?)\)/g,
    (_match, alt, src) => `![${alt}](${rawBase}${String(src).replace(/^\.?\//, '')})`
  );

  result = result.replace(
    /<img\s+([^>]*?)src=["'](?!https?:\/\/|data:|\/\/)([^"']+)["']([^>]*?)>/gi,
    (_match, before, src, after) =>
      `<img ${before}src="${rawBase}${String(src).replace(/^\.?\//, '')}"${after}>`
  );

  return result;
}
