
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Camera, Save } from "lucide-react";

export const ProfileTab = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Perfil do Usuário</h2>
        <p className="text-gray-600">Gerencie suas informações pessoais</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Foto do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="outline" className="w-full">
              Alterar Foto
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input id="firstName" placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input id="lastName" placeholder="Seu sobrenome" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={user?.email || ''} 
                disabled 
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">
                O email não pode ser alterado
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Fuso Horário</Label>
                <Input id="timezone" placeholder="America/Sao_Paulo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locale">Idioma</Label>
                <Input id="locale" placeholder="pt-BR" />
              </div>
            </div>
            
            <Button className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Notificações por Email</h4>
              <p className="text-sm text-gray-600">Receba notificações sobre seus posts e analytics</p>
            </div>
            <Button variant="outline" size="sm">
              Configurar
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Segurança da Conta</h4>
              <p className="text-sm text-gray-600">Altere sua senha e configure 2FA</p>
            </div>
            <Button variant="outline" size="sm">
              Gerenciar
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg border-red-200">
            <div>
              <h4 className="font-medium text-red-700">Excluir Conta</h4>
              <p className="text-sm text-gray-600">Exclua permanentemente sua conta e todos os dados</p>
            </div>
            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
              Excluir
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
