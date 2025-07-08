
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { useSocialAccounts } from "@/hooks/useSocialAccounts";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { InstagramLogo } from "@/components/icons/InstagramLogo";
import { LinkedInLogo } from "@/components/icons/LinkedInLogo";
import { SocialAccountCard } from "./social/SocialAccountCard";
import { AddAccountsCard } from "./social/AddAccountsCard";

export const SocialAccountsTab = () => {
  const { accounts, loading, connectInstagram, connectLinkedIn, disconnectAccount, syncAccount } = useSocialAccounts();
  const { user } = useAuth();
  const { toast } = useToast();

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

  const hasInstagram = accounts.some(acc => acc.platform === 'instagram');
  const hasLinkedIn = accounts.some(acc => acc.platform === 'linkedin');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Contas Sociais</h2>
          <p className="text-gray-600">Gerencie suas contas do Instagram e LinkedIn</p>
        </div>
      </div>

      {accounts.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma conta conectada</h3>
              <p className="text-gray-600 mb-6">Conecte suas contas do Instagram e LinkedIn para começar</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => handleConnect('instagram')}
                  className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <InstagramLogo className="w-5 h-5" />
                  <span className="font-medium">Conectar Instagram</span>
                </Button>
                
                <Button 
                  onClick={() => handleConnect('linkedin')}
                  className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  size="lg"
                >
                  <LinkedInLogo className="w-5 h-5" />
                  <span className="font-medium">Conectar LinkedIn</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <AddAccountsCard 
            onConnect={handleConnect}
            hasInstagram={hasInstagram}
            hasLinkedIn={hasLinkedIn}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accounts.map((account) => (
              <SocialAccountCard
                key={account.id}
                account={account}
                onSync={syncAccount}
                onDisconnect={disconnectAccount}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
