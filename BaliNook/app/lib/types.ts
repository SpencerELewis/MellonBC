export interface Book {
  id: string;
  title: string;
  author: string;
  path: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  description: string;
}

export interface BookClubData {
  currentBookId: string | null;
  books: Book[];
}
