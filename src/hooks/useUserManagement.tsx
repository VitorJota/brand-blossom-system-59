
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  id: string;
  user_id: string;
  organization_id: string;
  role: AppRole;
  created_at: string;
}

interface Member extends UserProfile {
  role: AppRole;
}

interface Invitation {
  id: string;
  email: string;
  role: AppRole;
  created_at: string;
  expires_at: string;
}

export const useUserManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<AppRole | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  const canManageUsers = currentUserRole === 'owner' || currentUserRole === 'admin';

  const createUserOrganization = async () => {
    if (!user) return null;

    try {
      console.log('Creating organization for user:', user.id);

      // Buscar dados do perfil do usuário
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profileData) {
        throw new Error('Perfil do usuário não encontrado');
      }

      // Criar nome da organização
      const userName = profileData.first_name && profileData.last_name
        ? `${profileData.first_name} ${profileData.last_name}`.trim()
        : user.email?.split('@')[0] || 'User';

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
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          organization_id: orgData.id,
          user_id: user.id,
          role: 'owner'
        });

      if (roleError) throw roleError;

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
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (roleError) {
        console.error('Error fetching user role:', roleError);
        throw roleError;
      }

      let currentOrgId = roleData?.organization_id;
      let currentRole = roleData?.role;

      // Se o usuário não faz parte de nenhuma organização, criar uma
      if (!roleData) {
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

      // Buscar todos os roles da organização
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('organization_id', currentOrgId);

      if (rolesError) throw rolesError;

      // Buscar perfis de todos os usuários
      const userIds = roles?.map(r => r.user_id) || [];
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('user_id', userIds);

        if (profilesError) throw profilesError;

        // Combinar perfis com roles
        const membersWithRoles = profiles?.map(profile => {
          const userRole = roles?.find(r => r.user_id === profile.user_id);
          return {
            ...profile,
            role: userRole?.role || 'member' as AppRole
          };
        }) || [];

        setMembers(membersWithRoles);
      }

      // Buscar convites pendentes
      const { data: invitesData, error: invitesError } = await supabase
        .from('invitations')
        .select('id, email, role, created_at, expires_at')
        .eq('organization_id', currentOrgId)
        .is('accepted_at', null);

      if (invitesError) throw invitesError;

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
