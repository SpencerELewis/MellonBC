import { BookCard } from "~/components/BookCard";
import { Calendar } from "~/components/Calendar";
import { bookClubData } from "~/data/bookclub-data";

export function meta() {
  return [
    { title: "BaliNook Book Club" },
    { name: "description", content: "Track our book club reading schedule." },
  ];
}

export default function Home() {
  const data = bookClubData;
  const today = new Date().toISOString().slice(0, 10);
  const currentBook = data.books.find((b) => b.id === data.currentBookId) ?? null;
  const upcomingBooks = data.books.filter((b) => b.id !== data.currentBookId && b.startDate > today);
  const pastBooks = data.books.filter((b) => b.id !== data.currentBookId && b.endDate < today);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {currentBook ? (
        <section>
          <BookCard book={currentBook} isCurrent />
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
    </div>
  );
}
