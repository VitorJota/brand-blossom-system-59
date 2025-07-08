
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

interface UserInviteDialogProps {
  organizationId: string;
  canManageUsers: boolean;
  onInviteSent: () => void;
}

export const UserInviteDialog = ({ organizationId, canManageUsers, onInviteSent }: UserInviteDialogProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("social_media");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async () => {
    if (!email || !organizationId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_invitations')
        .insert({
          organization_id: organizationId,
          email: email,
          role: role,
          invited_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;

      toast({
        title: "Convite enviado",
        description: `Convite enviado para ${email}.`
      });

      setEmail("");
      setRole("social_media");
      setIsOpen(false);
      onInviteSent();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar convite.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!canManageUsers) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0077ff] hover:bg-[#0066dd]">
          <UserPlus className="h-4 w-4 mr-2" />
          Convidar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar Novo Usuário</DialogTitle>
          <DialogDescription>
            Envie um convite para um novo usuário se juntar à sua organização.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label htmlFor="role">Função</Label>
            <Select value={role} onValueChange={(value: UserRole) => setRole(value)} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="manager">Gerente</SelectItem>
                <SelectItem value="social_media">Social Media</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleInvite} className="w-full" disabled={isLoading}>
            <Mail className="h-4 w-4 mr-2" />
            {isLoading ? "Enviando..." : "Enviar Convite"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
