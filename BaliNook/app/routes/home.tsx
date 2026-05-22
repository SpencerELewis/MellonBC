import { Link } from "react-router";
import { bookClubData } from "~/data/bookclub-data";

const NEXT_MEETING = {
  date: "May 27, 2026",
  time: "6:00 PM",
  location: "The Post on the corner of 20th and M St",
  agenda: "Discuss Greenlights",
};

export function meta() {
  return [
    { title: "BaliNook Book Club" },
    { name: "description", content: "Home page for the BaliNook Book Club." },
  ];
}

export default function Home() {
  const covers = bookClubData.books.filter((book) => Boolean(book.path));
  const MARQUEE_REPEAT = 12;
  const marqueeCovers = Array.from({ length: covers.length * MARQUEE_REPEAT }, (_, index) => {
    return covers[index % covers.length];
  });

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-12 space-y-20">
      <section>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Welcome to BaliNook</h1>
        <p className="mt-5 text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed">
          Keep up with what we are reading, what is coming next, and when each title runs.
          Use the navigation above to jump to the Books and Calendar pages.
        </p>
      </section>

      {covers.length > 0 && (
        <section>
          <div className="cover-marquee cover-marquee-bleed" aria-label="Scrolling book covers">
            <div
              className="cover-marquee-track"
              style={{ "--marquee-shift": `${100 / MARQUEE_REPEAT}%` } as React.CSSProperties}
            >
              {marqueeCovers.map((book, index) => (
                <Link
                  key={`${book.id}-${index}`}
                  to={`/books#${book.id}`}
                  className="block relative transition-transform duration-300 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:outline-none"
                  aria-label={`Open ${book.title} in Books`}
                >
                  <img
                    src={book.path}
                    alt={`Cover of ${book.title}`}
                    className="h-60 w-40 md:h-72 md:w-48 object-cover rounded-md"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">Next Meeting</h2>
        <p className="mt-3 text-lg md:text-xl text-gray-700">{NEXT_MEETING.agenda}</p>
        <div className="mt-3 space-y-1 text-base md:text-lg text-gray-600">
          <p>Date: {NEXT_MEETING.date}</p>
          <p>Time: {NEXT_MEETING.time}</p>
          <p>Location: {NEXT_MEETING.location}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-base md:text-lg font-medium">
          <Link to="/calendar" className="text-amber-800 hover:text-amber-700 underline underline-offset-4">
            View Reading Calendar
          </Link>
          <Link to="/books" className="text-amber-800 hover:text-amber-700 underline underline-offset-4">
            Browse Books
          </Link>
        </div>
      </section>
    </div>
  );
}
