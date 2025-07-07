
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Sparkles, Clock, DollarSign, TrendingUp, Instagram, Linkedin } from "lucide-react";

const Index = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Login realizado com sucesso!",
      description: "Redirecionando para o dashboard...",
    });
  };

  const handleForgotPassword = () => {
    toast({
      title: "Email enviado!",
      description: "Verifique sua caixa de entrada para redefinir sua senha.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Login Section */}
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Bolt</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
              <p className="text-gray-600">Informe os dados para continuar</p>
            </div>

            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastrar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Usuário</Label>
                    <div className="relative">
                      <Input 
                        id="username" 
                        placeholder="usuário" 
                        className="pl-10"
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 text-gray-400">👤</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Senha" 
                        className="pl-10 pr-10"
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-4 h-4 text-gray-400">🔒</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="remember" 
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Lembrar de mim
                    </Label>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Entrar
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Esqueci a Senha
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" placeholder="Seu nome completo" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="seu@email.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">Senha</Label>
                    <Input id="new-password" type="password" placeholder="Criar senha" required />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Criar Conta
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>

          {/* Hero Section */}
          <div className="lg:pl-12">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                COM INTELIGÊNCIA ARTIFICIAL
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Posts incríveis em segundos.<br />
                <span className="text-blue-600">Seu conteúdo com a cara da sua marca.</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8">
                Deixe a <strong>IA</strong> criar posts que engajam no Instagram e no LinkedIn.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 mb-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Foque no</p>
                <p className="text-sm font-medium text-gray-900">seu negócio</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Economize</p>
                <p className="text-sm font-medium text-gray-900">Tempo</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Ganhe</p>
                <p className="text-sm font-medium text-gray-900">presença</p>
              </div>
            </div>

            {/* Posts Preview */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seus posts</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="overflow-hidden">
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Instagram className="w-4 h-4 text-pink-600" />
                      <span className="text-xs font-medium text-gray-600">Instagram</span>
                      <div className="ml-auto">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Publicado</span>
                      </div>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop" 
                        alt="Post preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      🔥 Contratando mais um marco importante da nossa jornada! 
                      Chegou a hora de fazer parte desta história...
                    </p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>❤️ 764</span>
                      <span>💬 102</span>
                      <span>🔗 24</span>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden">
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Linkedin className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-medium text-gray-600">LinkedIn</span>
                      <div className="ml-auto">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Publicado</span>
                      </div>
                    </div>
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop" 
                        alt="Post preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      🚀 Contratando mais um marco importante da nossa jornada! 
                      Chegou a hora de fazer parte desta história...
                    </p>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>👍 244</span>
                      <span>💬 18</span>
                      <span>🔄 19</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
