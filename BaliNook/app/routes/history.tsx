import { useState, useEffect, useCallback } from "react";
import { BookCard } from "~/components/BookCard";
import { SetupModal } from "~/components/SetupModal";
import { fetchBookClubData } from "~/lib/github";
import { getRepoConfig } from "~/lib/storage";
import type { BookClubData, RepoConfig } from "~/lib/types";

export function meta() {
  return [{ title: "History – BaliNook Book Club" }];
}

export default function History() {
  const [repoConfig, setRepoConfig] = useState<RepoConfig | null>(null);
  const [data, setData] = useState<BookClubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRepoConfig(getRepoConfig());
  }, []);

  const loadData = useCallback(async (config: RepoConfig) => {
    setLoading(true);
    setError(null);
    try {
      const { data: fetched } = await fetchBookClubData(config.owner, config.repo);
      setData(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (repoConfig) loadData(repoConfig);
    else setLoading(false);
  }, [repoConfig, loadData]);

  if (!repoConfig) {
    return <SetupModal onComplete={(config) => setRepoConfig(config)} />;
  }

  const today = new Date().toISOString().slice(0, 10);
  const pastBooks =
    data?.books
      .filter((b) => b.endDate < today)
      .sort((a, b) => b.endDate.localeCompare(a.endDate)) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reading History</h1>

      {loading && (
        <p className="text-gray-400 text-sm text-center py-16">Loading…</p>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-sm">
          <p className="font-semibold mb-1">Could not load data</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {pastBooks.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🕰️</p>
              <p>No past books yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
