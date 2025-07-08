
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { UserDropdown } from "@/components/dashboard/UserDropdown";
import { useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("posts");

  const handleNavigateToProfile = () => {
    setActiveTab("profile");
    toast({
      title: "Navegando para perfil",
      description: "Redirecionando para suas configurações de perfil."
    });
  };

  const handleNavigateToBilling = () => {
    toast({
      title: "Em desenvolvimento",
      description: "A seção de cobranças será implementada em breve."
    });
  };

  const handleNavigateToUsers = () => {
    setActiveTab("users");
    toast({
      title: "Gestão de usuários",
      description: "Redirecionando para a gestão de usuários."
    });
  };

  // Função para garantir que apenas abas válidas do menu principal sejam selecionadas
  const handleTabChange = (tab: string) => {
    const validMainTabs = ["posts", "social", "templates", "analytics"];
    if (validMainTabs.includes(tab)) {
      setActiveTab(tab);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Header com gradiente e glassmorphism */}
      <div className="relative overflow-hidden">
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 blur-xl"></div>
          <div className="absolute top-20 -left-8 w-32 h-32 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full opacity-15 blur-xl"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full opacity-25 blur-lg"></div>
        </div>

        {/* Header content */}
        <div className="relative backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                {/* Logo/Brand */}
                <div className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#0077ff] to-indigo-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800">Seu Post</span>
                </div>

                {/* Título */}
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Dashboard
                  </h1>
                  <p className="text-[#0077ff] font-medium mt-1">
                    Gerencie suas redes sociais com inteligência
                  </p>
                </div>
              </div>

              {/* User Dropdown */}
              <UserDropdown 
                onNavigateToProfile={handleNavigateToProfile}
                onNavigateToBilling={handleNavigateToBilling}
                onNavigateToUsers={handleNavigateToUsers}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Container principal com glassmorphism */}
        <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl shadow-blue-500/10 border border-white/20 overflow-hidden">
          <DashboardTabs activeTab={activeTab} onTabChange={handleTabChange} />
        </div>

        {/* Elementos decorativos de fundo */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute bottom-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl rotate-12 opacity-10"></div>
          <div className="absolute bottom-40 right-20 w-16 h-16 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl -rotate-6 opacity-15"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg rotate-45 opacity-8"></div>
          <div className="absolute top-3/4 right-1/3 w-24 h-24 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-3xl -rotate-12 opacity-12"></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
