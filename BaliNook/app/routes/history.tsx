import { BookCard } from "~/components/BookCard";
import { bookClubData } from "~/data/bookclub-data";

export function meta() {
  return [{ title: "History – BaliNook Book Club" }];
}

export default function History() {
  const data = bookClubData;
  const today = new Date().toISOString().slice(0, 10);
  const pastBooks = data.books
    .filter((b) => b.endDate < today)
    .sort((a, b) => b.endDate.localeCompare(a.endDate));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reading History</h1>

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
    </div>
  );
}
