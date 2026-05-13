export function formatHours(h: number): string {
  if (h >= 10000) return (h / 1000).toFixed(1) + "k h";
  return h.toLocaleString("en-US") + " h";
}

export function formatHoursShort(h: number): string {
  if (h >= 1000) return (h / 1000).toFixed(1) + "k";
  return h.toLocaleString("en-US");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const day = 86400000;
  const months = Math.floor(diff / (day * 30));
  if (months < 1) {
    const days = Math.floor(diff / day);
    if (days < 1) return "today";
    if (days < 2) return "yesterday";
    return `${days} days ago`;
  }
  if (months < 12) return `${months} mo ago`;
  const years = (months / 12).toFixed(1);
  return `${years} yr ago`;
}

export function pumpStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
