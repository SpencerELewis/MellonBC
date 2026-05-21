import { useState } from "react";
import type { Book } from "~/lib/types";

interface CalendarProps {
  books: Book[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function dateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getBooksForDate(date: string, books: Book[]): Book[] {
  return books.filter((b) => b.startDate <= date && b.endDate >= date);
}

// Returns a CSS color class based on book index in a stable way
const BOOK_COLORS = [
  "bg-amber-200 text-amber-900",
  "bg-emerald-200 text-emerald-900",
  "bg-sky-200 text-sky-900",
  "bg-violet-200 text-violet-900",
  "bg-rose-200 text-rose-900",
];

function getBookColor(book: Book, allBooks: Book[]): string {
  const idx = allBooks.findIndex((b) => b.id === book.id);
  return BOOK_COLORS[idx % BOOK_COLORS.length] ?? BOOK_COLORS[0];
}

export function Calendar({ books }: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [tooltip, setTooltip] = useState<{ text: string; day: number } | null>(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = dateStr(today.getFullYear(), today.getMonth(), today.getDate());

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  // Build grid: leading empty cells + day cells
  const cells: Array<{ day: number | null }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Previous month"
        >
          ‹
        </button>
        <h3 className="font-semibold text-gray-800">
          {MONTHS[month]} {year}
        </h3>
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((cell, i) => {
          if (!cell.day) return <div key={`empty-${i}`} />;
          const ds = dateStr(year, month, cell.day);
          const dayBooks = getBooksForDate(ds, books);
          const isToday = ds === todayStr;

          return (
            <div
              key={ds}
              className={`relative text-center rounded-md py-1 text-sm cursor-default
                ${dayBooks.length > 0 ? getBookColor(dayBooks[0], books) : "text-gray-700"}
                ${isToday ? "ring-2 ring-amber-600 ring-offset-1 font-bold" : ""}
              `}
              onMouseEnter={() => {
                if (dayBooks.length > 0) {
                  setTooltip({ text: dayBooks.map((b) => b.title).join(", "), day: cell.day! });
                }
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              {cell.day}
              {tooltip?.day === cell.day && dayBooks.length > 0 && (
                <div className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap pointer-events-none shadow-lg">
                  {tooltip.text}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {books.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {books.map((book, idx) => (
            <div key={book.id} className="flex items-center gap-1.5 text-xs text-gray-600">
              <span
                className={`w-3 h-3 rounded-sm ${BOOK_COLORS[idx % BOOK_COLORS.length]?.split(" ")[0] ?? "bg-amber-200"}`}
              />
              <span>{book.title}</span>
              <span className="text-gray-400">
                ({book.startDate} – {book.endDate})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
