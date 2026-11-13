/**
 * The pages between previous and next: the first and last pages, `siblings`
 * pages around the current one and `null` for each gap, keeping the count
 * constant as the page moves.
 */
export function paginationRange(page: number, count: number, siblings: number): (number | null)[] {
  const all = (to: number) => Array.from({ length: to }, (_, index) => index + 1);
  if (count <= 2 * siblings + 5) return all(count);
  const start = Math.max(Math.min(page - siblings, count - 2 * siblings - 2), 3);
  const end = Math.min(Math.max(page + siblings, 2 * siblings + 3), count - 2);
  const middle = Array.from({ length: end - start + 1 }, (_, index) => start + index);
  return [1, start > 3 ? null : 2, ...middle, end < count - 2 ? null : count - 1, count];
}
