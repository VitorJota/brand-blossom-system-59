
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InstagramLogo } from "@/components/icons/InstagramLogo";
import { LinkedInLogo } from "@/components/icons/LinkedInLogo";

interface AddAccountsCardProps {
  onConnect: (platform: 'instagram' | 'linkedin') => void;
  hasInstagram: boolean;
  hasLinkedIn: boolean;
}

export const AddAccountsCard = ({ onConnect, hasInstagram, hasLinkedIn }: AddAccountsCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Adicionar mais contas</h4>
              <p className="text-sm text-gray-600">Conecte outras redes sociais</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => onConnect('instagram')}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              size="sm"
              disabled={hasInstagram}
            >
              <InstagramLogo className="w-4 h-4" />
              Instagram
            </Button>
            <Button 
              onClick={() => onConnect('linkedin')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              size="sm"
              disabled={hasLinkedIn}
            >
              <LinkedInLogo className="w-4 h-4" />
              LinkedIn
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
