
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Sparkles } from "lucide-react";

const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login realizado com sucesso!",
      description: "Redirecionando para o dashboard..."
    });
  };

  const handleForgotPassword = () => {
    toast({
      title: "Email enviado!",
      description: "Verifique sua caixa de entrada para redefinir sua senha."
    });
  };

  const handleRememberMeChange = (checked: boolean | "indeterminate") => {
    setRememberMe(checked === true);
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
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                profissional.
              </span>
            </h1>
            
            <h2 className="text-xl lg:text-2xl text-gray-700 font-medium">
              Com ou sem inteligência artificial – você escolhe.
            </h2>
            
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl">
              Planeje, agende, publique e acompanhe seus posts no Instagram e LinkedIn. 
              Com um toque a mais: nossa IA é capaz de criar textos e imagens por você.
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
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg font-medium"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-lg font-medium"
                  >
                    Cadastrar
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="mt-8">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-700 font-medium">
                        Usuário
                      </Label>
                      <Input 
                        id="username" 
                        placeholder="Digite seu usuário" 
                        className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" 
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
                          required 
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)} 
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
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
                        />
                        <Label htmlFor="remember" className="text-sm text-gray-600">
                          Lembrar de mim
                        </Label>
                      </div>
                      <button 
                        type="button" 
                        onClick={handleForgotPassword} 
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        Esqueci a senha
                      </button>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Entrar
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="mt-8">
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Nome Completo
                      </Label>
                      <Input 
                        id="name" 
                        placeholder="Digite seu nome completo" 
                        className="h-12 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-blue-500/20" 
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
                        required 
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Criar Conta
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
