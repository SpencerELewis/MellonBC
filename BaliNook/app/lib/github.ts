import type { BookClubData } from "./types";

const DATA_PATH = "data/bookclub.json";

export async function fetchBookClubData(
  owner: string,
  repo: string
): Promise<{ data: BookClubData; sha: string }> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${DATA_PATH}`;
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json" },
    // Bypass cache so we always get the latest committed version
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(
        "DATA_NOT_FOUND: The data file does not exist yet. Visit the Admin page to initialize it."
      );
    }
    throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
  }

  const file = await res.json() as { content: string; sha: string };
  const decoded = decodeURIComponent(
    escape(atob(file.content.replace(/\n/g, "")))
  );
  return { data: JSON.parse(decoded) as BookClubData, sha: file.sha };
}

export async function saveBookClubData(
  owner: string,
  repo: string,
  pat: string,
  data: BookClubData,
  sha: string | null
): Promise<string> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${DATA_PATH}`;
  const content = btoa(
    unescape(encodeURIComponent(JSON.stringify(data, null, 2)))
  );

  const body: Record<string, unknown> = {
    message: "Update book club data",
    content,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${pat}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (res.status === 409) {
    throw new Error(
      "CONFLICT: Someone else saved changes after you loaded this page. Refresh to get the latest data before saving again."
    );
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string };
    throw new Error(err.message ?? `Save failed: ${res.status}`);
  }

  const result = await res.json() as { content: { sha: string } };
  return result.content.sha;
}
