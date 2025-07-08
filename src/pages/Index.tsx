
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Sparkles, Clock, DollarSign, TrendingUp, Instagram, Linkedin, BarChart3, Calendar, Target, Wand2 } from "lucide-react";

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

  const handleRememberMeChange = (checked: boolean | "indeterminate") => {
    setRememberMe(checked === true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-screen">
          {/* Login Section */}
          <div className="max-w-md mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#0077FF] rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">Seu Post</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo de volta</h1>
              <p className="text-gray-600">Faça login para gerenciar suas redes sociais</p>
            </div>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                    <TabsTrigger value="login" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">Login</TabsTrigger>
                    <TabsTrigger value="register" className="data-[state=active]:bg-[#0077FF] data-[state=active]:text-white">Cadastrar</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="login" className="mt-6">
                    <form onSubmit={handleLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-700 font-medium">Usuário</Label>
                        <div className="relative">
                          <Input 
                            id="username" 
                            placeholder="Digite seu usuário" 
                            className="pl-10 h-12 border-gray-200 focus:border-[#0077FF] focus:ring-[#0077FF]"
                            required
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-5 h-5 text-gray-400">👤</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
                        <div className="relative">
                          <Input 
                            id="password" 
                            type={showPassword ? "text" : "password"}
                            placeholder="Digite sua senha" 
                            className="pl-10 pr-10 h-12 border-gray-200 focus:border-[#0077FF] focus:ring-[#0077FF]"
                            required
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-5 h-5 text-gray-400">🔒</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                          className="text-[#0077FF] hover:text-[#0066DD] text-sm font-medium"
                        >
                          Esqueci a senha
                        </button>
                      </div>

                      <Button type="submit" className="w-full h-12 bg-[#0077FF] hover:bg-[#0066DD] text-white font-medium shadow-lg">
                        Entrar
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="register" className="mt-6">
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700 font-medium">Nome Completo</Label>
                        <Input id="name" placeholder="Digite seu nome completo" className="h-12 border-gray-200 focus:border-[#0077FF] focus:ring-[#0077FF]" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                        <Input id="email" type="email" placeholder="Digite seu email" className="h-12 border-gray-200 focus:border-[#0077FF] focus:ring-[#0077FF]" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-gray-700 font-medium">Senha</Label>
                        <Input id="new-password" type="password" placeholder="Crie uma senha segura" className="h-12 border-gray-200 focus:border-[#0077FF] focus:ring-[#0077FF]" required />
                      </div>

                      <Button type="submit" className="w-full h-12 bg-[#0077FF] hover:bg-[#0066DD] text-white font-medium shadow-lg">
                        Criar Conta
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Hero Section */}
          <div className="lg:pl-12">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-[#0077FF]/10 text-[#0077FF] px-4 py-2 rounded-full text-sm font-medium mb-6 border border-[#0077FF]/20">
                <Sparkles className="w-4 h-4" />
                GESTÃO COMPLETA DE REDES SOCIAIS
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Gerencie suas redes sociais de forma profissional.<br />
                <span className="text-[#0077FF]">Com ou sem inteligência artificial – você escolhe.</span>
              </h2>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Planeje, agende, publique e acompanhe seus posts no Instagram e LinkedIn.
                <strong className="text-[#0077FF]"> Com um toque a mais: nossa IA é capaz de criar textos e imagens por você.</strong>
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="text-center group">
                <div className="w-14 h-14 bg-[#0077FF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0077FF]/20 transition-colors">
                  <Calendar className="w-7 h-7 text-[#0077FF]" />
                </div>
                <p className="text-sm font-semibold text-gray-900">Agendamento</p>
                <p className="text-sm text-gray-600">Inteligente</p>
              </div>
              
              <div className="text-center group">
                <div className="w-14 h-14 bg-[#0077FF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0077FF]/20 transition-colors">
                  <BarChart3 className="w-7 h-7 text-[#0077FF]" />
                </div>
                <p className="text-sm font-semibold text-gray-900">Métricas</p>
                <p className="text-sm text-gray-600">Detalhadas</p>
              </div>
              
              <div className="text-center group">
                <div className="w-14 h-14 bg-[#0077FF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0077FF]/20 transition-colors">
                  <Target className="w-7 h-7 text-[#0077FF]" />
                </div>
                <p className="text-sm font-semibold text-gray-900">Gestão</p>
                <p className="text-sm text-gray-600">Profissional</p>
              </div>

              <div className="text-center group">
                <div className="w-14 h-14 bg-[#0077FF]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#0077FF]/20 transition-colors">
                  <Wand2 className="w-7 h-7 text-[#0077FF]" />
                </div>
                <p className="text-sm font-semibold text-gray-900">Criação por IA</p>
                <p className="text-sm text-gray-600">(em breve)</p>
              </div>
            </div>

            {/* Posts Preview */}
            <div className="mb-8">
              <p className="text-lg text-gray-600 mb-4 italic">Seu conteúdo pode ganhar vida com organização e tecnologia.</p>
              <h3 className="text-xl font-bold text-gray-900 mb-6">Seus posts em ação</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="overflow-hidden shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Instagram className="w-5 h-5 text-pink-600" />
                      <span className="text-sm font-medium text-gray-700">Instagram</span>
                      <div className="ml-auto">
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">Publicado</span>
                      </div>
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl mb-4 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop" 
                        alt="Post preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      🚀 Alcançamos um novo marco! Obrigado por fazer parte desta jornada incrível...
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">❤️ 1.2K</span>
                      <span className="flex items-center gap-1">💬 89</span>
                      <span className="flex items-center gap-1">🔗 34</span>
                    </div>
                  </div>
                </Card>

                <Card className="overflow-hidden shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Linkedin className="w-5 h-5 text-[#0077FF]" />
                      <span className="text-sm font-medium text-gray-700">LinkedIn</span>
                      <div className="ml-auto">
                        <span className="text-xs bg-[#0077FF]/10 text-[#0077FF] px-3 py-1 rounded-full font-medium">Agendado</span>
                      </div>
                    </div>
                    <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl mb-4 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop" 
                        alt="Post preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      💼 Transformação digital: Como nossa empresa evoluiu nos últimos meses...
                    </p>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">👍 456</span>
                      <span className="flex items-center gap-1">💬 23</span>
                      <span className="flex items-center gap-1">🔄 12</span>
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
