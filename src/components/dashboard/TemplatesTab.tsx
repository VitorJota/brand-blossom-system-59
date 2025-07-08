
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Edit, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TemplatesTab = () => {
  const mockTemplates = [
    {
      id: 1,
      name: "Post Promocional",
      description: "Template para posts promocionais com call-to-action",
      category: "Marketing",
      usageCount: 15,
      isPublic: false,
      content: "🎉 Oferta especial! {produto} com {desconto}% OFF por tempo limitado. Corre que acaba logo! #promo #oferta"
    },
    {
      id: 2,
      name: "Dica Rápida",
      description: "Template para compartilhar dicas e conhecimento",
      category: "Educativo",
      usageCount: 8,
      isPublic: true,
      content: "💡 Dica {numero}: {dica_titulo}\n\n{dica_conteudo}\n\nGostou? Salva esse post! 📌"
    },
    {
      id: 3,
      name: "Behind the Scenes",
      description: "Template para mostrar os bastidores",
      category: "Pessoal",
      usageCount: 22,
      isPublic: false,
      content: "🎬 Bastidores de hoje: {atividade}\n\n{descricao}\n\n#behindthescenes #trabalho"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Marketing": return "bg-purple-100 text-purple-800";
      case "Educativo": return "bg-blue-100 text-blue-800";
      case "Pessoal": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Templates de Conteúdo</h2>
          <p className="text-gray-600">Crie e gerencie templates reutilizáveis</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>
                {template.isPublic && (
                  <Badge variant="outline" className="text-xs">
                    Público
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getCategoryColor(template.category)}>
                  {template.category}
                </Badge>
                <span className="text-sm text-gray-500">
                  Usado {template.usageCount}x
                </span>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {template.content}
                </p>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm">
                    <Edit className="w-3 h-3" />
                  </Button>
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
