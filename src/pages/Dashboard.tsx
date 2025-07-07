
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, BarChart3, Settings, Users, Plus, Instagram, Linkedin, TrendingUp, Clock, DollarSign } from "lucide-react";

const Dashboard = () => {
  const [userRole] = useState<'cliente' | 'gestor'>('cliente'); // This would come from auth context

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="text-xl font-bold">Bolt</span>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Novo Post
              </Button>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Gerencie suas redes sociais de forma inteligente</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts Agendados</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 desde ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Alcance Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5.2K</div>
              <p className="text-xs text-muted-foreground">+12% desde a semana passada</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engajamento</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.5%</div>
              <p className="text-xs text-muted-foreground">+0.5% desde ontem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Redes Conectadas</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Instagram, LinkedIn</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="posts" className="space-y-4">
          <TabsList>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="calendar">Calendário</TabsTrigger>
            <TabsTrigger value="analytics">Relatórios</TabsTrigger>
            {userRole === 'gestor' && <TabsTrigger value="users">Usuários</TabsTrigger>}
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Posts */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Posts Recentes</CardTitle>
                    <CardDescription>Seus últimos posts publicados</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2, 3].map((post) => (
                      <div key={post} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
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
                              <Linkedin className="w-4 h-4 text-blue-600" />
                            )}
                            <span className="text-sm font-medium">
                              {post % 2 === 0 ? 'Instagram' : 'LinkedIn'}
                            </span>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Publicado
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            Contratando mais um marco importante da nossa jornada! 
                            Chegou a hora de fazer parte desta história...
                          </p>
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            <span>❤️ {Math.floor(Math.random() * 1000)}</span>
                            <span>💬 {Math.floor(Math.random() * 100)}</span>
                            <span>🔗 {Math.floor(Math.random() * 50)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Post
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Calendar className="w-4 h-4 mr-2" />
                      Agendar Post
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Ver Relatórios
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Redes Conectadas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Instagram className="w-5 h-5 text-pink-600" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">Instagram</p>
                        <p className="text-xs text-gray-500">@suaempresa</p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">LinkedIn</p>
                        <p className="text-xs text-gray-500">Sua Empresa</p>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendário de Posts</CardTitle>
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
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Performance</CardTitle>
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
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Usuários</CardTitle>
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
