
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
  
  // Array vazio - sem dados de teste
  const mockPosts: Post[] = [];

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
