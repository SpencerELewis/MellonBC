import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { BookCard } from "~/components/BookCard";
import { bookClubData } from "~/data/bookclub-data";

export function meta() {
  return [
    { title: "Books | BaliNook Book Club" },
    { name: "description", content: "Browse current, upcoming, and past BaliNook book selections." },
  ];
}

export default function BooksPage() {
  const location = useLocation();
  const [highlightedBookId, setHighlightedBookId] = useState<string | null>(null);
  const data = bookClubData;
  const today = new Date().toISOString().slice(0, 10);
  const currentBook = data.books.find((b) => b.id === data.currentBookId) ?? null;
  const upcomingBooks = data.books.filter((b) => b.id !== data.currentBookId && b.startDate > today);
  const pastBooks = data.books.filter((b) => b.id !== data.currentBookId && b.endDate < today);

  useEffect(() => {
    const hashId = decodeURIComponent(location.hash.replace("#", ""));
    if (!hashId) {
      setHighlightedBookId(null);
      return;
    }

    setHighlightedBookId(hashId);
    const timeoutId = window.setTimeout(() => {
      setHighlightedBookId((current) => (current === hashId ? null : current));
    }, 1400);

    return () => window.clearTimeout(timeoutId);
  }, [location.hash]);

  function getCardAnchorClass(bookId: string): string {
    return `scroll-mt-24 ${highlightedBookId === bookId ? "book-card-highlight" : ""}`;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {currentBook ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Current Book
          </h2>
          <div id={currentBook.id} className={getCardAnchorClass(currentBook.id)}>
            <BookCard book={currentBook} isCurrent />
          </div>
        </section>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center text-amber-700">
          <p className="text-4xl mb-3">📚</p>
          <p className="font-semibold">No current book selected</p>
          <p className="text-sm mt-1">Set currentBookId in app/data/bookclub-data.ts.</p>
        </div>
      )}

      {upcomingBooks.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
            Coming Up
          </h2>
          <div className="space-y-4">
            {upcomingBooks.map((b) => (
              <div key={b.id} id={b.id} className={getCardAnchorClass(b.id)}>
                <BookCard book={b} />
              </div>
            ))}
          </div>
        </section>
      )}

      {pastBooks.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-3">
            History
          </h2>
          <div className="space-y-4">
            {[...pastBooks].reverse().slice(0, 3).map((b) => (
              <div key={b.id} id={b.id} className={getCardAnchorClass(b.id)}>
                <BookCard book={b} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
