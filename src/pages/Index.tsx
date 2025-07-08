
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Hero Section */}
        <div className="space-y-12 text-center lg:text-left">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Gerencie suas redes sociais de forma{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  profissional.
                </span>
              </h1>
              
              <h2 className="text-2xl lg:text-3xl text-gray-700 font-medium leading-relaxed">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                  Com ou sem inteligência artificial
                </span>{" "}
                – você escolhe.
              </h2>
              
              <div className="max-w-3xl">
                <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed">
                  Planeje, agende, publique e acompanhe seus posts no Instagram e LinkedIn. 
                  Com um toque a mais:{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
                    nossa IA é capaz de criar textos e imagens por você.
                  </span>
                </p>
              </div>
            </div>

            {/* Modern decorative elements */}
            <div className="hidden lg:flex items-center justify-start gap-8 mt-16">
              <div className="flex flex-col items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-transparent"></div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-transparent"></div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <div className="w-1 h-6 bg-gradient-to-b from-pink-500 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="w-full max-w-lg mx-auto">
          <Card className="backdrop-blur-xl bg-white/95 border-0 shadow-2xl shadow-blue-500/5 rounded-3xl">
            <CardContent className="p-10">
              <div className="mb-10 text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full px-6 py-3 mb-6">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="font-semibold text-white">Seu Post</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Gestão completa de redes sociais</h3>
                <p className="text-gray-600">Entre na sua conta para começar</p>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-50 p-1 rounded-2xl mb-8">
                  <TabsTrigger 
                    value="login" 
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-xl font-medium py-3"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="register" 
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-xl font-medium py-3"
                  >
                    Cadastrar
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-8">
                    <div className="space-y-3">
                      <Label htmlFor="username" className="text-gray-700 font-medium text-base">
                        Usuário
                      </Label>
                      <Input 
                        id="username" 
                        placeholder="Digite seu usuário" 
                        className="h-14 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-blue-500/20 text-base" 
                        required 
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="password" className="text-gray-700 font-medium text-base">
                        Senha
                      </Label>
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Digite sua senha" 
                          className="h-14 pr-12 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-blue-500/20 text-base" 
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
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          id="remember" 
                          checked={rememberMe} 
                          onCheckedChange={handleRememberMeChange} 
                        />
                        <Label htmlFor="remember" className="text-gray-600">
                          Lembrar de mim
                        </Label>
                      </div>
                      <button 
                        type="button" 
                        onClick={handleForgotPassword} 
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        Esqueci a senha
                      </button>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-base"
                    >
                      Entrar
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
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
