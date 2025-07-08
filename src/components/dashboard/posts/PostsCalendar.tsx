
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Plus, CheckCircle, XCircle, Clock, Edit } from "lucide-react";
import { useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'pending_approval';
  generation_type: 'manual' | 'ai_generated';
  scheduled_for: string | null;
  requires_approval: boolean;
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
}

interface PostsCalendarProps {
  platform: 'instagram' | 'linkedin';
}

export const PostsCalendar = ({ platform }: PostsCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
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
    }
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Adicionar dias vazios do início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Adicionar dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const getPostsForDay = (day: number) => {
    if (!day) return [];
    
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return mockPosts.filter(post => {
      if (!post.scheduled_for) return false;
      const postDate = new Date(post.scheduled_for);
      return postDate.toDateString() === dayDate.toDateString();
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'scheduled': return 'Agendado';
      case 'pending_approval': return 'Pendente';
      case 'draft': return 'Rascunho';
      case 'failed': return 'Erro';
      default: return status;
    }
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const days = getDaysInMonth(currentDate);
  const platformIcon = platform === 'instagram' ? '📷' : '💼';

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{platformIcon}</span>
            {platform === 'instagram' ? 'Instagram' : 'LinkedIn'}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button variant="outline" size="sm" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button size="sm" className="ml-4">
              <Plus className="w-4 h-4 mr-1" />
              Novo Post
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-center font-medium text-gray-500 text-sm p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const posts = getPostsForDay(day);
            
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
                      {posts.map(post => (
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
      </CardContent>
    </Card>
  );
};
