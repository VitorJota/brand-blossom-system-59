
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    name: "", 
    email: "", 
    password: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signIn, signUp, resetPassword, user } = useAuth();
  const navigate = useNavigate();

  // Redirecionar usuários autenticados
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(loginData.email, loginData.password);
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Erro de autenticação",
            description: "Email ou senha incorretos. Verifique suas credenciais.",
            variant: "destructive"
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({
            title: "Email não confirmado",
            description: "Verifique seu email e clique no link de confirmação.",
            variant: "destructive"
          });
        } else if (error.message.includes('Too many requests')) {
          toast({
            title: "Muitas tentativas",
            description: "Aguarde alguns minutos antes de tentar novamente.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro no login",
            description: error.message || "Ocorreu um erro inesperado.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard..."
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const names = registerData.name.split(' ');
      const firstName = names[0] || '';
      const lastName = names.slice(1).join(' ') || '';

      const { error } = await signUp(
        registerData.email, 
        registerData.password,
        firstName,
        lastName
      );
      
      if (error) {
        if (error.message.includes('Password should be at least')) {
          toast({
            title: "Senha muito fraca",
            description: "A senha deve ter pelo menos 6 caracteres.",
            variant: "destructive"
          });
        } else if (error.message.includes('User already registered')) {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está em uso. Tente fazer login.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: error.message || "Ocorreu um erro inesperado.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Cadastro realizado!",
          description: "Verifique seu email para confirmar a conta."
        });
        setRegisterData({ name: "", email: "", password: "" });
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!loginData.email) {
      toast({
        title: "Email necessário",
        description: "Digite seu email no campo acima para redefinir a senha.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await resetPassword(loginData.email);
      
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleRememberMeChange = (checked: boolean | "indeterminate") => {
    setRememberMe(checked === true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Hero Section - mantido exatamente igual */}
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

          {/* Decorative Elements - mantidos exatamente iguais */}
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

        {/* Login Section - mantido exatamente igual visualmente */}
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
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-700 font-medium">
                        Email
                      </Label>
                      <Input 
                        id="username" 
                        type="email"
                        placeholder="Digite seu email" 
                        className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" 
                        value={loginData.email}
                        onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={isLoading}
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700 font-medium">
                        Senha
                      </Label>
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Digite sua senha" 
                          className="h-12 pr-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" 
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          disabled={isLoading}
                          required 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)} 
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                          disabled={isLoading}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="remember" 
                          checked={rememberMe} 
                          onCheckedChange={handleRememberMeChange}
                          disabled={isLoading}
                        />
                        <Label htmlFor="remember" className="text-sm text-gray-600">
                          Lembrar de mim
                        </Label>
                      </div>
                      <button 
                        type="button" 
                        onClick={handleForgotPassword} 
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                        disabled={isLoading}
                      >
                        Esqueci a senha
                      </button>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Entrando...
                        </div>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="mt-8">
                  <form onSubmit={handleRegister} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Nome Completo
                      </Label>
                      <Input 
                        id="name" 
                        placeholder="Digite seu nome completo" 
                        className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" 
                        value={registerData.name}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={isLoading}
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700 font-medium">
                        Email
                      </Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="Digite seu email" 
                        className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" 
                        value={registerData.email}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={isLoading}
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password" className="text-gray-700 font-medium">
                        Senha
                      </Label>
                      <Input 
                        id="new-password" 
                        type="password" 
                        placeholder="Crie uma senha segura" 
                        className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" 
                        value={registerData.password}
                        onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                        disabled={isLoading}
                        required 
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Criando conta...
                        </div>
                      ) : (
                        "Criar Conta"
                      )}
                    </Button>
                  </form>
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
