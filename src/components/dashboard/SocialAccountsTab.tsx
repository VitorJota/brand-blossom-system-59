
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const SocialAccountsTab = () => {
  const mockAccounts = [
    {
      id: 1,
      platform: "Instagram",
      username: "@meuinsta",
      displayName: "Meu Instagram",
      isActive: true,
      followers: "12.5K",
      lastSync: "2025-01-08 14:30",
      profilePicture: "/placeholder.svg"
    },
    {
      id: 2,
      platform: "LinkedIn",
      username: "meu-linkedin",
      displayName: "Meu LinkedIn",
      isActive: true,
      followers: "3.2K",
      lastSync: "2025-01-08 12:15",
      profilePicture: "/placeholder.svg"
    },
    {
      id: 3,
      platform: "Facebook",
      username: "minha-pagina",
      displayName: "Minha Página FB",
      isActive: false,
      followers: "8.7K",
      lastSync: "2025-01-05 09:20",
      profilePicture: "/placeholder.svg"
    }
  ];

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "Instagram": return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "LinkedIn": return "bg-blue-600";
      case "Facebook": return "bg-blue-700";
      case "Twitter": return "bg-sky-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Contas Sociais</h2>
          <p className="text-gray-600">Gerencie suas contas conectadas</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Conectar Conta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAccounts.map((account) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${getPlatformColor(account.platform)} flex items-center justify-center text-white font-bold text-sm`}>
                    {account.platform.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{account.platform}</CardTitle>
                    <p className="text-sm text-gray-600">{account.username}</p>
                  </div>
                </div>
                {account.isActive ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={account.profilePicture} />
                  <AvatarFallback>{account.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{account.displayName}</p>
                  <p className="text-sm text-gray-600">{account.followers} seguidores</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Última sincronização:</span>
                <span>{new Date(account.lastSync).toLocaleString('pt-BR')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant={account.isActive ? "default" : "secondary"}>
                  {account.isActive ? "Ativa" : "Inativa"}
                </Badge>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  Sincronizar
                </Button>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
