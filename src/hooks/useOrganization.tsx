
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Database } from '@/integrations/supabase/types';

type Organization = Database['public']['Tables']['organizations']['Row'];
type OrganizationMember = Database['public']['Tables']['organization_members']['Row'];

export function useOrganization() {
  const { user } = useAuth();
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Get user's organizations
  const { data: organizations, isLoading: loadingOrgs } = useQuery({
    queryKey: ['organizations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('organization_members')
        .select(`
          organization_id,
          role,
          organizations (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data.map(item => ({
        ...item.organizations,
        userRole: item.role
      })) as (Organization & { userRole: string })[];
    },
    enabled: !!user,
  });

  // Get current organization details
  const { data: currentOrg } = useQuery({
    queryKey: ['organization', currentOrgId],
    queryFn: async () => {
      if (!currentOrgId) return null;
      
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', currentOrgId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!currentOrgId,
  });

  // Create organization mutation
  const createOrganization = useMutation({
    mutationFn: async ({ name, slug }: { name: string; slug: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({ name, slug })
        .select()
        .single();

      if (orgError) throw orgError;

      // Add user as owner
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: 'owner'
        });

      if (memberError) throw memberError;

      return org;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });

  // Set current organization (with localStorage persistence)
  useEffect(() => {
    const savedOrgId = localStorage.getItem('currentOrganizationId');
    if (savedOrgId && organizations?.some(org => org.id === savedOrgId)) {
      setCurrentOrgId(savedOrgId);
    } else if (organizations?.length && !currentOrgId) {
      // Auto-select first organization if none selected
      setCurrentOrgId(organizations[0].id);
    }
  }, [organizations, currentOrgId]);

  const switchOrganization = (orgId: string) => {
    setCurrentOrgId(orgId);
    localStorage.setItem('currentOrganizationId', orgId);
  };

  return {
    organizations: organizations || [],
    currentOrg,
    currentOrgId,
    loadingOrgs,
    createOrganization,
    switchOrganization,
  };
}
