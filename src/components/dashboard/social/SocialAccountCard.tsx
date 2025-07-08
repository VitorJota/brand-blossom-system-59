
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, XCircle, RefreshCw, Trash2 } from "lucide-react";
import { InstagramLogo } from "@/components/icons/InstagramLogo";
import { LinkedInLogo } from "@/components/icons/LinkedInLogo";

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  display_name: string | null;
  profile_picture_url: string | null;
  is_active: boolean;
  connected_at: string;
  last_sync_at: string | null;
}

interface SocialAccountCardProps {
  account: SocialAccount;
  onSync: (accountId: string) => void;
  onDisconnect: (accountId: string) => void;
}

const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "instagram": return <InstagramLogo className="w-5 h-5" />;
    case "linkedin": return <LinkedInLogo className="w-5 h-5" />;
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

export const SocialAccountCard = ({ account, onSync, onDisconnect }: SocialAccountCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
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
            <AvatarImage src={account.profile_picture_url || ""} />
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
            onClick={() => onSync(account.id)}
          >
            <RefreshCw className="w-3 h-3" />
            Sincronizar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-200"
            onClick={() => onDisconnect(account.id)}
          >
            <Trash2 className="w-3 h-3" />
            Desconectar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
