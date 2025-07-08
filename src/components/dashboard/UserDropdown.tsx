
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, CreditCard, Users, LogOut, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserDropdownProps {
  onNavigateToProfile: () => void;
  onNavigateToBilling: () => void;
  onNavigateToUsers: () => void;
}

export const UserDropdown = ({ onNavigateToProfile, onNavigateToBilling, onNavigateToUsers }: UserDropdownProps) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso."
      });
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout.",
        variant: "destructive"
      });
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-3 px-3 py-2 h-auto bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white/90 transition-all duration-200 shadow-md rounded-full"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src="" alt={user?.email} />
            <AvatarFallback className="bg-gradient-to-r from-[#0077ff] to-indigo-600 text-white text-sm font-medium">
              {user?.email ? getInitials(user.email) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-gray-900 truncate max-w-32">
              {user?.email}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-sm border-gray-200 shadow-lg">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Minha Conta</p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={onNavigateToProfile} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Meu Perfil</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onNavigateToBilling} className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Cobranças</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={onNavigateToUsers} className="cursor-pointer">
          <Users className="mr-2 h-4 w-4" />
          <span>Usuários</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
