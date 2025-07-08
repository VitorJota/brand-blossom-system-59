
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { GoogleButton } from "@/components/auth/GoogleButton";

const Index = () => {
  const { toast } = useToast();
  const { resetPassword, user } = useAuth();
  const navigate = useNavigate();

  // Redirecionar usuários autenticados
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      toast({
        title: "Email necessário",
        description: "Digite seu email no campo acima para redefinir a senha.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: error.message || "Não foi possível enviar o email de recuperação.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email enviado!",
          description: "Verifique sua caixa de entrada para redefinir sua senha."
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Hero Section */}
        <div className="space-y-8 text-center lg:text-left">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-800">Seu Post</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Gerencie suas redes sociais de forma{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-gray-900">
                profissional.
              </span>
            </h1>
            
            <h2 className="text-xl lg:text-2xl font-medium text-[#0077ff]">
              Com ou sem inteligência artificial – você escolhe.
            </h2>
            
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
              Planeje, agende, publique e acompanhe seus posts no Instagram e LinkedIn. 
              <span className="text-[#0077ff] font-medium"> Com um toque a mais: nossa IA é capaz de criar textos e imagens por você.</span>
            </p>
          </div>

          {/* Decorative Elements */}
          <div className="hidden lg:block space-y-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl rotate-12 opacity-60"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl -rotate-6 opacity-40 mt-4"></div>
            </div>
            <div className="flex gap-4 justify-center lg:justify-start">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg rotate-45 opacity-30"></div>
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-3xl -rotate-12 opacity-50 -mt-2"></div>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="w-full max-w-md mx-auto">
          <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl shadow-blue-500/10">
            <CardContent className="p-8">
              <div className="mb-8 text-center">
                <p className="text-gray-600 text-lg">Acesse sua conta</p>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1 rounded-xl">
                  <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg font-medium">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg font-medium">
                    Cadastrar
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="mt-8">
                  <div className="space-y-4 mb-6">
                    <GoogleButton text="Continuar com Google" />
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Ou</span>
                      </div>
                    </div>
                  </div>

                  <LoginForm onForgotPassword={handleForgotPassword} />
                </TabsContent>

                <TabsContent value="register" className="mt-8">
                  <div className="space-y-4 mb-6">
                    <GoogleButton text="Cadastrar com Google" />
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Ou</span>
                      </div>
                    </div>
                  </div>

                  <RegisterForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
};

export default Index;
