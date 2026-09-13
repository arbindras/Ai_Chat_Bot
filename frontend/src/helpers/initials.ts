// Safe initials for any name — the old app crashed on single-word names
// via `name.split(" ")[1][0]` (index 1 of a 1-element array is undefined,
// then `[0]` on undefined throws).
export const getInitials = (name?: string | null): string => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
};
