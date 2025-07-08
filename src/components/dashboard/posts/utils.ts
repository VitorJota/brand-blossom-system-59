
import { Post } from './types';

export const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const days = [];
  
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }
  
  return days;
};

export const getPostsForDay = (posts: Post[], currentDate: Date, day: number) => {
  if (!day) return [];
  
  const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  return posts.filter(post => {
    if (!post.scheduled_for) return false;
    const postDate = new Date(post.scheduled_for);
    return postDate.toDateString() === dayDate.toDateString();
  });
};

export const getPostsGroupedByDate = (posts: Post[], currentDate: Date) => {
  const grouped = new Map<string, Post[]>();
  
  posts.forEach(post => {
    if (!post.scheduled_for) return;
    
    const postDate = new Date(post.scheduled_for);
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    if (postDate.getFullYear() === currentYear && postDate.getMonth() === currentMonth) {
      const dateKey = postDate.toDateString();
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(post);
    }
  });
  
  return Array.from(grouped.entries())
    .map(([date, posts]) => ({ date: new Date(date), posts }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'published': return 'bg-green-100 text-green-800 border-green-200';
    case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'pending_approval': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'failed': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusText = (status: string) => {
  switch (status) {
    case 'published': return 'Publicado';
    case 'scheduled': return 'Agendado';
    case 'pending_approval': return 'Pendente';
    case 'draft': return 'Rascunho';
    case 'failed': return 'Erro';
    default: return status;
  }
};

export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(date);
};

export const formatTime = (dateString: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

export const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
