
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { Post } from './types';
import { getDaysInMonth, getPostsForDay, getStatusColor, getStatusText } from './utils';

interface PostsCalendarViewProps {
  posts: Post[];
  currentDate: Date;
}

export const PostsCalendarView = ({ posts, currentDate }: PostsCalendarViewProps) => {
  const days = getDaysInMonth(currentDate);

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center font-medium text-gray-500 text-sm p-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const dayPosts = getPostsForDay(posts, currentDate, day);
          
          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border rounded-lg ${
                day ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
              }`}
            >
              {day && (
                <>
                  <div className="font-medium text-sm text-gray-700 mb-2">{day}</div>
                  <div className="space-y-1">
                    {dayPosts.map(post => (
                      <div
                        key={post.id}
                        className="bg-gray-50 rounded p-1 text-xs hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <Badge className={`${getStatusColor(post.status)} text-xs px-1 py-0`}>
                            {getStatusText(post.status)}
                          </Badge>
                          {post.generation_type === 'ai_generated' && (
                            <span className="text-purple-600" title="Gerado por IA">🤖</span>
                          )}
                        </div>
                        <div className="font-medium text-gray-800 truncate" title={post.title}>
                          {post.title}
                        </div>
                        {post.status === 'pending_approval' && (
                          <div className="flex gap-1 mt-1">
                            <Button size="sm" variant="outline" className="h-5 px-1 text-xs">
                              <CheckCircle className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-5 px-1 text-xs">
                              <XCircle className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
