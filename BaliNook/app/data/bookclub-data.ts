import type { BookClubData } from "~/lib/types";

// Update this file to change all book club content.
// 1) Edit books[] entries
// 2) Set currentBookId to one of the book ids below
// 3) Place cover images in public/images/covers and use: /images/covers/<file-name>
export const bookClubData: BookClubData = {
  currentBookId: "never-lie-september",
  books: [
    {
      id: "what-happens-at-night-march",
      title: "What Happens at Night",
      author: "Peter Cameron",
      path: "/images/covers/WhatHappensAtNightjpg.jpg",
      startDate: "2026-03-01",
      endDate: "2026-03-31",
      description: "How goths sleep.",
    },
    {
      id: "sharp-object-april",
      title: "Sharp Objects",
      author: "Gillian Flynn",
      path: "/images/covers/SharpObjects.jpg",
      startDate: "2026-04-01",
      endDate: "2026-04-30",
      description: "Camille Preaker goes home and two girls are dead. Also the mom sucks.",
    },
    {
      id: "greenlights-may",
      title: "Greenlights",
      author: "Matthew McConaughey",
      path: "/images/covers/Greenlights.jpg",
      startDate: "2026-05-01",
      endDate: "2026-05-31",
      description: "A book about Matthew McConaughey's existential crises that he turned into a guide to life.",
    },
    {
      id: "red-rising-june",
      title: "Red Rising",
      author: "Pierce Brown",
      path: "/images/covers/RedRising.jpg",
      startDate: "2026-06-01",
      endDate: "2026-06-30",
      description: "A highschool story of a rebellion on Mars.",
    },
    {
      id: "the-stranger-july",
      title: "The Stranger",
      author: "Albert Camus",
      path: "/images/covers/TheStranger.jpg",
      startDate: "2026-07-01",
      endDate: "2026-07-31",
      description: "Beach murder is bad.",
    },
    {
      id: "the-revival-august",
      title: "The Revival",
      author: "Stephen King",
      path: "/images/covers/TheRevival.jpg",
      startDate: "2026-08-01",
      endDate: "2026-08-31",
      description: "Don't do heroin, or you'll find lovecraftian horrors.",
    },
    {
      id: "never-lie-september",
      title: "Never Lie",
      author: "Freida McFadden",
      path: "/images/covers/NeverLie.jpg",
      startDate: "2026-09-01",
      endDate: "2026-09-30",
      description: "Poor house-hunting simulator 2022.",
    },
        {
      id: "crime-and-punishment-october",
      title: "Crime and Punishment",
      author: "Fyodor Dostoevsky",
      path: "/images/covers/CrimeAndPunishment.jpg",
      startDate: "2026-10-01",
      endDate: "2026-10-31",
      description: "Pawnbrokers HATE this one trick!",
    },
  ],
};
