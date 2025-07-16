
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
  
  // Simulação com vários posts para julho de 2025 - dados de exemplo
  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Dicas de Marketing Digital para Q3 2025',
      content: 'Descubra as principais tendências de marketing digital que vão dominar o terceiro trimestre de 2025. Desde IA até personalização avançada...',
      status: 'scheduled',
      generation_type: 'manual',
      scheduled_for: '2025-07-02T10:00:00Z',
      requires_approval: false
    },
    {
      id: '2',
      title: 'Como usar IA para criar conteúdo visual',
      content: 'A inteligência artificial está revolucionando a criação de conteúdo visual no Instagram. Veja como implementar essas ferramentas...',
      status: 'pending_approval',
      generation_type: 'ai_generated',
      scheduled_for: '2025-07-05T14:30:00Z',
      requires_approval: true
    },
    {
      id: '3',
      title: 'Análise de Mercado - Meio do Ano',
      content: 'Análise completa das tendências do mercado digital no meio de 2025. Insights e oportunidades para o segundo semestre...',
      status: 'published',
      generation_type: 'manual',
      scheduled_for: '2025-07-08T08:00:00Z',
      requires_approval: false
    },
    {
      id: '4',
      title: 'Post sobre Sustentabilidade no Verão',
      content: 'A sustentabilidade no verão: dicas práticas para empresas e consumidores. Como sua marca pode contribuir...',
      status: 'scheduled',
      generation_type: 'ai_generated',
      scheduled_for: '2025-07-12T16:00:00Z',
      requires_approval: false
    },
    {
      id: '5',
      title: 'Estratégias de Engagement para Julho',
      content: 'Como aumentar o engagement no Instagram durante o verão. Técnicas comprovadas e exemplos práticos...',
      status: 'pending_approval',
      generation_type: 'ai_generated',
      scheduled_for: '2025-07-15T11:00:00Z',
      requires_approval: true,
      rejection_reason: null
    },
    {
      id: '6',
      title: 'Tendências de Design Verão 2025',
      content: 'As principais tendências visuais para o verão de 2025. Cores quentes, tipografias modernas e layouts dinâmicos...',
      status: 'draft',
      generation_type: 'manual',
      scheduled_for: '2025-07-18T13:00:00Z',
      requires_approval: false
    },
    {
      id: '7',
      title: 'ROI em Campanhas de Verão',
      content: 'Como calcular e otimizar o retorno sobre investimento em campanhas de verão no Instagram. Métricas essenciais...',
      status: 'published',
      generation_type: 'manual',
      scheduled_for: '2025-07-20T09:30:00Z',
      requires_approval: false
    },
    {
      id: '8',
      title: 'Automação de Stories',
      content: 'Automatize seus stories do Instagram e mantenha presença constante. Ferramentas e estratégias para o verão...',
      status: 'failed',
      generation_type: 'ai_generated',
      scheduled_for: '2025-07-22T18:00:00Z',
      requires_approval: false
    },
    {
      id: '9',
      title: 'Customer Experience no Instagram',
      content: 'Como proporcionar uma experiência excepcional aos seus seguidores. Estratégias para se destacar no feed...',
      status: 'scheduled',
      generation_type: 'manual',
      scheduled_for: '2025-07-25T15:30:00Z',
      requires_approval: false
    },
    {
      id: '10',
      title: 'Inovação em Reels',
      content: 'As últimas inovações em Reels que estão transformando o Instagram. Tendências e oportunidades criativas...',
      status: 'pending_approval',
      generation_type: 'ai_generated',
      scheduled_for: '2025-07-28T12:00:00Z',
      requires_approval: true
    },
    {
      id: '11',
      title: 'Métricas do Instagram que Importam',
      content: 'Quais métricas realmente importam no Instagram? Guia completo para análise de performance no verão...',
      status: 'published',
      generation_type: 'manual',
      scheduled_for: '2025-07-30T07:00:00Z',
      requires_approval: false
    },
    {
      id: '12',
      title: 'Stories Interativos para Julho',
      content: 'Como criar stories interativos que engajam no verão. Polls, quizzes e outras ferramentas criativas...',
      status: 'scheduled',
      generation_type: 'ai_generated',
      scheduled_for: '2025-07-31T10:45:00Z',
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
