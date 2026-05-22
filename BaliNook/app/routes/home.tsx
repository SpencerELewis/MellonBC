export function meta() {
  return [
    { title: "BaliNook Book Club" },
    { name: "description", content: "Home page for the BaliNook Book Club." },
  ];
}

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Welcome to BaliNook</h1>
        <p className="mt-3 text-gray-600 max-w-2xl leading-relaxed">
          Keep up with what we are reading, what is coming next, and when each title runs.
          Use the navigation above to jump to the Books and Calendar pages.
        </p>
      </section>
    </div>
  );
}
