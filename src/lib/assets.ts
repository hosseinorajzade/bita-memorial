/**
 * Resolve a content path from the config against the site's base URL so it works
 * whether the site is served from a domain root, a project sub-path
 * (…github.io/repo/), a custom domain, or the local dev server.
 *
 * Accepts "/assets/x.jpg", "assets/x.jpg" or "./assets/x.jpg" — all equivalent.
 */
export function asset(path: string): string {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  const base = import.meta.env.BASE_URL || '/';
  const clean = path.replace(/^\.?\//, '');
  return base.endsWith('/') ? base + clean : `${base}/${clean}`;
}
