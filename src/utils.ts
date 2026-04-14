export const formatReminderTime = (timestamp?: number): string => {
  if (!timestamp || isNaN(timestamp)) return "Vaqt belgilanmagan";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "Noto'g'ri vaqt";
  return date.toLocaleString('uz-UZ', { 
    day: 'numeric', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

export const formatDateUz = (dateStr: string | null) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Noto'g'ri sana";
  const formatted = date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
  return formatted.replace(/([a-z]+)/i, (match) => match.charAt(0).toUpperCase() + match.slice(1));
};
