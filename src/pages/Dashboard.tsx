
import { useAuth } from "@/hooks/useAuth";
import { useOrganization } from "@/hooks/useOrganization";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, BarChart3, Users, Settings } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { currentOrg, organizations } = useOrganization();

  if (!currentOrg && organizations.length === 0) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bem-vindo ao Social Media Manager!
          </h2>
          <p className="text-gray-600 mb-8">
            Você precisa criar uma organização para começar
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeira Organização
          </Button>
        </div>
      </AppLayout>
    );
  }

  const stats = [
    {
      title: "Posts Agendados",
      value: "24",
      description: "Para os próximos 7 dias",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Total de Impressões",
      value: "12.5K",
      description: "Últimos 30 dias",
      icon: BarChart3,
      color: "text-green-600"
    },
    {
      title: "Membros da Equipe",
      value: "3",
      description: "Ativos na organização",
      icon: Users,
      color: "text-purple-600"
    }
  ];

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Olá, {user?.user_metadata?.first_name || 'usuário'}! 👋
            </h1>
            <p className="text-gray-600">
              {currentOrg ? `Gerenciando ${currentOrg.name}` : 'Selecione uma organização para começar'}
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Post
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Calendar className="h-8 w-8 text-blue-600 mx-auto" />
              <CardTitle className="text-lg">Agendar Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Crie e agende conteúdo para suas redes sociais
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <BarChart3 className="h-8 w-8 text-green-600 mx-auto" />
              <CardTitle className="text-lg">Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Analise o desempenho dos seus posts
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto" />
              <CardTitle className="text-lg">Equipe</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Gerencie membros e permissões
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <Settings className="h-8 w-8 text-gray-600 mx-auto" />
              <CardTitle className="text-lg">Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Configure contas e integrações
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações realizadas na sua organização
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-sm">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Post publicado no Instagram</span>
                <span className="text-gray-400">há 2 horas</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Novo post agendado para LinkedIn</span>
                <span className="text-gray-400">há 4 horas</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Membro adicionado à equipe</span>
                <span className="text-gray-400">ontem</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
