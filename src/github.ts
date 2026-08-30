export interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  default_branch: string;
  topics?: string[];
  fork: boolean;
  visibility: string;
}

const GITHUB_USERNAME = 'NikitaBersenev';

// Cache in-memory during session
let cachedRepos: Repository[] | null = null;

export async function fetchUserRepos(): Promise<Repository[]> {
  if (cachedRepos) {
    return cachedRepos;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }
    const data: Repository[] = await response.json();
    // Filter out forks if desired or show all public non-archived repos
    const sorted = data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    cachedRepos = sorted;
    return sorted;
  } catch (error) {
    console.warn("Failed to fetch GitHub repositories, returning default fallback:", error);
    return getFallbackRepos();
  }
}

function getFallbackRepos(): Repository[] {
  return [
    {
      id: 1,
      name: "nikitabersenev.github.io",
      full_name: "NikitaBersenev/nikitabersenev.github.io",
      html_url: "https://github.com/NikitaBersenev/nikitabersenev.github.io",
      description: "Personal portfolio website built with React, Vite, and Linear dark UI aesthetics.",
      stargazers_count: 5,
      forks_count: 0,
      language: "TypeScript",
      updated_at: new Date().toISOString(),
      default_branch: "main",
      topics: ["portfolio", "react", "linear-design", "vite"],
      fork: false,
      visibility: "public"
    },
    {
      id: 2,
      name: "zmk-corne-new",
      full_name: "NikitaBersenev/zmk-corne-new",
      html_url: "https://github.com/NikitaBersenev/zmk-corne-new",
      description: "Custom ZMK firmware configuration for Corne split mechanical keyboard.",
      stargazers_count: 2,
      forks_count: 0,
      language: "C",
      updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      default_branch: "main",
      topics: ["zmk", "keyboard", "firmware", "corne"],
      fork: true,
      visibility: "public"
    }
  ];
}
