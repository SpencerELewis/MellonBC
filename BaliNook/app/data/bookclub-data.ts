import type { BookClubData } from "~/lib/types";

// Update this file to change all book club content.
// 1) Edit books[] entries
// 2) Set currentBookId to one of the book ids below
export const bookClubData: BookClubData = {
  currentBookId: "book-demo-1",
  books: [
    {
      id: "book-demo-1",
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
      coverUrl: "",
      startDate: "2026-05-01",
      endDate: "2026-05-31",
      description:
        "The riveting first-person narrative of Kvothe, a legendary figure and one of the most infamous wizards his world has ever seen. From his childhood in a troupe of traveling players, to years spent as a near-feral orphan in a crime-ridden city, to his time as a student of magic, this is a definitive portrait of a magician.",
      notes: "Discussion night: May 28th at 7pm. Chapters 1-40 for first session.",
    },
  ],
};
