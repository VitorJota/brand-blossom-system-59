
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Send, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const PostsTab = () => {
  const mockPosts = [
    {
      id: 1,
      title: "Post sobre marketing digital",
      content: "Dicas essenciais para aumentar o engajamento nas redes sociais...",
      status: "published",
      scheduledFor: "2025-01-10 10:00",
      platforms: ["Instagram", "LinkedIn"]
    },
    {
      id: 2,
      title: "Lançamento do novo produto",
      content: "Estamos empolgados em anunciar o lançamento do nosso novo produto...",
      status: "scheduled",
      scheduledFor: "2025-01-12 14:30",
      platforms: ["Facebook", "Twitter"]
    },
    {
      id: 3,
      title: "Behind the scenes",
      content: "Confira como é o dia a dia da nossa equipe...",
      status: "draft",
      scheduledFor: null,
      platforms: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-100 text-green-800";
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "published": return "Publicado";
      case "scheduled": return "Agendado";
      case "draft": return "Rascunho";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Posts</h2>
          <p className="text-gray-600">Crie, agende e publique conteúdo nas redes sociais</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                <Badge className={getStatusColor(post.status)}>
                  {getStatusText(post.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
              
              {post.scheduledFor && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.scheduledFor).toLocaleString('pt-BR')}
                </div>
              )}
              
              {post.platforms.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.platforms.map((platform) => (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Edit className="w-3 h-3" />
                  Editar
                </Button>
                <div className="flex gap-1">
                  {post.status === "draft" && (
                    <Button size="sm" className="flex items-center gap-1">
                      <Send className="w-3 h-3" />
                      Publicar
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
