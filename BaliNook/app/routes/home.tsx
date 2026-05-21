import { useState, useEffect, useCallback } from "react";
import { BookCard } from "~/components/BookCard";
import { Calendar } from "~/components/Calendar";
import { SetupModal } from "~/components/SetupModal";
import { fetchBookClubData } from "~/lib/github";
import { getRepoConfig } from "~/lib/storage";
import type { BookClubData, RepoConfig } from "~/lib/types";

export function meta() {
  return [
    { title: "BaliNook Book Club" },
    { name: "description", content: "Track our book club reading schedule." },
  ];
}

export default function Home() {
  const [repoConfig, setRepoConfig] = useState<RepoConfig | null>(null);
  const [data, setData] = useState<BookClubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hydrate config from localStorage on mount (avoids SSR mismatch)
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
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.startsWith("DATA_NOT_FOUND")) {
        setError("No book club data yet. An admin needs to initialize it from the Admin page.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (repoConfig) {
      loadData(repoConfig);
    } else {
      setLoading(false);
    }
  }, [repoConfig, loadData]);

  if (!repoConfig) {
    return <SetupModal onComplete={(config) => setRepoConfig(config)} />;
  }

  const today = new Date().toISOString().slice(0, 10);
  const currentBook = data?.books.find((b) => b.id === data.currentBookId) ?? null;
  const upcomingBooks =
    data?.books.filter((b) => b.id !== data.currentBookId && b.startDate > today) ?? [];
  const pastBooks =
    data?.books.filter((b) => b.id !== data.currentBookId && b.endDate < today) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {loading && (
        <div className="text-center py-16 text-gray-400 text-sm">Loading book club data…</div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-sm">
          <p className="font-semibold mb-1">Could not load data</p>
          <p>{error}</p>
          <button
            onClick={() => loadData(repoConfig)}
            className="mt-3 text-xs underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && data && (
        <>
          {currentBook ? (
            <section>
              <BookCard book={currentBook} isCurrent />
            </section>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center text-amber-700">
              <p className="text-4xl mb-3">📚</p>
              <p className="font-semibold">No current book selected</p>
              <p className="text-sm mt-1">An admin can set the current book from the Admin page.</p>
            </div>
          )}

          {upcomingBooks.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Coming Up
              </h2>
              <div className="space-y-4">
                {upcomingBooks.map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Reading Schedule
            </h2>
            <Calendar books={data.books} />
          </section>

          {pastBooks.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Recent Books
              </h2>
              <div className="space-y-4">
                {[...pastBooks].reverse().slice(0, 3).map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
