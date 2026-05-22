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

function dateToStr(date: Date): string {
  return dateStr(date.getFullYear(), date.getMonth(), date.getDate());
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

function buildMonthCells(year: number, month: number): Array<{ day: number | null }> {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<{ day: number | null }> = [];

  for (let i = 0; i < firstDay; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d });

  return cells;
}

export function Calendar({ books }: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const todayStr = dateStr(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setYear((y) => y - 1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Previous year"
        >
          ‹
        </button>
        <h3 className="font-semibold text-gray-800">Reading Year: {year}</h3>
        <button
          onClick={() => setYear((y) => y + 1)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Next year"
        >
          ›
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MONTHS.map((monthName, monthIdx) => {
          const cells = buildMonthCells(year, monthIdx);
          const monthStart = dateToStr(new Date(year, monthIdx, 1));
          const monthEnd = dateToStr(new Date(year, monthIdx + 1, 0));
          const monthBooks = books.filter((b) => b.startDate <= monthEnd && b.endDate >= monthStart);

          return (
            <section key={`${year}-${monthIdx}`} className="rounded-lg border border-gray-200 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-gray-700">{monthName}</h4>
                {monthBooks.length > 0 && (
                  <div className="max-w-[70%] rounded border border-gray-300 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-700">
                    {monthBooks.map((b) => b.title).join(", ")}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                  <div key={`${monthName}-${d}`} className="text-center text-[10px] font-medium text-gray-400 py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0.5">
                {cells.map((cell, i) => {
                  if (!cell.day) return <div key={`${monthName}-empty-${i}`} className="h-6" />;

                  const ds = dateStr(year, monthIdx, cell.day);
                  const dayBooks = getBooksForDate(ds, books);
                  const isToday = ds === todayStr;
                  const hasBook = dayBooks.length > 0;

                  return (
                    <div
                      key={ds}
                      className={`relative h-6 text-center rounded-md text-xs leading-6 cursor-default
                        ${hasBook ? getBookColor(dayBooks[0], books) : "text-gray-700"}
                        ${isToday ? "ring-2 ring-amber-600 ring-offset-1 font-bold" : ""}
                      `}
                    >
                      {cell.day}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <p className="text-xs text-gray-400 mt-3">
        Only dates that fall within a book period are color-filled.
      </p>
    </div>
  );
}
