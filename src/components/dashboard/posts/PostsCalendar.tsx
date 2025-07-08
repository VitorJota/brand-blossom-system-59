
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import { Post, PostsCalendarProps, ViewMode } from './types';
import { PostsHeader } from './PostsHeader';
import { PostsListView } from './PostsListView';
import { PostsCalendarView } from './PostsCalendarView';
import { getPostsGroupedByDate } from './utils';

export const PostsCalendar = ({ platform }: PostsCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  
  // Mock data - será substituído por dados reais do Supabase
  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Post sobre marketing',
      content: 'Conteúdo sobre estratégias de marketing digital...',
      status: 'scheduled',
      generation_type: 'manual',
      scheduled_for: '2025-01-15T10:00:00Z',
      requires_approval: false
    },
    {
      id: '2',
      title: 'Post gerado por IA',
      content: 'Conteúdo gerado automaticamente sobre tendências...',
      status: 'pending_approval',
      generation_type: 'ai_generated',
      scheduled_for: '2025-01-20T14:00:00Z',
      requires_approval: true
    },
    {
      id: '3',
      title: 'Análise de mercado',
      content: 'Análise completa das tendências do mercado...',
      status: 'published',
      generation_type: 'manual',
      scheduled_for: '2025-01-12T08:00:00Z',
      requires_approval: false
    }
  ];

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const groupedPosts = getPostsGroupedByDate(mockPosts, currentDate);

  return (
    <Card className="w-full">
      <CardHeader>
        <PostsHeader
          platform={platform}
          currentDate={currentDate}
          viewMode={viewMode}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onViewModeChange={setViewMode}
        />
      </CardHeader>
      
      <CardContent>
        {viewMode === 'list' ? (
          <PostsListView groupedPosts={groupedPosts} />
        ) : (
          <PostsCalendarView posts={mockPosts} currentDate={currentDate} />
        )}
      </CardContent>
    </Card>
  );
};
