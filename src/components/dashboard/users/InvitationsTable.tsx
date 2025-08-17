
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Crown, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface Invitation {
  id: string;
  email: string;
  role: AppRole;
  created_at: string;
  expires_at: string;
}

interface InvitationsTableProps {
  invitations: Invitation[];
  canManageUsers: boolean;
  onInvitationCanceled: () => void;
}

export const InvitationsTable = ({ invitations, canManageUsers, onInvitationCanceled }: InvitationsTableProps) => {
  const { toast } = useToast();

  const roleLabels: Record<AppRole, string> = {
    owner: "Proprietário",
    admin: "Administrador", 
    member: "Membro"
  };

  const roleIcons: Record<AppRole, React.ReactNode> = {
    owner: <Crown className="h-4 w-4 text-yellow-600" />,
    admin: <Shield className="h-4 w-4 text-red-600" />,
    member: <Users className="h-4 w-4 text-blue-600" />
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Convite cancelado",
        description: "O convite foi cancelado com sucesso."
      });

      onInvitationCanceled();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao cancelar convite.",
        variant: "destructive"
      });
    }
  };

  if (invitations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum convite pendente.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>E-mail</TableHead>
          <TableHead>Função</TableHead>
          <TableHead>Enviado em</TableHead>
          <TableHead>Expira em</TableHead>
          {canManageUsers && <TableHead>Ações</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => (
          <TableRow key={invitation.id}>
            <TableCell>{invitation.email}</TableCell>
            <TableCell>
              <Badge variant="outline" className="flex items-center gap-1 w-fit">
                {roleIcons[invitation.role]}
                {roleLabels[invitation.role]}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(invitation.created_at).toLocaleDateString('pt-BR')}
            </TableCell>
            <TableCell>
              {new Date(invitation.expires_at).toLocaleDateString('pt-BR')}
            </TableCell>
            {canManageUsers && (
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCancelInvitation(invitation.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
