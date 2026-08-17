export function formatDate(iso: string) {
  if (!iso) return;
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(iso: string) {
  if (!iso) return;
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number) {
  if (!amount) return;
  return `Rs. ${amount.toLocaleString()}`;
}
