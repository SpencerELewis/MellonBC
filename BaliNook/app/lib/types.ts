export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  description: string;
  notes: string;
}

export interface BookClubData {
  currentBookId: string | null;
  books: Book[];
}

export interface GitHubFileResponse {
  content: string;
  sha: string;
  encoding: string;
}

export interface RepoConfig {
  owner: string;
  repo: string;
}
