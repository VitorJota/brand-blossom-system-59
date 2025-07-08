import { useState, useEffect, createContext, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Configurar listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Atualizar perfil quando o usuário faz login
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            try {
              // Atualizar apenas campos que existem nos tipos atuais
              await supabase
                .from('profiles')
                .update({ 
                  updated_at: new Date().toISOString()
                })
                .eq('id', session.user.id);
            } catch (error) {
              console.error('Error updating profile:', error);
            }
          }, 0);
        }
      }
    );

    // Verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('🔍 Iniciando login com Google...');
      console.log('🌐 Current URL:', window.location.origin);
      
      // Verificar se o popup será bloqueado
      const testPopup = window.open('', '', 'width=1,height=1');
      if (!testPopup || testPopup.closed) {
        console.error('❌ Popup bloqueado pelo navegador');
        return { error: { message: 'Popup bloqueado. Permita popups para este site.' } };
      }
      testPopup.close();
      
      const redirectUrl = `${window.location.origin}/`;
      console.log('🔄 Redirect URL configurada:', redirectUrl);
      
      console.log('🚀 Chamando signInWithOAuth...');
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });
      
      console.log('📊 Resposta do signInWithOAuth:', { data, error });
      
      if (error) {
        console.error('❌ Erro no Google OAuth:', error);
        console.error('❌ Detalhes do erro:', {
          message: error.message,
          status: error.status,
          name: error.name
        });
        
        // Verificar tipos específicos de erro
        if (error.message?.includes('fetch')) {
          return { error: { message: 'Erro de conexão. Verifique sua internet e tente novamente.' } };
        }
        
        if (error.message?.includes('popup')) {
          return { error: { message: 'Popup foi bloqueado. Permita popups para este site.' } };
        }
        
        if (error.message?.includes('cors') || error.message?.includes('CORS')) {
          return { error: { message: 'Erro de configuração. Contate o suporte.' } };
        }
        
        return { error };
      }
      
      console.log('✅ Google OAuth iniciado com sucesso');
      return { error: null };
    } catch (error) {
      console.error('💥 Erro inesperado no Google sign in:', error);
      console.error('💥 Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Verificar se é erro de rede
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return { error: { message: 'Erro de conexão com o servidor. Verifique sua conexão com a internet.' } };
      }
      
      return { error: { message: 'Erro inesperado. Tente novamente em alguns instantes.' } };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signInWithGoogle,
      signUp,
      signOut,
      resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
