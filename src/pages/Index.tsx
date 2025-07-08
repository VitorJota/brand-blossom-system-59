
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BarChart3, Users, Zap, ArrowRight } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: "Agendamento Inteligente",
      description: "Programe seus posts para o melhor horário em todas as redes sociais"
    },
    {
      icon: BarChart3,
      title: "Analytics Avançados",
      description: "Acompanhe o desempenho com métricas detalhadas e insights"
    },
    {
      icon: Users,
      title: "Gestão de Equipes",
      description: "Colabore com sua equipe com roles e permissões granulares"
    },
    {
      icon: Zap,
      title: "Alta Performance",
      description: "Arquitetura otimizada para escalar com milhares de usuários"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Social Media Manager</h1>
        <div className="space-x-4">
          {user ? (
            <Button asChild>
              <Link to="/dashboard">
                Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Começar Agora</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Gerencie suas redes sociais
          <br />
          <span className="text-blue-600">de forma inteligente</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Plataforma completa para agendamento, análises e gestão de conteúdo 
          em todas as suas redes sociais. Construída para alta performance e escala.
        </p>
        <div className="space-x-4">
          <Button size="lg" asChild>
            <Link to="/auth">
              Começar Gratuitamente <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline">
            Ver Demo
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Tudo que você precisa em uma plataforma
          </h2>
          <p className="text-lg text-gray-600">
            Recursos profissionais para impulsionar sua presença digital
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de criadores e empresas que confiam em nossa plataforma
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/auth">
              Criar Conta Gratuita <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 Social Media Manager. Construído com alta performance e segurança.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
