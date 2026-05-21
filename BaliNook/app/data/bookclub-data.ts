import type { BookClubData } from "~/lib/types";

// Update this file to change all book club content.
// 1) Edit books[] entries
// 2) Set currentBookId to one of the book ids below
export const bookClubData: BookClubData = {
  currentBookId: "greenlights-may",
  books: [
    {
      id: "what-happens-at-night-march",
      title: "What Happens at Night",
      author: "Peter Cameron",
      coverUrl: "",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      description: "March selection.",
    },
    {
      id: "sharp-object-april",
      title: "Sharp Object",
      author: "Gillian Flynn",
      coverUrl: "",
      startDate: "2026-04-01",
      endDate: "2026-04-30",
      description: "April selection.",
    },
    {
      id: "greenlights-may",
      title: "Greenlights",
      author: "Matthew McConaughey",
      coverUrl: "",
      startDate: "2026-05-01",
      endDate: "2026-05-31",
      description: "May selection.",
    },
  ],
};
