# BaliNook Book Club App

Frontend-only book club tracker built with React Router + Vite.

The app is now fully static. All book data is controlled in one local file:

- `app/data/bookclub-data.ts`

## What It Does

- Tracks the current book and reading date range
- Shows upcoming and past books
- Displays a monthly reading calendar
- Highlights the current selection from `currentBookId`

## Tech Notes

- Runtime: Node 20+
- Framework: React Router (SPA mode)
- Styling: Tailwind CSS
- Data source: static TypeScript object in `app/data/bookclub-data.ts`

## Local Development

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Build:

```bash
npm run build
```

## Updating Book Data

Edit only this file:

- `app/data/bookclub-data.ts`

Set:

- `currentBookId` to the `id` of the active book
- `books` array to add/remove/update books

Then commit and push changes.

## Deployment (GitHub Pages)

This repo includes a workflow at `.github/workflows/deploy.yml` that deploys the built client app to GitHub Pages on push to `main`.

### Steps

1. In GitHub repo settings, enable Pages with source set to `GitHub Actions`.
2. If your site is hosted at `https://username.github.io/REPO_NAME/`, add repository variable:
	 - `VITE_BASE_PATH` = `/REPO_NAME/`
3. Push to `main`.

### SPA Route Handling

`public/404.html` is included to support direct deep links on GitHub Pages.

## Data File Format

The app expects this structure inside `app/data/bookclub-data.ts`:

Shape:

```ts
export const bookClubData = {
  currentBookId: "book-id-or-null",
  books: [
    {
      id: "book-1",
      title: "Book Title",
      author: "Author Name",
      path: "",
      startDate: "2026-05-01",
      endDate: "2026-05-31",
      description: "",
      notes: "",
    },
  ],
};
```
