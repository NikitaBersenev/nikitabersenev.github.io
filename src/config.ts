export interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
  coverImage?: string;
}

export interface SiteConfig {
  githubUsername: string;
  name: string;
  tagline: string;
  bio: string;
  avatarUrl?: string;
  location?: string;
  email?: string;
  socials: {
    github?: string;
    twitter?: string;
    telegram?: string;
    linkedin?: string;
    website?: string;
  };
  skills: {
    category: string;
    items: string[];
  }[];
  featuredRepos: string[]; // specific repos to pin to the top
  excludedRepos: string[]; // repos to hide (e.g. forks or config repos)
  blogPosts: BlogPost[];
}

export const siteConfig: SiteConfig = {
  // Your GitHub username
  githubUsername: 'NikitaBersenev',
  name: 'Nikita Bersenev',
  tagline: 'Software Engineer & Open Source Developer',
  bio: 'Building modern software, developer tooling, and custom firmware. Exploring distributed systems, Go, and clean frontend engineering.',
  location: 'Remote',
  email: '',
  socials: {
    github: 'https://github.com/NikitaBersenev',
    twitter: '',
    telegram: '',
    linkedin: '',
  },
  skills: [
    {
      category: 'Languages & Core',
      items: ['Go', 'TypeScript', 'JavaScript', 'Python', 'C / C++', 'HTML/CSS'],
    },
    {
      category: 'Frontend & UI',
      items: ['React', 'Tailwind CSS', 'shadcn/ui', 'Vite', 'Next.js'],
    },
    {
      category: 'Tools & Hardware',
      items: ['Git', 'GitHub Actions', 'Docker', 'Linux', 'ZMK Firmware', 'QMK'],
    },
  ],
  // Featured repos
  featuredRepos: [
    'go-nidis',
    'corne-keyboard-layout',
    'zmk-corne-new',
    'nikitabersenev.github.io',
  ],
  excludedRepos: [],
  blogPosts: [
    {
      id: 'building-modern-github-portfolio',
      title: 'How I Built My GitHub Pages Portfolio with React & shadcn/ui',
      description: 'A deep dive into building an interactive developer portfolio that automatically syncs with GitHub repositories, renders README files, and browses docs on the fly.',
      date: '2025-02-15',
      readTime: '5 min read',
      tags: ['React', 'GitHub API', 'Tailwind', 'Open Source'],
      content: `
# How I Built My GitHub Pages Portfolio with React & shadcn/ui

Static portfolios often go stale because developers forget to update them. When you ship new features or start new repositories, your portfolio should automatically reflect your latest work!

In this article, I'll walk through how this portfolio site works:

### 1. Zero-Maintenance Project Sync
By connecting directly to the **GitHub REST API**, all public repositories are fetched dynamically:
- Star counts, forks, and primary languages update automatically.
- Topics act as tags for filtering.
- Pinned repositories are highlighted at the top.

### 2. On-the-Fly README & Docs Rendering
Instead of copying descriptions into custom cards, we fetch the actual repository \`README.md\` and \`/docs\` folder content. Using \`react-markdown\` and custom remark/rehype plugins:
- Relative image links are rewritten to point to \`raw.githubusercontent.com\`.
- Code blocks get syntax highlighting and quick copy-to-clipboard functionality.
- You can navigate markdown documentation directly inside a modal without ever leaving the site!

### 3. Deploying to GitHub Pages
Thanks to GitHub Actions (\`.github/workflows/deploy.yml\`), every \`git push\` automatically runs \`npm run build\` and publishes the production bundle to GitHub Pages in seconds.
      `,
    },
    {
      id: 'optimizing-react-api-performance',
      title: 'Smart Caching Strategies for Client-Side GitHub API Integration',
      description: 'Navigating rate limits (60 req/hour unauthenticated) with client-side localStorage caching and resilient fallback patterns.',
      date: '2025-01-20',
      readTime: '4 min read',
      tags: ['TypeScript', 'WebDev', 'Performance'],
      content: `
# Smart Caching Strategies for Client-Side GitHub API Integration

The public GitHub REST API is awesome, but it enforces a strict limit of 60 requests per hour for unauthenticated IP addresses. Here are the strategies implemented in this portfolio to ensure 100% uptime:

### 1. Local & Session Storage Caching
Every repository payload is cached in \`sessionStorage\` with a TTL (time-to-live) of 30 minutes. If the user clicks back and forth between repositories, no additional network calls are made.

### 2. Optional Personal Access Token (PAT)
For users who want to inspect private repositories or avoid rate limits entirely (up to 5,000 requests/hour), the settings modal allows providing an optional GitHub Fine-Grained Token stored securely only in your browser's \`localStorage\`.

### 3. Offline & Rate-Limit Fallback Mode
If GitHub API returns a \`403 Rate Limit Exceeded\`, the app gracefully switches to offline showcase data so the website continues looking great without error screens!
      `,
    },
    {
      id: 'clean-code-frontend-architecture',
      title: 'Designing Accessible, Modular UI Components with Tailwind and Radix',
      description: 'Key principles for creating responsive, accessible developer portfolio interfaces that look stunning on any screen.',
      date: '2024-12-10',
      readTime: '6 min read',
      tags: ['UI/UX', 'Tailwind CSS', 'Architecture'],
      content: `
# Designing Accessible, Modular UI Components with Tailwind and Radix

Creating developer interfaces that are both aesthetically pleasing and functional requires attention to details:

- **Keyboard First**: Power users love keyboard navigation. Using \`ArrowLeft\` / \`ArrowRight\` or \`J\` / \`K\` allows effortless switching between projects.
- **Glassmorphism & Contrast**: Subtle dark-mode gradients with backdrop blur give modern contrast without overwhelming the text readability.
- **Responsive Drawers & Modals**: Smooth slide-over dialogs adapt seamlessly between 4K monitors and mobile screens.
      `,
    },
  ],
};
