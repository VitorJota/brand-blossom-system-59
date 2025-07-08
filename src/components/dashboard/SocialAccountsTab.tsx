
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle, XCircle, RefreshCw, Trash2, Instagram, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSocialAccounts } from "@/hooks/useSocialAccounts";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const SocialAccountsTab = () => {
  const { accounts, loading, connectInstagram, connectLinkedIn, disconnectAccount, syncAccount } = useSocialAccounts();
  const { user } = useAuth();
  const { toast } = useToast();

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "instagram": return <Instagram className="w-5 h-5" />;
      case "linkedin": return <Linkedin className="w-5 h-5" />;
      default: return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "instagram": return "bg-gradient-to-r from-purple-500 to-pink-500";
      case "linkedin": return "bg-blue-600";
      default: return "bg-gray-500";
    }
  };

  const handleConnect = (platform: 'instagram' | 'linkedin') => {
    if (!user) {
      toast({
        title: "Erro de autenticação",
        description: "Você precisa estar logado para conectar contas.",
        variant: "destructive"
      });
      return;
    }

    if (platform === 'instagram') {
      connectInstagram();
    } else if (platform === 'linkedin') {
      connectLinkedIn();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin text-[#0077ff]" />
        <span className="ml-2 text-gray-600">Carregando contas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Contas Sociais</h2>
          <p className="text-gray-600">Gerencie suas contas do Instagram e LinkedIn</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => handleConnect('instagram')}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            disabled={accounts.some(acc => acc.platform === 'instagram')}
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </Button>
          <Button 
            onClick={() => handleConnect('linkedin')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            disabled={accounts.some(acc => acc.platform === 'linkedin')}
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </Button>
        </div>
      </div>

      {accounts.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Nenhuma conta conectada</h3>
              <p className="text-gray-600">Conecte suas contas do Instagram e LinkedIn para começar</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${getPlatformColor(account.platform)} flex items-center justify-center text-white`}>
                      {getPlatformIcon(account.platform)}
                    </div>
                    <div>
                      <CardTitle className="text-lg capitalize">{account.platform}</CardTitle>
                      <p className="text-sm text-gray-600">@{account.username}</p>
                    </div>
                  </div>
                  {account.is_active ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={account.profile_picture_url} />
                    <AvatarFallback>{account.display_name?.charAt(0) || account.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{account.display_name || account.username}</p>
                    <p className="text-sm text-gray-600">Conta conectada</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Conectada em:</span>
                  <span>{new Date(account.connected_at).toLocaleDateString('pt-BR')}</span>
                </div>

                {account.last_sync_at && (
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Última sincronização:</span>
                    <span>{new Date(account.last_sync_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Badge variant={account.is_active ? "default" : "secondary"}>
                    {account.is_active ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
                
                <div className="flex justify-between pt-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1"
                    onClick={() => syncAccount(account.id)}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Sincronizar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-200"
                    onClick={() => disconnectAccount(account.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Desconectar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-blue-600 text-sm font-medium">ℹ</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Configuração necessária</p>
              <p className="text-blue-700">
                Para usar as integrações reais do Instagram e LinkedIn, você precisa configurar as credenciais OAuth nas variáveis de ambiente do Supabase:
              </p>
              <ul className="list-disc list-inside mt-2 text-blue-700 space-y-1">
                <li>INSTAGRAM_CLIENT_ID e INSTAGRAM_CLIENT_SECRET</li>
                <li>LINKEDIN_CLIENT_ID e LINKEDIN_CLIENT_SECRET</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
