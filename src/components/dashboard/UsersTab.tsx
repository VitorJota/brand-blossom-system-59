
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus, Mail, Trash2, Crown, Shield, Users, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];
type OrganizationMember = {
  id: string;
  user_id: string;
  role: UserRole;
  joined_at: string;
  profiles: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
};

type Invitation = {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  expires_at: string;
};

export const UsersTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("social_media");
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

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

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Buscar organização do usuário
      const { data: orgData, error: orgError } = await supabase
        .from('organization_members')
        .select('organization_id, role')
        .eq('user_id', user?.id)
        .single();

      if (orgError) throw orgError;

      setCurrentUserRole(orgData.role);
      setOrganizationId(orgData.organization_id);

      // Buscar membros da organização com join correto
      const { data: membersData, error: membersError } = await supabase
        .from('organization_members')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          profiles!organization_members_user_id_fkey (email, first_name, last_name)
        `)
        .eq('organization_id', orgData.organization_id);

      if (membersError) throw membersError;

      setMembers(membersData || []);

      // Buscar convites pendentes
      const { data: invitesData, error: invitesError } = await supabase
        .from('user_invitations')
        .select('id, email, role, created_at, expires_at')
        .eq('organization_id', orgData.organization_id)
        .is('accepted_at', null);

      if (invitesError) throw invitesError;

      setInvitations(invitesData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados dos usuários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail || !organizationId) return;

    try {
      const { error } = await supabase
        .from('user_invitations')
        .insert({
          organization_id: organizationId,
          email: inviteEmail,
          role: inviteRole,
          invited_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Convite enviado",
        description: `Convite enviado para ${inviteEmail} como ${roleLabels[inviteRole]}.`
      });

      setInviteEmail("");
      setInviteRole("social_media");
      setIsInviteOpen(false);
      fetchUserData();
    } catch (error: any) {
      console.error('Error inviting user:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar convite.",
        variant: "destructive"
      });
    }
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

      fetchUserData();
    } catch (error: any) {
      console.error('Error removing member:', error);
      toast({
        title: "Erro",
        description: "Erro ao remover usuário.",
        variant: "destructive"
      });
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('user_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      toast({
        title: "Convite cancelado",
        description: "O convite foi cancelado com sucesso."
      });

      fetchUserData();
    } catch (error: any) {
      console.error('Error canceling invitation:', error);
      toast({
        title: "Erro",
        description: "Erro ao cancelar convite.",
        variant: "destructive"
      });
    }
  };

  const canManageUsers = currentUserRole === 'owner' || currentUserRole === 'admin';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Usuários</h2>
          <p className="text-gray-600">Gerencie os membros da sua organização</p>
        </div>
        
        {canManageUsers && (
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
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
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="role">Função</Label>
                  <Select value={inviteRole} onValueChange={(value: UserRole) => setInviteRole(value)}>
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
                <Button onClick={handleInviteUser} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Convite
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Membros Ativos */}
      <Card>
        <CardHeader>
          <CardTitle>Membros Ativos</CardTitle>
          <CardDescription>
            Usuários que fazem parte da sua organização
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {member.profiles.first_name && member.profiles.last_name
                          ? `${member.profiles.first_name} ${member.profiles.last_name}`
                          : member.profiles.email
                        }
                      </div>
                      <div className="text-sm text-gray-500">{member.profiles.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {roleIcons[member.role]}
                      {roleLabels[member.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(member.joined_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  {canManageUsers && (
                    <TableCell>
                      {member.role !== 'owner' && member.user_id !== user?.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Convites Pendentes */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Convites Pendentes</CardTitle>
            <CardDescription>
              Convites enviados que ainda não foram aceitos
            </CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};
