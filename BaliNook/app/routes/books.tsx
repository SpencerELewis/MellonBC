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
  const currentMonth = new Date().getMonth() + 1;
  const currentBook = data.books.find((book) => Number(book.startDate.slice(5, 7)) === currentMonth) ?? null;
  const upcomingBooks = data.books.filter((book) => book.id !== currentBook?.id && book.startDate > today);
  const pastBooks = data.books.filter((book) => book.id !== currentBook?.id && book.endDate < today);

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
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8 bg-sky-50/70 rounded-3xl ring-1 ring-sky-100">
      {currentBook ? (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-700/70 mb-3">
            Current Book
          </h2>
          <div id={currentBook.id} className={getCardAnchorClass(currentBook.id)}>
            <BookCard book={currentBook} isCurrent />
          </div>
        </section>
      ) : (
        <div className="bg-sky-100 border border-sky-200 rounded-xl p-8 text-center text-sky-800">
          <p className="text-4xl mb-3">📚</p>
          <p className="font-semibold">No current book selected</p>
        </div>
      )}

      {upcomingBooks.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-700/70 mb-3">
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
          <h2 className="text-sm font-semibold uppercase tracking-wider text-sky-700/70 mb-3">
            History
          </h2>
          <div className="space-y-4">
            {[...pastBooks].reverse().slice().map((b) => (
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
