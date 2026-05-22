import { useRef } from "react";
import { Link } from "react-router";
import { bookClubData } from "~/data/bookclub-data";
import { toAssetUrl } from "~/lib/asset-path";

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
  const MIN_MARQUEE_RATE = 0.08;
  const MARQUEE_REPEAT = 12;
  const marqueeTrackRef = useRef<HTMLDivElement | null>(null);
  const rateRef = useRef(1);
  const targetRateRef = useRef(1);
  const rafRef = useRef<number | null>(null);
  const marqueeCovers = Array.from({ length: covers.length * MARQUEE_REPEAT }, (_, index) => {
    return covers[index % covers.length];
  });

  function setTrackRate(value: number) {
    const clamped = Math.max(MIN_MARQUEE_RATE, Math.min(1, value));
    const track = marqueeTrackRef.current;
    if (!track) return;
    const animations = track.getAnimations();
    for (const animation of animations) {
      animation.playbackRate = clamped;
    }
    rateRef.current = clamped;
  }

  function tweenTrackRate(nextTarget: number) {
    const target = Math.max(MIN_MARQUEE_RATE, Math.min(1, nextTarget));
    if (Math.abs(targetRateRef.current - target) < 0.001) {
      return;
    }
    targetRateRef.current = target;

    const startRate = rateRef.current;
    const durationMs = 650;
    const startTime = performance.now();

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextRate = startRate + (target - startRate) * eased;
      setTrackRate(nextRate);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-20 pb-20 space-y-20 bg-amber-50/70 rounded-3xl ring-1 ring-amber-100">
      <section>
        <h1 className="text-4xl md:text-5xl font-bold text-amber-900">Welcome to BaliNook</h1>
        <p className="mt-5 text-lg md:text-xl text-amber-800/90 max-w-3xl leading-relaxed">
          Keep up with what we are reading, what is coming next, and when each title runs.
          Use the navigation above to jump to the Books and Calendar pages.
        </p>
      </section>

      <hr className="border-amber-200" />

      {covers.length > 0 && (
        <>
          <section>
            <div
              className="cover-marquee cover-marquee-bleed"
              aria-label="Scrolling book covers"
              onPointerEnter={() => tweenTrackRate(MIN_MARQUEE_RATE)}
              onPointerLeave={() => tweenTrackRate(1)}
            >
              <div
                ref={marqueeTrackRef}
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
                      src={toAssetUrl(book.path)}
                      alt={`Cover of ${book.title}`}
                      className="h-60 w-40 md:h-72 md:w-48 object-cover rounded-md"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <hr className="border-amber-200" />
        </>
      )}

      <section>
        <h2 className="text-2xl md:text-3xl font-semibold text-amber-900">Next Meeting</h2>
        <p className="mt-3 text-lg md:text-xl text-amber-800/90">{NEXT_MEETING.agenda}</p>
        <div className="mt-3 space-y-1 text-base md:text-lg text-amber-900/75">
          <p>Date: {NEXT_MEETING.date}</p>
          <p>Time: {NEXT_MEETING.time}</p>
          <p>Location: {NEXT_MEETING.location}</p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-base md:text-lg font-medium">
          <Link to="/calendar" className="text-amber-900 hover:text-amber-700 underline underline-offset-4">
            View Reading Calendar
          </Link>
          <Link to="/books" className="text-amber-900 hover:text-amber-700 underline underline-offset-4">
            Browse Books
          </Link>
        </div>
      </section>

      <hr className="border-amber-200" />

      <section>
        <h2 className="text-2xl md:text-3xl font-semibold text-amber-900">Famous Quotes</h2>
        <blockquote className="mt-3 text-lg md:text-xl text-amber-900/80 italic leading-relaxed">
          {"\"...the woman was an "}
          <strong>awful</strong>
          {" person. I know she had "}
          <strong>cancer</strong>
          {" and was dying but despite all of his efforts to care for her, it was never good enough.\""}
        </blockquote>
        <p className="mt-2 text-sm md:text-base text-amber-900/70">
        </p>
        <p className="mt-2 text-base md:text-lg text-amber-900/70 font-medium">- Danny, <em>What Happens at Night</em></p>
      </section>
    </div>
  );
}
