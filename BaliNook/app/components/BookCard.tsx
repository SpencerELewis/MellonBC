import type { Book } from "~/lib/types";

interface BookCardProps {
  book: Book;
  isCurrent?: boolean;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" };
  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", opts)}`;
}

function daysRemaining(end: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(end + "T00:00:00");
  return Math.ceil((endDate.getTime() - today.getTime()) / 86400000);
}

function readingProgress(start: string, end: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const total = e.getTime() - s.getTime();
  const elapsed = today.getTime() - s.getTime();
  return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
}

export function BookCard({ book, isCurrent = false }: BookCardProps) {
  const remaining = daysRemaining(book.endDate);
  const progress = readingProgress(book.startDate, book.endDate);

  return (
    <div
      className={`rounded-xl border ${
        isCurrent
          ? "border-amber-300 bg-amber-50 shadow-lg"
          : "border-gray-200 bg-white shadow-sm"
      } p-6 flex gap-6`}
    >
      {/* Cover */}
      <div className="flex-shrink-0">
        {book.path ? (
          <img
            src={book.path}
            alt={`Cover of ${book.title}`}
            className="w-28 h-40 object-cover rounded-md shadow"
          />
        ) : (
          <div className="w-28 h-40 rounded-md bg-amber-200 flex items-center justify-center text-4xl shadow">
            📖
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        {isCurrent && (
          <span className="inline-block text-xs font-semibold uppercase tracking-wider bg-amber-800 text-amber-50 px-2 py-0.5 rounded mb-2">
            Currently Reading
          </span>
        )}
        <h2 className="text-xl font-bold text-gray-900 leading-tight">{book.title}</h2>
        <p className="text-gray-500 text-sm mt-0.5">by {book.author}</p>
        <p className="text-amber-700 text-sm mt-2 font-medium">
          {formatDateRange(book.startDate, book.endDate)}
        </p>

        {isCurrent && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{progress}% through reading period</span>
              <span>
                {remaining > 0
                  ? `${remaining} day${remaining !== 1 ? "s" : ""} left`
                  : remaining === 0
                  ? "Last day!"
                  : "Period ended"}
              </span>
            </div>
            <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-600 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {book.description && (
          <p className="text-gray-600 text-sm mt-3 leading-relaxed line-clamp-3">
            {book.description}
          </p>
        )}
      </div>
    </div>
  );
}
