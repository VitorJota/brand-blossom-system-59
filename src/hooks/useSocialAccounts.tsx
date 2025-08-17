
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface SocialAccount {
  id: string;
  platform: 'instagram' | 'linkedin';
  account_id: string;
  username: string;
  is_active: boolean;
  connected_at?: string;
  last_sync_at?: string;
}

export const useSocialAccounts = () => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAccounts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('social_accounts')
        .select('id, platform, account_id, username, is_active, last_sync_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedAccounts = (data || []).map((account): SocialAccount => ({
        id: account.id,
        platform: account.platform as 'instagram' | 'linkedin',
        account_id: account.account_id,
        username: account.username,
        is_active: account.is_active || false,
        connected_at: account.created_at || new Date().toISOString(),
        last_sync_at: account.last_sync_at || undefined,
      }));

      setAccounts(transformedAccounts);
    } catch (error: any) {
      console.error('Error fetching social accounts:', error);
      toast({
        title: "Erro ao carregar contas",
        description: "Não foi possível carregar suas contas sociais.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const connectInstagram = async () => {
    try {
      // Mock Instagram connection for demo
      const mockAccount = {
        user_id: user?.id,
        platform: 'instagram',
        account_id: `ig_${Date.now()}`,
        username: 'mock_instagram',
        is_active: true
      };

      const { error } = await supabase
        .from('social_accounts')
        .insert(mockAccount);

      if (error) throw error;

      toast({
        title: "Instagram conectado",
        description: "Sua conta do Instagram foi conectada com sucesso."
      });

      fetchAccounts();
    } catch (error: any) {
      console.error('Error connecting Instagram:', error);
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar com o Instagram.",
        variant: "destructive"
      });
    }
  };

  const connectLinkedIn = async () => {
    try {
      // Mock LinkedIn connection for demo
      const mockAccount = {
        user_id: user?.id,
        platform: 'linkedin',
        account_id: `li_${Date.now()}`,
        username: 'mock_linkedin',
        is_active: true
      };

      const { error } = await supabase
        .from('social_accounts')
        .insert(mockAccount);

      if (error) throw error;

      toast({
        title: "LinkedIn conectado",
        description: "Sua conta do LinkedIn foi conectada com sucesso."
      });

      fetchAccounts();
    } catch (error: any) {
      console.error('Error connecting LinkedIn:', error);
      toast({
        title: "Erro na conexão",
        description: "Não foi possível conectar com o LinkedIn.",
        variant: "destructive"
      });
    }
  };

  const disconnectAccount = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Conta desconectada",
        description: "A conta foi desconectada com sucesso."
      });

      fetchAccounts();
    } catch (error: any) {
      console.error('Error disconnecting account:', error);
      toast({
        title: "Erro ao desconectar",
        description: "Não foi possível desconectar a conta.",
        variant: "destructive"
      });
    }
  };

  const syncAccount = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('social_accounts')
        .update({ last_sync_at: new Date().toISOString() })
        .eq('id', accountId)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Conta sincronizada",
        description: "Os dados da conta foram atualizados."
      });

      fetchAccounts();
    } catch (error: any) {
      console.error('Error syncing account:', error);
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar a conta.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  return {
    accounts,
    loading,
    connectInstagram,
    connectLinkedIn,
    disconnectAccount,
    syncAccount,
    refetch: fetchAccounts
  };
};
