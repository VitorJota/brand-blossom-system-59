
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

  const createUserOrganization = async () => {
    if (!user) return null;

    try {
      console.log('Creating organization for existing user:', user.id);

      // Buscar dados do perfil do usuário
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profileData) {
        throw new Error('Perfil do usuário não encontrado');
      }

      // Criar nome da organização
      const userName = profileData.first_name && profileData.last_name
        ? `${profileData.first_name} ${profileData.last_name}`.trim()
        : profileData.email.split('@')[0];

      const orgName = `${userName}'s Organization`;
      const orgSlug = `${userName.toLowerCase().replace(/\s+/g, '-')}-${user.id.substring(0, 8)}`;

      // Criar organização
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: orgName,
          slug: orgSlug
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Adicionar usuário como owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: orgData.id,
          user_id: user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      console.log('Organization created successfully:', orgData.id);
      return orgData.id;

    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar organização. Tente novamente.",
        variant: "destructive"
      });
      return null;
    }
  };

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      console.log('Fetching user organization data for user:', user.id);

      // Buscar organização do usuário
      const { data: orgData, error: orgError } = await supabase
        .from('organization_members')
        .select('organization_id, role')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (orgError) {
        console.error('Error fetching organization:', orgError);
        throw orgError;
      }

      let currentOrgId = orgData?.organization_id;
      let currentRole = orgData?.role;

      // Se o usuário não faz parte de nenhuma organização, criar uma
      if (!orgData) {
        console.log('User is not part of any organization, creating one...');
        currentOrgId = await createUserOrganization();
        currentRole = 'owner';
        
        if (!currentOrgId) {
          setLoading(false);
          return;
        }
      }

      console.log('User organization data:', { organizationId: currentOrgId, role: currentRole });
      setCurrentUserRole(currentRole);
      setOrganizationId(currentOrgId);

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
        .eq('organization_id', currentOrgId)
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
        .eq('organization_id', currentOrgId)
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
