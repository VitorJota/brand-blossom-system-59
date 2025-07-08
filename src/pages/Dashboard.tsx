
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, User, Shield, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Bem-vindo ao seu painel de controle</p>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuário</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.email}</div>
              <p className="text-xs text-muted-foreground">
                ID: {user?.id?.substring(0, 8)}...
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Ativo</div>
              <p className="text-xs text-muted-foreground">
                Conta verificada
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Login</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Agora</div>
              <p className="text-xs text-muted-foreground">
                Sessão ativa
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Sistema Implementado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-green-600">✅ Recursos de Segurança</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Autenticação com Supabase</li>
                  <li>• Row Level Security (RLS)</li>
                  <li>• Proteção contra tentativas de login</li>
                  <li>• Triggers de segurança</li>
                  <li>• Estrutura preparada para 2FA</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-blue-600">🚀 Recursos de Escalabilidade</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Arquitetura multi-tenant</li>
                  <li>• Índices otimizados</li>
                  <li>• Funções Security Definer</li>
                  <li>• Sistema de organizações</li>
                  <li>• Estrutura para redes sociais</li>
                </ul>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg mt-4">
              <p className="text-sm text-blue-800">
                <strong>Próximos passos:</strong> O sistema está preparado para implementação de 2FA via email usando Resend, 
                gerenciamento de posts, integração com redes sociais e analytics avançados.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
