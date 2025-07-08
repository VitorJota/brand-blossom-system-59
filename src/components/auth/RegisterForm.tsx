
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const RegisterForm = () => {
  const [registerData, setRegisterData] = useState({ 
    name: "", 
    email: "", 
    password: "" 
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { signUp } = useAuth();

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

  return (
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
  );
};
