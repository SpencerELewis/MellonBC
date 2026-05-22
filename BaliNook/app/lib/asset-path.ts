export function toAssetUrl(path: string): string {
  if (!path) return path;

  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) {
    return path;
  }

  if (path.startsWith("/")) {
    const base = import.meta.env.BASE_URL || "/";
    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    return `${normalizedBase}${path}`;
  }

  return path;
}
