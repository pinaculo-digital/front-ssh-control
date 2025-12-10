import { PUBLIC_BASE } from "$env/static/public";

export function assets(path: string) {
  const base = PUBLIC_BASE;
  return `${base}${path}`;
}
