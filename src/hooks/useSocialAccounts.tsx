
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface SocialAccount {
  id: string;
  platform: 'instagram' | 'linkedin';
  account_id: string;
  username: string;
  display_name?: string;
  profile_picture_url?: string;
  followers_count: number;
  is_active: boolean;
  connected_at: string;
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
        .select('*')
        .eq('user_id', user.id)
        .order('connected_at', { ascending: false });

      if (error) throw error;
      
      // Transformar os dados para o formato esperado
      const transformedAccounts: SocialAccount[] = (data || []).map(account => ({
        id: account.id,
        platform: account.platform as 'instagram' | 'linkedin',
        account_id: account.account_id,
        username: account.username,
        display_name: account.display_name || undefined,
        profile_picture_url: account.profile_picture_url || undefined,
        followers_count: account.followers_count || 0,
        is_active: account.is_active || false,
        connected_at: account.connected_at || '',
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
      // Instagram Basic Display API OAuth
      const clientId = '1234567890'; // Você precisará configurar isso
      const redirectUri = `${window.location.origin}/auth/instagram/callback`;
      const scope = 'user_profile,user_media';
      
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
      
      // Abrir popup ou redirecionar
      window.location.href = authUrl;
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
      // LinkedIn OAuth 2.0
      const clientId = 'your-linkedin-client-id'; // Você precisará configurar isso
      const redirectUri = `${window.location.origin}/auth/linkedin/callback`;
      const scope = 'r_liteprofile r_emailaddress w_member_social';
      const state = Math.random().toString(36).substring(7);
      
      const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
      
      // Abrir popup ou redirecionar
      window.location.href = authUrl;
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
      // Aqui você implementaria a sincronização com a API da plataforma
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
