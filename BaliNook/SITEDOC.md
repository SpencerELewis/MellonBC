# BaliNook Book Club App

Frontend-only book club tracker built with React Router + Vite.

The app stores reading schedule data in a GitHub repository file (`data/bookclub.json`) so you can deploy for free with GitHub Pages and still share updates with everyone.

## What It Does

- Tracks the current book and reading date range
- Shows upcoming and past books
- Displays a monthly reading calendar
- Includes an admin page to add/edit/delete books and set the current book
- Saves data directly to GitHub using the Contents API
- Handles save conflicts if someone else updates between load and save

## Tech Notes

- Runtime: Node 20+
- Framework: React Router (SPA mode)
- Styling: Tailwind CSS
- Storage model:
	- Shared data: GitHub file (`data/bookclub.json`)
	- Local admin settings: browser localStorage (repo config + PAT)

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

## App Setup (First Run)

When you open the app, you will be prompted for:

- GitHub owner (user or org)
- Repository name

This tells the app where to read/write `data/bookclub.json`.

## Admin Save Permissions

To save on the Admin page, you need a GitHub Personal Access Token with write access to repository contents.

Required scope/permission:

- Fine-grained PAT: `Contents` set to `Read and write` on this repo
- Classic PAT: `repo` scope

The token is only stored in your browser localStorage.

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

The app expects this file in the repository root:

- `data/bookclub.json`

Shape:

```json
{
	"currentBookId": "book-id-or-null",
	"books": [
		{
			"id": "book-1",
			"title": "Book Title",
			"author": "Author Name",
			"coverUrl": "",
			"startDate": "2026-05-01",
			"endDate": "2026-05-31",
			"description": "",
			"notes": ""
		}
	]
}
```
