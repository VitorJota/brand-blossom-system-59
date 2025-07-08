
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Heart, MessageCircle, Share, Eye } from "lucide-react";

export const AnalyticsTab = () => {
  const mockMetrics = [
    {
      title: "Total de Visualizações",
      value: "45.2K",
      change: "+12.5%",
      icon: Eye,
      color: "text-blue-600"
    },
    {
      title: "Engajamento",
      value: "8.9K",
      change: "+8.2%",
      icon: Heart,
      color: "text-red-600"
    },
    {
      title: "Novos Seguidores",
      value: "1.2K",
      change: "+15.3%",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Compartilhamentos",
      value: "342",
      change: "+5.7%",
      icon: Share,
      color: "text-purple-600"
    }
  ];

  const topPosts = [
    {
      title: "Dicas de produtividade para 2025",
      platform: "LinkedIn",
      engagement: 2456,
      reach: 12500
    },
    {
      title: "Behind the scenes do nosso escritório",
      platform: "Instagram",
      engagement: 1890,
      reach: 8900
    },
    {
      title: "Lançamento do novo produto",
      platform: "Facebook",
      engagement: 1634,
      reach: 7800
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics</h2>
        <p className="text-gray-600">Acompanhe o desempenho das suas redes sociais</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">{metric.change}</span>
                  <span>vs mês anterior</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Posts com Melhor Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPosts.map((post, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-2">{post.title}</h4>
                    <p className="text-sm text-gray-600">{post.platform}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Heart className="w-3 h-3 text-red-500" />
                      <span>{post.engagement.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Eye className="w-3 h-3" />
                      <span>{post.reach.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Seguidores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                    I
                  </div>
                  <div>
                    <p className="font-medium">Instagram</p>
                    <p className="text-sm text-gray-600">12.5K seguidores</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 text-sm flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +450 esta semana
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    L
                  </div>
                  <div>
                    <p className="font-medium">LinkedIn</p>
                    <p className="text-sm text-gray-600">3.2K conexões</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 text-sm flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +120 esta semana
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold">
                    F
                  </div>
                  <div>
                    <p className="font-medium">Facebook</p>
                    <p className="text-sm text-gray-600">8.7K curtidas</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 text-sm flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +89 esta semana
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
