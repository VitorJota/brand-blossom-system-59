
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
  
  // Simulação com vários posts - dados de exemplo
  const mockPosts: Post[] = [
    {
      id: '1',
      title: 'Dicas de Marketing Digital para 2025',
      content: 'Descubra as principais tendências de marketing digital que vão dominar 2025. Desde IA até personalização avançada...',
      status: 'scheduled',
      generation_type: 'manual',
      scheduled_for: '2025-01-08T10:00:00Z',
      requires_approval: false
    },
    {
      id: '2',
      title: 'Como usar IA para criar conteúdo',
      content: 'A inteligência artificial está revolucionando a criação de conteúdo. Veja como implementar essas ferramentas...',
      status: 'pending_approval',
      generation_type: 'ai_generated',
      scheduled_for: '2025-01-08T14:30:00Z',
      requires_approval: true
    },
    {
      id: '3',
      title: 'Análise de Mercado - Janeiro 2025',
      content: 'Análise completa das tendências do mercado digital no primeiro trimestre. Insights e oportunidades...',
      status: 'published',
      generation_type: 'manual',
      scheduled_for: '2025-01-07T08:00:00Z',
      requires_approval: false
    },
    {
      id: '4',
      title: 'Post sobre Sustentabilidade',
      content: 'A sustentabilidade não é mais uma opção, é uma necessidade. Veja como sua empresa pode contribuir...',
      status: 'scheduled',
      generation_type: 'ai_generated',
      scheduled_for: '2025-01-09T16:00:00Z',
      requires_approval: false
    },
    {
      id: '5',
      title: 'Estratégias de Engagement',
      content: 'Como aumentar o engagement nas redes sociais com técnicas comprovadas. Exemplos práticos e cases...',
      status: 'pending_approval',
      generation_type: 'ai_generated',
      scheduled_for: '2025-01-10T11:00:00Z',
      requires_approval: true,
      rejection_reason: null
    },
    {
      id: '6',
      title: 'Tendências de Design 2025',
      content: 'As principais tendências de design que vão marcar 2025. Cores, tipografias, layouts e muito mais...',
      status: 'draft',
      generation_type: 'manual',
      scheduled_for: '2025-01-12T13:00:00Z',
      requires_approval: false
    },
    {
      id: '7',
      title: 'ROI em Marketing Digital',
      content: 'Como calcular e otimizar o retorno sobre investimento em campanhas digitais. Métricas essenciais...',
      status: 'published',
      generation_type: 'manual',
      scheduled_for: '2025-01-06T09:30:00Z',
      requires_approval: false
    },
    {
      id: '8',
      title: 'Automação de Processos',
      content: 'Automatize tarefas repetitivas e foque no que realmente importa. Ferramentas e estratégias...',
      status: 'failed',
      generation_type: 'ai_generated',
      scheduled_for: '2025-01-08T18:00:00Z',
      requires_approval: false
    },
    {
      id: '9',
      title: 'Customer Experience em 2025',
      content: 'A experiência do cliente continua sendo prioridade. Veja como se destacar no mercado...',
      status: 'scheduled',
      generation_type: 'manual',
      scheduled_for: '2025-01-11T15:30:00Z',
      requires_approval: false
    },
    {
      id: '10',
      title: 'Inovação em E-commerce',
      content: 'As últimas inovações que estão transformando o e-commerce. Tecnologias emergentes e oportunidades...',
      status: 'pending_approval',
      generation_type: 'ai_generated',
      scheduled_for: '2025-01-13T12:00:00Z',
      requires_approval: true
    },
    {
      id: '11',
      title: 'Métricas de Social Media',
      content: 'Quais métricas realmente importam nas redes sociais? Guia completo para análise de performance...',
      status: 'published',
      generation_type: 'manual',
      scheduled_for: '2025-01-05T07:00:00Z',
      requires_approval: false
    },
    {
      id: '12',
      title: 'Inteligência Artificial no Varejo',
      content: 'Como a IA está revolucionando o setor de varejo. Cases de sucesso e implementações práticas...',
      status: 'scheduled',
      generation_type: 'ai_generated',
      scheduled_for: '2025-01-14T10:45:00Z',
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
