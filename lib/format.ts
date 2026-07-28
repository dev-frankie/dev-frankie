// Client-safe formatting helpers (no node/fs imports) so components that render
// inside client components (e.g. the blog tag filter) can use them.
export const formatDate = (date: string): string => {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};
