
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronLeft, ChevronRight, Plus, CheckCircle, XCircle, List, Grid } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
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

  const getDaysInMonth = (date: Date) => {
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

  const getPostsForDay = (day: number) => {
    if (!day) return [];
    
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return mockPosts.filter(post => {
      if (!post.scheduled_for) return false;
      const postDate = new Date(post.scheduled_for);
      return postDate.toDateString() === dayDate.toDateString();
    });
  };

  const getPostsGroupedByDate = () => {
    const grouped = new Map<string, Post[]>();
    
    mockPosts.forEach(post => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date);
  };

  const formatTime = (dateString: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateString));
  };

  const days = getDaysInMonth(currentDate);
  const groupedPosts = getPostsGroupedByDate();
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
            
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-r-none"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="rounded-l-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
            
            <Button size="sm" className="ml-2">
              <Plus className="w-4 h-4 mr-1" />
              Novo Post
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {viewMode === 'list' ? (
          <div className="space-y-6">
            {groupedPosts.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum post agendado para este mês</p>
              </div>
            ) : (
              groupedPosts.map(({ date, posts }) => (
                <div key={date.toDateString()} className="border-l-4 border-blue-500 pl-6 pb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                      {date.getDate()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg capitalize">{formatDate(date)}</h3>
                      <p className="text-sm text-gray-500">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {posts.map(post => (
                      <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-gray-900">{post.title}</h4>
                              {post.generation_type === 'ai_generated' && (
                                <span className="text-purple-600 text-sm" title="Gerado por IA">🤖</span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.content}</p>
                            <div className="flex items-center gap-3">
                              <Badge className={`${getStatusColor(post.status)} text-xs`}>
                                {getStatusText(post.status)}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatTime(post.scheduled_for!)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {post.status === 'pending_approval' && (
                              <>
                                <Button size="sm" variant="outline" className="h-8 px-3">
                                  <CheckCircle className="w-4 h-4 mr-1 text-green-600" />
                                  Aprovar
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 px-3">
                                  <XCircle className="w-4 h-4 mr-1 text-red-600" />
                                  Rejeitar
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              •••
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};
