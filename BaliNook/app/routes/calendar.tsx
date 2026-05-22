import { Calendar } from "~/components/Calendar";
import { bookClubData } from "~/data/bookclub-data";

export function meta() {
  return [
    { title: "Calendar | BaliNook Book Club" },
    { name: "description", content: "View the BaliNook reading schedule calendar." },
  ];
}

export default function CalendarPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-3 bg-emerald-50/70 rounded-3xl ring-1 ring-emerald-100">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-emerald-700/70">
        Reading Schedule
      </h2>
      <Calendar books={bookClubData.books} />
    </div>
  );
}
