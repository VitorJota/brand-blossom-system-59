
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
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

interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
  expires_at: string;
}

export const useUserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  const canManageUsers = currentUserRole === 'owner' || currentUserRole === 'admin';

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      console.log('Fetching user organization data for user:', user.id);

      // Buscar organização do usuário usando maybeSingle() para evitar erro se não encontrar
      const { data: orgData, error: orgError } = await supabase
        .from('organization_members')
        .select('organization_id, role')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (orgError) {
        console.error('Error fetching organization:', orgError);
        throw orgError;
      }

      if (!orgData) {
        console.log('User is not part of any organization');
        setLoading(false);
        return;
      }

      console.log('User organization data:', orgData);
      setCurrentUserRole(orgData.role);
      setOrganizationId(orgData.organization_id);

      // Buscar membros da organização
      const { data: membersData, error: membersError } = await supabase
        .from('organization_members')
        .select(`
          id,
          user_id,
          role,
          joined_at,
          profiles!organization_members_user_id_fkey (email, first_name, last_name)
        `)
        .eq('organization_id', orgData.organization_id)
        .order('joined_at', { ascending: true });

      if (membersError) {
        console.error('Error fetching members:', membersError);
        throw membersError;
      }

      console.log('Members data:', membersData);
      setMembers(membersData || []);

      // Buscar convites pendentes
      const { data: invitesData, error: invitesError } = await supabase
        .from('user_invitations')
        .select('id, email, role, created_at, expires_at')
        .eq('organization_id', orgData.organization_id)
        .is('accepted_at', null);

      if (invitesError) {
        console.error('Error fetching invitations:', invitesError);
        throw invitesError;
      }

      console.log('Invitations data:', invitesData);
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

  useEffect(() => {
    fetchUserData();
  }, [user]);

  return {
    loading,
    members,
    invitations,
    currentUserRole,
    organizationId,
    canManageUsers,
    refetchData: fetchUserData
  };
};
