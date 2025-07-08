
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Crown, Shield, Users, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];

interface OrganizationMember {
  id: string;
  user_id: string;
  role: UserRole;
  joined_at: string;
  profiles: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}

interface MembersTableProps {
  members: OrganizationMember[];
  canManageUsers: boolean;
  currentUserId?: string;
  onMemberRemoved: () => void;
}

export const MembersTable = ({ members, canManageUsers, currentUserId, onMemberRemoved }: MembersTableProps) => {
  const { toast } = useToast();

  const roleLabels: Record<UserRole, string> = {
    owner: "Master",
    admin: "Administrador", 
    manager: "Gerente",
    editor: "Editor",
    viewer: "Visualizador",
    social_media: "Social Media"
  };

  const roleIcons: Record<UserRole, React.ReactNode> = {
    owner: <Crown className="h-4 w-4 text-yellow-600" />,
    admin: <Shield className="h-4 w-4 text-red-600" />,
    manager: <Users className="h-4 w-4 text-blue-600" />,
    editor: <Monitor className="h-4 w-4 text-green-600" />,
    viewer: <Monitor className="h-4 w-4 text-gray-600" />,
    social_media: <Monitor className="h-4 w-4 text-purple-600" />
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Usuário removido",
        description: "O usuário foi removido da organização."
      });

      onMemberRemoved();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao remover usuário.",
        variant: "destructive"
      });
    }
  };

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhum membro encontrado na organização.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Usuário</TableHead>
          <TableHead>Função</TableHead>
          <TableHead>Data de Entrada</TableHead>
          {canManageUsers && <TableHead>Ações</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow 
            key={member.id} 
            className={member.role === 'owner' ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' : ''}
          >
            <TableCell>
              <div className="flex items-center gap-2">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {member.role === 'owner' && <Crown className="h-4 w-4 text-yellow-600" />}
                    {member.profiles.first_name && member.profiles.last_name
                      ? `${member.profiles.first_name} ${member.profiles.last_name}`
                      : member.profiles.email
                    }
                    {member.role === 'owner' && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-medium">
                        Criador da Conta
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{member.profiles.email}</div>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge 
                variant="outline" 
                className={`flex items-center gap-1 w-fit ${
                  member.role === 'owner' 
                    ? 'border-yellow-300 bg-yellow-50 text-yellow-800' 
                    : ''
                }`}
              >
                {roleIcons[member.role]}
                {roleLabels[member.role]}
              </Badge>
            </TableCell>
            <TableCell>
              {new Date(member.joined_at).toLocaleDateString('pt-BR')}
            </TableCell>
            {canManageUsers && (
              <TableCell>
                {member.role !== 'owner' && member.user_id !== currentUserId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                {member.role === 'owner' && (
                  <span className="text-xs text-gray-400">Não removível</span>
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
