
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostsCalendar } from "./posts/PostsCalendar";
import { Instagram, Linkedin } from "lucide-react";

export const PostsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gerenciar Posts</h2>
        <p className="text-gray-600">Crie, agende e publique conteúdo nas redes sociais</p>
      </div>

      <Tabs defaultValue="instagram" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-50/80 backdrop-blur-sm p-2 rounded-xl border border-gray-200/50">
          <TabsTrigger 
            value="instagram" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#E4405F] data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-[#E4405F]/20 rounded-lg font-medium transition-all duration-200 hover:bg-white/50 flex items-center gap-2"
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </TabsTrigger>
          <TabsTrigger 
            value="linkedin" 
            className="data-[state=active]:bg-white data-[state=active]:text-[#0077B5] data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-[#0077B5]/20 rounded-lg font-medium transition-all duration-200 hover:bg-white/50 flex items-center gap-2"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="instagram" className="mt-6">
          <PostsCalendar platform="instagram" />
        </TabsContent>
        
        <TabsContent value="linkedin" className="mt-6">
          <PostsCalendar platform="linkedin" />
        </TabsContent>
      </Tabs>
    </div>
  );
};
