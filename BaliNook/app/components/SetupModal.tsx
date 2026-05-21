import { useState } from "react";
import { setRepoConfig } from "~/lib/storage";
import type { RepoConfig } from "~/lib/types";

interface SetupModalProps {
  onComplete: (config: RepoConfig) => void;
}

export function SetupModal({ onComplete }: SetupModalProps) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [error, setError] = useState("");
  const [testing, setTesting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimOwner = owner.trim();
    const trimRepo = repo.trim();
    if (!trimOwner || !trimRepo) {
      setError("Both fields are required.");
      return;
    }

    setError("");
    setTesting(true);
    try {
      const url = `https://api.github.com/repos/${trimOwner}/${trimRepo}/contents/data/bookclub.json`;
      const res = await fetch(url, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
      // 200 = file exists, 404 is OK (just not initialized yet), anything else is a config error
      if (res.status !== 200 && res.status !== 404) {
        setError(`Could not reach repository (HTTP ${res.status}). Check owner/repo name.`);
        return;
      }
    } catch {
      setError("Network error. Check the owner/repo and try again.");
      return;
    } finally {
      setTesting(false);
    }

    const config: RepoConfig = { owner: trimOwner, repo: trimRepo };
    setRepoConfig(config);
    onComplete(config);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Connect to GitHub</h2>
        <p className="text-sm text-gray-500 mb-6">
          Book club data is stored as a JSON file in a GitHub repository.
          Enter the repository details below. The repo must be public.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Owner (username or org)
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g. octocat"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repository Name
            </label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="e.g. MellonBC"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={testing}
            className="w-full bg-amber-800 hover:bg-amber-900 text-white font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {testing ? "Connecting…" : "Save & Connect"}
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Settings are saved in your browser. Each member must set this up once.
        </p>
      </div>
    </div>
  );
}
