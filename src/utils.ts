export const calculateReadingTime = (text: string): string => {
  const wordsPerMinute = 200;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  if (words === 0) return "0 daqiqa";
  
  const minutes = words / wordsPerMinute;
  if (minutes < 0.5) {
    return "30 soniyadan kam";
  }
  if (minutes < 1) {
    return "1 daqiqadan kam";
  }
  return `${Math.ceil(minutes)} daqiqa o'qish`;
};

export const formatDateUz = (dateStr: string | null) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const formatted = date.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
  return formatted.replace(/([a-z]+)/i, (match) => match.charAt(0).toUpperCase() + match.slice(1));
};
