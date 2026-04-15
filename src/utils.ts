export const formatReminderTime = (timestamp?: number): string => {
  if (!timestamp || isNaN(timestamp)) return "Vaqt belgilanmagan";
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return "Noto'g'ri vaqt";

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
  let datePart = date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' });
  
  if (targetDate.getTime() === today.getTime()) {
    datePart = 'Bugun';
  } else if (targetDate.getTime() === tomorrow.getTime()) {
    datePart = 'Ertaga';
  }

  const timePart = date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  return `${datePart}, ${timePart}`;
};

export const formatDateUz = (dateStr: string | null) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Noto'g'ri sana";
  const formatted = date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
  return formatted.replace(/([a-z]+)/i, (match) => match.charAt(0).toUpperCase() + match.slice(1));
};
