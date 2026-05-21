import type { RepoConfig } from "./types";

const KEYS = {
  REPO_CONFIG: "bc_repo_config",
  PAT: "bc_pat",
} as const;

export function getRepoConfig(): RepoConfig | null {
  try {
    const raw = localStorage.getItem(KEYS.REPO_CONFIG);
    return raw ? (JSON.parse(raw) as RepoConfig) : null;
  } catch {
    return null;
  }
}

export function setRepoConfig(config: RepoConfig): void {
  localStorage.setItem(KEYS.REPO_CONFIG, JSON.stringify(config));
}

export function clearRepoConfig(): void {
  localStorage.removeItem(KEYS.REPO_CONFIG);
}

export function getPAT(): string | null {
  return localStorage.getItem(KEYS.PAT);
}

export function setPAT(pat: string): void {
  localStorage.setItem(KEYS.PAT, pat);
}

export function clearPAT(): void {
  localStorage.removeItem(KEYS.PAT);
}
