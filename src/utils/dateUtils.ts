export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getDaysUntilDue = (dueDate: string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getUrgencyLevel = (dueDate: string): 'low' | 'medium' | 'high' | 'urgent' => {
  const days = getDaysUntilDue(dueDate);
  if (days < 0) return 'urgent';
  if (days <= 1) return 'urgent';
  if (days <= 3) return 'high';
  if (days <= 7) return 'medium';
  return 'low';
};