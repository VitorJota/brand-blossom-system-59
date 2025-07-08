
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface GoogleButtonProps {
  text: string;
}

export const GoogleButton = ({ text }: GoogleButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signInWithGoogle } = useAuth();

  const handleGoogleLogin = async () => {
    console.log('🎯 Botão do Google clicado');
    setIsLoading(true);
    
    try {
      console.log('🔧 Verificando configurações...');
      console.log('🌍 Environment:', {
        origin: window.location.origin,
        href: window.location.href,
        userAgent: navigator.userAgent.substring(0, 100)
      });
      
      const { error } = await signInWithGoogle();
      
      if (error) {
        console.error('🚨 Erro retornado do signInWithGoogle:', error);
        
        let errorMessage = "Erro no login com Google.";
        
        if (error.message?.includes('Popup bloqueado')) {
          errorMessage = "Popup foi bloqueado pelo navegador. Permita popups para este site e tente novamente.";
        } else if (error.message?.includes('conexão')) {
          errorMessage = "Problema de conexão. Verifique sua internet e tente novamente.";
        } else if (error.message?.includes('configuração')) {
          errorMessage = "Erro de configuração do Google OAuth. Entre em contato com o suporte.";
        } else if (error.message?.includes('refused') || error.message?.includes('recusada')) {
          errorMessage = "Conexão recusada pelo Google. Verifique se:\n• Você tem conexão com a internet\n• O site está configurado corretamente\n• Tente em outro navegador";
        }
        
        toast({
          title: "Erro no login com Google",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        console.log('✅ Login com Google iniciado com sucesso');
        toast({
          title: "Redirecionando...",
          description: "Você será redirecionado para completar o login com Google."
        });
      }
    } catch (error) {
      console.error('💥 Erro não capturado no handleGoogleLogin:', error);
      toast({
        title: "Erro no login com Google",
        description: "Ocorreu um erro inesperado. Tente novamente ou use o login com email.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      type="button"
      onClick={handleGoogleLogin}
      variant="outline"
      className="w-full h-12 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
      disabled={isLoading}
    >
      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          Conectando...
        </div>
      ) : (
        text
      )}
    </Button>
  );
};
