
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { UserInviteDialog } from "./users/UserInviteDialog";
import { MembersTable } from "./users/MembersTable";
import { InvitationsTable } from "./users/InvitationsTable";
import { useUserManagement } from "@/hooks/useUserManagement";

export const UsersTab = () => {
  const { user } = useAuth();
  const { 
    loading, 
    members, 
    invitations, 
    canManageUsers, 
    organizationId,
    refetchData 
  } = useUserManagement();

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
        
        {organizationId && (
          <UserInviteDialog 
            organizationId={organizationId}
            canManageUsers={canManageUsers}
            onInviteSent={refetchData}
          />
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
          <MembersTable 
            members={members}
            canManageUsers={canManageUsers}
            currentUserId={user?.id}
            onMemberRemoved={refetchData}
          />
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
            <InvitationsTable 
              invitations={invitations}
              canManageUsers={canManageUsers}
              onInvitationCanceled={refetchData}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};
