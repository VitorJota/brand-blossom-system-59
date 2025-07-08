
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart3, Settings, Users, Plus, Instagram, Linkedin, TrendingUp, Clock, Target, Sparkles } from "lucide-react";

const Dashboard = () => {
  const [userRole] = useState<'cliente' | 'gestor'>('cliente'); // This would come from auth context

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0077FF] rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Seu Post</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button className="bg-[#0077FF] hover:bg-[#0066DD] text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Novo Post
              </Button>
              <div className="w-10 h-10 bg-gradient-to-br from-[#0077FF] to-[#0066DD] rounded-full flex items-center justify-center text-white font-semibold">
                U
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Gerencie e monitore suas redes sociais de forma profissional</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Posts Agendados</CardTitle>
              <Clock className="h-5 w-5 text-[#0077FF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">12</div>
              <p className="text-xs text-green-600 font-medium">+2 desde ontem</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Alcance Total</CardTitle>
              <TrendingUp className="h-5 w-5 text-[#0077FF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">5.2K</div>
              <p className="text-xs text-green-600 font-medium">+12% esta semana</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Engajamento</CardTitle>
              <BarChart3 className="h-5 w-5 text-[#0077FF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">8.5%</div>
              <p className="text-xs text-green-600 font-medium">+0.5% desde ontem</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Redes Conectadas</CardTitle>
              <Settings className="h-5 w-5 text-[#0077FF]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">2</div>
              <p className="text-xs text-gray-600">Instagram, LinkedIn</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList className="bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <TabsTrigger value="posts" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">Posts</TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">Calendário</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">Relatórios</TabsTrigger>
            {userRole === 'gestor' && <TabsTrigger value="users" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">Usuários</TabsTrigger>}
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Posts */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Posts Recentes</CardTitle>
                    <CardDescription>Seus últimos posts publicados e agendados</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3].map((post) => (
                      <div key={post} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl bg-white/60 hover:bg-white/80 transition-colors">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl overflow-hidden">
                          <img 
                            src={`https://images.unsplash.com/photo-148859052850${post}-98d2b5aba04b?w=100&h=100&fit=crop`}
                            alt={`Post ${post}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {post % 2 === 0 ? (
                              <Instagram className="w-4 h-4 text-pink-600" />
                            ) : (
                              <Linkedin className="w-4 h-4 text-[#0077FF]" />
                            )}
                            <span className="text-sm font-medium text-gray-700">
                              {post % 2 === 0 ? 'Instagram' : 'LinkedIn'}
                            </span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                              Publicado
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {post === 1 && "🚀 Alcançamos um novo marco! Obrigado por fazer parte desta jornada incrível..."}
                            {post === 2 && "💼 Transformação digital: Como nossa empresa evoluiu nos últimos meses..."}
                            {post === 3 && "✨ Dicas valiosas para aumentar o engajamento nas suas redes sociais..."}
                          </p>
                          <div className="flex gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">❤️ {Math.floor(Math.random() * 1000) + 500}</span>
                            <span className="flex items-center gap-1">💬 {Math.floor(Math.random() * 100) + 20}</span>
                            <span className="flex items-center gap-1">🔗 {Math.floor(Math.random() * 50) + 10}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-[#0077FF]/10 text-[#0077FF] hover:bg-[#0077FF] hover:text-white border-0">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Post
                    </Button>
                    <Button className="w-full justify-start bg-[#0077FF]/10 text-[#0077FF] hover:bg-[#0077FF] hover:text-white border-0">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Post
                    </Button>
                    <Button className="w-full justify-start bg-[#0077FF]/10 text-[#0077FF] hover:bg-[#0077FF] hover:text-white border-0">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Ver Relatórios
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Redes Conectadas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-white/60">
                      <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-pink-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">Instagram</p>
                        <p className="text-xs text-gray-500">@suaempresa</p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl bg-white/60">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Linkedin className="w-5 h-5 text-[#0077FF]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">LinkedIn</p>
                        <p className="text-xs text-gray-500">Sua Empresa</p>
                      </div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Calendário de Posts</CardTitle>
                <CardDescription>Visualize e gerencie seus posts agendados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Calendário em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Relatórios de Performance</CardTitle>
                <CardDescription>Acompanhe o desempenho das suas publicações</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Relatórios em desenvolvimento</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {userRole === 'gestor' && (
            <TabsContent value="users">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gray-900">Gerenciar Usuários</CardTitle>
                  <CardDescription>Administre clientes e permissões</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Gerenciamento de usuários em desenvolvimento</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
